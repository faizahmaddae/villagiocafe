/* =============================================
   VILLAGIO CAFE - JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
  
  // -----------------------------------------
  // Announcement Bar Close
  // -----------------------------------------
  const announcementBar = document.getElementById('announcementBar');
  const closeAnnouncement = document.getElementById('closeAnnouncement');
  
  if (closeAnnouncement && announcementBar) {
    // Check if already dismissed
    if (sessionStorage.getItem('announcementDismissed')) {
      announcementBar.classList.add('hidden');
    }
    
    closeAnnouncement.addEventListener('click', function() {
      announcementBar.classList.add('hidden');
      sessionStorage.setItem('announcementDismissed', 'true');
    });
  }
  
  // -----------------------------------------
  // Mobile Menu Toggle
  // -----------------------------------------
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
  
  // -----------------------------------------
  // Header Scroll Effect
  // -----------------------------------------
  const header = document.getElementById('header');
  let lastScroll = 0;
  
  if (header) {
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      } else {
        header.style.boxShadow = 'none';
      }
      
      lastScroll = currentScroll;
    });
  }
  
  // -----------------------------------------
  // Smooth Scroll for Anchor Links
  // -----------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // -----------------------------------------
  // Lazy Load Images
  // -----------------------------------------
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }
  
  // -----------------------------------------
  // Gallery Lightbox (Basic Implementation)
  // -----------------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (galleryItems.length > 0) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-prev" aria-label="Previous">&lsaquo;</button>
        <button class="lightbox-next" aria-label="Next">&rsaquo;</button>
        <img src="" alt="" class="lightbox-image">
        <div class="lightbox-counter"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
    
    // Add lightbox styles
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
      .lightbox {
        position: fixed;
        inset: 0;
        z-index: 2000;
        display: none;
        align-items: center;
        justify-content: center;
      }
      .lightbox.active {
        display: flex;
      }
      .lightbox-overlay {
        position: absolute;
        inset: 0;
        background: rgba(44, 44, 44, 0.95);
      }
      .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
      }
      .lightbox-image {
        max-width: 100%;
        max-height: 85vh;
        object-fit: contain;
        border-radius: 4px;
      }
      .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        font-size: 32px;
        color: #FAF8F5;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
      }
      .lightbox-prev,
      .lightbox-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 48px;
        color: #FAF8F5;
        background: none;
        border: none;
        cursor: pointer;
        padding: 16px;
      }
      .lightbox-prev { left: -60px; }
      .lightbox-next { right: -60px; }
      .lightbox-counter {
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        color: #FAF8F5;
        font-size: 14px;
      }
      @media (max-width: 768px) {
        .lightbox-prev { left: 10px; }
        .lightbox-next { right: 10px; }
        .lightbox-prev,
        .lightbox-next {
          font-size: 32px;
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
      }
    `;
    document.head.appendChild(lightboxStyles);
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(function(item) {
      return item.querySelector('img').src;
    });
    
    function showImage(index) {
      currentIndex = index;
      if (currentIndex < 0) currentIndex = images.length - 1;
      if (currentIndex >= images.length) currentIndex = 0;
      
      lightboxImage.src = images[currentIndex];
      lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
    
    function openLightbox(index) {
      showImage(index);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    galleryItems.forEach(function(item, index) {
      item.addEventListener('click', function() {
        openLightbox(index);
      });
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function() { showImage(currentIndex - 1); });
    lightboxNext.addEventListener('click', function() { showImage(currentIndex + 1); });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }
  
  // -----------------------------------------
  // Active Nav Link
  // -----------------------------------------
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
});
