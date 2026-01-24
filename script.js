document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("generateBtn");
  const output = document.getElementById("output");
  const topicSelect = document.getElementById("topicSelect");

  if (!button || !output || !topicSelect) {
    console.error("Gerekli DOM elemanları bulunamadı.");
    return;
  }

  button.addEventListener("click", async () => {
    const tema = topicSelect.value || "";
    if (!tema) {
      output.textContent = "Lütfen bir tema seçin.";
      return;
    }

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "Oluşturuluyor...";

    output.textContent = "Metin oluşturuluyor... Lütfen bekleyin.";

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema })
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { error: await res.text() };

      if (!res.ok) {
        console.error("Sunucu hatalı cevap:", res.status, data);
        output.textContent = data?.error
          ? `Hata: ${data.error}`
          : `Sunucu hatası: ${res.status}`;

        if (data?.details) {
          output.textContent += `\nDetay: ${String(data.details).slice(0,1000)}`;
        }
        return;
      }

      output.textContent = data?.text || "Hata: Metin alınamadı.";

    } catch (err) {
      console.error("Ağ/JS hatası:", err);
      output.textContent = "Ağ hatası veya sunucuya ulaşılamıyor.";
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
});
