import { getProductsByTag } from "@/lib/shopify";
import { SEED_FOR_HIM } from "@/scripts/seed-data";
import { ProductCard } from "@/components/store/ProductCard";
import { TrustBar } from "@/components/store/TrustBar";

export const revalidate = 300;

export default async function ForHimPage() {
  let products = SEED_FOR_HIM;
  try {
    const fetched = await getProductsByTag("for-him", 24);
    if (fetched.length) products = fetched;
  } catch {
    // Use seed data
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero */}
      <div className="bg-brand-charcoal py-16 text-center">
        <p className="text-brand-orange/70 text-sm font-medium uppercase tracking-widest mb-3">
          Curated for him
        </p>
        <h1 className="font-headline font-black text-4xl md:text-5xl text-white mb-3">
          Dialed In ♥
        </h1>
        <p className="text-white/50 text-lg">
          The good stuff. Just for him.
        </p>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <TrustBar className="border-t border-brand-purple/10 py-6 bg-white" />
    </div>
  );
}
