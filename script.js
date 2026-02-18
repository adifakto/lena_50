// ===================== LYRICS =====================
const LYRICS = [
  { t: 10, text: "Ничего на свете лучше нету," },
  { t: 14, text: "Чем с Ленком гулять по белу свету!" },
  { t: 18, text: "Седер в доме, чистотой сияет," },
  { t: 21, text: "Пыль при виде Лены — исчезает!" },
  { t: 25, text: "Пыль при виде Лены — исчезает!" },
   //פזמון
  { t: 30, text: "Ла-ла-ла-ла ла ла," },
  { t: 32, text: "Ла-ла-ла-ла ла" },
  { t: 34, text: "Ла-ла ла, е, е-е, е-е" },
  { t: 40, text: "Коль карат мукар лэ Лена лично," },
  { t: 45, text: "Блеск в глазах и в сердце — доброта," },
  { t: 48, text: "Лена наша просто красота!" },
  { t: 52, text: "Лена наша просто красота!" },
  { t: 56, text: "Лена наша просто красота!" },
  //פזמון
  { t: 61, text: "Ла-ла-ла-ла ла ла," },
  { t: 63, text: "Ла-ла-ла-ла ла" },
  { t: 65, text: "Ла-ла ла, е, е-е, е-е" },
  { t: 71, text: "Рядом Питер — верная опора," },
  { t: 75, text: "С ним не будет в доме даже спора." },
  { t: 79, text: "Дина с Витей — «золото» семьи," },
  { t: 84, text: "Всё у них по правилам любви!" },
  { t: 86, text: "Всё у них по правилам любви!" },
  //פזמון
  { t: 91, text: "Ла-ла-ла-ла ла ла," },
  { t: 93, text: "Ла-ла-ла-ла ла" },
  { t: 95, text: "Ла-ла ла, е, е-е, е-е" },
  { t: 98, text: "Пусть маршруты новые манят," },
  { t: 100, text: "Бриллианты радостно звенят!" },
  { t: 105, text: "Пятьдесят — лишь новая огранка," },
  { t: 108, text: "А теперь вся жизнь одна гулянка!" },
  { t: 112, text: "А теперь вся жизнь одна гулянка!" },
].sort((a,b)=>a.t-b.t);


// ===================== CONFETTI TIMES =====================
// 👉 תשני כאן לפי השיר שלך (שניות)
const CONFETTI_TIMES = [
  30,
  61,
  91
];

let triggeredConfetti = new Set();

// ===================== ELEMENTS =====================
const player = document.getElementById("player");
const lyricsBox = document.getElementById("lyricsBox");
const timeInfo = document.getElementById("timeInfo");
const restartBtn = document.getElementById("restartBtn");

// ===================== TIME FORMAT =====================
function formatTime(sec) {
  sec = Math.floor(sec);
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ===================== FIND LINE =====================
function getCurrentLineIndex(time) {
  for (let i = LYRICS.length - 1; i >= 0; i--) {
    if (time >= LYRICS[i].t) return i;
  }
  return -1;
}

// ===================== RENDER =====================
function render() {
  const currentTime = player.currentTime || 0;
  timeInfo.textContent = formatTime(currentTime);

  const index = getCurrentLineIndex(currentTime);

  lyricsBox.innerHTML = "";

  const start = Math.max(0, (index === -1 ? 0 : index - 1));
  const end = Math.min(LYRICS.length, start + 5);

  for (let i = start; i < end; i++) {
    const div = document.createElement("div");
    div.className = "line" + (i === index ? " active" : "");
    div.textContent = LYRICS[i].text;
    lyricsBox.appendChild(div);
  }

  if (index === -1 && lyricsBox.firstChild) {
    lyricsBox.firstChild.classList.add("active");
  }

  // ===================== CONFETTI TRIGGERS =====================
  CONFETTI_TIMES.forEach(time => {
    if (currentTime >= time && !triggeredConfetti.has(time)) {
      triggeredConfetti.add(time);
      burstConfetti(2200);
    }
  });
}

// ===================== EVENTS =====================
player.addEventListener("timeupdate", render);
player.addEventListener("seeked", render);
player.addEventListener("loadedmetadata", render);

restartBtn.addEventListener("click", () => {
  player.currentTime = 0;
  player.play().catch(()=>{});
  render();
  triggeredConfetti.clear();
  burstConfetti(1800);
});

// ===================== INIT =====================
render();

// ===================== CONFETTI ENGINE =====================
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d", { alpha: true });

function resizeCanvas() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const confettiColors = [
  "#ffffff",
  "#ffd6a5",
  "#caffbf",
  "#9bf6ff",
  "#bdb2ff",
  "#ffc6ff"
];

let particles = [];
let animId = null;

// ===================== CREATE CONFETTI (FULL SCREEN RAIN) =====================
function createConfetti(count = 160) {
  const w = window.innerWidth;

  for (let i = 0; i < count; i++) {
    const size = rand(6, 12);

    particles.push({
      x: rand(0, w),
      y: rand(-50, 0),
      vx: rand(-1.5, 1.5),
      vy: rand(2.5, 5.5),
      g: rand(0.04, 0.1),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.15, 0.15),
      size,
      color: pick(confettiColors),
      life: rand(120, 200)
    });
  }
}

// ===================== DRAW =====================
function stepConfetti() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  ctx.clearRect(0, 0, w, h);

  particles.forEach(p => {
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 1;

    // wind effect
    p.vx += Math.sin(Date.now() * 0.002 + p.y * 0.01) * 0.05;
    p.vx *= 0.99;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 140));
    ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
    ctx.restore();
  });

  particles = particles.filter(p => p.life > 0 && p.y < h + 50);

  if (particles.length > 0) {
    animId = requestAnimationFrame(stepConfetti);
  } else {
    ctx.clearRect(0, 0, w, h);
    cancelAnimationFrame(animId);
    animId = null;
  }
}

// ===================== BURST =====================
function burstConfetti(duration = 2000) {
  createConfetti(180);
  if (!animId) stepConfetti();

  const t1 = setTimeout(() => createConfetti(120), 400);
  const t2 = setTimeout(() => createConfetti(100), 800);

  setTimeout(() => {
    clearTimeout(t1);
    clearTimeout(t2);
  }, duration);
}

// ===================== START CONFETTI =====================
burstConfetti(2500);
