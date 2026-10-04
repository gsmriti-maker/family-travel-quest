import type { Verdict } from "@/lib/types";

const FALLBACK = {
  verdict: "not-sure" as const,
  sentence: "No photo checker is connected, so this one is your call.",
};

export async function POST(req: Request) {
  let image = "";
  let task = "";
  try {
    const body = (await req.json()) as { image?: string; task?: string };
    image = body.image ?? "";
    task = (body.task ?? "").slice(0, 400);
  } catch {
    return Response.json(FALLBACK);
  }
  if (!image.startsWith("data:image/")) return Response.json(FALLBACK);

  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json(FALLBACK);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 80,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are checking a family scavenger-hunt photo. The task was: ${task}. Reply with JSON only: {"verdict":"looks-right"|"not-sure"|"doesnt-match","sentence":"one sentence"}. Use looks-right if the photo clearly shows the subject. Use doesnt-match if it clearly shows something else. Use not-sure if the photo is blurry, dark, or ambiguous. One sentence only. Do not quote books or add dates.`,
              },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
      }),
    });
    if (!res.ok) return Response.json({ ...FALLBACK, sentence: "The checker didn't answer, so this one is your call." });
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content.slice(content.indexOf("{"), content.lastIndexOf("}") + 1)) as {
      verdict?: string;
      sentence?: string;
    };
    return Response.json({
      verdict: normalize(parsed.verdict),
      sentence: oneSentence(parsed.sentence || "The checker didn't explain, so this one is your call."),
    });
  } catch {
    return Response.json({ ...FALLBACK, sentence: "The checker didn't answer, so this one is your call." });
  }
}

function normalize(value: string | undefined): Verdict {
  const text = (value ?? "").toLowerCase();
  if (text.includes("not") && text.includes("sure")) return "not-sure";
  if (text.includes("doesn") || text.includes("does not") || text.includes("mismatch")) return "doesnt-match";
  if (text.includes("looks") || text.includes("right")) return "looks-right";
  return "not-sure";
}

function oneSentence(value: string): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : cleaned).slice(0, 220);
}
