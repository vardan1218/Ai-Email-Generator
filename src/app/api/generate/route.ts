import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
    const { prompt, subject } = await req.json();
    const completion = await groq.chat.completions.create({
        messages: [
            {
              role: "system",
              content: "You are a professional email writer. Write emails that are concise, effective, and professional.",
            },
            {
              role: "user",
              content: `Write a professional email with the subject "${subject}". Context: ${prompt}`,
            },
          ],
          model: "mixtral-8x7b-32768",
          temperature: 0.7,
          max_tokens: 1024,
        });
    
        return NextResponse.json({ email: completion.choices[0]?.message?.content || "" });
      } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Failed to generate email" }, { status: 500 });
      }
    }