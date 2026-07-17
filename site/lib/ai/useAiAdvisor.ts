"use client";

import { useState, useCallback } from "react";
import { browserApiFetch } from "@/lib/api/browserApi";

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AiAdvisorContext {
  roomArea?: number;
  teamSize?: number;
  currentElements?: number;
  plannerType?: "oando" | "buddy";
}

interface UseAiAdvisorOptions {
  context?: AiAdvisorContext;
}

/** Map UI context to planner ai-advisor canonical context fields. */
function toPlannerContext(context: AiAdvisorContext | undefined): Record<string, unknown> | undefined {
  if (!context) return undefined;
  const out: Record<string, unknown> = {};
  if (context.plannerType === "oando" || context.plannerType === "buddy") {
    out.planner = context.plannerType;
  }
  if (typeof context.teamSize === "number" && Number.isFinite(context.teamSize)) {
    out.seatCount = context.teamSize;
  }
  if (typeof context.roomArea === "number" && Number.isFinite(context.roomArea)) {
    out.floorAreaSqFt = context.roomArea;
  }
  if (typeof context.currentElements === "number" && Number.isFinite(context.currentElements)) {
    out.currentShapeCount = context.currentElements;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function useAiAdvisor(options: UseAiAdvisorOptions = {}) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: AiMessage = {
        id: `msg-${Date.now()}-user`,
        role: "user",
        content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        const chatHistory = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await browserApiFetch("/api/planner/ai-advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "chat",
            messages: chatHistory,
            context: toPlannerContext(options.context),
          }),
        });

        const data = (await res.json().catch(() => ({}))) as {
          success?: boolean;
          content?: string;
          error?: string | { message?: string };
        };

        if (!res.ok) {
          const message =
            (typeof data.error === "object" && data.error?.message) ||
            (typeof data.error === "string" ? data.error : null) ||
            `HTTP ${res.status}`;
          throw new Error(message);
        }

        const reply =
          typeof data.content === "string" && data.content.trim().length > 0
            ? data.content
            : null;
        if (!reply) {
          throw new Error("Advisor returned empty content");
        }

        const assistantMsg: AiMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: "assistant",
          content: reply,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, options.context],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
