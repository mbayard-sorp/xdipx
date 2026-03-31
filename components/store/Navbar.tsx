"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const { cartCount, cart, loading, removeFromCart, checkoutUrl } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-brand-cream/95 backdrop-blur-sm border-b border-brand-purple/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="font-headline font-black text-2xl text-gradient">xdipx</span>
              <span className="text-brand-purple text-sm ml-0.5">♥</span>
            </Link>

            {/* Center nav links (desktop) */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/vault"
                className="text-sm font-medium text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
              >
                The Vault
              </Link>
              <Link
                href="/for-him"
                className="text-sm font-medium text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
              >
                For Him
              </Link>
              <Link
                href="/for-her"
                className="text-sm font-medium text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
              >
                For Her
              </Link>
            </div>

            {/* Right: cart icon */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl hover:bg-brand-mist transition-colors"
              aria-label="Open cart"
            >
              <BagIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 btn-gradient text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        loading={loading}
        removeFromCart={removeFromCart}
        checkoutUrl={checkoutUrl}
      />
    </>
  );
}

function BagIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand-charcoal"
    >
      <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
