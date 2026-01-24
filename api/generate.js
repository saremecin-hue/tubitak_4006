import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Sunucu yapılandırma hatası: OPENAI_API_KEY yok."
      });
    }

    const client = new OpenAI({ apiKey });

    const { tema, targetWords } = req.body || {};
    const words = Math.max(500, Math.min(Number(targetWords || 900), 1400)); // güvenli aralık

    const prompt = `
Türk edebiyatı atmosferinde, tamamen ÖZGÜN bir diyalog yaz.

KURALLAR:
- Kitaplardan, şiirlerden veya yazarlardan DOĞRUDAN ALINTI YAPMA.
- İki karakter konuşsun: (1) duygusal ve idealist bir yazar, (2) realist ve sorgulayıcı bir düşünür.
- Tema: "${tema}"
- Diyalog akıcı, doğal, edebî ama anlaşılır Türkçe ile yazılsın.
- Konuşmalar satır satır ilerlesin ve her satır "Karakter Adı: ..." formatında olsun.
- Yaklaşık ${words} kelime civarında olsun (çok kısa kalmasın).
- En sonda 2-3 maddelik "Temadaki etik değerler" mini özeti ekle.

Şimdi diyalogu yaz.
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sen edebiyat alanında uzman bir yazar ve editörsün." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85,
      max_tokens: 1800
    });

    const text = completion?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return res.status(500).json({ error: "Modelden metin alınamadı." });
    }

    return res.status(200).json({ text });

  } catch (error) {
    console.error("🔴 OpenAI API Hatası:", error);
    return res.status(500).json({
      error: "Sunucu hatası, metin oluşturulamadı.",
      details: error?.message || String(error)
    });
  }
}
