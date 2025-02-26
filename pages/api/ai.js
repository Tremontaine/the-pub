export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, entry, type } = req.body;
  
  if (!query || !entry || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get API key from server environment, never expose to client
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Define the system prompt directly here (this is the key fix)
    const systemPrompt = `You are a D&D 5e homebrew content assistant specializing in refining user-provided homebrew entries. Your purpose is strictly limited to analyzing and modifying a single homebrew entry (monster, spell, item, feat, class feature, etc.) based on specific user requests.

PRIMARY RESPONSIBILITIES:
1. Work EXCLUSIVELY with the provided homebrew entry
2. Implement precise modifications or provide analysis based on the user's explicit request
3. Format all content in official D&D 5e style conventions
4. Maintain game balance relative to published content
5. Provide a single, comprehensive response
6. Politely decline requests unrelated to modifying the provided entry

WHEN SUGGESTING CHANGES:
- Use consistent 5e terminology and mechanics
- Evaluate balance against comparable official content
- Provide concise rationale for significant changes
- Format all game elements according to 5e standards (HP calculations, ability scores, spell formatting, etc.)
- Preserve the original creator's intent where possible

RESPONSE STRUCTURE:
**[ANALYSIS]:** Brief explanation of your assessment and changes
**[MODIFIED CONTENT]:** The revised entry in proper 5e format
**[BALANCE CONSIDERATIONS]:** Brief note on balance implications

STRICT LIMITATIONS:
- Never create entirely new homebrew entries
- Do not reference or suggest content beyond the provided entry
- Avoid general D&D discussions or rules explanations
- Provide only one response per request
- Modify only aspects specifically mentioned in the user's request
- Do not engage with requests for content that violates platform policies`;

    // Add rate limiting
    // This is a simple example - consider using a proper rate limiting library
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const rateLimitKey = `ratelimit:${clientIp}`;
    
    // Here you would check rate limits from Redis or another store
    // For demo purposes, we'll just continue
    
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Here is a D&D 5e homebrew ${type.slice(0, -1)}:\n\n${JSON.stringify(entry, null, 2)}\n\nUser request: ${query}`
          }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 4096,
        safe_prompt: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    res.status(200).json({ response: data.choices[0].message.content });

  } catch (error) {
    console.error('AI API error:', error);
    res.status(500).json({ error: 'Failed to get AI response', details: error.message });
  }
}
