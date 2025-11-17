/**
 * Simple Carousel Navigation Script for ROKKO Records
 * Provides horizontal scrolling with arrow buttons and mousewheel support
 */

(function() {
  'use strict';

  /**
   * Initialize carousel with arrow navigation
   * @param {string} carouselSelector - CSS selector for carousel container
   * @param {string} trackSelector - CSS selector for scrollable track
   */
  function initCarousel(carouselSelector, trackSelector) {
    const carouselWrapper = document.querySelector(carouselSelector);
    const carouselTrack = document.querySelector(trackSelector);
    
    if (!carouselWrapper || !carouselTrack) {
      return; // Carousel not found on this page
    }

    // Create navigation arrows if they don't exist
    let leftArrow = carouselWrapper.querySelector('.carousel-arrow-left');
    let rightArrow = carouselWrapper.querySelector('.carousel-arrow-right');
    
    if (!leftArrow) {
      leftArrow = document.createElement('button');
      leftArrow.className = 'carousel-arrow carousel-arrow-left';
      leftArrow.innerHTML = '‹';
      leftArrow.setAttribute('aria-label', 'Scroll left');
      carouselWrapper.style.position = 'relative';
      carouselWrapper.appendChild(leftArrow);
    }
    
    if (!rightArrow) {
      rightArrow = document.createElement('button');
      rightArrow.className = 'carousel-arrow carousel-arrow-right';
      rightArrow.innerHTML = '›';
      rightArrow.setAttribute('aria-label', 'Scroll right');
      carouselWrapper.appendChild(rightArrow);
    }

    // Calculate scroll amount (roughly one item width + gap)
    const scrollAmount = 200; // Adjust based on item width

    // Left arrow click handler
    leftArrow.addEventListener('click', function() {
      carouselTrack.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });

    // Right arrow click handler
    rightArrow.addEventListener('click', function() {
      carouselTrack.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });

    // Horizontal scroll with mouse wheel
    carouselTrack.addEventListener('wheel', function(e) {
      // Only handle horizontal scroll if not already scrolling vertically
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        carouselTrack.scrollBy({
          left: e.deltaY,
          behavior: 'smooth'
        });
      }
    }, { passive: false });

    // Update arrow visibility based on scroll position
    function updateArrows() {
      const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
      
      // Hide left arrow if at start
      if (carouselTrack.scrollLeft <= 5) {
        leftArrow.style.opacity = '0.3';
        leftArrow.style.pointerEvents = 'none';
      } else {
        leftArrow.style.opacity = '1';
        leftArrow.style.pointerEvents = 'auto';
      }
      
      // Hide right arrow if at end
      if (carouselTrack.scrollLeft >= maxScroll - 5) {
        rightArrow.style.opacity = '0.3';
        rightArrow.style.pointerEvents = 'none';
      } else {
        rightArrow.style.opacity = '1';
        rightArrow.style.pointerEvents = 'auto';
      }
    }

    // Listen to scroll events to update arrows
    carouselTrack.addEventListener('scroll', updateArrows);
    
    // Initial arrow state
    updateArrows();
    
    // Update on window resize
    window.addEventListener('resize', updateArrows);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize album carousel
      initCarousel('#album-carousel-wrapper', '#album-carousel');
      
      // Initialize any other carousels with class .artist-carousel
      const artistCarousels = document.querySelectorAll('.artist-carousel');
      artistCarousels.forEach(function(carousel) {
        const track = carousel.querySelector('.carousel-track');
        if (track) {
          initCarousel('.' + carousel.className.split(' ').join('.'), '.carousel-track');
        }
      });
    });
  } else {
    // DOM already loaded
    initCarousel('#album-carousel-wrapper', '#album-carousel');
    
    const artistCarousels = document.querySelectorAll('.artist-carousel');
    artistCarousels.forEach(function(carousel) {
      const track = carousel.querySelector('.carousel-track');
      if (track) {
        initCarousel('.' + carousel.className.split(' ').join('.'), '.carousel-track');
      }
    });
  }
})();
