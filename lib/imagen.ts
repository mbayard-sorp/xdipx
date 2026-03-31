// Google Imagen via Vertex AI
// Docs: https://cloud.google.com/vertex-ai/generative-ai/docs/image/generate-images

const GCP_PROJECT = process.env.GOOGLE_CLOUD_PROJECT_ID!;
const GCP_LOCATION = "us-central1";
const MODEL = "imagegeneration@006";

const VERTEX_API = `https://${GCP_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT}/locations/${GCP_LOCATION}/publishers/google/models/${MODEL}:predict`;

type ImageMood = "warm" | "playful" | "romantic" | "bold";
type ImageStyle = "lifestyle" | "abstract" | "flat-lay";

interface ImagenRequest {
  productName: string;
  category: string;
  mood: ImageMood;
  style: ImageStyle;
}

// Build a tasteful, brand-aligned prompt
function buildPrompt(req: ImagenRequest): string {
  const moodDescriptions: Record<ImageMood, string> = {
    warm:     "warm golden hour lighting, soft shadows, cozy intimate atmosphere",
    playful:  "bright cheerful lighting, pastel tones, fun energetic mood",
    romantic: "soft candlelight, rose and purple tones, dreamy bokeh background",
    bold:     "high contrast dramatic lighting, coral and orange accents, editorial feel",
  };

  const styleDescriptions: Record<ImageStyle, string> = {
    lifestyle: "lifestyle product photography, styled vignette, home setting",
    abstract:  "abstract artistic composition, geometric shapes, brand color accents",
    "flat-lay": "top-down flat lay arrangement, clean minimal surface, product surrounded by complementary objects",
  };

  return [
    `${styleDescriptions[req.style]},`,
    `${moodDescriptions[req.mood]},`,
    `no people, no faces, no text, no explicit content,`,
    `sophisticated wellness brand aesthetic,`,
    `brand colors: coral red #F04E37 and warm orange #FF8C38 accents,`,
    `soft purple highlights, creamy off-white background,`,
    `professional product photography,`,
    `tasteful and elegant,`,
    `8k quality, photorealistic`,
  ].join(" ");
}

async function getAccessToken(): Promise<string> {
  // In production, use google-auth-library or Application Default Credentials
  // For Vercel, use a service account JSON stored as an env var
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credentialsJson) {
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS_JSON env var not set");
  }

  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth({
    credentials: JSON.parse(credentialsJson),
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token ?? "";
}

export async function generateMoodImage(req: ImagenRequest): Promise<string | null> {
  try {
    const accessToken = await getAccessToken();
    const prompt = buildPrompt(req);

    const response = await fetch(VERTEX_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          safetyFilterLevel: "block_some",
          personGeneration: "dont_allow",
        },
      }),
    });

    if (!response.ok) {
      console.error("Imagen API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const base64Image = data.predictions?.[0]?.bytesBase64Encoded;
    if (!base64Image) return null;

    // In production: upload to Shopify CDN or Cloudflare R2
    // Return as data URL for now (replace with upload logic pre-launch)
    return `data:image/png;base64,${base64Image}`;
  } catch (err) {
    console.error("generateMoodImage failed:", err);
    return null;
  }
}

// ─── Upload helper (stub — replace with actual CDN upload) ────────────────────

export async function uploadImageToShopify(
  base64Data: string,
  filename: string,
  productId: string
): Promise<string | null> {
  // TODO: implement Shopify Files API upload
  // POST /admin/api/2024-01/graphql.json
  // mutation stagedUploadsCreate + fileCreate
  console.log(`TODO: upload ${filename} to Shopify for product ${productId}`);
  return null;
}
