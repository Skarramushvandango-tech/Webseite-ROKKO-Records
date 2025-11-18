/**
 * ROKKO Frame Alternator
 * 
 * This script automatically applies alternating color classes to .frame elements
 * based on their nesting depth. It ensures that:
 * - Even depth (0, 2, 4...) gets light-sand background
 * - Odd depth (1, 3, 5...) gets dark-sand background
 * - No two dark-sand frames are ever adjacent
 * 
 * Usage:
 * 1. Add class="frame" to any container that should have alternating colors
 * 2. This script will automatically apply .frame--light-sand or .frame--dark-sand
 * 3. For dynamically loaded content, call window.recolorFrames()
 */

(function() {
  'use strict';

  /**
   * Calculate the nesting depth of a frame element
   * Depth is determined by counting parent elements with class 'frame'
   * @param {HTMLElement} element - The frame element to check
   * @returns {number} The nesting depth (0 for top-level frames)
   */
  function getFrameDepth(element) {
    let depth = 0;
    let parent = element.parentElement;
    
    while (parent) {
      if (parent.classList && parent.classList.contains('frame')) {
        depth++;
      }
      parent = parent.parentElement;
    }
    
    return depth;
  }

  /**
   * Apply alternating color classes to all .frame elements
   * based on their nesting depth
   */
  function recolorFrames() {
    // Get all elements with class 'frame'
    const frames = document.querySelectorAll('.frame');
    
    // Process each frame
    frames.forEach(function(frame) {
      // Calculate nesting depth
      const depth = getFrameDepth(frame);
      
      // Remove any existing color classes
      frame.classList.remove('frame--light-sand', 'frame--dark-sand');
      
      // Apply appropriate class based on depth
      // Even depth (0, 2, 4...) = light-sand
      // Odd depth (1, 3, 5...) = dark-sand
      if (depth % 2 === 0) {
        frame.classList.add('frame--light-sand');
      } else {
        frame.classList.add('frame--dark-sand');
      }
    });
    
    console.log('Frame colors updated: ' + frames.length + ' frames processed');
  }

  /**
   * Initialize the frame alternator when DOM is ready
   */
  function init() {
    // Run immediately if DOM is already loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', recolorFrames);
    } else {
      // DOM is already loaded, run immediately
      recolorFrames();
    }
  }

  // Export the recolorFrames function globally so it can be called
  // when content is dynamically loaded
  window.recolorFrames = recolorFrames;

  // Initialize
  init();

})();
