import { getProductsByTag } from "@/lib/shopify";
import { SEED_FOR_HER } from "@/scripts/seed-data";
import { ProductCard } from "@/components/store/ProductCard";
import { TrustBar } from "@/components/store/TrustBar";

export const revalidate = 300;

export default async function ForHerPage() {
  let products = SEED_FOR_HER;
  try {
    const fetched = await getProductsByTag("for-her", 24);
    if (fetched.length) products = fetched;
  } catch {
    // Use seed data
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero */}
      <div
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #F04E37 0%, #FF8C38 60%, #A855F7 100%)" }}
      >
        <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-3">
          Made for her
        </p>
        <h1 className="font-headline font-black text-4xl md:text-5xl text-white mb-3">
          Obviously ♥
        </h1>
        <p className="text-white/70 text-lg">
          Products that actually understand what you want.
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
