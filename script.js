document.addEventListener("DOMContentLoaded", function () {

  const panels = document.querySelectorAll(".panel");

  function showPanel(id) {
    panels.forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  // HOME NAVIGATION
  document.querySelectorAll("[data-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      showPanel(target);
    });
  });

  // API REQUEST
  async function sendRequest(payload) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    document.getElementById("outputText").innerText = data.text || "Hata oluştu";
    showPanel("result");
  }

  document.getElementById("generateTheme").onclick = () => {
    sendRequest({
      mode: "theme",
      theme: document.getElementById("themeSelect").value
    });
  };

  document.getElementById("generateEra").onclick = () => {
    sendRequest({
      mode: "era",
      era1: document.getElementById("era1").value,
      era2: document.getElementById("era2").value
    });
  };

  document.getElementById("generateAuthor").onclick = () => {
    sendRequest({
      mode: "author",
      author1: document.getElementById("author1").value,
      author2: document.getElementById("author2").value,
      topic: document.getElementById("authorTopic").value
    });
  };

});
