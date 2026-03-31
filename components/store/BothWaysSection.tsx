interface BothWaysSectionProps {
  forHim: string;
  forHer: string;
}

export function BothWaysSection({ forHim, forHer }: BothWaysSectionProps) {
  if (!forHim && !forHer) {
    return (
      <p className="text-brand-charcoal/40 italic text-sm">
        Copy coming soon. ♥
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {forHim && (
        <div className="bg-brand-mist rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">♂</span>
            <h4 className="font-headline font-bold text-brand-charcoal">For Him ♥</h4>
          </div>
          <p className="text-brand-charcoal/70 text-sm leading-relaxed">{forHim}</p>
        </div>
      )}

      {forHer && (
        <div className="bg-brand-mist rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">♀</span>
            <h4 className="font-headline font-bold text-brand-charcoal">For Her ♥</h4>
          </div>
          <p className="text-brand-charcoal/70 text-sm leading-relaxed">{forHer}</p>
        </div>
      )}
    </div>
  );
}
