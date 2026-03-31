"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAgeGate } from "@/hooks/useAgeGate";

export function AgeGate() {
  const { verified, confirm, deny } = useAgeGate();

  // Don't render anything until localStorage is checked (avoids flash)
  if (verified === null || verified === true) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
        style={{ background: "linear-gradient(135deg, #F04E37 0%, #FF8C38 50%, #7B2FBE 100%)" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl"
        >
          {/* Logo */}
          <div className="mb-6">
            <span className="font-headline font-black text-4xl text-gradient">xdipx</span>
            <div className="text-brand-purple text-xl mt-1">♥</div>
          </div>

          <h1 className="font-headline font-bold text-2xl text-brand-charcoal mb-3 leading-tight">
            Hey there.
          </h1>

          <p className="text-brand-charcoal/70 text-base leading-relaxed mb-8">
            xdipx is a grown-ups-only kind of place.
            <br />
            Are you{" "}
            <span className="font-semibold text-brand-charcoal">18 or older?</span>
          </p>

          <div className="space-y-3">
            <button
              onClick={confirm}
              className="btn-gradient w-full py-4 px-6 rounded-2xl font-headline font-bold text-lg text-white shadow-lg"
            >
              Yes, let me in ♥
            </button>
            <button
              onClick={deny}
              className="w-full py-3 px-6 rounded-2xl font-medium text-brand-charcoal/50 hover:text-brand-charcoal/70 transition-colors text-sm"
            >
              Not yet
            </button>
          </div>

          <p className="text-xs text-brand-charcoal/40 mt-6 leading-relaxed">
            We don&apos;t track this. Just keeping things responsible.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
