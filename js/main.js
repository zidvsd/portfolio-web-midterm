document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const mobileLinks = document.getElementById('navLinksMobile');

  if (toggle && mobileLinks) {
    toggle.addEventListener('click', () => {
      const isHidden = mobileLinks.classList.contains('hidden');
      mobileLinks.classList.toggle('hidden');
      mobileLinks.classList.toggle('flex');
      toggle.setAttribute('aria-expanded', String(isHidden));
    });

    mobileLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileLinks.classList.add('hidden');
        mobileLinks.classList.remove('flex');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('.reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 80 * i);
  });
});
