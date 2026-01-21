const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
const loader = document.getElementById("loader");
const overlayText = document.querySelector(".overlay-text");

// CONFIG
const frameCount = 120;
const framePath = i =>
  `frames1/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

const images = [];
let imagesLoaded = 0;
let currentFrame = 0;

let canvasWidth, canvasHeight;

// ✅ Proper DPR resize
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // RESET + scale
  render();
}

window.addEventListener("resize", resizeCanvas);

// Preload images
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = framePath(i);
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === frameCount) {
      loader.style.display = "none";
      resizeCanvas();
    }
  };
  images.push(img);
}

// ✅ Correct aspect-ratio drawing
function drawImageCover(img) {
  if (!img) return;

  const canvasRatio = canvasWidth / canvasHeight;
  const imageRatio = img.width / img.height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imageRatio > canvasRatio) {
    drawHeight = canvasHeight;
    drawWidth = img.width * (canvasHeight / img.height);
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = canvasWidth;
    drawHeight = img.height * (canvasWidth / img.width);
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// Render frame
function render() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const frameIndex = Math.round(currentFrame); // ✅ FIX
  drawImageCover(images[frameIndex]);
}

// Scroll animation
function updateFrame() {
  const scrollTop = window.scrollY;
  const maxScroll =
    document.body.scrollHeight - window.innerHeight;

  const scrollFraction = Math.min(
    Math.max(scrollTop / maxScroll, 0),
    1
  );

  const targetFrame = scrollFraction * (frameCount - 1);

  // Smooth scrub
  currentFrame += (targetFrame - currentFrame) * 0.12;

  // Optional text fade
  if (overlayText) {
    overlayText.style.opacity =
      scrollFraction > 0.05 && scrollFraction < 0.3 ? 1 : 0;
  }

  render();
  requestAnimationFrame(updateFrame);
}

updateFrame();
