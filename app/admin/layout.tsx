import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin nav */}
      <nav className="bg-brand-charcoal text-white px-6 py-4 flex items-center gap-8">
        <Link href="/admin" className="font-headline font-black text-xl text-gradient">
          xdipx <span className="text-white/40 text-sm font-normal">admin</span>
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/admin/queue"    className="text-white/70 hover:text-white transition-colors">Queue</Link>
          <Link href="/admin/today"    className="text-white/70 hover:text-white transition-colors">Today</Link>
          <Link href="/admin/generate" className="text-white/70 hover:text-white transition-colors">Generate</Link>
          <Link href="/admin/emails"   className="text-white/70 hover:text-white transition-colors">Emails</Link>
        </div>
        <Link href="/" className="ml-auto text-white/40 hover:text-white/70 text-xs transition-colors">
          ← View site
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
