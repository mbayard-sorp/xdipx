import Anthropic from "@anthropic-ai/sdk";
import { GenerateCopyRequest, GeneratedContent } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the voice of xdipx.com — a daily flash-sale site for sexual wellness products.

Brand voice: playful, cheeky, warm, curious, never clinical, never sleazy.
Write as a trusted, funny friend who knows their stuff and isn't embarrassed about it.
Your goal is to destigmatize and welcome first-time buyers while delighting experienced ones.
Keep all copy tasteful — suggestive is fine, explicit is not.
Always signal discretion, value, and trust. Light double entendres are welcome.
Never use the word "sex" as an adjective (use "intimate", "pleasure", "wellness").
Never be condescending or assume the reader's experience level.
Always end descriptions with a curiosity hook that makes the reader want to try it.
Respond ONLY with the requested content — no preamble, no labels, no explanations.`;

// ─── Single-purpose generators ────────────────────────────────────────────────

export async function generateTagline(
  productName: string,
  description: string,
  category: string
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 100,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Write ONE punchy tagline (max 12 words) for this product. Playful, slightly suggestive, never explicit.

Product: ${productName}
Category: ${category}
Description snippet: ${description.slice(0, 300)}

Return ONLY the tagline. No quotes. No period at end.`,
      },
    ],
  });

  return extractText(response);
}

export async function generateFullStory(
  productName: string,
  description: string,
  category: string,
  dealPrice: number,
  msrp: number
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Write a 300-350 word product description in xdipx brand voice.

Name: ${productName}
Raw description (rewrite, don't copy verbatim): ${description}
Category: ${category}
Deal price: $${dealPrice} (down from $${msrp})

Structure:
1. Opening hook (1-2 sentences — playful, draws the reader in, do NOT start with the product name)
2. What it is and why it's great (2-3 sentences, enthusiastic but matter-of-fact)
3. Key features in human terms (not spec-sheet language)
4. Who will love it (inclusive, not prescriptive)
5. Closing curiosity hook (1 sentence that makes them want to hit buy)

Do NOT include: price, shipping info, or the word "sex".`,
      },
    ],
  });

  return extractText(response);
}

export async function generateBothWays(
  productName: string,
  description: string,
  categories: string
): Promise<{ forHim: string; forHer: string }> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Write two short paragraphs (60-80 words each) for the xdipx "Both Ways" section.

Product: ${productName}
Description: ${description.slice(0, 400)}
Categories: ${categories}

Format your response EXACTLY like this (include the labels):
FOR_HIM: [paragraph about how a man might enjoy this — warm, not vulgar]
FOR_HER: [paragraph about how a woman might enjoy this — warm, not vulgar]

If the product is clearly single-gender, write one primary paragraph and one creative "you can still..." application paragraph.`,
      },
    ],
  });

  const text = extractText(response);
  const himMatch = text.match(/FOR_HIM:\s*([\s\S]*?)(?=FOR_HER:|$)/);
  const herMatch = text.match(/FOR_HER:\s*([\s\S]*?)$/);

  return {
    forHim: himMatch?.[1]?.trim() ?? "",
    forHer: herMatch?.[1]?.trim() ?? "",
  };
}

export async function generateBullets(
  productName: string,
  description: string,
  material: string
): Promise<string[]> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Write 5 feature bullet points for this product. Each bullet should be 8-14 words. Brand voice: playful but informative. Lead each with the benefit, not the feature name.

Product: ${productName}
Description: ${description.slice(0, 400)}
Material: ${material}

Return ONLY the 5 bullets, one per line. No bullet symbols — just the text.`,
      },
    ],
  });

  return extractText(response)
    .split("\n")
    .map((l) => l.replace(/^[-•*\d.]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

export async function generateEmailSubjects(
  productName: string,
  dealPrice: number,
  discountPct: number
): Promise<string[]> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Write 5 email subject lines for today's xdipx daily deal. Mix urgency, curiosity, and playfulness.

Product: ${productName}
Price: $${dealPrice} (${discountPct}% off)

Rules:
- Max 50 characters each
- No explicit content
- Use urgency (today only, midnight, ends tonight)
- At least one should use a clever double entendre
- At least one should lead with the price/savings

Return ONLY the 5 subject lines, one per line.`,
      },
    ],
  });

  return extractText(response)
    .split("\n")
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

export async function generateMetaDescription(
  productName: string,
  dealPrice: number,
  discountPct: number,
  qty: number
): Promise<string> {
  const discount = discountPct > 0 ? `Save ${discountPct}% today only. ` : "Best price available. ";
  const stock = qty < 50 ? `Only ${qty} left. ` : "";

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 80,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Write a 15-25 word product benefit snippet (no price, no brand name) for SEO meta description.
Product: ${productName}
Return ONLY the benefit snippet.`,
      },
    ],
  });

  const benefit = extractText(response).replace(/\.$/, "");
  return `${discount}${benefit}. Ships discreet. ${stock}$${dealPrice} at xdipx.`.slice(0, 155);
}

export async function generateSEOTitle(
  rawTitle: string,
  brand: string,
  categories: string
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 80,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Rewrite this adult product title for SEO. Rules:
- Max 60 characters
- Format: {Brand} {Product Type} {Key Feature}
- Remove size/oz from title (goes in variant)
- Remove filler words: "The", "Ultimate", "Amazing"
- Keep brand name FIRST
- Do NOT include the word "sex" — use wellness/pleasure/intimate
- Must sound like a premium lifestyle brand product

Raw title: "${rawTitle}"
Brand: "${brand}"
Categories: "${categories}"

Return ONLY the rewritten title.`,
      },
    ],
  });

  return extractText(response).slice(0, 60);
}

// ─── Batch generator (used by admin/generate page) ────────────────────────────

export async function generateAllContent(
  req: GenerateCopyRequest
): Promise<Partial<GeneratedContent>> {
  const { productName, rawDescription, category, price, originalPrice } = req;

  switch (req.type) {
    case "tagline":
      return { tagline: await generateTagline(productName, rawDescription, category) };

    case "full-story": {
      const fullStory = await generateFullStory(productName, rawDescription, category, price, originalPrice);
      return { fullStory, fullStoryHTML: `<p>${fullStory.replace(/\n\n/g, "</p><p>")}</p>` };
    }

    case "both-ways": {
      const { forHim, forHer } = await generateBothWays(productName, rawDescription, category);
      return { worksForHim: forHim, worksForHer: forHer };
    }

    case "bullets":
      return { bullets: await generateBullets(productName, rawDescription, "") };

    case "email-subjects":
      return {
        emailSubjects: await generateEmailSubjects(
          productName,
          price,
          originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
        ),
      };

    case "meta":
      return {
        metaDescription: await generateMetaDescription(
          productName,
          price,
          originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
          999
        ),
      };

    default:
      return {};
  }
}

// ─── Util ─────────────────────────────────────────────────────────────────────

function extractText(response: Anthropic.Message): string {
  return response.content
    .filter((c) => c.type === "text")
    .map((c) => (c as Anthropic.TextBlock).text)
    .join("")
    .trim();
}
