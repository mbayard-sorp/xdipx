import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-headline font-black text-3xl text-brand-charcoal mb-2">Dashboard</h1>
      <p className="text-brand-charcoal/50 mb-8">What do you want to do today?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            href: "/admin/today",
            icon: "📅",
            title: "Today's Deal",
            desc: "Review and approve the active deal",
          },
          {
            href: "/admin/queue",
            icon: "📋",
            title: "Deal Queue",
            desc: "Schedule upcoming deals, reorder, manage the calendar",
          },
          {
            href: "/admin/generate",
            icon: "✨",
            title: "AI Generator",
            desc: "Generate copy and images for any product",
          },
          {
            href: "/admin/emails",
            icon: "📧",
            title: "Emails",
            desc: "Preview Klaviyo email drafts",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow border border-brand-purple/10 block"
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h2 className="font-headline font-bold text-brand-charcoal mb-1">{card.title}</h2>
            <p className="text-brand-charcoal/50 text-sm">{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* Cron trigger */}
      <div className="mt-10 bg-white rounded-2xl p-6 border border-brand-purple/10">
        <h2 className="font-headline font-bold text-lg text-brand-charcoal mb-2">
          Manual Cron Trigger
        </h2>
        <p className="text-brand-charcoal/50 text-sm mb-4">
          Run the deal selector + AI generator manually. Normally runs at 11:45 PM via Vercel Cron.
        </p>
        <ManualCronButton />
      </div>
    </div>
  );
}

function ManualCronButton() {
  // This is a server component so we use a form action
  return (
    <form
      action={async () => {
        "use server";
        // Trigger the cron endpoint with server-side auth
        const secret = process.env.CRON_SECRET;
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/deal-scheduler`, {
          headers: { Authorization: `Bearer ${secret}` },
        });
      }}
    >
      <button
        type="submit"
        className="btn-gradient px-6 py-3 rounded-xl text-white font-bold text-sm"
      >
        Run Deal Selector Now
      </button>
    </form>
  );
}
