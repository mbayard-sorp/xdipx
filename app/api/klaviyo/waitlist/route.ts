import { NextRequest, NextResponse } from "next/server";
import { addToWaitlist } from "@/lib/klaviyo";

export async function POST(req: NextRequest) {
  try {
    const { email, productId, productHandle } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    await addToWaitlist(email, productId, productHandle ?? "");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/klaviyo/waitlist error:", err);
    return NextResponse.json({ error: "Waitlist signup failed" }, { status: 500 });
  }
}
