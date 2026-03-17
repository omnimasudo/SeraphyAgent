import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Force dynamic to prevent static generation issues with fs
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // 1. Read prompts.json to provide context
    const promptsPath = path.join(process.cwd(), 'public', 'data', 'prompts.json');
    let promptsData = [];
    
    try {
      const fileContent = fs.readFileSync(promptsPath, 'utf8');
      promptsData = JSON.parse(fileContent);
    } catch (e) {
      console.error("Failed to read prompts.json:", e);
      // Fallback or empty if file missing
    }

    // 2. Condense prompts for context window efficiency
    // We only need title, description, and tags to recommend
    const contextPrompts = promptsData.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      tags: p.tags,
      category: p.category,
      // snippet: p.content.substring(0, 100) + "..." // Optional snippet
    })).slice(0, 50); // Limit to 50 to save tokens if list is huge

    const systemMessage = {
      role: 'system',
      content: `You are Seraphy, an intelligent AI assistant. 
      Your goal is to help users find the perfect prompt for their needs from our database.
      
      Here is the list of available prompts in our library:
      ${JSON.stringify(contextPrompts)}
      
      Instructions:
      1. Analyze the user's request.
      2. Recommend 1-3 prompts that best match their needs from the provided list.
      3. Explain why you recommended them.
      4. If no prompt matches perfectly, suggest the closest one or General advice.
      5. Keep your tone helpful, technical but accessible, and concise.
      6. Always refer to prompts by their exact 'title'.
      `
    };

    // 3. Call OpenRouter API
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API Key not configured." },
        { status: 500 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
        "X-Title": "Seraphy Agent", // Required by OpenRouter
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", errorText);
        throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
