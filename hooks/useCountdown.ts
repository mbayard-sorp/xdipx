"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  total: number; // ms remaining
  isExpired: boolean;
}

function getMidnightMs(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function parseMs(ms: number): CountdownTime {
  if (ms <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0, isExpired: true };
  }
  const total = ms;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  ms -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(ms / (1000 * 60));
  ms -= minutes * 1000 * 60;
  const seconds = Math.floor(ms / 1000);
  return { hours, minutes, seconds, total, isExpired: false };
}

export function useCountdown(): CountdownTime {
  const [time, setTime] = useState<CountdownTime>(() => parseMs(getMidnightMs()));

  const tick = useCallback(() => {
    setTime(parseMs(getMidnightMs()));
  }, []);

  useEffect(() => {
    tick(); // Sync immediately on mount
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return time;
}

export function padTime(n: number): string {
  return String(n).padStart(2, "0");
}
