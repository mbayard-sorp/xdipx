import Link from "next/link";
import { TrustBar } from "@/components/store/TrustBar";

export default function AboutPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero */}
      <div
        className="py-20 text-center px-4"
        style={{ background: "linear-gradient(135deg, #1E1A2E 0%, #7B2FBE 100%)" }}
      >
        <div className="font-headline font-black text-5xl text-gradient mb-2">xdipx</div>
        <p className="text-white/60 text-xl mt-2">
          One deal a day. For everyone.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        {/* Mission */}
        <section>
          <h2 className="font-headline font-black text-2xl text-brand-charcoal mb-4">
            Look, we all have a drawer. ♥
          </h2>
          <div className="prose-brand space-y-4">
            <p>
              Let&apos;s make it a great one. That&apos;s the whole idea behind xdipx.
            </p>
            <p>
              We&apos;re a daily flash-sale site for sexual wellness products. One deal drops every day
              at midnight. Deep discount, limited quantity, gone when it&apos;s gone. Just like the best
              deal sites — except for the stuff you actually want to talk about at brunch
              (or, you know, don&apos;t).
            </p>
            <p>
              The name &ldquo;xdipx&rdquo; is a palindrome. It reads the same forwards and backwards.
              Just like our products: built for everyone, from every angle. No gatekeeping here.
              Whether you&apos;re brand new to this space or you&apos;ve been building your collection
              for years, xdipx is for you.
            </p>
          </div>
        </section>

        {/* Why */}
        <section>
          <h2 className="font-headline font-black text-2xl text-brand-charcoal mb-4">
            Why xdipx?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "💡",
                title: "Great products, not random ones",
                body: "Every deal is scored and curated. We only feature products we'd actually recommend.",
              },
              {
                icon: "💰",
                title: "Real prices, not fake markdowns",
                body: "We show you the honest savings. The MSRP is real, the discount is real, the deal is real.",
              },
              {
                icon: "🔒",
                title: "Privacy first, always",
                body: "Plain packaging, discreet billing, and we'll never use your data in a weird way.",
              },
              {
                icon: "♥",
                title: "For everyone",
                body: "No assumptions, no judgment. Every product gets a 'For Him' and 'For Her' section because everyone deserves the full picture.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-5 card-shadow">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-headline font-bold text-brand-charcoal mb-1">{item.title}</h3>
                <p className="text-brand-charcoal/60 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust bar */}
        <TrustBar className="bg-brand-mist rounded-2xl py-6 px-4" />

        {/* CTA */}
        <div className="text-center">
          <Link href="/" className="btn-gradient inline-block px-10 py-4 rounded-2xl text-white font-headline font-bold text-lg shadow-lg">
            See Today&apos;s Deal ♥
          </Link>
        </div>
      </div>
    </div>
  );
}
