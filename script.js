document.addEventListener("DOMContentLoaded", () => {
  // View helpers
  const views = {
    home: document.getElementById("viewHome"),
    theme: document.getElementById("viewTheme"),
    era: document.getElementById("viewEra"),
    result: document.getElementById("viewResult"),
  };

  function show(viewKey){
    Object.values(views).forEach(v => v.classList.remove("active"));
    views[viewKey].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Buttons
  const goTheme = document.getElementById("goTheme");
  const goEra = document.getElementById("goEra");
  const backFromTheme = document.getElementById("backFromTheme");
  const backFromEra = document.getElementById("backFromEra");
  const backFromResult = document.getElementById("backFromResult");

  const genTheme = document.getElementById("genTheme");
  const genEra = document.getElementById("genEra");

  // Make diamond text visible
  genTheme.innerHTML = "<span>Metin<br/>oluştur</span>";
  genEra.innerHTML = "<span>Metin<br/>oluştur</span>";

  // Inputs
  const themeSelect = document.getElementById("themeSelect");
  const era1 = document.getElementById("era1");
  const era2 = document.getElementById("era2");

  // Output
  const output = document.getElementById("output");

  // Navigation
  goTheme.addEventListener("click", () => show("theme"));
  goEra.addEventListener("click", () => show("era"));
  backFromTheme.addEventListener("click", () => show("home"));
  backFromEra.addEventListener("click", () => show("home"));
  backFromResult.addEventListener("click", () => show("home"));

  // Call API
  async function generate(payload){
    show("result");
    output.textContent = "Metin oluşturuluyor... Lütfen bekleyin.";

    try{
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok){
        output.textContent =
          (data?.error ? `Hata: ${data.error}\n` : "Hata oluştu.\n") +
          (data?.details ? `Detay: ${String(data.details).slice(0,800)}` : "");
        return;
      }

      output.textContent = data?.text || "Metin alınamadı.";

    }catch(e){
      output.textContent = "Ağ hatası veya sunucuya ulaşılamıyor.";
    }
  }

  // Theme generate
  genTheme.addEventListener("click", () => {
    const tema = themeSelect.value || "";
    if (!tema) {
      alert("Lütfen bir tema seçin.");
      return;
    }
    generate({ mode: "theme", tema });
  });

  // Era generate
  genEra.addEventListener("click", () => {
    const d1 = era1.value || "";
    const d2 = era2.value || "";
    if (!d1 || !d2){
      alert("Lütfen iki dönemi de seçin.");
      return;
    }
    generate({ mode: "era", era1: d1, era2: d2 });
  });
});
