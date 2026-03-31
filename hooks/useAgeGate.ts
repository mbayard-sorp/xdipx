"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "xdipx_age_verified";
const EXPIRY_DAYS = 30;

export function useAgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null); // null = not yet checked

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { timestamp } = JSON.parse(stored);
      const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp < expiryMs) {
        setVerified(true);
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
    }
    setVerified(false);
  }, []);

  function confirm() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }));
    setVerified(true);
  }

  function deny() {
    window.location.href = "https://www.google.com";
  }

  return { verified, confirm, deny };
}
