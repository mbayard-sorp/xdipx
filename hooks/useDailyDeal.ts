"use client";

import { useState, useEffect } from "react";
import { DailyDeal } from "@/types";

// Client-side hook that fetches the daily deal via our API proxy.
// Server components should call getDailyDeal() from lib/shopify directly.
export function useDailyDeal() {
  const [deal, setDeal] = useState<DailyDeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/shopify/daily-deal")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setDeal(data.deal);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { deal, loading, error };
}
