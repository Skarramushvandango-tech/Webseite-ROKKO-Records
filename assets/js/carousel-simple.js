/**
 * Simple Carousel Navigation Enhancement
 * Adds arrow navigation and optional mousewheel horizontal scrolling to carousels
 * Non-invasive helper that works with existing carousel implementations
 */

(function() {
  'use strict';

  /**
   * Initialize carousel navigation for a given container
   * @param {HTMLElement} container - The carousel wrapper element
   * @param {Object} options - Configuration options
   */
  function initCarouselNav(container, options) {
    if (!container) return;

    var config = Object.assign({
      trackSelector: '.carousel-track, #album-carousel',
      scrollAmount: 300,
      enableMousewheel: true,
      createArrows: true,
      arrowLeftClass: 'carousel-arrow left',
      arrowRightClass: 'carousel-arrow right'
    }, options || {});

    var track = container.querySelector(config.trackSelector);
    if (!track) return;

    // Create navigation arrows if enabled
    if (config.createArrows) {
      var leftArrow = document.createElement('button');
      leftArrow.className = config.arrowLeftClass;
      leftArrow.setAttribute('aria-label', 'Scroll left');
      leftArrow.setAttribute('type', 'button');

      var rightArrow = document.createElement('button');
      rightArrow.className = config.arrowRightClass;
      rightArrow.setAttribute('aria-label', 'Scroll right');
      rightArrow.setAttribute('type', 'button');

      container.appendChild(leftArrow);
      container.appendChild(rightArrow);

      // Arrow click handlers
      leftArrow.addEventListener('click', function() {
        track.scrollBy({
          left: -config.scrollAmount,
          behavior: 'smooth'
        });
      });

      rightArrow.addEventListener('click', function() {
        track.scrollBy({
          left: config.scrollAmount,
          behavior: 'smooth'
        });
      });

      // Update arrow visibility based on scroll position
      function updateArrows() {
        var isAtStart = track.scrollLeft <= 0;
        var isAtEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
        
        leftArrow.style.opacity = isAtStart ? '0.3' : '1';
        leftArrow.style.cursor = isAtStart ? 'default' : 'pointer';
        
        rightArrow.style.opacity = isAtEnd ? '0.3' : '1';
        rightArrow.style.cursor = isAtEnd ? 'default' : 'pointer';
      }

      track.addEventListener('scroll', updateArrows);
      updateArrows();
    }

    // Enable horizontal mousewheel scrolling if enabled
    if (config.enableMousewheel) {
      track.addEventListener('wheel', function(e) {
        // Only handle horizontal wheel events or shift+vertical wheel
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
          e.preventDefault();
          var delta = e.deltaX || e.deltaY;
          track.scrollBy({
            left: delta,
            behavior: 'auto'
          });
        }
      }, { passive: false });
    }
  }

  /**
   * Auto-initialize carousels on DOM ready
   */
  function autoInit() {
    // Initialize album carousel if present
    var albumWrapper = document.getElementById('album-carousel-wrapper');
    if (albumWrapper) {
      initCarouselNav(albumWrapper, {
        trackSelector: '#album-carousel',
        scrollAmount: 400
      });
    }

    // Initialize any other carousels with .artist-carousel class
    var carousels = document.querySelectorAll('.artist-carousel');
    carousels.forEach(function(carousel) {
      if (carousel.id !== 'album-carousel-wrapper') {
        initCarouselNav(carousel);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  // Export for manual initialization if needed
  window.RokkoCarousel = {
    init: initCarouselNav
  };
})();
