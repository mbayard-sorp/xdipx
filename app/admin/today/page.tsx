"use client";

import { useState } from "react";
import Image from "next/image";
import { SEED_DAILY_DEAL } from "@/scripts/seed-data";
import { DailyDeal, GenerateType } from "@/types";
import { formatMoney } from "@/lib/shopify";

type DealStatus = "pending_approval" | "approved" | "live";

export default function AdminTodayPage() {
  const [deal] = useState<DailyDeal>(SEED_DAILY_DEAL);
  const [status, setStatus] = useState<DealStatus>("pending_approval");
  const [tagline, setTagline] = useState(deal.tagline);
  const [fullStory, setFullStory] = useState(deal.fullStory);
  const [worksForHim, setWorksForHim] = useState(deal.worksForHim);
  const [worksForHer, setWorksForHer] = useState(deal.worksForHer);
  const [bullets, setBullets] = useState<string[]>(deal.featureBullets);
  const [generating, setGenerating] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function regenerate(field: GenerateType) {
    setGenerating(field);
    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: deal.product.title,
          rawDescription: deal.product.description,
          category: deal.category ?? "both",
          price: deal.dealPrice,
          originalPrice: deal.originalPrice,
          type: field,
        }),
      });
      const json = await res.json();
      if (!json.success) return;

      const d = json.data;
      if (field === "tagline" && d.tagline) setTagline(d.tagline);
      if (field === "full-story" && d.fullStory) setFullStory(d.fullStory);
      if (field === "both-ways") {
        if (d.worksForHim) setWorksForHim(d.worksForHim);
        if (d.worksForHer) setWorksForHer(d.worksForHer);
      }
      if (field === "bullets" && d.bullets) setBullets(d.bullets);
    } finally {
      setGenerating(null);
    }
  }

  async function handleApprove() {
    setSaving(true);
    // TODO: update Shopify metafields via admin API
    await new Promise((r) => setTimeout(r, 800));
    setStatus("approved");
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const statusColors: Record<DealStatus, string> = {
    pending_approval: "bg-yellow-100 text-yellow-800",
    approved:         "bg-green-100 text-green-700",
    live:             "bg-brand-coral text-white",
  };
  const statusLabels: Record<DealStatus, string> = {
    pending_approval: "Pending Approval",
    approved:         "Approved",
    live:             "Live",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline font-black text-3xl text-brand-charcoal">Today&apos;s Deal</h1>
          <p className="text-brand-charcoal/50 text-sm mt-1">Review, edit, and approve before midnight.</p>
        </div>
        <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Preview */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-brand-purple/10">
            <div className="aspect-square bg-brand-mist rounded-xl mb-4 relative overflow-hidden">
              {deal.product.featuredImage ? (
                <Image
                  src={deal.product.featuredImage.url}
                  alt={deal.product.title}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-brand-purple/20 text-5xl">♥</div>
              )}
            </div>
            <h2 className="font-headline font-bold text-brand-charcoal text-sm">{deal.product.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-brand-coral">{formatMoney(deal.dealPrice)}</span>
              <span className="text-brand-charcoal/40 text-xs line-through">{formatMoney(deal.originalPrice)}</span>
              <span className="text-xs bg-brand-purple text-white px-2 py-0.5 rounded-full">{deal.discountPct}% off</span>
            </div>
            <p className="text-xs text-brand-charcoal/50 mt-2">SKU: {deal.product.xdipx?.nalpacSku ?? "—"}</p>
            <p className="text-xs text-brand-charcoal/50">Stock: {deal.stockCount} units</p>
            <p className="text-xs text-brand-charcoal/50">Score: {deal.product.xdipx?.dealScore?.toFixed(3) ?? "—"}</p>
          </div>

          {/* Approve button */}
          <button
            onClick={handleApprove}
            disabled={saving || status === "live"}
            className="btn-gradient w-full py-4 rounded-2xl font-bold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Approved ✓" : status === "approved" ? "Already Approved ✓" : "Approve Deal ♥"}
          </button>
        </div>

        {/* Right: Edit fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* Tagline */}
          <EditField
            label="Tagline"
            hint="One punchy sentence, max 12 words"
          >
            <div className="flex gap-2">
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="flex-1 border border-brand-purple/20 rounded-xl px-4 py-3 text-sm text-brand-charcoal outline-none focus:border-brand-purple"
              />
              <RegenerateButton
                onClick={() => regenerate("tagline")}
                loading={generating === "tagline"}
              />
            </div>
          </EditField>

          {/* Full Story */}
          <EditField label="Full Story" hint="300-350 words, brand voice">
            <div className="space-y-2">
              <textarea
                value={fullStory}
                onChange={(e) => setFullStory(e.target.value)}
                rows={10}
                className="w-full border border-brand-purple/20 rounded-xl px-4 py-3 text-sm text-brand-charcoal outline-none focus:border-brand-purple resize-y"
              />
              <RegenerateButton
                onClick={() => regenerate("full-story")}
                loading={generating === "full-story"}
              />
            </div>
          </EditField>

          {/* Both Ways */}
          <EditField label="Both Ways" hint="For Him + For Her sections">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-brand-charcoal/50 mb-1 block">♂ For Him</label>
                <textarea
                  value={worksForHim}
                  onChange={(e) => setWorksForHim(e.target.value)}
                  rows={4}
                  className="w-full border border-brand-purple/20 rounded-xl px-4 py-3 text-sm text-brand-charcoal outline-none focus:border-brand-purple resize-y"
                />
              </div>
              <div>
                <label className="text-xs text-brand-charcoal/50 mb-1 block">♀ For Her</label>
                <textarea
                  value={worksForHer}
                  onChange={(e) => setWorksForHer(e.target.value)}
                  rows={4}
                  className="w-full border border-brand-purple/20 rounded-xl px-4 py-3 text-sm text-brand-charcoal outline-none focus:border-brand-purple resize-y"
                />
              </div>
            </div>
            <RegenerateButton
              onClick={() => regenerate("both-ways")}
              loading={generating === "both-ways"}
            />
          </EditField>

          {/* Feature Bullets */}
          <EditField label="Feature Bullets" hint="5 bullets, benefit-led">
            <div className="space-y-2 mb-2">
              {bullets.map((b, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-brand-purple mt-3 text-xs flex-shrink-0">♥</span>
                  <input
                    value={b}
                    onChange={(e) => {
                      const copy = [...bullets];
                      copy[i] = e.target.value;
                      setBullets(copy);
                    }}
                    className="flex-1 border border-brand-purple/20 rounded-xl px-4 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-purple"
                  />
                </div>
              ))}
            </div>
            <RegenerateButton
              onClick={() => regenerate("bullets")}
              loading={generating === "bullets"}
            />
          </EditField>
        </div>
      </div>
    </div>
  );
}

function EditField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-brand-purple/10">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-headline font-bold text-brand-charcoal">{label}</h3>
        {hint && <span className="text-xs text-brand-charcoal/30">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function RegenerateButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 text-xs font-medium text-brand-purple hover:text-brand-purple-light transition-colors disabled:opacity-50"
    >
      {loading ? (
        <span className="w-3 h-3 border border-brand-purple border-t-transparent rounded-full animate-spin" />
      ) : (
        "✨"
      )}
      Regenerate with AI
    </button>
  );
}
