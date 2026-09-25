const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const portfolioImages = Array.from(document.querySelectorAll(".port-card img"));

let currentIndex = 0;
let scale = 1;
let translateX = 0;
let translateY = 0;

function updateTransform() {
  lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function resetZoom() {
  scale = 1;
  translateX = 0;
  translateY = 0;
  updateTransform();
}

function openLightbox(index) {
  currentIndex = index;

  const image = portfolioImages[currentIndex];

  lightboxImg.src = image.src;
  lightboxImg.alt = image.alt;
  lightboxCaption.textContent = image.alt;

  resetZoom();

  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  resetZoom();
}

function showPrevious() {
  currentIndex =
    (currentIndex - 1 + portfolioImages.length) % portfolioImages.length;

  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % portfolioImages.length;

  openLightbox(currentIndex);
}

// Open image
portfolioImages.forEach((image, index) => {
  image.addEventListener("click", () => {
    openLightbox(index);
  });
});

// Controls
lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPrevious);
lightboxNext.addEventListener("click", showNext);

// Click backdrop to close
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard controls
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showPrevious();
  }

  if (event.key === "ArrowRight") {
    showNext();
  }
});

// Mouse wheel zoom
lightboxImg.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    scale += event.deltaY < 0 ? 0.15 : -0.15;
    scale = Math.min(Math.max(scale, 1), 4);

    updateTransform();
  },
  { passive: false },
);

// Double-click zoom
lightboxImg.addEventListener("dblclick", () => {
  scale = scale === 1 ? 2 : 1;

  if (scale === 1) {
    translateX = 0;
    translateY = 0;
  }

  updateTransform();
});
