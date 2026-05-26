type SummaryWrongAnswer = {
  question: string;
  picked: string;
  correct: string;
};

type SummarySection = {
  title: string;
  correct: number;
  incorrect: number;
  wrongAnswers: SummaryWrongAnswer[];
};

type SummaryRequestBody = {
  score: { correct: number; incorrect: number; total: number };
  sections: SummarySection[];
};

type SummaryResponseBody =
  | { available: true; summary: string }
  | { available: false; reason: string };

type VercelRequest = {
  method?: string;
  body?: SummaryRequestBody | string;
};

type VercelResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => { json: (body: SummaryResponseBody | { error: string }) => void };
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";
const MAX_OUTPUT_TOKENS = 320;

function parseBody(body: VercelRequest["body"]): SummaryRequestBody | null {
  if (!body) return null;
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as SummaryRequestBody;
    } catch {
      return null;
    }
  }
  return body;
}

function isValidPayload(payload: SummaryRequestBody): boolean {
  if (!payload?.score || !Array.isArray(payload.sections)) return false;
  const { correct, incorrect, total } = payload.score;
  if (
    typeof correct !== "number" ||
    typeof incorrect !== "number" ||
    typeof total !== "number" ||
    total < 0 ||
    correct < 0 ||
    incorrect < 0
  ) {
    return false;
  }
  if (correct + incorrect > total + 1) return false;
  if (payload.sections.length > 20) return false;
  return true;
}

function buildPrompt(payload: SummaryRequestBody): string {
  const { score, sections } = payload;
  const lines = [
    `Resultat: ${score.correct} riktige, ${score.incorrect} feil, ${score.total} totalt.`,
    "",
    "Seksjoner:",
    ...sections.map((s) => {
      const wrong =
        s.wrongAnswers.length > 0
          ? s.wrongAnswers
              .map(
                (w) =>
                  `  - Spørsmål: ${w.question}\n    Valgt: ${w.picked}\n    Riktig: ${w.correct}`,
              )
              .join("\n")
          : "  (ingen feil)";
      return `- ${s.title}: ${s.correct} riktig, ${s.incorrect} feil\n${wrong}`;
    }),
  ];
  return lines.join("\n");
}

const SYSTEM_PROMPT = `Du er en vennlig naturfag-lærer for ungdomsskole/videregående i Norge.
Skriv en kort oppsummering (maks 120 ord) på norsk bokmål etter en quiz.
Ros det som gikk bra. Nevn 1–2 tema de bør repetere hvis de hadde feil — uten å være nedlatende.
Ikke list alle spørsmål. Ingen markdown, bare ren tekst.`;

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

  const userContent = buildPrompt(payload);

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!groqRes.ok) {
      console.error("Groq error", groqRes.status, await groqRes.text());
      res.status(502).json({ available: false, reason: "upstream_error" });
      return;
    }

    const data = (await groqRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const summary = data.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      res.status(502).json({ available: false, reason: "empty_response" });
      return;
    }

    res.status(200).json({ available: true, summary });
  } catch (err) {
    console.error("Summary handler error", err);
    res.status(500).json({ available: false, reason: "server_error" });
  }
}
