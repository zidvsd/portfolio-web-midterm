document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const confirmBox = document.getElementById('confirmBox');
  const confirmList = document.getElementById('confirmList');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subjectSelect = document.getElementById('subject');
    const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      form.reportValidity();
      return;
    }

    confirmList.innerHTML = '';
    const entries = [
      ['Name', name],
      ['Email', email],
      ['Subject', subjectText],
      ['Message', message]
    ];

    entries.forEach(([label, value]) => {
      const dt = document.createElement('dt');
      dt.className = 'font-mono text-xs text-ink/60 self-baseline';
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.className = 'text-sm text-ink/90';
      dd.textContent = value;
      confirmList.appendChild(dt);
      confirmList.appendChild(dd);
    });

    confirmBox.classList.remove('hidden');
    confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.reset();
  });
});
