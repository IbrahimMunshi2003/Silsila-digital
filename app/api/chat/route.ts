import OpenAI from "openai";
import { NextResponse } from "next/server";
import { SYSTEM_KNOWLEDGE_BASE } from "@/src/lib/knowledgeBase";

export const runtime = "nodejs";

type RequestMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "Silsila Digital AI is not configured yet. Add GROQ_API_KEY to enable it." }, { status: 503 });
  }

  try {
    const { messages } = (await request.json()) as { messages?: RequestMessage[] };
    if (!Array.isArray(messages) || !messages.length) {
      return NextResponse.json({ error: "A message is required." }, { status: 400 });
    }

    const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
      temperature: 0.45,
      max_tokens: 400,
      messages: [{ role: "system", content: SYSTEM_KNOWLEDGE_BASE }, ...messages.slice(-10)],
    });

    return NextResponse.json({ message: completion.choices[0]?.message.content ?? "I couldn't generate a reply just now." });
  } catch (error) {
    console.error("Portfolio chat error:", error);
    return NextResponse.json({ error: "Something went wrong while reaching the assistant." }, { status: 500 });
  }
}
