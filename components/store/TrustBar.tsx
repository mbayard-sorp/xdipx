import { DiscretionModal } from "./DiscretionModal";

const TRUST_PILLARS = [
  { icon: "🔒", label: "Discreet Billing" },
  { icon: "📦", label: "Plain Packaging" },
  { icon: "🚚", label: "Fast Shipping" },
  { icon: "↩", label: "Easy Returns" },
];

interface TrustBarProps {
  className?: string;
  compact?: boolean;
}

export function TrustBar({ className = "", compact = false }: TrustBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className={`flex items-center justify-center flex-wrap gap-x-6 gap-y-2 ${compact ? "text-xs" : "text-sm"}`}>
        {TRUST_PILLARS.map((p) => (
          <div key={p.label} className="flex items-center gap-1.5 text-brand-charcoal/60 whitespace-nowrap">
            <span className={compact ? "text-sm" : "text-base"}>{p.icon}</span>
            <span className="font-medium">{p.label}</span>
          </div>
        ))}
        <DiscretionModal />
      </div>
    </div>
  );
}
