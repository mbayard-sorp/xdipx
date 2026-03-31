"use client";

import { useState } from "react";
import { DailyDeal } from "@/types";
import { BothWaysSection } from "./BothWaysSection";

interface ProductTabsProps {
  deal: DailyDeal;
}

const TABS = [
  { id: "story",    label: "The Full Story" },
  { id: "specs",    label: "What's In The Box" },
  { id: "reviews",  label: "Real Talk" },
  { id: "both",     label: "Both Ways" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProductTabs({ deal }: ProductTabsProps) {
  const [active, setActive] = useState<TabId>("story");

  return (
    <div className="bg-white rounded-3xl overflow-hidden card-shadow">
      {/* Tab bar */}
      <div className="flex border-b border-brand-purple/10 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex-1 min-w-max px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              active === tab.id
                ? "border-brand-coral text-brand-coral"
                : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6 md:p-8">
        {active === "story" && (
          <div className="prose-brand max-w-none">
            {deal.fullStory ? (
              deal.fullStory.split("\n\n").map((para, i) => (
                <p key={i} className="text-brand-charcoal/80 leading-relaxed mb-4 last:mb-0">
                  {para}
                </p>
              ))
            ) : (
              <p className="text-brand-charcoal/80 leading-relaxed">
                {deal.product.description}
              </p>
            )}
          </div>
        )}

        {active === "specs" && (
          <SpecsTab deal={deal} />
        )}

        {active === "reviews" && (
          <ReviewsTab />
        )}

        {active === "both" && (
          <BothWaysSection
            forHim={deal.worksForHim}
            forHer={deal.worksForHer}
          />
        )}
      </div>
    </div>
  );
}

function SpecsTab({ deal }: { deal: DailyDeal }) {
  const variant = deal.product.variants.nodes[0];
  const specs = [
    { label: "Brand", value: deal.product.vendor },
    { label: "SKU", value: variant?.sku || deal.product.xdipx?.nalpacSku || "—" },
    { label: "Material", value: deal.product.productType || "—" },
    { label: "Category", value: deal.product.tags.find((t) => t.startsWith("cat:"))?.replace("cat:", "").replace(/-/g, " ") || "—" },
  ].filter((s) => s.value && s.value !== "—");

  return (
    <div>
      {deal.featureBullets.length > 0 && (
        <ul className="space-y-2 mb-6">
          {deal.featureBullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3 text-brand-charcoal/80">
              <span className="text-brand-purple flex-shrink-0 mt-0.5">♥</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {specs.length > 0 && (
        <dl className="divide-y divide-brand-purple/10 border-t border-brand-purple/10 mt-4">
          {specs.map((spec) => (
            <div key={spec.label} className="flex gap-4 py-3">
              <dt className="text-sm text-brand-charcoal/50 font-medium w-24 flex-shrink-0 capitalize">
                {spec.label}
              </dt>
              <dd className="text-sm text-brand-charcoal capitalize">{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function ReviewsTab() {
  const PLACEHOLDER_REVIEWS = [
    {
      name: "Alex T.",
      rating: 5,
      date: "2 weeks ago",
      body: "Honestly shocked at the quality for this price. Arrived fast, totally discreet packaging. Would 100% order again.",
    },
    {
      name: "Morgan R.",
      rating: 5,
      date: "1 month ago",
      body: "The deal was too good to pass up and I'm so glad I didn't. This is now a permanent fixture in my life. You'll understand when you get it.",
    },
    {
      name: "Jamie K.",
      rating: 4,
      date: "3 weeks ago",
      body: "Great product, great price. Shipping was quick and the packaging gave nothing away. Exactly what I needed.",
    },
  ];

  return (
    <div className="space-y-5">
      {PLACEHOLDER_REVIEWS.map((review, i) => (
        <div key={i} className="border-b border-brand-purple/10 pb-5 last:border-0 last:pb-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold">
                {review.name[0]}
              </div>
              <span className="font-medium text-brand-charcoal text-sm">{review.name}</span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} className={j < review.rating ? "text-brand-orange" : "text-gray-200"}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-brand-charcoal/70 text-sm leading-relaxed">{review.body}</p>
          <p className="text-brand-charcoal/30 text-xs mt-2">{review.date}</p>
        </div>
      ))}
    </div>
  );
}
