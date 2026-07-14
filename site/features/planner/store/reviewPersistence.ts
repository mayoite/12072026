/**
 * Review & Comment Persistence — Drizzle CRUD for shareable review links
 * and anchored comments (Phase 4).
 */
import { and, desc, eq } from "drizzle-orm";
import { adminDb } from "@/platform/drizzle/adminDb";
import { isPlannerDatabaseUrlConfigured } from "@/platform/drizzle/plannerDatabaseUrl";
import { reviewLinks, reviewComments } from "@/platform/drizzle/schema";
import { randomBytes } from "crypto";

export class ReviewPersistenceError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "ReviewPersistenceError";
  }
}

function token(): string {
  return randomBytes(24).toString("hex");
}

/** Create a review link for a plan. */
export async function createReviewLink(
  planId: string,
  createdBy: string,
  permission: "view" | "comment" = "view",
  expiresAt?: Date,
) {
  if (!isPlannerDatabaseUrlConfigured()) {
    return { success: false as const, error: new ReviewPersistenceError("Database not configured") };
  }
  try {
    const [row] = await adminDb.insert(reviewLinks).values({
      planId,
      token: token(),
      permission,
      expiresAt: expiresAt ?? null,
      createdBy,
    }).returning();
    return { success: true as const, data: row };
  } catch (e) {
    return { success: false as const, error: new ReviewPersistenceError("Failed to create review link", e) };
  }
}

/** Revoke a review link by id. */
export async function revokeReviewLink(linkId: string) {
  if (!isPlannerDatabaseUrlConfigured()) {
    return { success: false as const, error: new ReviewPersistenceError("Database not configured") };
  }
  try {
    const [row] = await adminDb.update(reviewLinks)
      .set({ isRevoked: "true" })
      .where(eq(reviewLinks.id, linkId))
      .returning();
    return { success: true as const, data: row ?? null };
  } catch (e) {
    return { success: false as const, error: new ReviewPersistenceError("Failed to revoke review link", e) };
  }
}

/** Look up a review link by token. Includes computed isActive. */
export async function getReviewLinkByToken(token: string) {
  if (!isPlannerDatabaseUrlConfigured()) {
    return { success: false as const, error: new ReviewPersistenceError("Database not configured") };
  }
  try {
    const [row] = await adminDb.select().from(reviewLinks)
      .where(eq(reviewLinks.token, token))
      .limit(1);
    if (!row) return { success: true as const, data: null };
    const now = new Date();
    const expired = row.expiresAt && new Date(row.expiresAt) < now;
    const isActive = row.isRevoked !== "true" && !expired;
    return { success: true as const, data: { ...row, isActive } };
  } catch (e) {
    return { success: false as const, error: new ReviewPersistenceError("Failed to get review link", e) };
  }
}

/** List unrevolved review links for a plan. */
export async function listReviewLinks(planId: string) {
  if (!isPlannerDatabaseUrlConfigured()) {
    return { success: false as const, error: new ReviewPersistenceError("Database not configured") };
  }
  try {
    const rows = await adminDb.select().from(reviewLinks)
      .where(and(eq(reviewLinks.planId, planId), eq(reviewLinks.isRevoked, "false")))
      .orderBy(desc(reviewLinks.createdAt));
    return { success: true as const, data: rows };
  } catch (e) {
    return { success: false as const, error: new ReviewPersistenceError("Failed to list review links", e) };
  }
}

/** Add a comment to a plan / object. */
export async function createReviewComment(
  planId: string,
  authorName: string,
  text: string,
  options?: { linkId?: string; objectId?: string; objectType?: string },
) {
  if (!isPlannerDatabaseUrlConfigured()) {
    return { success: false as const, error: new ReviewPersistenceError("Database not configured") };
  }
  try {
    const [row] = await adminDb.insert(reviewComments).values({
      planId,
      linkId: options?.linkId ?? null,
      objectId: options?.objectId ?? null,
      objectType: options?.objectType ?? null,
      authorName,
      text,
    }).returning();
    return { success: true as const, data: row };
  } catch (e) {
    return { success: false as const, error: new ReviewPersistenceError("Failed to create comment", e) };
  }
}

/** List comments for a plan, newest first. */
export async function listReviewComments(planId: string) {
  if (!isPlannerDatabaseUrlConfigured()) {
    return { success: false as const, error: new ReviewPersistenceError("Database not configured") };
  }
  try {
    const rows = await adminDb.select().from(reviewComments)
      .where(eq(reviewComments.planId, planId))
      .orderBy(desc(reviewComments.createdAt));
    return { success: true as const, data: rows };
  } catch (e) {
    return { success: false as const, error: new ReviewPersistenceError("Failed to list comments", e) };
  }
}
