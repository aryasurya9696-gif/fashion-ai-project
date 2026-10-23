import { NextRequest } from "next/server";
import { getStylistModel, fileToImagePart } from "@/lib/gemini";
import { buildOutfitPrompt } from "@/lib/prompt-templates";

export const runtime = "nodejs";

type JsonResult = {
  bestDressIndex: number;
  ranking: number[];
  recommendation: string;
  reasoning: string;
  confidence: number; // 0..1
};

function sanitizeJsonLike(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
  }
  return t;
}

async function fileToPartFromFormFile(file: File) {
  const buf = await file.arrayBuffer();
  const mime = file.type || "application/octet-stream";
  return fileToImagePart(buf, mime);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const occasion = String(form.get("occasion") || "");
    const preferences = String(form.get("preferences") || "");
    const notes = String(form.get("notes") || "");

    // Person image optional. If not provided, we'll rank dresses overall.
    const person = form.get("person");

    // Collect dress images: keys starting with 'dress' or repeated 'dresses'
    const dressFiles: File[] = [];
    for (const [key, value] of form.entries()) {
      if (value instanceof File && (key === "dresses" || key.startsWith("dress"))) {
        dressFiles.push(value);
      }
    }
    if (dressFiles.length === 0) {
      return new Response(JSON.stringify({ error: "Provide at least one dress image as 'dress' or 'dresses'" }), { status: 400 });
    }

    const personPart = person instanceof File ? await fileToPartFromFormFile(person) : null;
    const dressParts = await Promise.all(dressFiles.map(fileToPartFromFormFile));

    const prompt = buildOutfitPrompt({ occasion, preferences, notes });
    const parts: any[] = [
      { text: prompt },
      ...(personPart ? ([{ text: "\nPerson Photo:" }, personPart] as any[]) : []),
      { text: "\nDresses:" },
      ...dressParts.flatMap((p, i) => [{ text: `\nDress ${i}:` }, p]),
    ];

    const model = getStylistModel();
    const resp = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: Number(process.env.GEMINI_TEMPERATURE ?? "0.4"),
        responseMimeType: process.env.GEMINI_RESPONSE_MIME || "application/json",
      },
    });

    const raw = resp.response.text();
    const cleaned = sanitizeJsonLike(raw);
    let json: JsonResult | null = null;
    try {
      json = JSON.parse(cleaned);
    } catch {
      // try to salvage common patterns: pick first {...}
      const m = cleaned.match(/\{[\s\S]*\}/);
      if (m) {
        json = JSON.parse(m[0]);
      }
    }

    if (!json) {
      return new Response(JSON.stringify({ error: "Model did not return valid JSON", raw }), { status: 502 });
    }

    return new Response(JSON.stringify({ ...json, raw }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), { status: 500 });
  }
}


