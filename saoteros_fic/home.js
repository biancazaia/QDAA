(() => {
  const $ = (id) => document.getElementById(id);
  $("homeTitle").textContent = STORY.title;
  $("homeSubtitle").textContent = STORY.subtitle;
  const summary = String(STORY.summary || "").trim();
  $("homeSummary").textContent = summary && !/^insira aqui/i.test(summary)
    ? summary
    : "Uma história de fogo, sangue e corações em disputa.";

  const themeToggle = $("themeToggle");
  function renderThemeToggle() {
    const isDark = document.documentElement.dataset.theme === "dark";
    themeToggle.innerHTML = isDark ? "☀ <span>Tema</span>" : "☾ <span>Tema</span>";
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }

  const savedTheme = localStorage.getItem("westeros-theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  renderThemeToggle();
  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("westeros-theme", next);
    renderThemeToggle();
  });
})();
