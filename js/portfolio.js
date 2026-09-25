document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.port-card');

  function setActive(btn) {
    buttons.forEach(b => {
      b.classList.remove('bg-ink', 'text-cream');
      b.classList.add('bg-white', 'border', 'border-ink/15', 'text-ink/70');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.remove('bg-white', 'border', 'border-ink/15', 'text-ink/70');
    btn.classList.add('bg-ink', 'text-cream');
    btn.setAttribute('aria-selected', 'true');
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setActive(btn);
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.term === filter;
        card.classList.toggle('hidden-card', !match);
      });
    });
  });
});
