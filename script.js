const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const slideCurrentText = document.getElementById('slideCurrent');
    const slideTotalText = document.getElementById('slideTotal');
    
    let currentSlide = 0;
    slideTotalText.textContent = slides.length.toString().padStart(2, '0');

    function typeWriter(element, text, speed) {
      let i = 0;
      element.textContent = '';
      element.setAttribute('data-text', '');
      function type() {
        if (i < text.length) {
          const char = text.charAt(i);
          element.textContent += char;
          element.setAttribute('data-text', element.getAttribute('data-text') + char);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    }

    function updateSlides() {
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
      });
      
      const progress = ((currentSlide + 1) / slides.length) * 100;
      progressBar.style.width = `${progress}%`;
      slideCurrentText.textContent = (currentSlide + 1).toString().padStart(2, '0');
      
      // Matrix opacity logic
      const canvas = document.getElementById('matrix-canvas');
      if (currentSlide === slides.length - 1) {
        canvas.style.opacity = '0';
      } else {
        canvas.style.opacity = '0.15';
      }

      // Typing effect for cover slide
      if (currentSlide === 0) {
        setTimeout(() => {
          typeWriter(document.getElementById('main-title'), 'WANNACRY', 150);
        }, 600); // delay to match fade-up
      }

      // Shake effect for ransom screen
      const ransomTitle = document.querySelector('.ransom-title');
      if (currentSlide === 16) { // 17th slide (0-indexed)
        ransomTitle.classList.add('shake');
      } else {
        ransomTitle.classList.remove('shake');
      }
    }

    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlides();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlides();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentSlide < slides.length - 1) {
          currentSlide++;
          updateSlides();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentSlide > 0) {
          currentSlide--;
          updateSlides();
        }
      }
    });

    // Mouse click navigation
    document.addEventListener('click', (e) => {
      if (e.button === 0) { // left click
        if (currentSlide < slides.length - 1) {
          currentSlide++;
          updateSlides();
        }
      }
    });

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (currentSlide > 0) {
        currentSlide--;
        updateSlides();
      }
    });

    // Matrix Background Effect
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    // Particles Effect
    const particlesCanvas = document.getElementById('particles-canvas');
    const pCtx = particlesCanvas.getContext('2d');
    let particles = [];

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 14;

    function createParticle() {
      return {
        x: Math.random() * particlesCanvas.width,
        y: Math.random() * particlesCanvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.5
      };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
      }
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
      const columns = canvas.width / fontSize;
      drops.length = 0;
      drops.push(...Array(Math.floor(columns)).fill(1));
      initParticles();
    }

    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    resize();
    window.addEventListener('resize', resize);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00d4ff';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    function drawParticles() {
      pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > particlesCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particlesCanvas.height) p.vy *= -1;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        pCtx.fill();
      });
    }

    setInterval(drawMatrix, 50);
    setInterval(drawParticles, 50);
    updateSlides();

    // Loading Screen Animation
    setTimeout(() => {
      const title = document.getElementById('loading-title');
      if (title) {
        typeWriter(title, 'INITIALIZING WANNACRY SYSTEMS', 50);
      }
    }, 300);

    setTimeout(() => {
      const progress = document.getElementById('loading-progress');
      if (progress) {
        let width = 0;
        const interval = setInterval(() => {
          width += 2;
          progress.style.width = width + '%';
          if (width >= 100) {
            clearInterval(interval);
          }
        }, 30);
      }
    }, 500);

    // Simple fade out after 4 seconds
    setTimeout(() => {
      const screen = document.getElementById('loading-screen');
      if (screen) {
        screen.style.opacity = '0';
        setTimeout(() => {
          screen.style.display = 'none';
        }, 1000);
      }
    }, 4000);