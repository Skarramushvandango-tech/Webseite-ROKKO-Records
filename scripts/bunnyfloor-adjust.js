/**
 * Bunnyfloor Adjust
 * Programmatically reduces the bunnyfloor image to 50% of its current rendered size
 */

(function() {
  'use strict';

  let resizeTimeout = null;

  /**
   * Adjust the bunnyfloor image size to 50% of its current rendered width
   */
  function adjustBunnyfloor() {
    const bunnyfloor = document.querySelector('.bunnyfloor');
    
    if (!bunnyfloor) {
      return;
    }

    // Get the current computed width of the image
    const computedStyle = window.getComputedStyle(bunnyfloor);
    const currentWidth = parseFloat(computedStyle.width);
    
    if (currentWidth && currentWidth > 0) {
      // Calculate half the current width
      const newWidth = Math.round(currentWidth / 2);
      
      // Set the new width explicitly
      bunnyfloor.style.width = newWidth + 'px';
      
      // Set height to auto to maintain aspect ratio
      bunnyfloor.style.height = 'auto';
      
      // Ensure transform-origin is set for any transforms
      bunnyfloor.style.transformOrigin = 'top left';
      
      console.log('Bunnyfloor adjusted: ' + currentWidth + 'px → ' + newWidth + 'px');
    }
  }

  /**
   * Debounced resize handler
   */
  function debouncedAdjust() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(adjustBunnyfloor, 150);
  }

  /**
   * Initialize the bunnyfloor adjustment
   */
  function init() {
    // Initial adjustment after DOM is loaded
    adjustBunnyfloor();

    // Re-adjust on window resize
    window.addEventListener('resize', debouncedAdjust);
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
