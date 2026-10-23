import { NextRequest } from "next/server";
import { buildOutfitPrompt } from "@/lib/prompt-templates";

export const runtime = "nodejs";

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function sanitize(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) t = t.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
  return t;
}

async function fileToDataUrl(file: File): Promise<{ type: string; dataUrl: string }> {
  const buf = await file.arrayBuffer();
  const b64 = Buffer.from(buf).toString("base64");
  const type = file.type || "image/jpeg";
  return { type, dataUrl: `data:${type};base64,${b64}` };
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const occasion = String(form.get("occasion") || "");
    const preferences = String(form.get("preferences") || "");
    const notes = String(form.get("notes") || "");

    const person = form.get("person");
    if (!(person instanceof File)) {
      return new Response(JSON.stringify({ error: "Missing 'person' image" }), { status: 400 });
    }

    const dresses: File[] = [];
    for (const [key, value] of form.entries()) {
      if (value instanceof File && (key === "dresses" || key.startsWith("dress"))) {
        dresses.push(value);
      }
    }
    if (dresses.length === 0) {
      return new Response(JSON.stringify({ error: "Provide at least one dress image" }), { status: 400 });
    }

    const personData = await fileToDataUrl(person);
    const dressDataList = await Promise.all(dresses.map(fileToDataUrl));

    const prompt = buildOutfitPrompt({ occasion, preferences, notes });

    const messages: any[] = [
      {
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          { type: "input_text", text: "\nPerson Photo:" },
          { type: "input_image", image_url: personData.dataUrl },
          { type: "input_text", text: "\nDresses:" },
          ...dressDataList.flatMap((d, i) => [
            { type: "input_text", text: `\nDress ${i}:` },
            { type: "input_image", image_url: d.dataUrl },
          ]),
        ],
      },
    ];

    const apiKey = getEnv("OPENROUTER_API_KEY");
    const model = process.env.OPENROUTER_MODEL || "microsoft/phi-3-vision-128k-instruct:free";

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "https://localhost",
        "X-Title": process.env.OPENROUTER_APP_NAME || "FashionAI",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: Number(process.env.OPENROUTER_TEMPERATURE ?? "0.4"),
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return new Response(JSON.stringify({ error: `OpenRouter error ${resp.status}`, details: txt }), { status: 502 });
    }

    const json = await resp.json();
    let content: any = json?.choices?.[0]?.message?.content ?? "";
    let contentText = "";
    if (typeof content === "string") {
      contentText = content;
    } else if (Array.isArray(content)) {
      // Join known text parts
      contentText = content
        .map((p: any) => p?.text || p?.content || p?.data || "")
        .join("\n")
        .trim();
    }

    const cleaned = sanitize(contentText);
    let result: any;
    try {
      result = JSON.parse(cleaned);
    } catch {
      const m = cleaned.match(/\{[\s\S]*\}/);
      if (m) {
        try { result = JSON.parse(m[0]); } catch {}
      }
    }

    if (!result) {
      // Synthesize a safe fallback JSON so UI can proceed
      const dressesCount = dressDataList.length;
      const ranking = Array.from({ length: dressesCount }, (_, i) => i);
      result = {
        bestDressIndex: 0,
        ranking,
        recommendation: contentText || 'Based on the photos, Dress #1 looks like a solid choice.',
        reasoning: (contentText ? `${contentText}\n\nClarify: Share occasion/preferences for a more precise pick.` : 'Selected Dress #1 as a baseline. Clarify occasion/preferences for refinement.'),
        confidence: 0.5,
      };
    }

    return new Response(JSON.stringify(result), { headers: { "content-type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), { status: 500 });
  }
}
