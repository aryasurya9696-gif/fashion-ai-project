import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
      if (m) {
        const key = m[1];
        let val = m[2];
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\''))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

readEnv();

function getEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} not set`);
  return v;
}

function mimeFromExt(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

function fileToPart(filePath) {
  const data = fs.readFileSync(filePath);
  return {
    inlineData: {
      data: data.toString('base64'),
      mimeType: mimeFromExt(filePath),
    }
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { occasion: '', preferences: '', notes: '' };
  for (let i = 0; i < args.length; i++) {
    const k = args[i];
    const v = args[i + 1] || '';
    if (k === '--occasion') { out.occasion = v; i++; }
    if (k === '--preferences') { out.preferences = v; i++; }
    if (k === '--notes') { out.notes = v; i++; }
  }
  return out;
}

async function main() {
  const { occasion, preferences, notes } = parseArgs();

  const sampleDir = path.join(__dirname, 'sample');
  const person = ['person.jpg', 'person.jpeg', 'person.png', 'person.webp']
    .map(n => path.join(sampleDir, n))
    .find(p => fs.existsSync(p));
  if (!person) throw new Error('Place person.jpg/png/webp under test/stylist/sample');

  const dressFiles = [];
  for (let i = 1; i <= 10; i++) {
    const candidates = [`.jpg`, `.jpeg`, `.png`, `.webp`].map(ext => path.join(sampleDir, `dress-${i}${ext}`));
    const found = candidates.find(p => fs.existsSync(p));
    if (found) dressFiles.push(found);
  }
  if (dressFiles.length === 0) throw new Error('Add at least one dress image as dress-1.jpg (or .png/.webp)');

  const apiKey = getEnv('GEMINI_API_KEY');
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: modelName });

  const prompt = [
    'You are a professional AI personal stylist.',
    'You will be given one person photo and multiple dress images.',
    'Return strictly JSON with keys: bestDressIndex (number, 0-based), ranking (number[]), recommendation (string), reasoning (string), confidence (0..1).',
    '',
    occasion ? `Occasion: ${occasion}` : 'Occasion: (not provided)',
    preferences ? `Preferences: ${preferences}` : 'Preferences: (not provided)',
    notes ? `Notes: ${notes}` : 'Notes: (not provided)'
  ].join('\n');

  const parts = [
    { text: prompt },
    { text: '\nPerson Photo:' },
    fileToPart(person),
    { text: '\nDresses:' },
    ...dressFiles.flatMap((f, idx) => [{ text: `\nDress ${idx}:` }, fileToPart(f)])
  ];

  const response = await model.generateContent({
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature: Number(process.env.GEMINI_TEMPERATURE ?? '0.4'),
      responseMimeType: process.env.GEMINI_RESPONSE_MIME || 'application/json',
    }
  });

  const text = response.response.text();
  console.log(text);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


