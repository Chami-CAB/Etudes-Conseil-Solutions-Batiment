// Main JavaScript for DEC BIM website
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== CURRENT YEAR IN FOOTER =====
  const currentYear = document.getElementById('current-year');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
  
  // ===== REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('visible');
      }
    });
  };
  
  // Initial check
  revealOnScroll();
  
  // Check on scroll
  window.addEventListener('scroll', revealOnScroll);
  
  // ===== MOBILE MENU TOGGLE =====
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.replace('fa-bars', 'fa-times');
      } else {
        icon.classList.replace('fa-times', 'fa-bars');
      }
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.replace('fa-times', 'fa-bars');
        }
      });
    });
  }
  
  // ===== FAQ TOGGLE =====
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isActive = question.classList.contains('active');
      
      // Close all other FAQ items
      faqQuestions.forEach(q => {
        q.classList.remove('active');
        const ans = q.nextElementSibling;
        if (ans) {
          ans.classList.remove('active');
          ans.style.maxHeight = null;
        }
      });
      
      // Toggle current item
      if (!isActive) {
        question.classList.add('active');
        if (answer) {
          answer.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });
  
  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ===== FORMSPREE FORM HANDLING =====
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm && !contactForm.classList.contains('multi-step')) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      
      try {
        const formData = new FormData(this);
        const response = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Show success message
          this.innerHTML = `
            <div class="success-message">
              <div class="success-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <h3>Message envoyé avec succès !</h3>
              <p>Je vous répondrai dans les plus brefs délais.</p>
              <a href="/" class="btn btn-primary">Retour à l'accueil</a>
            </div>
          `;
        } else {
          throw new Error('Erreur lors de l\'envoi');
        }
      } catch (error) {
        alert('Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.');
        console.error('Form error:', error);
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
  
  // ===== PORTFOLIO FILTERING =====
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        // Filter items
        portfolioItems.forEach(item => {
          const categories = item.getAttribute('data-category');
          
          if (filterValue === 'all' || categories.includes(filterValue)) {
            item.style.display = 'flex';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
  
  // ===== ACCORDION FUNCTIONALITY =====
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isActive = this.classList.contains('active');
      
      // Close all accordions
      accordionHeaders.forEach(h => {
        h.classList.remove('active');
        const c = h.nextElementSibling;
        if (c) {
          c.classList.remove('active');
          c.style.maxHeight = null;
        }
      });
      
      // Open current accordion if it was closed
      if (!isActive) {
        this.classList.add('active');
        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
  
  // ===== PARALLAX EFFECT FOR HERO =====
  const heroImage = document.querySelector('.hero-img');
  
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      heroImage.style.transform = `perspective(1000px) rotateY(-10deg) translateY(${rate}px)`;
    });
  }
  
  // ===== COUNTER ANIMATION =====
  const stats = document.querySelectorAll('.stat-number');
  
  if (stats.length > 0) {
    const animateCounter = (element, target) => {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
        }
      }, 20);
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumber = entry.target;
          const target = parseInt(statNumber.textContent.replace(/[^0-9]/g, ''));
          
          if (!statNumber.classList.contains('animated')) {
            statNumber.classList.add('animated');
            animateCounter(statNumber, target);
          }
        }
      });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
  }
  
  // ===== LAZY LOADING FOR IMAGES =====
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          lazyLoadObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => lazyLoadObserver.observe(img));
  }
  
  // ===== PRICING TABLE INTERACTIVITY =====
  const planCols = document.querySelectorAll('.plan-col');
  
  planCols.forEach(col => {
    col.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    col.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // ===== SERVICE PAGE TABS =====
  const serviceTabs = document.querySelectorAll('.service-tab');
  
  if (serviceTabs.length > 0) {
    serviceTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const targetId = this.getAttribute('data-tab');
        
        // Update active tab
        serviceTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Show target content
        document.querySelectorAll('.service-tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }
  
  // ===== TESTIMONIALS SLIDER =====
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const sliderDots = document.querySelectorAll('.slider-dots .dot');
  const sliderPrev = document.querySelector('.slider-prev');
  const sliderNext = document.querySelector('.slider-next');
  
  if (testimonialSlides.length > 0) {
    let currentTestimonial = 0;
    
    function showTestimonialSlide(n) {
      testimonialSlides.forEach(slide => slide.classList.remove('active'));
      sliderDots.forEach(dot => dot.classList.remove('active'));
      
      currentTestimonial = (n + testimonialSlides.length) % testimonialSlides.length;
      
      testimonialSlides[currentTestimonial].classList.add('active');
      sliderDots[currentTestimonial].classList.add('active');
    }
    
    if (sliderPrev && sliderNext) {
      sliderPrev.addEventListener('click', () => showTestimonialSlide(currentTestimonial - 1));
      sliderNext.addEventListener('click', () => showTestimonialSlide(currentTestimonial + 1));
      
      sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonialSlide(index));
      });
      
      // Auto-rotate testimonials
      setInterval(() => {
        showTestimonialSlide(currentTestimonial + 1);
      }, 5000);
    }
  }
  
  // ===== FORM VALIDATION HELPERS =====
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePhone = (phone) => {
    const re = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return re.test(phone.replace(/\s/g, ''));
  };
  
  // ===== BACK TO TOP BUTTON =====
  const backToTopButton = document.createElement('button');
  backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
  backToTopButton.className = 'back-to-top';
  backToTopButton.setAttribute('aria-label', 'Retour en haut');
  document.body.appendChild(backToTopButton);
  
  backToTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #2a6e8c;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(42, 110, 140, 0.3);
    z-index: 1000;
    transition: all 0.3s ease;
  `;
  
  backToTopButton.addEventListener('mouseenter', () => {
    backToTopButton.style.transform = 'translateY(-3px)';
    backToTopButton.style.boxShadow = '0 6px 16px rgba(42, 110, 140, 0.4)';
  });
  
  backToTopButton.addEventListener('mouseleave', () => {
    backToTopButton.style.transform = 'translateY(0)';
    backToTopButton.style.boxShadow = '0 4px 12px rgba(42, 110, 140, 0.3)';
  });
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.style.display = 'flex';
    } else {
      backToTopButton.style.display = 'none';
    }
  });
  
  // ===== COOKIE CONSENT =====
  if (!localStorage.getItem('cookiesAccepted')) {
    const cookieConsent = document.createElement('div');
    cookieConsent.className = 'cookie-consent';
    cookieConsent.innerHTML = `
      <div class="cookie-content">
        <p>🍪 Ce site utilise des cookies pour améliorer votre expérience. En continuant, vous acceptez notre utilisation des cookies.</p>
        <div class="cookie-buttons">
          <button class="btn btn-primary btn-sm accept-cookies">Accepter</button>
          <button class="btn btn-secondary btn-sm reject-cookies">Refuser</button>
        </div>
      </div>
    `;
    document.body.appendChild(cookieConsent);
    
    cookieConsent.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #1a202c;
      color: white;
      padding: 1.5rem;
      z-index: 9999;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    `;
    
    const cookieContent = cookieConsent.querySelector('.cookie-content');
    cookieContent.style.cssText = `
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    `;
    
    const acceptBtn = cookieConsent.querySelector('.accept-cookies');
    const rejectBtn = cookieConsent.querySelector('.reject-cookies');
    
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieConsent.style.display = 'none';
      // Initialize analytics here if needed
    });
    
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'false');
      cookieConsent.style.display = 'none';
    });
  }
  
  // ===== LOADING ANIMATION =====
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });
});