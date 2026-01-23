// Portfolio specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
  
  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption h3');
  const lightboxDesc = document.querySelector('.lightbox-caption p');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const zoomButtons = document.querySelectorAll('.portfolio-zoom');
  
  let currentImageIndex = 0;
  const portfolioImages = [];
  
  // Collect all portfolio images
  document.querySelectorAll('.portfolio-img img').forEach((img, index) => {
    const portfolioItem = img.closest('.portfolio-item');
    if (portfolioItem) {
      portfolioImages.push({
        src: img.src,
        alt: img.alt,
        title: portfolioItem.querySelector('.portfolio-info h3')?.textContent || 'Projet',
        desc: portfolioItem.querySelector('.portfolio-info p')?.textContent || ''
      });
    }
  });
  
  // Open lightbox
  zoomButtons.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = index;
      openLightbox(currentImageIndex);
    });
  });
  
  // Open lightbox from thumbnail click
  document.querySelectorAll('.portfolio-img').forEach((img, index) => {
    img.addEventListener('click', (e) => {
      if (!e.target.classList.contains('portfolio-zoom') && 
          !e.target.classList.contains('fa-search-plus')) {
        currentImageIndex = index;
        openLightbox(currentImageIndex);
      }
    });
  });
  
  function openLightbox(index) {
    if (portfolioImages.length === 0) return;
    
    const image = portfolioImages[index];
    if (lightboxImage) lightboxImage.src = image.src;
    if (lightboxImage) lightboxImage.alt = image.alt;
    if (lightboxCaption) lightboxCaption.textContent = image.title;
    if (lightboxDesc) lightboxDesc.textContent = image.desc;
    if (lightbox) lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Close lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      if (lightbox) lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }
  
  // Close lightbox on background click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }
  
  // Navigation
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex - 1 + portfolioImages.length) % portfolioImages.length;
      openLightbox(currentImageIndex);
    });
  }
  
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % portfolioImages.length;
      openLightbox(currentImageIndex);
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
      } else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + portfolioImages.length) % portfolioImages.length;
        openLightbox(currentImageIndex);
      } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % portfolioImages.length;
        openLightbox(currentImageIndex);
      }
    }
  });
  
  // Project detail modal
  const projectModal = document.getElementById('projectModal');
  const modalClose = document.querySelector('.modal-close');
  const detailButtons = document.querySelectorAll('.btn-details');
  
  if (detailButtons.length > 0 && projectModal && modalClose) {
    detailButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-project');
        loadProjectDetails(projectId);
        projectModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    });
    
    modalClose.addEventListener('click', () => {
      projectModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    
    // Close modal on background click
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
  
  function loadProjectDetails(projectId) {
    // This would typically fetch data from an API
    // For now, we'll use static content
    const projectData = {
      '1': {
        title: 'Boulangerie "Au Bon Pain"',
        category: 'ERP Catégorie 5',
        date: 'Mars 2024',
        location: 'Montpellier',
        description: 'Dossier complet ERP pour création d\'un commerce alimentaire de 120m². Le projet incluait des plans de sécurité incendie détaillés, des schémas de désenfumage, et une accessibilité PMR complète.',
        challenges: 'Intégration dans un bâtiment ancien avec contraintes architecturales.',
        solutions: 'Modélisation BIM précise permettant de visualiser toutes les installations techniques.',
        images: ['commerce-securite.jpg', 'commerce-plan.jpg'],
        tags: ['Revit', 'Sécurité Incendie', 'PMR', 'Commerce', 'BIM']
      },
      '2': {
        title: 'Villa "Les Pins"',
        category: 'Imagerie 3D',
        date: 'Février 2024',
        location: 'Pérols',
        description: 'Rendu 3D photoréaliste pour un projet de permis de construire. Intégration paysagère et matières réalistes pour une visualisation parfaite du projet final.',
        challenges: 'Reproduction fidèle des matériaux et de l\'éclairage naturel.',
        solutions: 'Utilisation de textures haute définition et de lumières HDRI pour un rendu réaliste.',
        images: ['maison-3d-exterieur.jpg'],
        tags: ['3D Photoréaliste', 'Extérieur', 'Architecture', 'Rendu']
      },
      '3': {
        title: 'Extension avec terrasse couverte',
        category: 'Permis de Construire',
        date: 'Janvier 2024',
        location: 'Lattes',
        description: 'Permis de construire pour extension de 40m² avec terrasse couverte. Plans conformes PLU et validation obtenue en 2 mois seulement.',
        challenges: 'Respect des règles d\'urbanisme strictes en zone résidentielle.',
        solutions: 'Optimisation des volumes pour maximiser l\'espace tout en restant conforme.',
        images: ['extension-plans.jpg'],
        tags: ['Extension', 'Terrasse', 'PLU', 'Permis de construire']
      }
    };
    
    const project = projectData[projectId];
    if (!project) return;
    
    const modalBody = document.querySelector('.modal-body');
    if (!modalBody) return;
    
    modalBody.innerHTML = `
      <div class="project-detail">
        <div class="project-header">
          <span class="project-category">${project.category}</span>
          <h2>${project.title}</h2>
          <div class="project-meta">
            <span><i class="far fa-calendar"></i> ${project.date}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${project.location}</span>
          </div>
        </div>
        
        <div class="project-content">
          <div class="project-description">
            <h3>Description du projet</h3>
            <p>${project.description}</p>
            
            <h3>Défis rencontrés</h3>
            <p>${project.challenges}</p>
            
            <h3>Solutions apportées</h3>
            <p>${project.solutions}</p>
          </div>
          
          <div class="project-gallery">
            <h3>Galerie du projet</h3>
            <div class="gallery-grid">
              ${project.images.map(img => `
                <div class="gallery-item">
                  <img src="assets/img/portfolio/${img}" alt="${project.title}" loading="lazy">
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="project-technologies">
            <h3>Technologies utilisées</h3>
            <div class="tech-tags">
              ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
            </div>
          </div>
          
          <div class="project-cta">
            <a href="contact.html?service=${project.category.toLowerCase().includes('erp') ? 'erp' : project.category.toLowerCase().includes('3d') ? '3d' : 'permis'}" class="btn btn-primary">
              <i class="fas fa-envelope"></i> Discuter d'un projet similaire
            </a>
          </div>
        </div>
      </div>
    `;
    
    // Add some basic styles for the modal content
    const style = document.createElement('style');
    style.textContent = `
      .project-detail {
        padding: 1rem;
      }
      .project-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .project-category {
        display: inline-block;
        background: #2a6e8c;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      .project-header h2 {
        margin: 1rem 0;
        color: #1a202c;
      }
      .project-meta {
        display: flex;
        justify-content: center;
        gap: 2rem;
        color: #718096;
        font-size: 0.9rem;
      }
      .project-content h3 {
        color: #1a202c;
        margin: 2rem 0 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #f0f7fa;
      }
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      .gallery-item img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
      }
      .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 1rem 0;
      }
      .tech-tag {
        background: #f0f7fa;
        color: #2a6e8c;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 500;
      }
      .project-cta {
        text-align: center;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid #f0f7fa;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Portfolio sorting
  const sortSelect = document.querySelector('.sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const sortValue = this.value;
      const items = Array.from(document.querySelectorAll('.portfolio-item'));
      
      items.sort((a, b) => {
        if (sortValue === 'recent') {
          return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
        } else if (sortValue === 'ancien') {
          return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
        } else if (sortValue === 'type') {
          return a.getAttribute('data-category').localeCompare(b.getAttribute('data-category'));
        }
        return 0;
      });
      
      const container = document.getElementById('portfolio-container');
      if (container) {
        items.forEach(item => container.appendChild(item));
      }
    });
  }
  
  // Testimonials slider
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  
  if (testimonialSlides.length > 0) {
    let currentSlide = 0;
    
    function showSlide(n) {
      testimonialSlides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;
      
      testimonialSlides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
      }
    }
    
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
      nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
      
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
      });
      
      // Auto-rotate slides
      setInterval(() => {
        showSlide(currentSlide + 1);
      }, 5000);
    }
  }
  
  // Pagination functionality
  const paginationButtons = document.querySelectorAll('.pagination-btn');
  paginationButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (this.classList.contains('active')) return;
      
      // Remove active class from all buttons
      paginationButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Here you would typically load the page content via AJAX
      // For now, we'll just scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
});