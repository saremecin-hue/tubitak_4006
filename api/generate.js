import { authors } from "../authors.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST destekleniyor." });
  }

  const { mode, theme, era1, era2, author1, author2 } = req.body;

  try {

    // 🔹 THEME MODE
    if (mode === "theme") {
      return res.status(200).json({
        text: `Tema: ${theme}

Bu tema üzerinden farklı dönemlerin bakış açıları tartışılabilir.
Yapay zeka bu tema etrafında karşılaştırmalı bir diyalog üretebilir.`
      });
    }

    // 🔹 ERA MODE
    if (mode === "era") {
      const eraAuthors1 = authors.filter(a => a.era === era1);
      const eraAuthors2 = authors.filter(a => a.era === era2);

      return res.status(200).json({
        text: `${era1} döneminden yazarlar:
${eraAuthors1.map(a => a.name).join(", ")}

${era2} döneminden yazarlar:
${eraAuthors2.map(a => a.name).join(", ")}

Bu dönemler dil, tema ve anlatım açısından karşılaştırılabilir.`
      });
    }

    // 🔹 AUTHOR MODE
    if (mode === "author") {
      const a1 = authors.find(a => a.name === author1);
      const a2 = authors.find(a => a.name === author2);

      if (!a1 || !a2) {
        return res.status(400).json({ error: "Yazar bulunamadı." });
      }

      const similarity =
        1 -
        Math.sqrt(
          a1.styleVector.reduce(
            (sum, val, i) => sum + Math.pow(val - a2.styleVector[i], 2),
            0
          )
        ) / Math.sqrt(a1.styleVector.length);

      return res.status(200).json({
        text: `${a1.name} (${a1.era})
${a2.name} (${a2.era})

Stil Benzerlik Oranı: ${(similarity * 100).toFixed(1)}%

${a1.description}

${a2.description}`
      });
    }

    return res.status(400).json({ error: "Hatalı mod." });

  } catch (err) {
    return res.status(500).json({ error: "Sunucu hatası." });
  }
}
