// api/generate.js
module.exports = async function handler(req, res) {
  // CORS (opsiyonel ama güvenli)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Sunucu yapılandırma hatası: OPENAI_API_KEY yok." });
    }

    const { tema } = req.body || {};
    if (!tema || typeof tema !== "string") {
      return res.status(400).json({ error: "Tema eksik veya hatalı." });
    }

    const words = 800;

    const prompt = `
Türk edebiyatı atmosferinde, tamamen ÖZGÜN bir diyalog yaz.

KURALLAR:
- Kitaplardan/şiirlerden/yazarlardan DOĞRUDAN ALINTI YAPMA.
- İki karakter konuşsun: (1) duygusal ve idealist bir yazar, (2) realist ve sorgulayıcı bir düşünür.
- Tema: "${tema}"
- Diyalog akıcı, doğal, edebî ama anlaşılır Türkçe ile yazılsın.
- Konuşmalar satır satır ilerlesin ve her satır "Karakter Adı: ..." formatında olsun.
- Yaklaşık ${words} kelime civarında olsun (çok kısa kalmasın).
- En sonda 2-3 maddelik "Temadaki etik değerler" mini özeti ekle.
`.trim();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Sen edebiyat alanında uzman bir yazar ve editörsün." },
          { role: "user", content: prompt }
        ],
        temperature: 0.85,
        max_tokens: 1800
      }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      return res.status(r.status).json({
        error: "OpenAI isteği başarısız.",
        details: data?.error?.message || JSON.stringify(data).slice(0, 1000)
      });
    }

    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return res.status(500).json({ error: "Modelden metin alınamadı." });
    }

    return res.status(200).json({ text });

  } catch (err) {
    console.error("🔴 Function crashed:", err);
    return res.status(500).json({
      error: "Sunucu hatası, metin oluşturulamadı.",
      details: err?.message || String(err)
    });
  }
};
