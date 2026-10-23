import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Add it to your environment (.env.local).`);
  }
  return value;
}

export function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = getRequiredEnv("GEMINI_API_KEY");
  return new GoogleGenerativeAI(apiKey);
}

export function getStylistModel(): GenerativeModel {
  const client = getGeminiClient();
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  return client.getGenerativeModel({ model: modelName });
}

export type ImagePart = { inlineData: { data: string; mimeType: string } };

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = Buffer.from(new Uint8Array(buffer));
  return bytes.toString("base64");
}

export function fileToImagePart(buffer: ArrayBuffer, mimeType: string): ImagePart {
  return {
    inlineData: {
      data: arrayBufferToBase64(buffer),
      mimeType,
    },
  };
}


