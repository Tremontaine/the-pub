export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, entry, type, systemPrompt } = req.body;

  if (!query || !entry || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Mistral API key not configured',
        details: 'Please add your MISTRAL_API_KEY to the .env.local file'
      });
    }

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