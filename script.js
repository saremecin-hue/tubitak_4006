async function generate(mode) {
  const payload = { mode };

  if (mode === "theme") {
    payload.theme = document.getElementById("themeSelect").value;
  }

  if (mode === "era") {
    payload.era1 = document.getElementById("era1").value;
    payload.era2 = document.getElementById("era2").value;
  }

  if (mode === "author") {
    payload.author1 = document.getElementById("author1").value;
    payload.author2 = document.getElementById("author2").value;
  }

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  document.getElementById("resultText").innerText =
    data.text || data.error;
}
