(() => {
  const canvas = document.getElementById("dragonCanvas");
  const context = canvas.getContext("2d");
  const board = document.getElementById("gameBoard");
  const button = document.getElementById("gameButton");
  const message = document.getElementById("gameMessage");
  const scoreLabel = document.getElementById("gameScore");
  const themeToggle = document.getElementById("themeToggle");
  const startingCanvasLabel = canvas.getAttribute("aria-label");
  const world = { width: 320, height: 128 };
  const dragon = { x: 34, y: 27, velocity: 0 };
  const dragonSize = { width: 48, height: 28 };
  const barrier = { width: 18, baseGap: 60, minGap: dragonSize.height + 8 };
  const keys = { up: false, down: false };
  let touchTarget = null;
  let obstacles = [];
  let score = 0;
  let state = "ready";
  let lastTime = 0;
  let animationFrame = 0;

  function renderThemeToggle() {
    const isDark = document.documentElement.dataset.theme === "dark";
    themeToggle.innerHTML = isDark
      ? "☀ <span>Tema</span>"
      : "☾ <span>Tema</span>";
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }

  const savedTheme = localStorage.getItem("westeros-theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  renderThemeToggle();
  themeToggle.addEventListener("click", () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("westeros-theme", next);
    renderThemeToggle();
  });

  function resize() {
    canvas.width = world.width;
    canvas.height = world.height;
    context.imageSmoothingEnabled = false;
    draw();
  }

  function drawDragon() {
    context.save();
    context.translate(
      Math.round(dragon.x + dragonSize.width),
      Math.round(dragon.y),
    );
    context.scale(-1, 1);

    const tile = 2;
    const colors = {
      outline: "#100d16",
      body: "#211a23",
      shadow: "#45313a",
      red: "#9e2538",
      redLight: "#d43749",
      belly: "#a68a7a",
      eye: "#f6c451",
    };
    const block = (column, row, columns, rows, color) => {
      context.fillStyle = color;
      context.fillRect(column * tile, row * tile, columns * tile, rows * tile);
    };

    const wingRows = [
      [13, 1, 1],
      [12, 2, 3],
      [11, 3, 5],
      [10, 4, 7],
      [9, 5, 9],
      [7, 6, 13],
      [11, 7, 3],
    ];
    wingRows.forEach(([column, row, columns]) => {
      block(column, row, columns, 1, colors.outline);
      if (columns > 2) {
        block(column + 1, row, columns - 2, 1, colors.red);
      }
    });
    [
      [12, 2],
      [11, 3],
      [10, 4],
      [9, 5],
      [8, 6],
      [10, 6],
      [12, 6],
      [14, 6],
      [12, 7],
    ].forEach(([column, row]) => block(column, row, 1, 1, colors.outline));

    block(17, 9, 3, 2, colors.outline);
    block(19, 10, 3, 1, colors.outline);
    block(22, 11, 2, 1, colors.outline);
    block(18, 9, 2, 1, colors.red);
    block(20, 10, 2, 1, colors.redLight);
    block(23, 11, 1, 1, colors.red);

    block(5, 8, 14, 4, colors.outline);
    block(6, 9, 12, 2, colors.body);
    block(6, 11, 12, 1, colors.belly);
    block(7, 11, 10, 1, colors.shadow);

    block(14, 11, 2, 2, colors.outline);
    block(13, 13, 4, 1, colors.outline);
    block(15, 12, 1, 1, colors.red);

    block(1, 7, 7, 1, colors.outline);
    block(0, 8, 8, 3, colors.outline);
    block(1, 8, 6, 2, colors.body);
    block(0, 9, 4, 1, colors.red);
    block(1, 10, 6, 1, colors.belly);
    block(2, 8, 1, 1, colors.eye);
    block(3, 8, 1, 1, colors.outline);
    block(2, 6, 2, 2, colors.outline);
    block(3, 6, 1, 1, colors.redLight);
    block(5, 7, 2, 1, colors.outline);
    block(6, 6, 1, 2, colors.red);

    [
      [6, 9],
      [8, 9],
      [12, 9],
      [15, 9],
      [7, 10],
      [10, 10],
      [13, 10],
      [16, 10],
    ].forEach(([column, row], index) =>
      block(column, row, 1, 1, index % 2 ? colors.red : colors.redLight),
    );
    context.restore();
  }

  function draw() {
    context.clearRect(0, 0, world.width, world.height);
    context.fillStyle = "#292d3d";
    context.fillRect(0, 0, world.width, world.height);
    context.fillStyle = "#414152";
    context.fillRect(0, 0, world.width, 42);
    context.fillStyle = "#5c4c57";
    context.fillRect(0, 42, world.width, 28);
    context.fillStyle = "#d2a66c";
    [
      [20, 20],
      [95, 34],
      [226, 18],
      [302, 43],
    ].forEach(([x, y]) => {
      context.fillRect(x, y, 2, 2);
    });

    drawStoneTower(22, 40, 42, 38);
    drawStoneTower(133, 52, 50, 27);
    drawStoneTower(255, 33, 48, 46);
    drawStoneWall();

    obstacles.forEach((obstacle) => {
      const gapTop = obstacle.gapCenter - obstacle.gap / 2;
      const gapBottom = obstacle.gapCenter + obstacle.gap / 2;
      drawBarrier(obstacle.x, 0, barrier.width, gapTop, false);
      drawBarrier(
        obstacle.x,
        gapBottom,
        barrier.width,
        world.height - gapBottom,
        true,
      );
    });

    if (state === "won") {
      drawEnding();
      return;
    }
    drawDragon();
  }

  function drawEnding() {
    context.fillStyle = "rgba(12, 10, 18, 0.78)";
    context.fillRect(0, 0, world.width, world.height);
    drawPixelPrincess(130, 43, "#c92f43", "#258453", "right");
    drawPixelPrincess(160, 43, "#f2eee4", "#201b25", "left");
    context.fillStyle = "#ed5260";
    context.fillRect(157, 57, 2, 2);
    context.fillRect(155, 59, 6, 2);
    context.fillRect(157, 61, 2, 2);
  }

  function drawPixelPrincess(x, y, hair, dress, facing) {
    const pixel = 2;
    const rect = (column, row, columns, rows, color) => {
      context.fillStyle = color;
      context.fillRect(
        x + column * pixel,
        y + row * pixel,
        columns * pixel,
        rows * pixel,
      );
    };
    const outline = "#100d16";
    const skin = "#f1c5a6";
    const faceX = facing === "right" ? 6 : 1;
    const hairX = facing === "right" ? 1 : 9;
    const eyeX = facing === "right" ? 10 : 2;
    const noseX = facing === "right" ? 13 : 0;
    const armX = facing === "right" ? 10 : 2;

    rect(3, 1, 8, 2, outline);
    rect(2, 2, 10, 2, hair);
    rect(hairX, 3, 4, 12, outline);
    rect(hairX + 1, 4, 2, 10, hair);
    rect(faceX - 1, 4, 8, 8, outline);
    rect(faceX, 5, 6, 6, skin);
    rect(faceX, 4, 5, 2, hair);
    rect(eyeX, 7, 1, 1, outline);
    rect(noseX, 8, 1, 1, "#ed5260");
    rect(faceX + 1, 10, 4, 1, "#bd5260");
    rect(6, 12, 3, 3, skin);

    rect(4, 14, 8, 5, outline);
    rect(5, 15, 6, 3, dress);
    rect(armX, 15, 2, 4, skin);
    rect(facing === "right" ? 11 : 1, 17, 3, 1, "#ed5260");
    rect(3, 19, 10, 2, outline);
    rect(4, 19, 8, 1, dress);
    rect(1, 21, 14, 2, outline);
    rect(2, 21, 12, 1, dress);
    rect(0, 23, 16, 3, outline);
    rect(1, 23, 14, 2, dress);
    rect(2, 25, 12, 1, dress === "#258453" ? "#45a96e" : "#39313f");
    rect(4, 20, 1, 1, dress === "#258453" ? "#80d28b" : "#716475");
    rect(11, 23, 1, 1, dress === "#258453" ? "#80d28b" : "#716475");
  }

  function drawStonework(x, y, width, height) {
    context.fillStyle = "#454754";
    context.fillRect(x, y, width, height);
    for (let row = 0; row < height; row += 10) {
      context.fillStyle = "#343846";
      context.fillRect(x, y + row, width, 2);
      const offset = (Math.floor(row / 10) % 2) * 10;
      for (let column = offset; column < width; column += 20) {
        context.fillStyle = (column / 20) % 2 ? "#595a65" : "#50525f";
        context.fillRect(x + column, y + row + 2, 18, 7);
        context.fillStyle = "#6b6570";
        context.fillRect(x + column + 2, y + row + 3, 5, 1);
      }
    }
  }

  function drawStoneTower(x, y, width, height) {
    drawStonework(x, y, width, height);
    context.fillStyle = "#343846";
    for (let blockX = x; blockX < x + width; blockX += 12) {
      context.fillRect(blockX, y - 5, 7, 7);
    }
    context.fillStyle = "#292d3d";
    context.fillRect(x + Math.floor(width / 2) - 3, y + 13, 6, 12);
    context.fillStyle = "#d29a5a";
    context.fillRect(x + Math.floor(width / 2) - 1, y + 16, 2, 7);
  }

  function drawStoneWall() {
    drawStonework(0, 78, world.width, 50);
    context.fillStyle = "#343846";
    for (let x = 0; x < world.width; x += 24) {
      context.fillRect(x, 70, 13, 12);
    }
    context.fillStyle = "#69636d";
    context.fillRect(0, 78, world.width, 2);
    [78, 195, 278].forEach((x) => {
      context.fillStyle = "#252b39";
      context.fillRect(x, 88, 6, 13);
      context.fillStyle = "#c98f57";
      context.fillRect(x + 2, 92, 2, 7);
    });
  }

  function drawBarrier(x, y, blockWidth, blockHeight, fromBottom) {
    const startY = Math.round(y);
    const height = Math.max(0, Math.round(blockHeight));
    if (!height) return;
    context.fillStyle = "#15132b";
    context.fillRect(x, startY, blockWidth, height);
    context.fillStyle = "#a73663";
    context.fillRect(
      x + 2,
      startY + 2,
      blockWidth - 4,
      Math.max(0, height - 4),
    );
    context.fillStyle = "#ef5264";
    context.fillRect(x + 4, startY + 3, 3, Math.max(0, height - 6));
    context.fillStyle = "#ffba52";
    context.fillRect(
      x + 2,
      fromBottom ? startY : startY + height - 4,
      blockWidth - 4,
      4,
    );
    context.fillStyle = "#15132b";
    context.fillRect(
      x - 2,
      fromBottom ? startY : startY + height - 3,
      blockWidth + 4,
      3,
    );
  }

  function getPillarGap() {
    const reduction = Math.floor(score / 20) * 2;
    return Math.max(barrier.minGap, barrier.baseGap - reduction);
  }

  function randomGapCenter(gap) {
    const margin = 6;
    const minCenter = gap / 2 + margin;
    const maxCenter = world.height - gap / 2 - margin;
    return minCenter + Math.floor(Math.random() * (maxCenter - minCenter + 1));
  }

  function createObstacle(x) {
    const gap = getPillarGap();
    return { x, gap, gapCenter: randomGapCenter(gap) };
  }

  function begin() {
    score = 0;
    speed = 1.35;
    obstacles = [createObstacle(world.width + 24)];
    dragon.y = 27;
    dragon.velocity = 0;
    touchTarget = null;
    state = "running";
    lastTime = 0;
    scoreLabel.textContent = "0000";
    canvas.setAttribute("aria-label", startingCanvasLabel);
    message.classList.add("is-hidden");
    message.classList.remove("is-ending");
    button.textContent = "Reiniciar";
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(update);
  }

  function finish() {
    state = "over";
    message.textContent =
      "FIM DE JOGO - " + String(Math.floor(score)).padStart(4, "0");
    message.classList.remove("is-ending");
    message.classList.remove("is-hidden");
    button.textContent = "Jogar de novo";
  }

  function finishAtTargetScore() {
    state = "won";
    obstacles = [];
    message.textContent = "FIM DE JOGO";
    message.classList.add("is-ending");
    message.classList.remove("is-hidden");
    canvas.setAttribute(
      "aria-label",
      "Fim de jogo aos 1000 pontos: duas princesas pixeladas se beijam.",
    );
    button.textContent = "Jogar de novo";
  }

  function update(time) {
    if (state !== "running") return;
    const delta = Math.min((time - (lastTime || time)) / 16.67, 2);
    lastTime = time;
    score += delta * speed * 0.08;
    speed = Math.min(3.8, 1.35 + score / 180);
    if (score >= 1000) {
      score = 1000;
      scoreLabel.textContent = "1000";
      finishAtTargetScore();
      draw();
      return;
    }
    scoreLabel.textContent = String(Math.floor(score)).padStart(4, "0");

    const direction = Number(keys.down) - Number(keys.up);
    if (direction) {
      dragon.y += direction * 2.5 * delta;
      touchTarget = null;
    } else if (touchTarget !== null) {
      const difference = touchTarget - (dragon.y + dragonSize.height / 2);
      dragon.y += Math.max(-2.5 * delta, Math.min(2.5 * delta, difference));
    }
    dragon.y = Math.max(
      5,
      Math.min(world.height - dragonSize.height - 5, dragon.y),
    );

    obstacles.forEach((obstacle) => {
      obstacle.x -= speed * delta;
    });
    obstacles = obstacles.filter((obstacle) => obstacle.x > -barrier.width - 4);
    const obstacleSpacing = Math.max(120, 150 - Math.floor(score / 16));
    if (
      !obstacles.length ||
      obstacles[obstacles.length - 1].x < world.width - obstacleSpacing
    ) {
      obstacles.push(createObstacle(world.width + 12));
    }
    const collision = obstacles.some((obstacle) => {
      const gapTop = obstacle.gapCenter - obstacle.gap / 2;
      const gapBottom = obstacle.gapCenter + obstacle.gap / 2;
      const overlapsX =
        dragon.x + dragonSize.width - 4 > obstacle.x &&
        dragon.x + 4 < obstacle.x + barrier.width;
      const outsideGap =
        dragon.y + 4 < gapTop || dragon.y + dragonSize.height - 4 > gapBottom;
      return overlapsX && outsideGap;
    });
    draw();
    if (collision) {
      finish();
      draw();
      return;
    }
    animationFrame = requestAnimationFrame(update);
  }

  button.addEventListener("click", begin);
  function setTouchTarget(event) {
    if (state !== "running") return;
    const bounds = canvas.getBoundingClientRect();
    touchTarget = ((event.clientY - bounds.top) / bounds.height) * world.height;
  }
  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    setTouchTarget(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (event.buttons) setTouchTarget(event);
  });
  window.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp" || event.code === "KeyW") {
      event.preventDefault();
      keys.up = true;
    } else if (event.code === "ArrowDown" || event.code === "KeyS") {
      event.preventDefault();
      keys.down = true;
    }
  });
  window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowUp" || event.code === "KeyW") keys.up = false;
    if (event.code === "ArrowDown" || event.code === "KeyS") keys.down = false;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state === "running") {
      state = "paused";
      message.textContent = "Pausa";
      message.classList.remove("is-hidden");
    } else if (!document.hidden && state === "paused") {
      state = "running";
      message.classList.add("is-hidden");
      lastTime = 0;
      animationFrame = requestAnimationFrame(update);
    }
  });
  new ResizeObserver(resize).observe(board);
  resize();
})();
