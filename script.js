document.addEventListener("DOMContentLoaded", function () {

  // VIEW ELEMENTLERİ
  const homeView = document.getElementById("homeView");
  const themeView = document.getElementById("themeView");
  const eraView = document.getElementById("eraView");
  const authorView = document.getElementById("authorView");
  const resultView = document.getElementById("resultView");

  // HOME BUTTONLARI
  const btnTheme = document.getElementById("btnTheme");
  const btnEra = document.getElementById("btnEra");
  const btnAuthor = document.getElementById("btnAuthor");

  // BACK BUTTONLARI
  const backTheme = document.getElementById("backTheme");
  const backEra = document.getElementById("backEra");
  const backAuthor = document.getElementById("backAuthor");
  const backResult = document.getElementById("backResult");

  // GENERATE BUTTONLARI
  const generateTheme = document.getElementById("generateTheme");
  const generateEra = document.getElementById("generateEra");
  const generateAuthor = document.getElementById("generateAuthor");

  const output = document.getElementById("outputText");

  function hideAll() {
    homeView.style.display = "none";
    themeView.style.display = "none";
    eraView.style.display = "none";
    authorView.style.display = "none";
    resultView.style.display = "none";
  }

  function show(view) {
    hideAll();
    view.style.display = "block";
  }

  // HOME → MODE
  btnTheme.onclick = () => show(themeView);
  btnEra.onclick = () => show(eraView);
  btnAuthor.onclick = () => show(authorView);

  // BACK BUTTONLARI
  backTheme.onclick = () => show(homeView);
  backEra.onclick = () => show(homeView);
  backAuthor.onclick = () => show(homeView);
  backResult.onclick = () => show(homeView);

  // THEME MODE
  generateTheme.onclick = async () => {
    const theme = document.getElementById("themeSelect").value;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "theme",
        theme: theme
      })
    });

    const data = await res.json();
    output.innerText = data.text;
    show(resultView);
  };

  // ERA MODE
  generateEra.onclick = async () => {
    const era1 = document.getElementById("era1").value;
    const era2 = document.getElementById("era2").value;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "era",
        era1: era1,
        era2: era2
      })
    });

    const data = await res.json();
    output.innerText = data.text;
    show(resultView);
  };

  // AUTHOR MODE
  generateAuthor.onclick = async () => {
    const author1 = document.getElementById("author1").value;
    const author2 = document.getElementById("author2").value;
    const topic = document.getElementById("authorTopic").value;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "author",
        author1: author1,
        author2: author2,
        topic: topic
      })
    });

    const data = await res.json();
    output.innerText = data.text;
    show(resultView);
  };

});

