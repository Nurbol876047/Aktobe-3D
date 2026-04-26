const stage = document.querySelector("[data-gallery]");
const progressFill = document.getElementById("nature-progress-fill");
const currentNumber = document.getElementById("nature-current");
const statusText = document.getElementById("gesture-status");
const cursor = document.querySelector(".gesture-cursor");
const video = document.getElementById("gesture-video");
const cards = Array.from(document.querySelectorAll(".nature-card"));

let targetScroll = 0;
let lastHandX = null;
let currentIndex = 0;
let isProgrammaticScroll = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function maxScroll() {
  return Math.max(0, stage.scrollWidth - stage.clientWidth);
}

function updateProgress() {
  const max = maxScroll();
  const ratio = max > 0 ? stage.scrollLeft / max : 0;
  const nextIndex = Math.round(ratio * (cards.length - 1));

  if (nextIndex !== currentIndex) {
    currentIndex = nextIndex;
    currentNumber.textContent = String(currentIndex + 1).padStart(2, "0");
  }

  progressFill.style.width = `${((currentIndex + 1) / cards.length) * 100}%`;
}

function animateGallery() {
  targetScroll = clamp(targetScroll, 0, maxScroll());
  isProgrammaticScroll = true;
  stage.scrollLeft += (targetScroll - stage.scrollLeft) * 0.16;
  requestAnimationFrame(() => {
    isProgrammaticScroll = false;
  });
  updateProgress();
  requestAnimationFrame(animateGallery);
}

function moveGallery(handX) {
  if (lastHandX !== null) {
    const delta = handX - lastHandX;
    const deadZone = 0.006;

    if (Math.abs(delta) > deadZone) {
      targetScroll += -delta * stage.clientWidth * 2.7;
    }
  }

  lastHandX = handX;
}

function showCursor(point) {
  cursor.style.left = `${point.x * 100}%`;
  cursor.style.top = `${point.y * 100}%`;
  cursor.classList.add("is-visible");
}

function hideCursor() {
  lastHandX = null;
  cursor.classList.remove("is-visible");
}

function onHandsResults(results) {
  const hand = results.multiHandLandmarks && results.multiHandLandmarks[0];

  if (!hand) {
    hideCursor();
    statusText.textContent = "Камера";
    return;
  }

  const palm = hand[9];
  moveGallery(palm.x);
  showCursor({ x: palm.x, y: palm.y });
  statusText.textContent = "MediaPipe";
}

async function startGestureCamera() {
  if (!window.Hands || !window.Camera) {
    statusText.textContent = "MediaPipe қолжетімсіз";
    return;
  }

  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.62,
    minTrackingConfidence: 0.62,
    selfieMode: true,
  });

  hands.onResults(onHandsResults);

  const camera = new Camera(video, {
    width: 640,
    height: 480,
    onFrame: async () => {
      await hands.send({ image: video });
    },
  });

  try {
    await camera.start();
    statusText.textContent = "MediaPipe";
  } catch (error) {
    console.error("Camera start failed", error);
    statusText.textContent = "Камера қолжетімсіз";
  }
}

window.addEventListener("resize", () => {
  targetScroll = clamp(stage.scrollLeft, 0, maxScroll());
  updateProgress();
});

stage.addEventListener(
  "scroll",
  () => {
    if (isProgrammaticScroll) return;

    targetScroll = stage.scrollLeft;
    updateProgress();
  },
  { passive: true }
);

stage.addEventListener(
  "wheel",
  (event) => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

    if (!delta) return;

    targetScroll += delta;
    event.preventDefault();
  },
  { passive: false }
);

animateGallery();

if (window.matchMedia("(min-width: 861px)").matches) {
  startGestureCamera();
} else {
  statusText.textContent = "Свайп";
}
