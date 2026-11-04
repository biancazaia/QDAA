(() => {
  const $ = (id) => document.getElementById(id);
  let current = 0;
  let readerSize = 19;
  let wide = false;

  const safeText = (value) => String(value ?? "");
  function renderChapter(index) {
    current = Math.max(0, Math.min(index, STORY.chapters.length - 1));
    const chapter = STORY.chapters[current];
    $("chapterKicker").textContent = `CAPÍTULO ${toRoman(current + 1)}`;
    $("chapterTitle").textContent = chapter.title;
    $("chapterContent").innerHTML = chapter.content;
    $("chapterSelect").value = String(current);
    $("chapterCounter").textContent = `${current + 1} / ${STORY.chapters.length}`;
    $("prevChapter").disabled = current === 0;
    $("nextChapter").disabled = current === STORY.chapters.length - 1;
    $("prevChapter").style.opacity = current === 0 ? ".45" : "1";
    $("nextChapter").style.opacity = current === STORY.chapters.length - 1 ? ".45" : "1";
    document.querySelectorAll("#chapterList button").forEach((button, i) => {
      button.classList.toggle("active", i === current);
      button.setAttribute("aria-current", i === current ? "page" : "false");
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    $("sidebar").classList.remove("open");
    $("contentsToggle").setAttribute("aria-expanded", "false");
  }
  function toRoman(num) {
    const vals = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
    let out = "";
    for (const [value, symbol] of vals) while (num >= value) { out += symbol; num -= value; }
    return out;
  }
  function initialize() {
    document.title = `${STORY.title} — Arquivo de Westeros`;
    $("sidebarTitle").innerHTML = safeText(STORY.title).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    $("storyTitle").textContent = STORY.title;
    $("storySubtitle").textContent = STORY.subtitle;
    $("storyFandom").textContent = STORY.fandom;
    const meta = [STORY.author, STORY.rating, STORY.warnings, STORY.relationships]
      .filter(Boolean).map(item => `<span class="meta-chip">${escapeHTML(item)}</span>`).join("");
    $("storyMeta").innerHTML = meta;
    STORY.chapters.forEach((chapter, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${index + 1}. ${chapter.title}`;
      $("chapterSelect").appendChild(option);
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${String(index + 1).padStart(2, "0")}  ${chapter.title}`;
      button.addEventListener("click", () => renderChapter(index));
      li.appendChild(button);
      $("chapterList").appendChild(li);
    });
    const savedTheme = localStorage.getItem("westeros-theme");
    if (savedTheme) document.documentElement.dataset.theme = savedTheme;
    $("themeToggle").innerHTML = document.documentElement.dataset.theme === "dark" ? "☀ <span>Tema</span>" : "☾ <span>Tema</span>";
    renderChapter(0);
  }
  function escapeHTML(text) {
    return safeText(text).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  }

  $("themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("westeros-theme", next);
    $("themeToggle").innerHTML = next === "dark" ? "☀ <span>Tema</span>" : "☾ <span>Tema</span>";
  });
  $("chapterSelect").addEventListener("change", (event) => renderChapter(Number(event.target.value)));
  $("prevChapter").addEventListener("click", () => renderChapter(current - 1));
  $("nextChapter").addEventListener("click", () => renderChapter(current + 1));
  $("fontDown").addEventListener("click", () => { readerSize = Math.max(14, readerSize - 1); document.documentElement.style.setProperty("--reader-size", `${readerSize}px`); });
  $("fontUp").addEventListener("click", () => { readerSize = Math.min(30, readerSize + 1); document.documentElement.style.setProperty("--reader-size", `${readerSize}px`); });
  $("widthToggle").addEventListener("click", () => {
    wide = !wide;
    document.body.classList.toggle("wide-reader", wide);
    $("widthToggle").textContent = `Largura: ${wide ? "ampla" : "confortável"}`;
    $("widthToggle").setAttribute("aria-pressed", String(wide));
  });
  $("contentsToggle").addEventListener("click", () => {
    const opened = $("sidebar").classList.toggle("open");
    $("contentsToggle").setAttribute("aria-expanded", String(opened));
  });
  initialize();
})();
