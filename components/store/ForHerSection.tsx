import { ShopifyProduct } from "@/types";
import { ProductCard } from "./ProductCard";

interface ForHerSectionProps {
  products: ShopifyProduct[];
}

export function ForHerSection({ products }: ForHerSectionProps) {
  if (!products.length) return null;

  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-headline font-black text-3xl text-brand-charcoal">
              For Her ♥
            </h2>
            <p className="text-brand-charcoal/50 mt-1">Made for her. Obviously.</p>
          </div>
          <a
            href="/for-her"
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-light transition-colors hidden sm:block"
          >
            See all →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
