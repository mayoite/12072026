"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { formatKpiValuePlus } from "@/lib/kpiFormat";

interface KpiCounterProps {
  value: number;
  className?: string;
}

export function KpiCounter({ value, className = "typ-stat text-primary" }: KpiCounterProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.45 });
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (reduceMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional set on mount/reduce for animation skip; reason: avoid initial 0 render + respect user motion pref; owner: Resolve Failures Agent (PLAN-FAIL-0411); removal: refactor to useLayoutEffect + ref or CSS transition when animation policy updated
      setDisplayValue(value);
      return;
    }
    if (!isInView) return;

    setDisplayValue(0);

    const durationMs = 2200;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, reduceMotion, value]);

  const renderedValue = reduceMotion || !isInView ? value : displayValue;

  return (
    <p ref={ref} className={className}>
      {formatKpiValuePlus(renderedValue)}
    </p>
  );
}