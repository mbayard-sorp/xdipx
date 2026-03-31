"use client";

import { useCountdown, padTime } from "@/hooks/useCountdown";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const ROTATING_COPY = [
  "Today only. No reruns. No excuses.",
  "This deal disappears at midnight. Just saying.",
  "New deal drops at midnight. This one's going, going...",
];

export function CountdownTimer() {
  const { hours, minutes, seconds, isExpired } = useCountdown();
  const [copyIndex, setCopyIndex] = useState(0);

  // Rotate the urgency copy every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCopyIndex((i) => (i + 1) % ROTATING_COPY.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (isExpired) {
    return (
      <div className="text-center py-4">
        <p className="font-headline font-bold text-xl text-brand-purple animate-pulse">
          New deal dropping now... ♥
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Rotating urgency copy */}
      <div className="h-6 overflow-hidden mb-3">
        <AnimatePresence mode="wait">
          <motion.p
            key={copyIndex}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium text-brand-charcoal/60 italic"
          >
            {ROTATING_COPY[copyIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Countdown digits */}
      <div className="flex items-end justify-center gap-1">
        <TimeBlock value={hours} label="hours" />
        <Colon />
        <TimeBlock value={minutes} label="min" />
        <Colon />
        <TimeBlock value={seconds} label="sec" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="countdown-block text-5xl md:text-6xl tabular-nums"
        >
          {padTime(value)}
        </motion.span>
      </AnimatePresence>
      <span className="text-xs text-brand-charcoal/40 uppercase tracking-widest mt-1 font-medium">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <span className="countdown-block text-5xl md:text-6xl pb-5 leading-none mx-0.5 select-none">
      :
    </span>
  );
}
