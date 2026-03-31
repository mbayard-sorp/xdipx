import { NextRequest, NextResponse } from "next/server";
import { generateMoodImage } from "@/lib/imagen";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, category, mood = "warm", style = "lifestyle" } = body;

    if (!productName) {
      return NextResponse.json({ error: "productName is required" }, { status: 400 });
    }

    const imageDataUrl = await generateMoodImage({ productName, category, mood, style });

    if (!imageDataUrl) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, imageUrl: imageDataUrl });
  } catch (err) {
    console.error("/api/generate-image error:", err);
    return NextResponse.json(
      { error: "Image generation failed", details: String(err) },
      { status: 500 }
    );
  }
}
