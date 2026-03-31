"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShopifyCart } from "@/types";
import { formatMoney } from "@/lib/shopify";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: ShopifyCart | null;
  loading: boolean;
  removeFromCart: (lineId: string) => Promise<void>;
  checkoutUrl: string | null;
}

export function CartDrawer({
  open,
  onClose,
  cart,
  loading,
  removeFromCart,
  checkoutUrl,
}: CartDrawerProps) {
  const lines = cart?.lines.nodes ?? [];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-brand-charcoal/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-brand-cream shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-brand-purple/10">
              <h2 className="font-headline font-bold text-xl text-brand-charcoal">
                Your Bag ♥
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-brand-mist transition-colors text-brand-charcoal/50 hover:text-brand-charcoal"
                aria-label="Close cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-brand-coral border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!loading && lines.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🛍️</div>
                  <p className="text-brand-charcoal/60 font-medium">Your bag is empty.</p>
                  <p className="text-brand-charcoal/40 text-sm mt-1">Today&apos;s deal is waiting.</p>
                </div>
              )}

              {lines.map((line) => (
                <div key={line.id} className="flex gap-3 bg-white rounded-2xl p-3 card-shadow">
                  {line.merchandise.product.featuredImage && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-brand-mist">
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-charcoal text-sm leading-tight truncate">
                      {line.merchandise.product.title}
                    </p>
                    <p className="text-brand-charcoal/50 text-xs mt-0.5">
                      Qty: {line.quantity}
                    </p>
                    <p className="font-bold text-brand-coral text-sm mt-1">
                      {formatMoney(line.merchandise.price.amount)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(line.id)}
                    className="text-brand-charcoal/30 hover:text-brand-coral transition-colors flex-shrink-0 p-1"
                    aria-label="Remove item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            {lines.length > 0 && (
              <div className="p-5 border-t border-brand-purple/10 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-charcoal/60">Subtotal</span>
                  <span className="font-bold text-brand-charcoal">
                    {formatMoney(cart?.cost.subtotalAmount.amount ?? "0")}
                  </span>
                </div>
                {checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    className="btn-gradient w-full py-4 rounded-2xl font-headline font-bold text-center text-white text-base block"
                  >
                    Checkout ♥
                  </a>
                ) : (
                  <button disabled className="w-full py-4 rounded-2xl bg-gray-200 text-gray-400 font-bold cursor-not-allowed">
                    Loading...
                  </button>
                )}
                <p className="text-center text-xs text-brand-charcoal/40">
                  🔒 Discreet billing & plain packaging
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
