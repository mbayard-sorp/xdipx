"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShopifyProduct } from "@/types";
import { formatMoney } from "@/lib/shopify";

interface VaultCardProps {
  product: ShopifyProduct;
  showWaitlist?: boolean;
}

export function VaultCard({ product, showWaitlist = true }: VaultCardProps) {
  const [waitlisted, setWaitlisted] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  const variant = product.variants.nodes[0];
  const isAvailable = variant?.availableForSale ?? false;
  const dealPrice = parseFloat(variant?.price.amount ?? "0");
  const originalPrice = product.xdipx?.originalPrice ?? parseFloat(variant?.compareAtPrice?.amount ?? "0");
  const dealDate = product.xdipx?.dealDate;

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/klaviyo/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId: product.id, productHandle: product.handle }),
      });
      setWaitlisted(true);
    } catch {
      // Silent fail — user still sees success to prevent enumeration
      setWaitlisted(true);
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden card-shadow card-shadow-hover flex flex-col">
      {/* Image */}
      <Link href={`/vault#${product.handle}`} className="relative aspect-[4/3] bg-brand-mist block">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            className={`object-cover ${!isAvailable ? "opacity-60 grayscale" : ""}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-charcoal/20 text-4xl">
            ♥
          </div>
        )}

        {/* Status badge */}
        <div
          className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${
            isAvailable
              ? "bg-green-500 text-white"
              : "bg-brand-charcoal/70 text-white"
          }`}
        >
          {isAvailable ? "Still Available" : "Sold Out"}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-headline font-semibold text-brand-charcoal text-sm leading-tight line-clamp-2 mb-1">
          {product.title}
        </h3>

        {dealDate && (
          <p className="text-xs text-brand-charcoal/30 mb-2">
            {new Date(dealDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        )}

        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="font-bold text-brand-coral text-sm">
            {formatMoney(dealPrice)}
          </span>
          {originalPrice > 0 && originalPrice !== dealPrice && (
            <span className="text-brand-charcoal/30 text-xs line-through">
              {formatMoney(originalPrice)}
            </span>
          )}
        </div>

        {/* Waitlist button for sold-out items */}
        {!isAvailable && showWaitlist && (
          <div className="mt-3">
            {waitlisted ? (
              <p className="text-xs text-green-600 font-medium">
                You&apos;re on the list ♥
              </p>
            ) : showEmailInput ? (
              <form onSubmit={handleWaitlist} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 text-xs border border-brand-purple/20 rounded-lg px-3 py-2 outline-none focus:border-brand-purple"
                  required
                />
                <button
                  type="submit"
                  className="btn-gradient text-white text-xs font-bold px-3 py-2 rounded-lg"
                >
                  ♥
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowEmailInput(true)}
                className="text-xs font-medium text-brand-purple hover:text-brand-purple-light transition-colors underline underline-offset-2"
              >
                Waitlist me →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
