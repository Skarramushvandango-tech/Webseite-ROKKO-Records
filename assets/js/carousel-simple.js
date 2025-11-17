/**
 * Simple Carousel Navigation Script
 * Provides arrow navigation and optional horizontal mousewheel support
 * for artist carousels with the .carousel-track class
 */

(function() {
  'use strict';

  // Initialize carousel controls when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }

  function initCarousels() {
    // Find all carousel containers
    const carousels = document.querySelectorAll('.artist-carousel');
    
    carousels.forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      if (!track) return;

      // Create arrow buttons
      const leftArrow = createArrow('left');
      const rightArrow = createArrow('right');
      
      // Add arrows to carousel
      carousel.appendChild(leftArrow);
      carousel.appendChild(rightArrow);

      // Set up arrow click handlers
      leftArrow.addEventListener('click', () => scrollCarousel(track, 'left'));
      rightArrow.addEventListener('click', () => scrollCarousel(track, 'right'));

      // Optional: Add horizontal mousewheel support
      track.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          track.scrollLeft += e.deltaY;
        }
      }, { passive: false });

      // Update arrow visibility based on scroll position
      updateArrows(track, leftArrow, rightArrow);
      track.addEventListener('scroll', () => {
        updateArrows(track, leftArrow, rightArrow);
      });
    });
  }

  function createArrow(direction) {
    const arrow = document.createElement('div');
    arrow.className = `carousel-arrow ${direction}`;
    arrow.setAttribute('aria-label', `Scroll ${direction}`);
    
    // Create SVG icon
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if (direction === 'left') {
      path.setAttribute('d', 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z');
    } else {
      path.setAttribute('d', 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z');
    }
    
    svg.appendChild(path);
    arrow.appendChild(svg);
    
    return arrow;
  }

  function scrollCarousel(track, direction) {
    const scrollAmount = track.offsetWidth * 0.7; // Scroll 70% of visible width
    const currentScroll = track.scrollLeft;
    
    if (direction === 'left') {
      track.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth'
      });
    } else {
      track.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  function updateArrows(track, leftArrow, rightArrow) {
    // Hide left arrow if at start
    if (track.scrollLeft <= 0) {
      leftArrow.style.opacity = '0.3';
      leftArrow.style.pointerEvents = 'none';
    } else {
      leftArrow.style.opacity = '1';
      leftArrow.style.pointerEvents = 'auto';
    }

    // Hide right arrow if at end
    const isAtEnd = track.scrollLeft + track.offsetWidth >= track.scrollWidth - 5;
    if (isAtEnd) {
      rightArrow.style.opacity = '0.3';
      rightArrow.style.pointerEvents = 'none';
    } else {
      rightArrow.style.opacity = '1';
      rightArrow.style.pointerEvents = 'auto';
    }
  }
})();
