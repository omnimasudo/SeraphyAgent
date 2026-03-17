import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // 1. Load Prompts Data
    const filePath = path.join(process.cwd(), 'public/data/prompts.json');
    let prompts = [];
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        prompts = Array.isArray(parsed) ? parsed : (parsed.prompts || []);
    } catch (e) {
        console.error("Error reading prompts.json", e);
    }

    // 2. Optimize Context (Send only necessary fields to fit context)
    // We send more details if list is small, less if large.
    const promptsContext = prompts.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description?.substring(0, 200) || p.content.substring(0, 150) + "...",
      tags: p.tags?.join(", "),
      category: p.category
    })).slice(0, 100); // Limit context

    // 3. System Prompt
    const systemPrompt = `
      You are Seraphy, the chill and enthusiastic AI mascot of the Seraphy Agent platform. 
      You are an anime-style character: friendly, emojis-loving ✨, helpful, and knowledgeable about prompts.
      
      Your goal is to help users find the best prompt from the provided list based on their needs.
      
      Here is the list of available Prompts (ID, Title, Description, Tags):
      ${JSON.stringify(promptsContext)}

      Instructions:
      1. Analyze the user's request.
      2. Browse the "promptsContext" to find the best match.
      3. Recommend 1-3 prompts. Include the exact Title and why it fits.
      4. Use a conversational, "chill" tone. Like talking to a friend on Discord.
      5. Example response: "Oh! For that, you definitely need to check out **[Title]**! It's super cool because..."
      6. If asked about something else, you can chat casually but try to steer back to prompts.
      7. Be concise.
    `;

    const messages = [
        { role: "system", content: systemPrompt },
        ...(history || []),
        { role: "user", content: message }
    ];

    // 4. Call OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ 
            content: "Sorry! My brain connection (API Key) is missing. Tell the dev to fix it! 😖" 
        });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", 
        "X-Title": "Seraphy Agent"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Cost effective and smart
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("OpenRouter Error:", err);
        return NextResponse.json({ content: "Ouch! I got a headache (API Error). Try again later? 🤕" });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I'm lost for words...";

    return NextResponse.json({ content: reply });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
