import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";
import { AgeGate } from "@/components/store/AgeGate";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AgeGate />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
