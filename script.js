// Interactive JavaScript for Sarthak Parashar Portfolio

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle Logic
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas font-solid fa-moon"></i>';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas font-solid fa-sun"></i>';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas font-solid fa-sun"></i>';
        showToast('Switched to Dark Mode');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas font-solid fa-moon"></i>';
        showToast('Switched to Light Mode');
      }
    });
  }

  // 2. Typing Effect in Hero Section
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const roles = [
      "MERN Stack Developer",
      "Full Stack Engineer",
      "MCA Scholar @ Parul University",
      "AWS Certified AI Practitioner (98%)",
      "Problem Solver & Tech Enthusiast"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400; // Pause before typing next word
      }

      setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();
  }

  // 3. Navbar Sticky Glass & Scroll Active Navigation Link
  const headerNav = document.getElementById('header-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerNav.classList.add('nav-glass');
    } else {
      headerNav.classList.remove('nav-glass');
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Mobile Navigation Drawer Toggle
  const mobileNavBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');

  if (mobileNavBtn && navLinksContainer) {
    mobileNavBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
      });
    });
  }

  // 5. Project Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'btn-primary');
        b.classList.add('btn-secondary', 'text-gray-300');
      });
      btn.classList.remove('btn-secondary', 'text-gray-300');
      btn.classList.add('btn-primary', 'bg-blue-600', 'text-white');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Project Modal Logic
  const projectData = {
    'branded-shortlink': {
      title: "Branded Short-Link & Bio-Link Hub",
      category: "MERN Stack Full-Stack Application",
      tech: ["React 18", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT", "Recharts"],
      description: "A feature-rich URL shortener and customizable Link-in-Bio management platform designed for content creators and businesses to streamline their web presence and track link performance.",
      features: [
        "Built a full-stack URL shortener supporting random or custom branded aliases with ultra-fast 302 HTTP redirects.",
        "Detailed click analytics (clicks over time, top referrer domains, device type split) visualized using interactive Recharts.",
        "Dual JWT Token Authentication (15-min access token, 7-day refresh token stored in httpOnly cookies) with silent refresh via Axios interceptors.",
        "Security features: Email verification, password reset, rate limiting, and SHA-256 IP hashing for visitor privacy.",
        "Public Link-in-Bio pages (/bio/:username) with avatar uploads, social links editor, three distinct visual themes, and downloadable QR codes."
      ],
      github: "https://github.com/sarthakparashar/branded-shortlink-hub",
      demo: "#"
    },
    'electrohub': {
      title: "ElectroHub – E-Commerce Web Application",
      category: "MERN Stack E-Commerce Platform",
      tech: ["MongoDB", "Express.js", "React.js", "Node.js", "JavaScript", "JWT", "Postman"],
      description: "A robust online marketplace platform built for seamless user shopping, product catalog browsing, dynamic cart management, and order handling.",
      features: [
        "Architected scalable RESTful APIs with Node.js and Express to manage product catalogs, inventory, and users.",
        "Secure user authentication and authorization using JSON Web Tokens (JWT) and bcrypt password encryption.",
        "Modular features: Products catalog with search/filter, Wishlist management, Cart state, Address book, Order tracking, Payment gateway integration blueprint, and Reviews & Ratings system.",
        "Comprehensive API testing via Postman collections and robust source code management using Git/GitHub."
      ],
      github: "https://github.com/sarthakparashar/electrohub-ecommerce",
      demo: "#"
    },
    'aurahabit': {
      title: "AuraHabit – Habit Tracking Web App",
      category: "Frontend Web Application",
      tech: ["React.js", "Vite", "Tailwind CSS", "Context API"],
      description: "A beautiful, productivity-focused habit tracking application featuring modern bento UI aesthetics and gamified streak achievements.",
      features: [
        "Built a responsive habit tracker with a modern bento-style dashboard, habit frequency manager, calendar view, and streak analytics.",
        "Role-based authorization (User / Admin) with custom authentication flow and an administrative management dashboard.",
        "Simulated backend API layer utilizing browser localStorage for seamless offline data persistence.",
        "Designed modular, reusable UI components including animated progress rings, progress bars, achievement badges, modal dialogs, and spotlight cards."
      ],
      github: "https://github.com/sarthakparashar/aurahabit-tracker",
      demo: "#"
    }
  };

  const projectModal = document.getElementById('project-modal');
  const closeModalBtn = document.getElementById('close-modal');

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const data = projectData[projId];
      if (data && projectModal) {
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-category').textContent = data.category;
        document.getElementById('modal-description').textContent = data.description;
        
        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = data.tech.map(t => `<span class="badge badge-blue">${t}</span>`).join(' ');

        const featuresContainer = document.getElementById('modal-features');
        featuresContainer.innerHTML = data.features.map(f => `<li class="flex items-start gap-2 text-gray-300 mb-2"><i class="fas fa-check-circle text-blue-400 mt-1"></i><span>${f}</span></li>`).join('');

        document.getElementById('modal-github').setAttribute('href', data.github);
        document.getElementById('modal-demo').setAttribute('href', data.demo);

        projectModal.classList.add('active');
      }
    });
  });

  if (closeModalBtn && projectModal) {
    closeModalBtn.addEventListener('click', () => {
      projectModal.classList.remove('active');
    });
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('active');
      }
    });
  }

  // 7. Contact Form Handler & Toast Notification
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all fields before sending.', 'error');
        return;
      }

      showToast(`Thank you, ${name}! Your message has been sent successfully.`);
      contactForm.reset();
    });
  }

  // 8. Clipboard Helper
  window.copyToClipboard = function(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied to clipboard!`);
    }).catch(() => {
      showToast(`Failed to copy ${label}`, 'error');
    });
  };

  // Toast Helper Function
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="${type === 'error' ? 'fas fa-exclamation-circle text-red-400' : 'fas fa-check-circle text-blue-400'} text-lg"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
