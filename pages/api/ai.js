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
