import { NextRequest, NextResponse } from "next/server";
import { generateAllContent } from "@/lib/claude";
import { GenerateCopyRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateCopyRequest;

    const { productName, rawDescription, category, price, originalPrice, type } = body;

    if (!productName || !type) {
      return NextResponse.json({ error: "productName and type are required" }, { status: 400 });
    }

    const result = await generateAllContent({
      productName,
      rawDescription: rawDescription ?? "",
      category: category ?? "both",
      price: price ?? 0,
      originalPrice: originalPrice ?? 0,
      type,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("/api/generate-copy error:", err);
    return NextResponse.json(
      { error: "Content generation failed", details: String(err) },
      { status: 500 }
    );
  }
}
