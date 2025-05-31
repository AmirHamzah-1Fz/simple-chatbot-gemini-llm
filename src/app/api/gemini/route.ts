// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response("Missing Gemini API key", { status: 500 });
    }
    const ai = new GoogleGenAI({ apiKey });
    // Merge of prompt history
    const chatHistory = messages
      .map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (msg: any) =>
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
  } catch (err: any) {
    return new Response("Error: " + err.message, { status: 500 });
  }
}
