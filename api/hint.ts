type HintRequestBody = {
  question: string;
  options: string[];
  correctIndex: number;
  mode: "hint" | "explain";
  selectedIndex?: number;
};

type HintResponseBody =
  | { available: true; text: string }
  | { available: false; reason: string };

type VercelRequest = {
  method?: string;
  body?: HintRequestBody | string;
};

type VercelResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => { json: (body: HintResponseBody | { error: string }) => void };
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-20b";
const MAX_OUTPUT_TOKENS = 120;

function parseBody(body: VercelRequest["body"]): HintRequestBody | null {
  if (!body) return null;
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as HintRequestBody;
    } catch {
      return null;
    }
  }
  return body;
}

function isValidPayload(p: HintRequestBody): boolean {
  if (typeof p.question !== "string" || p.question.length > 500) return false;
  if (!Array.isArray(p.options) || p.options.length < 2 || p.options.length > 6) return false;
  if (typeof p.correctIndex !== "number") return false;
  if (p.mode !== "hint" && p.mode !== "explain") return false;
  if (p.mode === "explain" && typeof p.selectedIndex !== "number") return false;
  return true;
}

const HINT_SYSTEM = `Du er en naturfaglærer på ungdomsskole/videregående i Norge.
Eleven spør om hjelp til et spørsmål de ikke har svart på ennå.
Gi et kort, nyttig hint som hjelper dem tenke selv — IKKE avslør svaret direkte.
Maks 40 ord. Ren tekst, ingen markdown. Norsk bokmål.`;

const EXPLAIN_SYSTEM = `Du er en naturfaglærer på ungdomsskole/videregående i Norge.
Eleven svarte feil. Forklar kort og tydelig hvorfor riktig svar er riktig, og hva eleven misforstod.
Maks 60 ord. Ren tekst, ingen markdown. Norsk bokmål.`;

function buildHintContent(p: HintRequestBody): string {
  const optLines = p.options.map((o, i) => `  ${i + 1}. ${o}`).join("\n");
  return `Spørsmål: ${p.question}\nAlternativer:\n${optLines}`;
}

function buildExplainContent(p: HintRequestBody): string {
  const correct = p.options[p.correctIndex] ?? "ukjent";
  const picked = p.selectedIndex !== undefined ? (p.options[p.selectedIndex] ?? "ukjent") : "ukjent";
  return `Spørsmål: ${p.question}\nRiktig svar: ${correct}\nElevens svar: ${picked}`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.status(405).json({ available: false, reason: "method_not_allowed" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(503).json({ available: false, reason: "missing_api_key" });
    return;
  }

  const payload = parseBody(req.body);
  if (!payload || !isValidPayload(payload)) {
    res.status(400).json({ available: false, reason: "invalid_payload" });
    return;
  }

  const systemPrompt = payload.mode === "hint" ? HINT_SYSTEM : EXPLAIN_SYSTEM;
  const userContent =
    payload.mode === "hint" ? buildHintContent(payload) : buildExplainContent(payload);

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.5,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!groqRes.ok) {
      console.error("Groq hint error", groqRes.status, await groqRes.text());
      res.status(502).json({ available: false, reason: "upstream_error" });
      return;
    }

    const data = (await groqRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      res.status(502).json({ available: false, reason: "empty_response" });
      return;
    }

    res.status(200).json({ available: true, text });
  } catch (err) {
    console.error("Hint handler error", err);
    res.status(500).json({ available: false, reason: "server_error" });
  }
}
