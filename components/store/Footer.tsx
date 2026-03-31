import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="font-headline font-black text-3xl text-gradient mb-2">xdipx</div>
            <p className="text-white/50 text-sm leading-relaxed">
              One deal a day. Ships in plain packaging.
              <br />
              Your business is your business.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/vault", label: "The Vault" },
                { href: "/for-him", label: "For Him" },
                { href: "/for-her", label: "For Her" },
                { href: "/about", label: "About" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
              Our Promise
            </h4>
            <p className="text-white/60 text-sm leading-relaxed">
              At xdipx, every order ships in plain, unmarked packaging.
              Your billing statement will show a discreet charge descriptor.
              <span className="text-white/80"> Your business is your business.</span>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} xdipx. All rights reserved. Adults 18+ only.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/faq" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/faq" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Terms of Service
            </Link>
            <span className="text-brand-purple text-sm">♥</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
