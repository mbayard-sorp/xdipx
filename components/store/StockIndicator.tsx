interface StockIndicatorProps {
  qty: number;
}

export function StockIndicator({ qty }: StockIndicatorProps) {
  if (qty <= 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-500 font-medium">Sold out</span>
      </div>
    );
  }

  if (qty < 10) {
    return (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-coral animate-pulse flex-shrink-0" />
        <span className="text-sm text-brand-coral font-semibold">
          Only {qty} left — don&apos;t sleep on this.
        </span>
      </div>
    );
  }

  if (qty < 25) {
    return (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-orange flex-shrink-0" />
        <span className="text-sm text-brand-orange font-medium">
          Only {qty} left at this price
        </span>
      </div>
    );
  }

  if (qty < 50) {
    return (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-orange/70 flex-shrink-0" />
        <span className="text-sm text-brand-charcoal/60 font-medium">
          {qty} remaining
        </span>
      </div>
    );
  }

  return null; // Plenty in stock — no indicator needed
}
