import Link from "next/link";
import { ShopifyProduct } from "@/types";
import { VaultCard } from "./VaultCard";

interface VaultPreviewProps {
  products: ShopifyProduct[];
}

export function VaultPreview({ products }: VaultPreviewProps) {
  if (!products.length) return null;

  return (
    <section className="bg-brand-cream py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-headline font-black text-2xl text-brand-charcoal">
              The Vault
            </h2>
            <p className="text-brand-charcoal/50 mt-1 text-sm">
              Recent deals — some still available.
            </p>
          </div>
          <Link
            href="/vault"
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-light transition-colors"
          >
            See Everything →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product) => (
            <VaultCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
