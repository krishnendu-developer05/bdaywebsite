/* ============================================
   SOUTRIKA — Birthday Website  ·  Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ───── 0. Greeting Overlay ───── */
  const overlay = document.getElementById('greeting-overlay');
  overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
    // Start petals only after overlay is dismissed
    setTimeout(createPetals, 800);
  });

  /* ───── 1. Ambient Petals ───── */
  function createPetals() {
    const container = document.getElementById('petals');
    const petalSVG = `<svg viewBox="0 0 24 24"><path d="M12 2C9 6 4 9 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-5-5-8-8-12z"/></svg>`;
    const count = 18;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.innerHTML = petalSVG;
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (8 + Math.random() * 10) + 's';
      petal.style.animationDelay = (Math.random() * 12) + 's';
      petal.querySelector('svg').style.transform = `rotate(${Math.random()*360}deg)`;
      container.appendChild(petal);
    }
  }

  /* ───── 2. Hero Sparkle Particles ───── */
  const particlesContainer = document.getElementById('hero-particles');
  for (let i = 0; i < 35; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.top  = Math.random() * 100 + '%';
    s.style.animationDuration = (4 + Math.random() * 6) + 's';
    s.style.animationDelay    = (Math.random() * 6) + 's';
    s.style.width = s.style.height = (2 + Math.random() * 3) + 'px';
    particlesContainer.appendChild(s);
  }

  /* ───── 3. Live Counter (since 23 Sep 2023) ───── */
  const startDate = new Date('2023-09-23T00:00:00');

  function updateCounter() {
    const now = new Date();
    let years  = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days   = now.getDate() - startDate.getDate();
    let hours  = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    if (days < 0) {
      months--;
      const prev = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prev.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    document.getElementById('c-years').textContent   = years;
    document.getElementById('c-months').textContent  = months;
    document.getElementById('c-days').textContent     = days;
    document.getElementById('c-hours').textContent    = hours;
    document.getElementById('c-minutes').textContent  = minutes;
    document.getElementById('c-seconds').textContent  = seconds;
  }
  updateCounter();
  setInterval(updateCounter, 1000);

  /* ───── 4. Scroll Reveal ───── */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => io.observe(el));

  /* ───── 5. Gallery Drag & Arrow Scroll ───── */
  const track = document.getElementById('gallery-track');
  const leftBtn  = document.getElementById('gallery-left');
  const rightBtn = document.getElementById('gallery-right');

  leftBtn.addEventListener('click',  () => track.scrollBy({ left: -320, behavior: 'smooth' }));
  rightBtn.addEventListener('click', () => track.scrollBy({ left:  320, behavior: 'smooth' }));

  // drag
  let isDragging = false, startX, scrollLeft;
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', () => isDragging = false);
  track.addEventListener('mouseup',    () => isDragging = false);
  track.addEventListener('mousemove',  (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  /* ───── 6. The Date — Dodging "No" Button ───── */
  const btnNo   = document.getElementById('btn-no');
  const btnYes  = document.getElementById('btn-yes');
  const dateAsk = document.getElementById('date-ask');
  const ticket  = document.getElementById('dinner-ticket');
  const hintEl  = document.getElementById('dodge-hint');

  const hints = [
    "Really? Think again… 😏",
    "Are you sure about that?",
    "I don't think so… try again!",
    "Nope, that button doesn't work 😌",
    "Wrong answer, love ♥",
    "The universe says yes!",
    "Nice try… but no 'No' allowed!",
    "Hmm, let me redirect you… 👉 Yes",
    "That button is broken, sorry!",
    "You already said yes in your heart 😊"
  ];
  let hintIndex = 0;
  let dodgeCount = 0;

  btnNo.addEventListener('mouseover', dodgeButton);
  btnNo.addEventListener('focus', dodgeButton);
  btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); dodgeButton(); });

  function dodgeButton() {
    dodgeCount++;
    const section = document.getElementById('the-date');
    const rect = section.getBoundingClientRect();
    const btnW = btnNo.offsetWidth;
    const btnH = btnNo.offsetHeight;

    // Calculate bounds relative to the section
    const maxX = rect.width - btnW - 40;
    const maxY = rect.height - btnH - 40;

    const randX = 20 + Math.random() * maxX;
    const randY = 20 + Math.random() * maxY;

    btnNo.style.position = 'absolute';
    btnNo.style.left = randX + 'px';
    btnNo.style.top  = randY + 'px';
    btnNo.style.zIndex = '10';

    // Show hint
    hintEl.textContent = hints[hintIndex % hints.length];
    hintEl.classList.add('visible');
    hintIndex++;

    // After many dodges, shrink the button
    if (dodgeCount > 5) {
      const scale = Math.max(0.4, 1 - dodgeCount * 0.08);
      btnNo.style.transform = `scale(${scale})`;
    }
    if (dodgeCount > 10) {
      btnNo.style.opacity = '0.4';
    }
  }

  /* ───── 7. "Yes" — Reveal Ticket + Confetti ───── */
  btnYes.addEventListener('click', () => {
    dateAsk.style.display = 'none';
    ticket.classList.add('show');
    burstConfetti();
  });

  function burstConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#c9a84c', '#e8d5a3', '#f5e6b8', '#6b1d34', '#faf3e8', '#ff6b8a', '#ffd700'];
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.top  = '-10px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      piece.style.animationDelay = (Math.random() * .8) + 's';
      piece.style.transform = `rotate(${Math.random()*360}deg)`;
      piece.style.width  = (6 + Math.random() * 8) + 'px';
      piece.style.height = (10 + Math.random() * 10) + 'px';
      container.appendChild(piece);
    }
    // Clean up after animation
    setTimeout(() => { container.innerHTML = ''; }, 5000);
  }

});
