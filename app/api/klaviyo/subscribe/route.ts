import { NextRequest, NextResponse } from "next/server";
import { subscribeToList } from "@/lib/klaviyo";

export async function POST(req: NextRequest) {
  try {
    const { email, listId } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    await subscribeToList(email, listId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/klaviyo/subscribe error:", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
