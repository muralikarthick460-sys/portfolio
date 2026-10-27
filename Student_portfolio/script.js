/**
 * ==========================================================================
 * MURALI KARTHICK K - PORTFOLIO INTERACTIVITY (JS)
 * Pure Vanilla JavaScript
 * Features: Background Particles, Theme Switcher, 3D Card Tilt,
 * Courier Tracking Simulator, Gmail Hub & Toggle, Dynamic Typewriter
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. DYNAMIC YEAR
  // ------------------------------------------------------------------------
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------------------------------
  // 2. THEME ACCENT COLOR SWITCHER (Unique Aspects & Colors)
  // ------------------------------------------------------------------------
  const themeBtns = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('mk_portfolio_theme') || 'cyan';

  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('mk_portfolio_theme', themeName);

    themeBtns.forEach(btn => {
      if (btn.getAttribute('data-color') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Re-draw particle canvas colors to match new theme
    if (typeof updateParticleThemeColor === 'function') {
      updateParticleThemeColor(themeName);
    }
  }

  // Initialize saved theme
  applyTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedColor = btn.getAttribute('data-color');
      applyTheme(selectedColor);
      showToast(`Switched theme to ${selectedColor.toUpperCase()} mode!`);
    });
  });


  // ------------------------------------------------------------------------
  // 4. INTERACTIVE BACKGROUND CONSTELLATION CANVAS
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('bgCanvas');
  let ctx = canvas ? canvas.getContext('2d') : null;
  let particlesArray = [];
  let particleColor = 'rgba(0, 242, 254, ';

  function getThemeRgb(theme) {
    switch (theme) {
      case 'violet': return 'rgba(168, 85, 247, ';
      case 'emerald': return 'rgba(16, 185, 129, ';
      case 'amber': return 'rgba(245, 158, 11, ';
      case 'cyan':
      default: return 'rgba(0, 242, 254, ';
    }
  }

  window.updateParticleThemeColor = function(theme) {
    particleColor = getThemeRgb(theme);
  };
  updateParticleThemeColor(savedTheme);

  if (canvas && ctx) {
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
      }

      draw() {
        ctx.fillStyle = particleColor + '0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 75);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            const opacity = (1 - distance / 110) * 0.18;
            ctx.strokeStyle = particleColor + opacity + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ------------------------------------------------------------------------
  // 5. DYNAMIC TYPEWRITER EFFECT
  // ------------------------------------------------------------------------
  const typewriterText = document.getElementById('typewriterText');
  if (typewriterText) {
    const words = [
      '2nd Year Student at KGCAS',
      'Software & Web Developer',
      'Tech Explorer from Tenkasi, India',
      'Problem Solver & Creator',
      'Courier Tracking System Builder'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeLoop() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typewriterText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typewriterText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 400; // Pause before typing new word
      }

      setTimeout(typeLoop, typingSpeed);
    }
    typeLoop();
  }

  // ------------------------------------------------------------------------
  // 6. NAVBAR SCROLL EFFECT & ACTIVE SECTION HIGHLIGHT
  // ------------------------------------------------------------------------
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    if (currentSection) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }

    // Back to top button visibility
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  // ------------------------------------------------------------------------
  // 7. MOBILE NAVIGATION DRAWER
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer && drawerClose) {
    function openDrawer() {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);

    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // ------------------------------------------------------------------------
  // 8. 3D TILT EFFECT ON PHOTO & PROJECT CARDS
  // ------------------------------------------------------------------------
  const tiltCard = document.getElementById('photoTiltCard');
  if (tiltCard && window.matchMedia('(hover: hover)').matches) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // ------------------------------------------------------------------------
  // 9. COURIER PARCEL TRACKING STATUS SYSTEM - INTERACTIVE SIMULATOR
  // ------------------------------------------------------------------------
  const trackingInput = document.getElementById('trackingInput');
  const trackSubmitBtn = document.getElementById('trackSubmitBtn');
  const samplePills = document.querySelectorAll('.sample-pill');
  const testSimulatorBtn = document.getElementById('testSimulatorBtn');

  // Simulator Display Elements
  const simStatusHeading = document.getElementById('simStatusHeading');
  const simSubInfo = document.getElementById('simSubInfo');
  const simStatusChip = document.getElementById('simStatusChip');
  const simProgressBar = document.getElementById('simProgressBar');
  const simLogs = document.getElementById('simLogs');

  // Timeline Step Elements
  const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4'),
    document.getElementById('step5')
  ];

  // Simulated Database of Tracking Records
  const parcelDatabase = {
    'TRK-9842-TEN': {
      statusHeading: 'In Transit • Tenkasi Hub',
      subInfo: 'Destination: Coimbatore, TN | ETA: Tomorrow, 2:00 PM',
      chipText: 'In Transit',
      chipClass: 'chip-transit',
      progress: '65%',
      activeStep: 3, // 1-based index
      logs: [
        { time: 'Today, 10:45 AM', msg: 'Departed Sorting Facility • Tenkasi Logistics Hub' },
        { time: 'Yesterday, 06:12 PM', msg: 'Processed & Scanned at KGCAS Collection Point' }
      ]
    },
    'TRK-5120-KGC': {
      statusHeading: 'Out for Delivery • KG Campus Station',
      subInfo: 'Delivery Agent: S. Ramesh (+91-9840XXXXXX) | ETA: 45 Mins',
      chipText: 'Out for Delivery',
      chipClass: 'chip-transit',
      progress: '85%',
      activeStep: 4,
      logs: [
        { time: 'Today, 08:30 AM', msg: 'Loaded onto Delivery Van for Final Delivery' },
        { time: 'Today, 06:15 AM', msg: 'Arrived at Destination Distribution Hub (Saravanampatti)' }
      ]
    },
    'TRK-3041-DEL': {
      statusHeading: 'Delivered • Recipient Signed',
      subInfo: 'Delivered at Tenkasi, TN | Signed by: Murali Karthick',
      chipText: 'Delivered',
      chipClass: 'chip-delivered',
      progress: '100%',
      activeStep: 5,
      logs: [
        { time: 'Yesterday, 04:30 PM', msg: 'Shipment Successfully Delivered to Consignee' },
        { time: 'Yesterday, 11:20 AM', msg: 'Out for Delivery from Tenkasi Town Branch' }
      ]
    }
  };

  function updateSimulator(trackingId) {
    const cleanId = trackingId.trim().toUpperCase();
    if (!cleanId) {
      showToast('Please enter a tracking number!');
      return;
    }

    let data = parcelDatabase[cleanId];

    // Fallback dynamic generator for any custom user input!
    if (!data) {
      data = {
        statusHeading: `In Transit • Route Hub (${cleanId})`,
        subInfo: 'Destination: Tenkasi, Tamil Nadu | Live Dispatch Status Active',
        chipText: 'In Transit',
        chipClass: 'chip-transit',
        progress: '55%',
        activeStep: 3,
        logs: [
          { time: 'Just Now', msg: `Tracking record verified for shipment ${cleanId}` },
          { time: 'Today, 09:00 AM', msg: 'Dispatched from Central Logistics Sorting Centre' }
        ]
      };
    }

    // Apply simulation updates with animated transitions
    if (simStatusHeading) simStatusHeading.textContent = data.statusHeading;
    if (simSubInfo) simSubInfo.textContent = data.subInfo;
    
    if (simStatusChip) {
      simStatusChip.textContent = data.chipText;
      simStatusChip.className = `sim-status-chip ${data.chipClass}`;
    }

    if (simProgressBar) {
      simProgressBar.style.width = '0%';
      setTimeout(() => {
        simProgressBar.style.width = data.progress;
      }, 100);
    }

    // Update 5-stage timeline visual indicators
    steps.forEach((stepEl, idx) => {
      if (!stepEl) return;
      stepEl.className = 'timeline-step';
      const stepNum = idx + 1;

      if (stepNum < data.activeStep) {
        stepEl.classList.add('completed');
      } else if (stepNum === data.activeStep) {
        if (data.activeStep === 5) {
          stepEl.classList.add('completed');
        } else {
          stepEl.classList.add('active');
        }
      }
    });

    // Populate milestone log entries
    if (simLogs) {
      simLogs.innerHTML = data.logs.map(log => `
        <div class="log-entry">
          <span class="log-time">${log.time}</span>
          <span class="log-msg">${log.msg}</span>
        </div>
      `).join('');
    }

    showToast(`Tracking status updated for ${cleanId}`);
  }

  if (trackSubmitBtn && trackingInput) {
    trackSubmitBtn.addEventListener('click', () => {
      updateSimulator(trackingInput.value);
    });

    trackingInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        updateSimulator(trackingInput.value);
      }
    });
  }

  samplePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const code = pill.getAttribute('data-code');
      if (trackingInput) trackingInput.value = code;
      updateSimulator(code);
    });
  });

  if (testSimulatorBtn) {
    testSimulatorBtn.addEventListener('click', () => {
      const simCol = document.querySelector('.project-simulator-col');
      if (simCol) {
        simCol.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (trackingInput) {
          setTimeout(() => trackingInput.focus(), 600);
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 10. GMAIL TOGGLE & INTERACTIVE CONTACT HUB
  // ------------------------------------------------------------------------
  const btnModeQuick = document.getElementById('btnModeQuick');
  const btnModeCompose = document.getElementById('btnModeCompose');
  const quickAccessView = document.getElementById('quickAccessView');
  const composeMailView = document.getElementById('composeMailView');
  const cancelComposeBtn = document.getElementById('cancelComposeBtn');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const targetEmailEl = document.getElementById('targetEmail');
  const quickGmailBtn = document.getElementById('quickGmailBtn');

  function switchContactMode(mode) {
    if (mode === 'compose') {
      btnModeQuick.classList.remove('active');
      btnModeCompose.classList.add('active');
      quickAccessView.classList.remove('active');
      composeMailView.classList.add('active');
    } else {
      btnModeCompose.classList.remove('active');
      btnModeQuick.classList.add('active');
      composeMailView.classList.remove('active');
      quickAccessView.classList.add('active');
    }
  }

  if (btnModeQuick && btnModeCompose) {
    btnModeQuick.addEventListener('click', () => switchContactMode('quick'));
    btnModeCompose.addEventListener('click', () => switchContactMode('compose'));
  }

  if (cancelComposeBtn) {
    cancelComposeBtn.addEventListener('click', () => switchContactMode('quick'));
  }

  // Copy Email to Clipboard Functionality
  if (copyEmailBtn && targetEmailEl) {
    copyEmailBtn.addEventListener('click', () => {
      const email = targetEmailEl.textContent.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          triggerCopySuccess();
        }).catch(() => {
          fallbackCopy(email);
        });
      } else {
        fallbackCopy(email);
      }
    });
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      triggerCopySuccess();
    } catch (err) {
      showToast('Could not copy automatically. Email: ' + text);
    }
    document.body.removeChild(textArea);
  }

  function triggerCopySuccess() {
    const copyBtnText = document.getElementById('copyBtnText');
    if (copyBtnText) copyBtnText.textContent = 'Copied!';
    showToast('Copied muralikarthick460@gmail.com to clipboard!');

    setTimeout(() => {
      if (copyBtnText) copyBtnText.textContent = 'Copy';
    }, 2500);
  }

  // Quick Gmail button on hero connects to Gmail toggle in contact
  if (quickGmailBtn) {
    quickGmailBtn.addEventListener('click', () => {
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Contact Form Submission (Launches Gmail Web / Mail Client with Pre-filled Content)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('senderName').value.trim();
      const senderEmail = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('emailSubject').value.trim();
      const message = document.getElementById('emailMessage').value.trim();

      const bodyText = `Hi Murali,\n\n${message}\n\nFrom: ${senderName} (${senderEmail})`;
      const encodedSubject = encodeURIComponent(subject || 'Portfolio Inquiry');
      const encodedBody = encodeURIComponent(bodyText);

      // Preferred Gmail Web direct link
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=muralikarthick460@gmail.com&su=${encodedSubject}&body=${encodedBody}`;

      showToast('Opening Gmail with your message draft...');
      window.open(gmailUrl, '_blank');

      // Reset form
      contactForm.reset();
      switchContactMode('quick');
    });
  }

  // ------------------------------------------------------------------------
  // 11. TOAST NOTIFICATION UTILITY
  // ------------------------------------------------------------------------
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 3200);
  }

  // ------------------------------------------------------------------------
  // 12. BACK TO TOP BUTTON
  // ------------------------------------------------------------------------
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ------------------------------------------------------------------------
  // 13. INTERSECTION OBSERVER SCROLL REVEAL ANIMATIONS
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-left, .reveal-right, .reveal-up');

  function revealElement(el) {
    el.classList.remove('reveal-hidden');
    el.classList.add('revealed');
  }

  function checkReveal() {
    const triggerBottom = window.innerHeight * 0.95;
    revealElements.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        revealElement(el);
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 80px 0px'
    });

    revealElements.forEach(el => {
      // Only hide if element is positioned below the initial viewport fold
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('reveal-hidden');
      } else {
        revealElement(el);
      }
      revealObserver.observe(el);
    });
  } else {
    window.addEventListener('scroll', checkReveal);
    checkReveal();
  }

  // Reveal targets immediately when clicking any navigation link
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function() {
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.querySelectorAll('.reveal-fade, .reveal-left, .reveal-right, .reveal-up').forEach(el => {
          revealElement(el);
        });
      }
    });
  });

  window.addEventListener('scroll', checkReveal);

});
