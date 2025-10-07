document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("generateBtn");
  const output = document.getElementById("output");
  const themeSelect = document.getElementById("themeSelect");

  button.addEventListener("click", async () => {
    const selectedTheme = themeSelect.value;
    let promptText = "Karakterler arasında 2000 kelimelik özgün bir diyalog oluştur";

    if (selectedTheme !== "default") {
      promptText += `, teması: ${selectedTheme}`;
    }

    output.textContent = "Metin oluşturuluyor... Lütfen bekleyin.";

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText })
      });

      if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status}`);
      }

      const data = await response.json();
      output.textContent = data.text || "Hata: Metin alınamadı.";

    } catch (error) {
      console.error("🔴 Hata:", error);
      output.textContent = "Sunucu hatası, metin oluşturulamadı.";
    }
  });
});
