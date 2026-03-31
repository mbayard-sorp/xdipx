"use client";

import { useState } from "react";
import { SEED_VAULT, SEED_FOR_HIM, SEED_FOR_HER } from "@/scripts/seed-data";
import { ShopifyProduct } from "@/types";
import { VaultCard } from "@/components/store/VaultCard";

const ALL_PRODUCTS = [...SEED_VAULT, ...SEED_FOR_HIM, ...SEED_FOR_HER];

type Filter = "all" | "for-him" | "for-her" | "for-couples" | "under-25" | "under-50";

function matchesFilter(product: ShopifyProduct, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "under-25") {
    const price = parseFloat(product.variants.nodes[0]?.price.amount ?? "0");
    return price < 25;
  }
  if (filter === "under-50") {
    const price = parseFloat(product.variants.nodes[0]?.price.amount ?? "0");
    return price < 50;
  }
  return product.tags.includes(filter);
}

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All Deals" },
  { id: "for-him", label: "For Him" },
  { id: "for-her", label: "For Her" },
  { id: "for-couples", label: "For Couples" },
  { id: "under-25", label: "Under $25" },
  { id: "under-50", label: "Under $50" },
];

export default function VaultPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const filtered = ALL_PRODUCTS.filter(
    (p) =>
      matchesFilter(p, filter) &&
      (search.length === 0 || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = filtered.length > paginated.length;

  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="font-headline font-black text-4xl text-brand-charcoal mb-2">
            The Vault ♥
          </h1>
          <p className="text-brand-charcoal/60">
            Every deal we&apos;ve ever run. Some still available.
          </p>
        </div>

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => { setFilter(f.id); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f.id
                    ? "btn-gradient text-white shadow-md"
                    : "bg-white text-brand-charcoal/60 hover:text-brand-charcoal border border-brand-purple/20"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search deals..."
            className="sm:ml-auto border border-brand-purple/20 rounded-xl px-4 py-2 text-sm bg-white text-brand-charcoal placeholder-brand-charcoal/30 outline-none focus:border-brand-purple w-full sm:w-64"
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-charcoal/40 text-lg">No deals match that filter. Yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {paginated.map((product) => (
                <VaultCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-gradient px-8 py-3 rounded-2xl text-white font-bold"
                >
                  Load More →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
