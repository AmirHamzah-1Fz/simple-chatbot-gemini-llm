import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response("Missing Gemini API key", { status: 500 });
    }
    const ai = new GoogleGenAI({ apiKey });
    // Merge of prompt history
    interface Message {
      role: "user" | "assistant";
      content: string;
    }

    const chatHistory: string = messages
      .map(
        (msg: Message): string =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");
    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: chatHistory,
    });

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Process the stream in background
    (async () => {
      try {
        const encoder = new TextEncoder();
        for await (const chunk of response) {
          await writer.write(encoder.encode(chunk.text));
        }
      } catch (e) {
        console.error("Stream error:", e);
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const error = err as Error;
    return new Response("Error: " + error.message, { status: 500 });
  }
}
