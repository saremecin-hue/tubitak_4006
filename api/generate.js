// api/generate.js

const authors = require("../data/authors");

function calculateStyleDistance(authorName1, authorName2) {
  const a1 = authors[authorName1];
  const a2 = authors[authorName2];

  if (!a1 || !a2) return null;

  const keys = ["dilSeviyesi", "cumleUzunluk", "duyguYogunluk", "toplumsallik", "soyutluk"];

  let sum = 0;

  keys.forEach(key => {
    const diff = a1[key] - a2[key];
    sum += diff * diff;
  });

  return Math.sqrt(sum);
}

function generateStyleComparison(authorName1, authorName2) {
  const a1 = authors[authorName1];
  const a2 = authors[authorName2];

  const differences = [];

  if (Math.abs(a1.dilSeviyesi - a2.dilSeviyesi) >= 2) {
    differences.push("Dil seviyesi belirgin biçimde farklıdır.");
  }

  if (Math.abs(a1.cumleUzunluk - a2.cumleUzunluk) >= 2) {
    differences.push("Cümle yapısı ve uzunluğu açısından ayrışmaktadırlar.");
  }

  if (Math.abs(a1.duyguYogunluk - a2.duyguYogunluk) >= 2) {
    differences.push("Duygusal yoğunluk düzeyleri farklıdır.");
  }

  if (Math.abs(a1.toplumsallik - a2.toplumsallik) >= 2) {
    differences.push("Toplumsal temaya yaklaşım biçimleri ayrıdır.");
  }

  if (Math.abs(a1.soyutluk - a2.soyutluk) >= 2) {
    differences.push("Soyutlama ve felsefi derinlik düzeyleri farklıdır.");
  }

  return differences;
}

module.exports = async function handler(req, res) {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY tanımlı değil." });
    }

    const { mode, author1, author2, tema } = req.body || {};
    const words = 800;

    let prompt = "";

    // =========================
    // AUTHOR MODE
    // =========================
    if (mode === "author") {

      if (!author1 || !author2) {
        return res.status(400).json({ error: "Yazar bilgisi eksik." });
      }

      if (!authors[author1] || !authors[author2]) {
        return res.status(400).json({ error: "Seçilen yazarlardan biri veri setinde yok." });
      }

      const distance = calculateStyleDistance(author1, author2);
      const styleDiff = generateStyleComparison(author1, author2);

      prompt = `
Türk edebiyatı atmosferinde tamamen ÖZGÜN bir diyalog yaz.

KURALLAR:
- Doğrudan alıntı yapma.
- 1. karakter: ${author1} üslubuna yakın yaz.
- 2. karakter: ${author2} üslubuna yakın yaz.
- Diyalog akıcı ve edebi olsun.
- Yaklaşık ${words} kelime civarında olsun.
- Her satır "Karakter: ..." formatında olsun.

En sonda şu başlıkla analiz yap:

Algoritmik Üslup Fark Analizi:
- Stil Mesafesi (Öklidyen): ${distance.toFixed(2)}
${styleDiff.length > 0 ? "- " + styleDiff.join("\n- ") : "- Üslup parametreleri birbirine yakındır."}
`.trim();
    }

    // =========================
    // THEME MODE
    // =========================
    else if (mode === "theme") {

      if (!tema || typeof tema !== "string") {
        return res.status(400).json({ error: "Tema eksik veya hatalı." });
      }

      prompt = `
Türk edebiyatı atmosferinde tamamen ÖZGÜN bir diyalog yaz.

KURALLAR:
- Doğrudan alıntı yapma.
- İki karakter konuşsun:
  (1) duygusal ve idealist bir yazar
  (2) realist ve sorgulayıcı bir düşünür
- Tema: "${tema}"
- Yaklaşık ${words} kelime olsun.
- Her satır "Karakter: ..." formatında olsun.
- En sonda 2-3 maddelik etik değerlendirme ekle.
`.trim();
    }

    else {
      return res.status(400).json({ error: "Geçersiz mode." });
    }

    // =========================
    // OPENAI REQUEST
    // =========================

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Sen edebiyat alanında uzman bir yazar ve akademisyensin." },
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
    console.error("Function crashed:", err);
    return res.status(500).json({
      error: "Sunucu hatası.",
      details: err?.message || String(err)
    });
  }
};
