// scripts/test-llm.mjs
// Test LLM API end-to-end: generate JSON scene untuk B-roll Remotion.
// Usage: JB_KEY=sk-jb-... node scripts/test-llm.mjs

const API_BASE = "https://joinbareng.com/api/ai-proxy-v2/v1";
const MODEL = "gpt-5.5";

const SYSTEM_PROMPT = `Kamu adalah motion designer ahli untuk video B-roll pendek konten YouTube (max 8 detik) bergaya Iman Gadzhi / Alex Hormozi — kinetic typography, punchy, modern.

TUGAS:
Diberikan sebuah topik, generate JSON untuk 1 video B-roll pendek. Output HARUS JSON valid, tanpa markdown, tanpa backtick, tanpa penjelasan.

SCHEMA:
{
  "title": "judul pendek max 5 kata",
  "duration": 8,
  "color_theme": "lime",
  "scenes": [
    // 2-4 scenes, total durasi scene = 8.0 detik
    // TYPES:
    //   {"type": "kinetic", "text": "KATA KATA", "highlight": "kata_di_bold", "duration": 2.5}
    //   {"type": "counter", "from": 0, "to": 1000000, "prefix": "Rp", "suffix": "JUTA", "duration": 3.0}
    //   {"type": "quote", "text": "KATA KATA", "style": "shake|pop|glitch", "duration": 2.5}
  ]
}

PALET WARNA (referensi, jangan di-output):
- Primary: #A3E635 (lime)
- Background: #0A0A0A (hitam)
- Text: #FFFFFF (putih)
- Accent opsional: #FFD600 (kuning), #3B82F6 (biru), #F97316 (oranye)

ATURAN KONTEN:
- Bahasa Indonesia, gaya punchy, marketing/edu-tech
- Maksimal 8 detik total
- WAJIB mix 3 types (kinetic + counter + quote) kalau cukup ruang
- kinetic "text": 1-4 kata kapital, "highlight": 1-2 kata paling impact
- counter: angka dramatis (0→1000000, 1→1000, 24→7 JAM, dst). Boleh ada prefix/suffix.
- quote: max 4 kata, impactful. Pilih style: shake (untuk warning), pop (untuk euforia), glitch (untuk tech).

OUTPUT: HANYA JSON valid satu objek. Tidak ada teks lain.`;

const TOPICS = [
  "trik AI buat content creator",
  "dropshipping modal 0 rupiah",
  "website jadi uang otomatis",
];

async function callLLM(topic) {
  const apiKey = process.env.JB_KEY;
  if (!apiKey) {
    throw new Error("JB_KEY env var not set");
  }

  const t0 = Date.now();
  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Topik: ${topic}` },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    }),
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  const data = await res.json();
  if (!res.ok) {
    return { topic, elapsed: `${elapsed}s`, error: data };
  }

  const msg = data.choices?.[0]?.message ?? {};
  const rawContent = msg.content ?? "";
  const reasoning = msg.reasoning_content ?? "";
  const usage = data.usage ?? {};

  // Try to parse JSON
  let parsed = null;
  let parseError = null;
  try {
    // Strip possible markdown fences
    const cleaned = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    parseError = String(e.message);
  }

  return {
    topic,
    elapsed: `${elapsed}s`,
    tokens: {
      total: usage.total_tokens,
      reasoning: usage.completion_tokens_details?.reasoning_tokens,
      completion: usage.completion_tokens,
    },
    parsed_ok: parsed !== null,
    parse_error: parseError,
    raw_content: rawContent,
    parsed,
    reasoning_preview: reasoning.slice(0, 300),
  };
}

const results = [];
for (const topic of TOPICS) {
  console.log(`\n→ Generating: "${topic}"`);
  try {
    const r = await callLLM(topic);
    results.push(r);
    console.log(`  ✓ ${r.elapsed} | parsed: ${r.parsed_ok} | tokens: ${r.tokens.total}`);
  } catch (e) {
    console.log(`  ✗ ${e.message}`);
    results.push({ topic, error: e.message });
  }
}

console.log("\n" + "=".repeat(60));
console.log("FULL RESULTS:");
console.log("=".repeat(60));
console.log(JSON.stringify(results, null, 2));
