// Contact form specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
  
  // Multi-step form navigation
  const nextButtons = document.querySelectorAll('.btn-next');
  const prevButtons = document.querySelectorAll('.btn-prev');
  const steps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressFill = document.querySelector('.progress-fill');
  
  let currentStep = 1;
  
  // Initialize form
  showStep(currentStep);
  
  // Next button
  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const nextStep = parseInt(button.getAttribute('data-next'));
      if (validateStep(currentStep)) {
        showStep(nextStep);
      }
    });
  });
  
  // Previous button
  prevButtons.forEach(button => {
    button.addEventListener('click', () => {
      const prevStep = parseInt(button.getAttribute('data-prev'));
      showStep(prevStep);
    });
  });
  
  function showStep(step) {
    // Hide all steps
    steps.forEach(s => s.classList.remove('active'));
    
    // Show current step
    const currentStepElement = document.getElementById(`step${step}`);
    if (currentStepElement) {
      currentStepElement.classList.add('active');
    }
    
    // Update progress
    progressSteps.forEach((p, index) => {
      if (index + 1 <= step) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
    
    // Update progress bar
    if (progressFill) {
      const progressPercentage = ((step - 1) / (steps.length - 1)) * 100;
      progressFill.style.width = `${progressPercentage}%`;
    }
    
    currentStep = step;
  }
  
  function validateStep(step) {
    const currentStepElement = document.getElementById(`step${step}`);
    if (!currentStepElement) return true;
    
    const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    
    inputs.forEach(input => {
      // Remove existing error messages
      const existingError = input.parentElement.querySelector('.error-message');
      if (existingError) existingError.remove();
      
      if (!input.value.trim()) {
        input.classList.add('error');
        showError(input, 'Ce champ est obligatoire.');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
      
      // Email validation
      if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          input.classList.add('error');
          showError(input, 'Veuillez entrer une adresse email valide.');
          isValid = false;
        }
      }
      
      // Phone validation
      if (input.type === 'tel' && input.value) {
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
          input.classList.add('error');
          showError(input, 'Veuillez entrer un numéro de téléphone valide.');
          isValid = false;
        }
      }
    });
    
    return isValid;
  }
  
  function showError(input, message) {
    // Create error message
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = '#e53e3e';
    error.style.fontSize = '0.85rem';
    error.style.marginTop = '0.3rem';
    
    input.parentElement.appendChild(error);
  }
  
  // Character counter
  const messageTextarea = document.getElementById('message');
  const charCount = document.getElementById('char-count');
  
  if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', function() {
      const length = this.value.length;
      charCount.textContent = length;
      
      if (length > 2000) {
        charCount.style.color = '#e53e3e';
        this.value = this.value.substring(0, 2000);
        charCount.textContent = 2000;
      } else if (length > 1800) {
        charCount.style.color = '#f6ad55';
      } else {
        charCount.style.color = '#4a5568';
      }
    });
  }
  
  // File upload with drag & drop
  const dropArea = document.getElementById('drop-area');
  const fileInput = document.getElementById('file');
  const fileList = document.getElementById('file-list');
  
  if (dropArea && fileInput) {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    // Handle file input change
    fileInput.addEventListener('change', handleFiles, false);
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    function highlight() {
      dropArea.style.borderColor = '#2a6e8c';
      dropArea.style.backgroundColor = '#f8fafc';
    }
    
    function unhighlight() {
      dropArea.style.borderColor = '#e2e8f0';
      dropArea.style.backgroundColor = 'transparent';
    }
    
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles({ target: { files } });
    }
    
    function handleFiles(e) {
      const files = e.target.files;
      const maxSize = 20 * 1024 * 1024; // 20MB
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/acad',
        'application/dwg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      Array.from(files).forEach(file => {
        // Validate file size
        if (file.size > maxSize) {
          alert(`Le fichier "${file.name}" dépasse la taille maximale de 20MB.`);
          return;
        }
        
        // Validate file type
        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png|dwg|dxf|doc|docx)$/i)) {
          alert(`Le format du fichier "${file.name}" n'est pas accepté.`);
          return;
        }
        
        // Add file to list
        addFileToList(file);
      });
    }
    
    function addFileToList(file) {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      
      const fileSize = formatFileSize(file.size);
      
      fileItem.innerHTML = `
        <div class="file-name">
          <i class="fas fa-file"></i>
          <span>${file.name}</span>
        </div>
        <div class="file-size">${fileSize}</div>
        <button class="btn-remove-file" type="button">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      if (fileList) {
        fileList.appendChild(fileItem);
      }
      
      // Add remove functionality
      const removeBtn = fileItem.querySelector('.btn-remove-file');
      removeBtn.addEventListener('click', () => {
        fileItem.remove();
      });
    }
    
    function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }
  
  // Form submission with enhanced validation
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  
  if (contactForm) {
    contactForm.classList.add('multi-step');
    
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Validate all steps before submission
      let allValid = true;
      for (let i = 1; i <= steps.length; i++) {
        if (!validateStep(i)) {
          showStep(i);
          allValid = false;
          break;
        }
      }
      
      if (!allValid) {
        alert('Veuillez corriger les erreurs dans le formulaire avant de soumettre.');
        return;
      }
      
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      
      // Show loading state
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline';
      
      try {
        const formData = new FormData(this);
        
        // Add additional data
        formData.append('date', new Date().toISOString());
        formData.append('page', window.location.href);
        
        const response = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Show success message
          contactForm.innerHTML = `
            <div class="success-message">
              <div class="success-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <h3>Message envoyé avec succès !</h3>
              <p>Je vous remercie pour votre confiance. Je vous répondrai dans les plus brefs délais (sous 24h ouvrées).</p>
              <div class="success-actions">
                <a href="/" class="btn btn-primary">
                  <i class="fas fa-home"></i> Retour à l'accueil
                </a>
                <a href="portfolio.html" class="btn btn-secondary">
                  <i class="fas fa-images"></i> Voir le portfolio
                </a>
              </div>
            </div>
          `;
          
          // Track conversion
          if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
              'send_to': 'AW-XXXXXXXXX/YYYYYYYYYYYY',
              'value': 1.0,
              'currency': 'EUR',
              'transaction_id': ''
            });
          }
        } else {
          throw new Error('Erreur lors de l\'envoi du formulaire');
        }
      } catch (error) {
        console.error('Form error:', error);
        
        // Show error message
        const formMessages = document.getElementById('form-messages');
        if (formMessages) {
          formMessages.innerHTML = `
            <div class="error-message" style="background: #fed7d7; color: #c53030; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
              <p><strong>Une erreur est survenue</strong></p>
              <p>Veuillez réessayer ou me contacter directement par téléphone : <a href="tel:+33000000000">00 00 00 00 00</a></p>
            </div>
          `;
          
          // Scroll to error
          formMessages.scrollIntoView({ behavior: 'smooth' });
        } else {
          alert('Une erreur est survenue. Veuillez réessayer ou me contacter directement par téléphone : 00 00 00 00 00');
        }
        
        // Reset button
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
      }
    });
  }
  
  // Auto-open FAQ if URL has hash
  if (window.location.hash) {
    const targetQuestion = document.querySelector(`${window.location.hash} .faq-question`);
    if (targetQuestion) {
      setTimeout(() => {
        targetQuestion.click();
        targetQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }
  
  // Initialize service and project type based on URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const offreParam = urlParams.get('offre');
  
  if (serviceParam) {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
      serviceSelect.value = serviceParam;
    }
  }
  
  if (offreParam) {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
      // Map offre parameter to service value
      const offreMap = {
        'erp': 'erp',
        'permis': 'permis',
        '3d': '3d'
      };
      if (offreMap[offreParam]) {
        serviceSelect.value = offreMap[offreParam];
      }
    }
  }
});