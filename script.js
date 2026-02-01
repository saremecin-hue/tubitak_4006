document.addEventListener("DOMContentLoaded", () => {
  // Views
  const views = {
    home: document.getElementById("viewHome"),
    theme: document.getElementById("viewTheme"),
    era: document.getElementById("viewEra"),
    author: document.getElementById("viewAuthor"),
    result: document.getElementById("viewResult"),
  };

  function show(viewKey){
    Object.values(views).forEach(v => v.classList.remove("active"));
    views[viewKey].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Navigation buttons
  const goTheme = document.getElementById("goTheme");
  const goEra = document.getElementById("goEra");
  const goAuthor = document.getElementById("goAuthor");

  const backFromTheme = document.getElementById("backFromTheme");
  const backFromEra = document.getElementById("backFromEra");
  const backFromAuthor = document.getElementById("backFromAuthor");
  const backFromResult = document.getElementById("backFromResult");

  goTheme.addEventListener("click", () => show("theme"));
  goEra.addEventListener("click", () => show("era"));
  goAuthor.addEventListener("click", () => show("author"));

  backFromTheme.addEventListener("click", () => show("home"));
  backFromEra.addEventListener("click", () => show("home"));
  backFromAuthor.addEventListener("click", () => show("home"));
  backFromResult.addEventListener("click", () => show("home"));

  // Inputs
  const themeSelect = document.getElementById("themeSelect");
  const era1 = document.getElementById("era1");
  const era2 = document.getElementById("era2");

  const author1 = document.getElementById("author1");
  const author2 = document.getElementById("author2");
  const authorTopic = document.getElementById("authorTopic");

  // Generate buttons
  const genTheme = document.getElementById("genTheme");
  const genEra = document.getElementById("genEra");
  const genAuthor = document.getElementById("genAuthor");

  // Output
  const output = document.getElementById("output");

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
          (data?.details ? `Detay: ${String(data.details).slice(0,1000)}` : "");
        return;
      }

      output.textContent = data?.text || "Metin alınamadı.";

    }catch(e){
      output.textContent = "Ağ hatası veya sunucuya ulaşılamıyor.";
    }
  }

  genTheme.addEventListener("click", () => {
    const tema = themeSelect.value || "";
    if (!tema) return alert("Lütfen bir tema seçin.");
    generate({ mode: "theme", tema });
  });

  genEra.addEventListener("click", () => {
    const d1 = era1.value || "";
    const d2 = era2.value || "";
    if (!d1 || !d2) return alert("Lütfen iki dönemi de seçin.");
    generate({ mode: "era", era1: d1, era2: d2 });
  });

  genAuthor.addEventListener("click", () => {
    const a1 = author1.value || "";
    const a2 = author2.value || "";
    const topic = (authorTopic.value || "").trim();

    if (!a1 || !a2) return alert("Lütfen iki yazarı da seçin.");
    generate({ mode: "author", author1: a1, author2: a2, topic });
  });
});
