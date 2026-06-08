// api/generate.js — Vercel Serverless Function
// À placer dans le dossier /api/ à la racine du projet

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt, context } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: `${prompt}\n\nContexte entreprise :\n${context}\n\nRéponds UNIQUEMENT avec le message final, sans introduction ni commentaire.` }],
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });
    const msg = data.content?.[0]?.text?.trim() || "";
    res.status(200).json({ msg });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
