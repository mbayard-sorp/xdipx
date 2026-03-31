import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "xdipx — Today's Deal",
  description:
    "One incredible deal on sexual wellness products, every single day. Ships discreet. Billing discreet. Your business is your business.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='26' font-size='26'>♥</text></svg>",
  },
  openGraph: {
    title: "xdipx — Today's Deal",
    description: "One incredible deal on sexual wellness products, every single day.",
    siteName: "xdipx",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
