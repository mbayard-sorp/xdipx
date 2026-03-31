"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DiscretionModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-5 h-5 rounded-full border border-brand-charcoal/30 text-brand-charcoal/40 text-xs font-bold hover:border-brand-purple hover:text-brand-purple transition-colors flex items-center justify-center flex-shrink-0"
        aria-label="Privacy info"
      >
        ?
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-brand-charcoal/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="fixed inset-x-4 bottom-4 z-50 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md w-full bg-white rounded-3xl p-7 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-headline font-bold text-xl text-brand-charcoal">
                  Your privacy is everything. ♥
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-brand-charcoal/30 hover:text-brand-charcoal transition-colors ml-4 flex-shrink-0"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 text-brand-charcoal/70 text-sm leading-relaxed">
                <p>
                  Orders ship in plain, unmarked packaging — no logos, no hints, nothing.
                  The return address will say &ldquo;XD Inc.&rdquo; — boring on purpose.
                </p>
                <p>
                  Your billing statement will show a discreet charge descriptor — never
                  &ldquo;xdipx&rdquo; or anything revealing.
                </p>
                <p className="font-medium text-brand-charcoal">
                  What you buy is your business, full stop.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="btn-gradient w-full py-3 mt-6 rounded-2xl font-bold text-white text-sm"
              >
                Got it ♥
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
