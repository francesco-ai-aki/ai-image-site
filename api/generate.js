export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024'
      })
    });

    const data = await response.json();

    if (data?.data?.[0]?.url) {
      res.status(200).json({ url: data.data[0].url });
    } else {
      res.status(500).json({ error: 'Image generation failed', details: data });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
