"use client";

import { useState } from "react";
import { GenerateType } from "@/types";

interface GeneratedOutputs {
  tagline?: string;
  fullStory?: string;
  worksForHim?: string;
  worksForHer?: string;
  bullets?: string[];
  emailSubjects?: string[];
  metaDescription?: string;
}

const GENERATE_TYPES: { type: GenerateType; label: string }[] = [
  { type: "tagline",        label: "Tagline" },
  { type: "full-story",     label: "Full Story" },
  { type: "both-ways",      label: "Both Ways (Him + Her)" },
  { type: "bullets",        label: "Feature Bullets" },
  { type: "email-subjects", label: "Email Subject Lines" },
  { type: "meta",           label: "SEO Meta Description" },
];

export default function AdminGeneratePage() {
  const [productName, setProductName] = useState("");
  const [rawDescription, setRawDescription] = useState("");
  const [category, setCategory] = useState<"for-him" | "for-her" | "both" | "couples">("both");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [outputs, setOutputs] = useState<GeneratedOutputs>({});
  const [generating, setGenerating] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function generate(type: GenerateType) {
    if (!productName) return;
    setGenerating(type);
    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          rawDescription,
          category,
          price: parseFloat(price) || 0,
          originalPrice: parseFloat(originalPrice) || 0,
          type,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setOutputs((prev) => ({ ...prev, ...json.data }));
      }
    } finally {
      setGenerating(null);
    }
  }

  async function generateAll() {
    for (const { type } of GENERATE_TYPES) {
      await generate(type);
    }
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline font-black text-3xl text-brand-charcoal">AI Content Generator</h1>
        <p className="text-brand-charcoal/50 text-sm mt-1">Paste raw product info, generate xdipx-voice copy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input form */}
        <div className="bg-white rounded-2xl p-6 border border-brand-purple/10 space-y-4">
          <h2 className="font-headline font-bold text-brand-charcoal">Product Info</h2>

          <div>
            <label className="text-xs text-brand-charcoal/50 mb-1 block">Product Name *</label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Magic Wand Rechargeable HV-270"
              className="w-full border border-brand-purple/20 rounded-xl px-4 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-purple"
            />
          </div>

          <div>
            <label className="text-xs text-brand-charcoal/50 mb-1 block">Raw Description (paste from distributor)</label>
            <textarea
              value={rawDescription}
              onChange={(e) => setRawDescription(e.target.value)}
              placeholder="Paste the raw product description here..."
              rows={6}
              className="w-full border border-brand-purple/20 rounded-xl px-4 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-purple resize-y"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-brand-charcoal/50 mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full border border-brand-purple/20 rounded-xl px-3 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-purple bg-white"
              >
                <option value="both">Both</option>
                <option value="for-him">For Him</option>
                <option value="for-her">For Her</option>
                <option value="couples">Couples</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-brand-charcoal/50 mb-1 block">Deal Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.99"
                className="w-full border border-brand-purple/20 rounded-xl px-3 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-purple"
              />
            </div>
            <div>
              <label className="text-xs text-brand-charcoal/50 mb-1 block">MSRP ($)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="79.99"
                className="w-full border border-brand-purple/20 rounded-xl px-3 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={generateAll}
              disabled={!productName || !!generating}
              className="btn-gradient flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-50"
            >
              {generating ? `Generating ${generating}...` : "✨ Generate All"}
            </button>
          </div>

          {/* Individual generate buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-purple/10">
            {GENERATE_TYPES.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => generate(type)}
                disabled={!productName || !!generating}
                className="text-xs font-medium text-brand-purple hover:text-brand-purple-light border border-brand-purple/20 rounded-lg px-3 py-2 transition-colors disabled:opacity-40 text-left"
              >
                {generating === type ? "⏳ " : "✨ "}{label}
              </button>
            ))}
          </div>
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          {outputs.tagline && (
            <OutputBlock label="Tagline" onCopy={() => copy(outputs.tagline!, "tagline")} copied={copied === "tagline"}>
              <p className="text-brand-charcoal italic">&ldquo;{outputs.tagline}&rdquo;</p>
            </OutputBlock>
          )}

          {outputs.fullStory && (
            <OutputBlock label="Full Story" onCopy={() => copy(outputs.fullStory!, "story")} copied={copied === "story"}>
              <div className="text-brand-charcoal/80 text-sm leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                {outputs.fullStory}
              </div>
            </OutputBlock>
          )}

          {(outputs.worksForHim || outputs.worksForHer) && (
            <OutputBlock label="Both Ways" onCopy={() => copy(`FOR HIM:\n${outputs.worksForHim}\n\nFOR HER:\n${outputs.worksForHer}`, "both")} copied={copied === "both"}>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-brand-charcoal/50 text-xs mb-1">♂ For Him</p>
                  <p className="text-brand-charcoal/80 leading-relaxed">{outputs.worksForHim}</p>
                </div>
                <div>
                  <p className="font-medium text-brand-charcoal/50 text-xs mb-1">♀ For Her</p>
                  <p className="text-brand-charcoal/80 leading-relaxed">{outputs.worksForHer}</p>
                </div>
              </div>
            </OutputBlock>
          )}

          {outputs.bullets && outputs.bullets.length > 0 && (
            <OutputBlock label="Feature Bullets" onCopy={() => copy(outputs.bullets!.map((b) => `• ${b}`).join("\n"), "bullets")} copied={copied === "bullets"}>
              <ul className="space-y-1.5">
                {outputs.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm text-brand-charcoal/80">
                    <span className="text-brand-purple">♥</span>{b}
                  </li>
                ))}
              </ul>
            </OutputBlock>
          )}

          {outputs.emailSubjects && outputs.emailSubjects.length > 0 && (
            <OutputBlock label="Email Subject Lines" onCopy={() => copy(outputs.emailSubjects!.join("\n"), "emails")} copied={copied === "emails"}>
              <ol className="space-y-1.5">
                {outputs.emailSubjects.map((s, i) => (
                  <li key={i} className="text-sm text-brand-charcoal/80 flex gap-2">
                    <span className="text-brand-charcoal/30 font-mono">{i + 1}.</span>{s}
                  </li>
                ))}
              </ol>
            </OutputBlock>
          )}

          {outputs.metaDescription && (
            <OutputBlock label="SEO Meta Description" onCopy={() => copy(outputs.metaDescription!, "meta")} copied={copied === "meta"}>
              <p className="text-brand-charcoal/80 text-sm">{outputs.metaDescription}</p>
              <p className="text-brand-charcoal/30 text-xs mt-1">{outputs.metaDescription.length}/155 chars</p>
            </OutputBlock>
          )}

          {Object.keys(outputs).length === 0 && (
            <div className="bg-white rounded-2xl p-8 border border-brand-purple/10 text-center">
              <div className="text-4xl mb-3">✨</div>
              <p className="text-brand-charcoal/40">Outputs will appear here once generated.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OutputBlock({
  label,
  children,
  onCopy,
  copied,
}: {
  label: string;
  children: React.ReactNode;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-brand-purple/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-headline font-bold text-brand-charcoal text-sm">{label}</h3>
        <button
          onClick={onCopy}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
            copied ? "bg-green-100 text-green-700" : "bg-brand-mist text-brand-purple hover:bg-brand-purple hover:text-white"
          }`}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      {children}
    </div>
  );
}
