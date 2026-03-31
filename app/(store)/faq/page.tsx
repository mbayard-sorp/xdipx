"use client";

import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: "Shipping & Packaging",
    items: [
      {
        q: "Will anyone know what's inside?",
        a: "Absolutely not. Every xdipx order ships in a plain, unmarked box or poly mailer. No logos, no hints, nothing. The return address will say 'XD Inc.' — boring on purpose.",
      },
      {
        q: "How fast does it ship?",
        a: "Most orders ship within 1-2 business days via our fulfillment partner. Standard delivery is typically 3-7 business days. We'll send you tracking so you can watch it make its way to you.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently we ship within the continental United States. International shipping is on our roadmap. Stay on the email list for updates.",
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        q: "What will appear on my credit card statement?",
        a: "Your statement will show a discreet descriptor — not 'xdipx' or anything revealing. We'll confirm exactly what it shows in your order confirmation email.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. We use a specialized high-risk payment processor that handles adult purchases with full PCI compliance. Your card details are never stored on our servers.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      {
        q: "What's your return policy?",
        a: "For hygiene reasons, we can't accept returns on used products. Unopened items in original packaging can be returned within 14 days. Something wrong? Email us at hello@xdipx.com — we'll make it right.",
      },
      {
        q: "What if something arrives damaged?",
        a: "That's on us. Email us a photo at hello@xdipx.com and we'll get a replacement out to you right away, no questions asked.",
      },
    ],
  },
  {
    title: "The Daily Deal",
    items: [
      {
        q: "How does the daily deal work?",
        a: "Every day at midnight, a new deal drops. One product, one price, one day only. When it's gone, it's gone. The countdown timer on the homepage shows exactly how much time is left.",
      },
      {
        q: "Can I buy more than one?",
        a: "Each deal is limited to 3 units per customer. This keeps the deal available for more people and the price as good as possible.",
      },
      {
        q: "What if a deal sells out before I can buy?",
        a: "Use the waitlist button on that product in the Vault. If we ever restock it, you'll be the first to know.",
      },
    ],
  },
  {
    title: "About xdipx",
    items: [
      {
        q: "What does xdipx mean?",
        a: "It's a palindrome — reads the same forwards and backwards. Just like our products: built for everyone, from every angle. ♥",
      },
      {
        q: "Is this a real company?",
        a: "Very real. We're obsessed with finding products worth buying at prices worth celebrating. New deal every single day, and we're just getting started.",
      },
      {
        q: "Who is xdipx for?",
        a: "Everyone who has a drawer. Whether you're a first-timer or you've been in this space for years, we want xdipx to be the place where you find something great at a price that makes you smile.",
      },
    ],
  },
];

function AccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-brand-purple/10 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium text-brand-charcoal leading-snug">{item.q}</span>
        <span
          className={`text-brand-purple text-xl flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-brand-charcoal/70 leading-relaxed">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="font-headline font-black text-4xl text-brand-charcoal mb-3">
            FAQ ♥
          </h1>
          <p className="text-brand-charcoal/60">
            Everything you wanted to know but felt slightly weird asking.
            <br />
            We&apos;re not weird about it.
          </p>
        </div>

        <div className="space-y-8">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title} className="bg-white rounded-3xl p-6 md:p-8 card-shadow">
              <h2 className="font-headline font-bold text-lg text-brand-charcoal mb-2 text-gradient">
                {section.title}
              </h2>
              <div>
                {section.items.map((item, i) => (
                  <AccordionItem key={i} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-brand-charcoal/60 mb-3">Still have questions?</p>
          <a
            href="mailto:hello@xdipx.com"
            className="btn-gradient inline-block px-8 py-3 rounded-2xl text-white font-bold"
          >
            Email us ♥
          </a>
        </div>
      </div>
    </div>
  );
}
