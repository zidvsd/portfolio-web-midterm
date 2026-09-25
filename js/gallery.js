document.addEventListener('DOMContentLoaded', () => {

  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const images = slides.map(s => {
    const img = s.querySelector('img');
    return { src: img.src, alt: img.alt, caption: img.dataset.caption };
  });

  /* ---------- Carousel ---------- */
  let current = 0;
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.className = 'w-2 h-2 rounded-full transition ' + (i === 0 ? 'bg-violet scale-125' : 'bg-ink/20');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('button').forEach((d, i) => {
      d.className = 'w-2 h-2 rounded-full transition ' + (i === current ? 'bg-violet scale-125' : 'bg-ink/20');
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  slides.forEach((slide, i) => {
    slide.querySelector('img').addEventListener('click', () => openLightbox(i));
  });

  let startX = null;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (startX === null) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) diff > 0 ? goTo(current - 1) : goTo(current + 1);
    startX = null;
  }, { passive: true });

  /* ---------- Thumbnail grid ---------- */
  document.querySelectorAll('.thumb-btn').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(parseInt(btn.dataset.index, 10)));
  });

  /* ---------- Lightbox with zoom & pan ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');

  let lbIndex = 0;
  let scale = 1, panX = 0, panY = 0;
  let isDragging = false, dragStartX = 0, dragStartY = 0;

  function openLightbox(index) {
    lbIndex = index;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function renderLightbox() {
    const data = images[lbIndex];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = data.caption;
    resetZoom();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function resetZoom() {
    scale = 1; panX = 0; panY = 0;
    applyTransform();
  }

  function applyTransform() {
    lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  lbPrev.addEventListener('click', () => { lbIndex = (lbIndex - 1 + images.length) % images.length; renderLightbox(); });
  lbNext.addEventListener('click', () => { lbIndex = (lbIndex + 1) % images.length; renderLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev.click();
    if (e.key === 'ArrowRight') lbNext.click();
  });

  lightboxImg.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    scale = Math.min(4, Math.max(1, scale + delta));
    if (scale === 1) { panX = 0; panY = 0; }
    applyTransform();
  }, { passive: false });

  lightboxImg.addEventListener('dblclick', () => {
    scale = scale > 1 ? 1 : 2.2;
    if (scale === 1) { panX = 0; panY = 0; }
    applyTransform();
  });

  lightboxImg.addEventListener('mousedown', e => {
    if (scale === 1) return;
    isDragging = true;
    dragStartX = e.clientX - panX;
    dragStartY = e.clientY - panY;
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    panX = e.clientX - dragStartX;
    panY = e.clientY - dragStartY;
    applyTransform();
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  let pinchStartDist = null;
  let pinchStartScale = 1;
  lightboxImg.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      pinchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartScale = scale;
    }
  });
  lightboxImg.addEventListener('touchmove', e => {
    if (e.touches.length === 2 && pinchStartDist) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      scale = Math.min(4, Math.max(1, pinchStartScale * (dist / pinchStartDist)));
      applyTransform();
    }
  }, { passive: false });
  lightboxImg.addEventListener('touchend', () => { pinchStartDist = null; });

});
