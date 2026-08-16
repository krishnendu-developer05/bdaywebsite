/* ============================================
   SOUTRIKA — Birthday Website  ·  Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ───── 0. Greeting Overlay ───── */
  const overlay = document.getElementById('greeting-overlay');
  overlay.addEventListener('click', () => {
    burstGreetingHeart();
    overlay.classList.add('hidden');
    // Start petals only after overlay is dismissed
    setTimeout(createPetals, 800);
  });

  // Scatter a burst of hearts from the greeting heart on tap
  function burstGreetingHeart() {
    const heart = document.querySelector('.greeting-heart');
    const r = heart.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    heart.classList.add('burst');
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('span');
      p.className = 'heart-burst';
      p.textContent = '🤍';
      const ang = (i / 14) * Math.PI * 2 + Math.random() * .5;
      const dist = 60 + Math.random() * 110;
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
      p.style.fontSize = (12 + Math.random() * 14) + 'px';
      overlay.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  }

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

  /* ───── 3. Scroll Reveal ───── */
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

  /* ───── 4. Envelope Interaction & Heart Burst ───── */
  const envelope = document.getElementById('love-envelope');
  const drawer = document.getElementById('letter-drawer');

  if (envelope && drawer) {
    envelope.addEventListener('click', () => {
      // 1. Trigger the heart burst centered on the envelope
      burstEnvelopeHearts(envelope);
      
      // 2. Animate the envelope flap and fade
      envelope.classList.add('open');
      
      // 3. Open the letter drawer after a small delay
      setTimeout(() => {
        drawer.classList.add('open');
      }, 300);
    });
  }

  function burstEnvelopeHearts(el) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const hearts = ['❤️', '💖', '💝', '🤍', '✨', '💕', '💛'];
    const count = 24; // Generous burst of hearts
    
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'heart-burst';
      p.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      
      // Angle spread around the circle
      const ang = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 70 + Math.random() * 140;
      
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
      p.style.fontSize = (14 + Math.random() * 16) + 'px';
      
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  }

  /* ───── 5. Gallery Drag & Arrow Scroll ───── */
  const track = document.getElementById('gallery-track');
  const leftBtn  = document.getElementById('gallery-left');
  const rightBtn = document.getElementById('gallery-right');

  // drag
  let isDragging = false, startX, scrollLeft;
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    pauseAutoScroll();
  });
  track.addEventListener('mouseleave', () => {
    isDragging = false;
    resumeAutoScroll();
  });
  track.addEventListener('mouseup',    () => {
    isDragging = false;
    resumeAutoScroll();
  });
  track.addEventListener('mousemove',  (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  // Auto-scroll logic (gentle speed with float subpixel precision)
  let scrollPos = track.scrollLeft;
  let autoScrollSpeed = 0.5; // gentle, steady float increment
  let autoScrollReq;
  let isHoveringGallery = false;
  let resumeTimeout;

  const startAutoScroll = () => {
    if (!isHoveringGallery && !isDragging) {
      scrollPos += autoScrollSpeed;
      track.scrollLeft = scrollPos;
      
      const maxScroll = track.scrollWidth - track.clientWidth;
      
      // Ping-pong scrolling: reverse direction when hitting ends
      if (scrollPos >= maxScroll - 1) {
         autoScrollSpeed = -0.5; // Scroll left
         scrollPos = maxScroll - 1;
      } else if (scrollPos <= 0) {
         autoScrollSpeed = 0.5;  // Scroll right
         scrollPos = 0;
      }
    } else {
      // Sync float position when user interacts (mouse wheel, drag, or button click)
      scrollPos = track.scrollLeft;
    }
    autoScrollReq = requestAnimationFrame(startAutoScroll);
  };

  // Start auto-scroll
  autoScrollReq = requestAnimationFrame(startAutoScroll);

  const pauseAutoScroll = () => {
    isHoveringGallery = true;
    track.classList.add('snapping');
    if (resumeTimeout) clearTimeout(resumeTimeout);
  };

  const resumeAutoScroll = () => {
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      track.classList.remove('snapping');
      isHoveringGallery = false;
      isDragging = false;
      scrollPos = track.scrollLeft; // sync position
    }, 1500); // Resume smooth glide 1.5s after interaction ends
  };

  // Pause on hover or touch
  track.addEventListener('mouseenter', pauseAutoScroll);
  track.addEventListener('touchstart', pauseAutoScroll, {passive: true});
  track.addEventListener('touchend', resumeAutoScroll, {passive: true});

  // Arrow button click listeners with snapping
  leftBtn.addEventListener('click', () => {
    pauseAutoScroll();
    track.scrollBy({ left: -320, behavior: 'smooth' });
    resumeAutoScroll();
  });
  rightBtn.addEventListener('click', () => {
    pauseAutoScroll();
    track.scrollBy({ left:  320, behavior: 'smooth' });
    resumeAutoScroll();
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
    const btnW = btnNo.offsetWidth;
    const btnH = btnNo.offsetHeight;

    // The .reveal transform on #date-ask makes it the containing block for
    // `fixed`; once revealed it's identity (translateY(0)), so drop it with no
    // visual change and position against the real viewport, clamped on-screen.
    // Kill the transition too, else the transform animates over .8s and stays a
    // containing block for the whole flight, flinging the button off-screen.
    const ask = document.getElementById('date-ask');
    ask.style.transition = 'none';
    ask.style.transform = 'none';
    const maxX = Math.max(10, window.innerWidth  - btnW - 20);
    const maxY = Math.max(10, window.innerHeight - btnH - 20);

    btnNo.style.position = 'fixed';
    btnNo.style.left = (20 + Math.random() * maxX) + 'px';
    btnNo.style.top  = (20 + Math.random() * maxY) + 'px';
    btnNo.style.zIndex = '100';

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
