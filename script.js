document.addEventListener("DOMContentLoaded", function () {

  const views = document.querySelectorAll(".view");

  function showView(id) {
    views.forEach(v => v.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  // HOME BUTTONS
  document.getElementById("btnTheme").onclick = () => showView("themeView");
  document.getElementById("btnEra").onclick = () => showView("eraView");
  document.getElementById("btnAuthor").onclick = () => showView("authorView");

  document.getElementById("backTheme").onclick = () => showView("homeView");
  document.getElementById("backEra").onclick = () => showView("homeView");
  document.getElementById("backAuthor").onclick = () => showView("homeView");
  document.getElementById("backResult").onclick = () => showView("homeView");

  async function sendRequest(payload) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    document.getElementById("outputText").innerText = data.text || "Hata oluştu";
    showView("resultView");
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
