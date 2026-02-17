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

  if (Math.abs(a1.dilSeviyesi - a2.dilSeviyesi) >= 2)
    differences.push("Dil seviyesi belirgin biçimde farklıdır.");

  if (Math.abs(a1.cumleUzunluk - a2.cumleUzunluk) >= 2)
    differences.push("Cümle yapısı ve uzunluğu açısından ayrışmaktadırlar.");

  if (Math.abs(a1.duyguYogunluk - a2.duyguYogunluk) >= 2)
    differences.push("Duygusal yoğunluk düzeyleri farklıdır.");

  if (Math.abs(a1.toplumsallik - a2.toplumsallik) >= 2)
    differences.push("Toplumsal temaya yaklaşım biçimleri ayrıdır.");

  if (Math.abs(a1.soyutluk - a2.soyutluk) >= 2)
    differences.push("Soyutlama ve felsefi derinlik düzeyleri farklıdır.");

  return differences;
}

module.exports = async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey)
      return res.status(500).json({ error: "OPENAI_API_KEY tanımlı değil." });

    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const { mode, author1, author2, tema } = body || {};

    let prompt = "";
    const words = 800;

    // AUTHOR MODE
    if (mode === "author") {

      if (!author1 || !author2)
        return res.status(400).json({ error: "Yazar bilgisi eksik." });

      if (!authors[author1] || !authors[author2])
        return res.status(400).json({ error: "Yazar veri setinde bulunamadı." });

      const distance = calculateStyleDistance(author1, author2);
      const styleDiff = generateStyleComparison(author1, author2);

      prompt = `
Türk edebiyatı atmosferinde özgün bir diyalog yaz.

1. Karakter: ${author1} üslubunda yaz.
2. Karakter: ${author2} üslubunda yaz.

Yaklaşık ${words} kelime olsun.
Her satır "Karakter: ..." formatında olsun.

En sonda:

Algoritmik Üslup Fark Analizi:
- Stil Mesafesi: ${distance.toFixed(2)}
${styleDiff.length > 0 ? "- " + styleDiff.join("\n- ") : "- Üsluplar birbirine yakındır."}
`.trim();
    }

    // THEME MODE
    else if (mode === "theme") {

      if (!tema)
        return res.status(400).json({ error: "Tema eksik." });

      prompt = `
Türk edebiyatı atmosferinde özgün bir diyalog yaz.

Tema: "${tema}"

İki karakter konuşsun:
- Biri idealist
- Biri realist

Yaklaşık ${words} kelime olsun.
Her satır "Karakter: ..." formatında olsun.
`.trim();
    }

    // ERA MODE (geçici güvenli versiyon)
    else if (mode === "era") {
      return res.status(200).json({
        text: "Era modu henüz aktif edilmedi. Author ve Theme modları çalışmaktadır."
      });
    }

    else {
      return res.status(400).json({ error: "Geçersiz mode." });
    }

    // OPENAI
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Sen edebiyat alanında uzman bir yazarsın." },
          { role: "user", content: prompt }
        ],
        temperature: 0.85,
        max_tokens: 1800
      }),
    });

    const data = await r.json();

    if (!r.ok)
      return res.status(r.status).json({
        error: "OpenAI isteği başarısız.",
        details: data?.error?.message
      });

    const text = data?.choices?.[0]?.message?.content?.trim();

    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({
      error: "Sunucu hatası.",
      details: err?.message
    });
  }
};

