"use client";

import { useState } from "react";
import { QueuedDeal, DealStatus } from "@/types";
import { formatMoney } from "@/lib/shopify";

// Seed queue data for development
const SEED_QUEUE: QueuedDeal[] = [
  {
    id: "q-001",
    shopifyProductId: "seed-001",
    productTitle: "Magic Wand Rechargeable HV-270 Wand Massager",
    scheduledDate: new Date().toISOString().split("T")[0],
    category: "for-her",
    status: "live",
    dealScore: 0.949,
    brand: "Magic Wand",
    dealPrice: 142.95,
    originalPrice: 208.95,
    accessories: [],
  },
  {
    id: "q-002",
    shopifyProductId: "seed-vault-001",
    productTitle: "Shots Europe Vibrating Stroker",
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    category: "for-him",
    status: "approved",
    dealScore: 0.92,
    brand: "Shots",
    dealPrice: 19.42,
    originalPrice: 25.95,
    accessories: [],
  },
  {
    id: "q-003",
    shopifyProductId: "seed-him-001",
    productTitle: "System JO H2O Premium Water-Based Lubricant",
    scheduledDate: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    category: "both",
    status: "pending_approval",
    dealScore: 0.907,
    brand: "System JO",
    dealPrice: 31.55,
    originalPrice: 48.99,
    accessories: [],
  },
  {
    id: "q-004",
    shopifyProductId: "seed-her-001",
    productTitle: "Tantus Silk Small Premium Silicone",
    scheduledDate: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    category: "both",
    status: "pending",
    dealScore: 0.894,
    brand: "Tantus",
    dealPrice: 74.97,
    originalPrice: 99.96,
    accessories: [],
  },
  {
    id: "q-005",
    shopifyProductId: "seed-her-002",
    productTitle: "Nasstoys Mini Mite Vibrator",
    scheduledDate: new Date(Date.now() + 345600000).toISOString().split("T")[0],
    category: "for-her",
    status: "pending",
    dealScore: 0.857,
    brand: "Nasstoys",
    dealPrice: 13.65,
    originalPrice: 18.20,
    accessories: [],
  },
];

const STATUS_COLORS: Record<DealStatus, string> = {
  pending:          "bg-gray-100 text-gray-600",
  pending_approval: "bg-yellow-100 text-yellow-700",
  approved:         "bg-blue-100 text-blue-700",
  live:             "bg-green-100 text-green-700",
  archived:         "bg-gray-100 text-gray-400",
};

const CATEGORY_ICONS: Record<string, string> = {
  "for-him":    "♂",
  "for-her":    "♀",
  "both":       "♂♀",
  "couples":    "👫",
};

export default function AdminQueuePage() {
  const [queue, setQueue] = useState<QueuedDeal[]>(SEED_QUEUE);
  const [running, setRunning] = useState(false);
  const [runLog, setRunLog] = useState<string[]>([]);

  function moveUp(index: number) {
    if (index === 0) return;
    const copy = [...queue];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    setQueue(copy);
  }

  function moveDown(index: number) {
    if (index === queue.length - 1) return;
    const copy = [...queue];
    [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
    setQueue(copy);
  }

  async function runDealSelector() {
    setRunning(true);
    setRunLog([]);
    try {
      const res = await fetch("/api/deal-scheduler");
      const json = await res.json();
      if (json.log) setRunLog(json.log);
      if (json.success) {
        setRunLog((l) => [...l, `✓ New deal staged: ${json.title} @ $${json.dealPrice}`]);
      }
    } catch (e) {
      setRunLog(["Error running deal selector: " + String(e)]);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline font-black text-3xl text-brand-charcoal">Deal Queue</h1>
          <p className="text-brand-charcoal/50 text-sm mt-1">
            {queue.filter((d) => d.status !== "archived").length} deals scheduled
          </p>
        </div>
        <button
          onClick={runDealSelector}
          disabled={running}
          className="btn-gradient px-5 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50"
        >
          {running ? "Running..." : "✨ Run Deal Selector"}
        </button>
      </div>

      {/* Run log */}
      {runLog.length > 0 && (
        <div className="bg-brand-charcoal text-green-400 text-xs font-mono rounded-xl p-4 mb-6 max-h-40 overflow-y-auto">
          {runLog.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}

      {/* Queue table */}
      <div className="bg-white rounded-2xl border border-brand-purple/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-purple/10 bg-brand-mist/50">
                <th className="text-left px-5 py-3 font-medium text-brand-charcoal/50">Date</th>
                <th className="text-left px-5 py-3 font-medium text-brand-charcoal/50">Product</th>
                <th className="text-left px-5 py-3 font-medium text-brand-charcoal/50">Cat</th>
                <th className="text-left px-5 py-3 font-medium text-brand-charcoal/50">Price</th>
                <th className="text-left px-5 py-3 font-medium text-brand-charcoal/50">Score</th>
                <th className="text-left px-5 py-3 font-medium text-brand-charcoal/50">Status</th>
                <th className="text-left px-5 py-3 font-medium text-brand-charcoal/50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-purple/10">
              {queue.map((deal, i) => (
                <tr key={deal.id} className="hover:bg-brand-mist/30 transition-colors">
                  <td className="px-5 py-4 text-brand-charcoal/60 whitespace-nowrap">
                    {new Date(deal.scheduledDate).toLocaleDateString("en-US", {
                      month: "short", day: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-brand-charcoal line-clamp-1 max-w-xs">
                      {deal.productTitle}
                    </div>
                    <div className="text-brand-charcoal/40 text-xs">{deal.brand}</div>
                  </td>
                  <td className="px-5 py-4 text-brand-charcoal/60 text-base">
                    {CATEGORY_ICONS[deal.category ?? "both"] ?? "—"}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-bold text-brand-coral">{formatMoney(deal.dealPrice)}</span>
                    <span className="text-brand-charcoal/30 text-xs ml-1 line-through">{formatMoney(deal.originalPrice)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs text-brand-charcoal/60">
                      {deal.dealScore?.toFixed(3) ?? "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[deal.status]}`}>
                      {deal.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveUp(i)}
                        disabled={i === 0 || deal.status === "live"}
                        className="text-brand-charcoal/30 hover:text-brand-charcoal disabled:opacity-20 text-base"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveDown(i)}
                        disabled={i === queue.length - 1 || deal.status === "live"}
                        className="text-brand-charcoal/30 hover:text-brand-charcoal disabled:opacity-20 text-base"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-brand-charcoal/30 mt-4">
        Drag-and-drop reordering coming soon. Use arrows to adjust order.
      </p>
    </div>
  );
}
