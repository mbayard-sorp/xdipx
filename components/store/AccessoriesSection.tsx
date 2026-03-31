import { ShopifyProduct } from "@/types";
import { AccessoryCard } from "./AccessoryCard";

interface AccessoriesSectionProps {
  products: ShopifyProduct[];
}

export function AccessoriesSection({ products }: AccessoriesSectionProps) {
  if (!products.length) return null;

  return (
    <section className="bg-brand-cream py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-headline font-black text-2xl text-brand-charcoal">
            Make It Better ♥
          </h2>
          <p className="text-brand-charcoal/50 mt-1 text-sm">
            The perfect add-ons for today&apos;s deal.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product) => (
            <AccessoryCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
