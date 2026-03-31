"use client";

import { useState } from "react";
import { SEED_DAILY_DEAL } from "@/scripts/seed-data";
import { formatMoney } from "@/lib/shopify";

const EMAIL_FLOWS = [
  {
    id: "welcome",
    name: "Welcome Series",
    trigger: "On subscribe",
    emails: [
      { num: 1, delay: "Immediate", subject: "Welcome to xdipx ♥ Here's today's deal" },
      { num: 2, delay: "Day 2",     subject: "Here's how xdipx works (and why you'll love it)" },
      { num: 3, delay: "Day 5",     subject: "About your orders: shipping, billing, all the good stuff" },
    ],
  },
  {
    id: "daily",
    name: "Daily Deal",
    trigger: "Midnight cron",
    emails: [
      { num: 1, delay: "Midnight", subject: "[AI generated per deal]" },
    ],
  },
  {
    id: "back-in-stock",
    name: "Back In Stock",
    trigger: "Inventory restored",
    emails: [
      { num: 1, delay: "Immediate", subject: "Your waitlist item is back — for 24 hours only" },
    ],
  },
  {
    id: "abandoned",
    name: "Abandoned Checkout",
    trigger: "Checkout started, not completed",
    emails: [
      { num: 1, delay: "1 hour",  subject: "You got so close. Your cart is waiting. ♥" },
      { num: 2, delay: "24 hours", subject: "Last chance — deal ends at midnight" },
    ],
  },
  {
    id: "post-purchase",
    name: "Post-Purchase",
    trigger: "Order completed",
    emails: [
      { num: 1, delay: "Immediate", subject: "Order confirmed — ships in plain packaging ♥" },
      { num: 2, delay: "Day 7",     subject: "How'd we do? (And tomorrow's deal is 🔥)" },
    ],
  },
];

export default function AdminEmailsPage() {
  const [selected, setSelected] = useState("daily");
  const [previewSubject, setPreviewSubject] = useState("");
  const [generating, setGenerating] = useState(false);

  const deal = SEED_DAILY_DEAL;

  async function generateSubjectLines() {
    setGenerating(true);
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
          type: "email-subjects",
        }),
      });
      const json = await res.json();
      if (json.success && json.data.emailSubjects?.length) {
        setPreviewSubject(json.data.emailSubjects[0]);
      }
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline font-black text-3xl text-brand-charcoal">Email Flows</h1>
        <p className="text-brand-charcoal/50 text-sm mt-1">Manage Klaviyo email flows and preview today&apos;s deal email.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flow list */}
        <div className="space-y-2">
          {EMAIL_FLOWS.map((flow) => (
            <button
              key={flow.id}
              onClick={() => setSelected(flow.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected === flow.id
                  ? "border-brand-coral bg-brand-cream shadow-sm"
                  : "border-brand-purple/10 bg-white hover:border-brand-purple/30"
              }`}
            >
              <div className="font-medium text-brand-charcoal text-sm">{flow.name}</div>
              <div className="text-brand-charcoal/40 text-xs mt-0.5">{flow.trigger}</div>
            </button>
          ))}
        </div>

        {/* Flow detail */}
        <div className="lg:col-span-2 space-y-4">
          {EMAIL_FLOWS.filter((f) => f.id === selected).map((flow) => (
            <div key={flow.id}>
              <div className="bg-white rounded-2xl p-6 border border-brand-purple/10 mb-4">
                <h2 className="font-headline font-bold text-xl text-brand-charcoal mb-1">{flow.name}</h2>
                <p className="text-brand-charcoal/50 text-sm">Trigger: {flow.trigger}</p>
              </div>

              <div className="space-y-3">
                {flow.emails.map((email) => (
                  <div key={email.num} className="bg-white rounded-xl p-5 border border-brand-purple/10 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-mist flex items-center justify-center text-brand-purple font-bold text-sm flex-shrink-0">
                      {email.num}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-brand-charcoal/40 mb-0.5">Sends: {email.delay}</div>
                      <div className="font-medium text-brand-charcoal text-sm">{email.subject}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Daily deal email preview */}
          {selected === "daily" && (
            <div className="bg-white rounded-2xl p-6 border border-brand-purple/10">
              <h3 className="font-headline font-bold text-brand-charcoal mb-4">
                Today&apos;s Deal Email Preview
              </h3>

              <div className="border border-brand-purple/10 rounded-xl overflow-hidden">
                {/* Email preview header */}
                <div className="bg-brand-charcoal text-white p-4 text-center">
                  <div className="font-headline font-black text-2xl text-gradient">xdipx</div>
                  <div className="text-white/50 text-xs mt-0.5">Today&apos;s deal drops at midnight</div>
                </div>

                {/* Email body */}
                <div className="p-6 text-center">
                  <div className="w-32 h-32 bg-brand-mist rounded-2xl mx-auto mb-4 flex items-center justify-center text-brand-purple/30 text-5xl">
                    ♥
                  </div>
                  <h4 className="font-headline font-bold text-lg text-brand-charcoal mb-1">
                    {deal.product.title}
                  </h4>
                  <p className="text-brand-charcoal/60 text-sm mb-4 italic">{deal.tagline}</p>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="font-black text-2xl text-brand-coral">{formatMoney(deal.dealPrice)}</span>
                    <span className="text-brand-charcoal/30 line-through">{formatMoney(deal.originalPrice)}</span>
                    <span className="bg-brand-purple text-white text-xs font-bold px-2 py-1 rounded-full">{deal.discountPct}% off</span>
                  </div>
                  <div className="bg-brand-gradient text-white py-3 px-8 rounded-2xl font-bold inline-block mb-4">
                    Dip In ♥
                  </div>
                  <p className="text-brand-charcoal/30 text-xs">
                    🔒 Discreet billing &nbsp;|&nbsp; 📦 Plain packaging &nbsp;|&nbsp; 🚚 Fast shipping
                  </p>
                </div>

                <div className="bg-brand-mist px-6 py-4 text-center">
                  <p className="text-brand-charcoal/40 text-xs">
                    Deal ends tonight at midnight. New deal tomorrow. ♥
                  </p>
                </div>
              </div>

              {/* Generate subject line */}
              <div className="mt-4 space-y-2">
                <label className="text-xs text-brand-charcoal/50">Subject Line</label>
                <div className="flex gap-2">
                  <input
                    value={previewSubject}
                    onChange={(e) => setPreviewSubject(e.target.value)}
                    placeholder="Click Generate to create AI subject lines..."
                    className="flex-1 border border-brand-purple/20 rounded-xl px-4 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-purple"
                  />
                  <button
                    onClick={generateSubjectLines}
                    disabled={generating}
                    className="btn-gradient px-4 py-2.5 rounded-xl text-white text-sm font-bold whitespace-nowrap disabled:opacity-50"
                  >
                    {generating ? "..." : "✨ Generate"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
