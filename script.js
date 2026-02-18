const LYRICS = [
  { t: 0, text: "Строка 1..." },
  { t: 5, text: "Строка 2..." },
  { t: 10, text: "Строка 3..." },
  { t: 15, text: "Строка 4..." },
  { t: 20, text: "Припев..." }
];

const player = document.getElementById("player");
const lyricsBox = document.getElementById("lyricsBox");
const timeInfo = document.getElementById("timeInfo");
const restartBtn = document.getElementById("restartBtn");

function formatTime(sec) {
  sec = Math.floor(sec);
  let m = String(Math.floor(sec / 60)).padStart(2, "0");
  let s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function getCurrentLineIndex(time) {
  for (let i = LYRICS.length - 1; i >= 0; i--) {
    if (time >= LYRICS[i].t) {
      return i;
    }
  }
  return 0;
}

function render() {
  const currentTime = player.currentTime;
  timeInfo.textContent = formatTime(currentTime);

  const index = getCurrentLineIndex(currentTime);

  lyricsBox.innerHTML = "";

  for (let i = index - 1; i <= index + 2; i++) {
    if (i >= 0 && i < LYRICS.length) {
      const div = document.createElement("div");
      div.className = "line";
      if (i === index) div.classList.add("active");

      div.textContent = LYRICS[i].text;
      lyricsBox.appendChild(div);
    }
  }
}

player.addEventListener("timeupdate", render);
player.addEventListener("seeked", render);

restartBtn.addEventListener("click", () => {
  player.currentTime = 0;
  player.play();
});
