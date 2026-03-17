const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export interface SearchResult {
  prompt_ids: number[];
  explanation: string;
}

export async function searchPromptsWithAI(
  query: string,
  promptSummaries: { id: number; title: string; category: string; tags: string[] }[]
): Promise<SearchResult> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const promptList = promptSummaries
    .slice(0, 200) // Limit for context
    .map(p => `[${p.id}] ${p.title} (${p.category}) - Tags: ${p.tags.join(', ')}`)
    .join('\n');

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'SeraphyAgent',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: `You are a prompt recommendation assistant. Given a user query and a list of available prompts, return the most relevant prompt IDs that match the user's needs.

Return your response in this exact JSON format:
{
  "prompt_ids": [1, 2, 3],
  "explanation": "Brief explanation of why these prompts are relevant"
}

Only include prompt IDs that are actually in the provided list. Return at most 10 relevant prompts.`
        },
        {
          role: 'user',
          content: `User is looking for: "${query}"

Available prompts:
${promptList}

Return the most relevant prompt IDs in JSON format.`
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '{}';

  try {
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    console.error('Failed to parse AI response:', content);
  }

  return { prompt_ids: [], explanation: 'Could not parse AI response' };
}
