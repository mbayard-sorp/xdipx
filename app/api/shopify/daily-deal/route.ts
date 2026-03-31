import { NextResponse } from "next/server";
import { getDailyDeal } from "@/lib/shopify";

export const revalidate = 60;

export async function GET() {
  try {
    const deal = await getDailyDeal();
    return NextResponse.json({ deal });
  } catch (err) {
    console.error("/api/shopify/daily-deal error:", err);
    return NextResponse.json({ error: "Failed to fetch daily deal", deal: null }, { status: 500 });
  }
}
