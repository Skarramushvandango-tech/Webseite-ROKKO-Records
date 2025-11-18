/**
 * Frame Alternator
 * Automatically applies alternating background colors to .frame elements
 * based on their nesting depth
 */

(function() {
  'use strict';

  let recolorTimeout = null;

  /**
   * Calculate the nesting depth of a frame element
   * @param {HTMLElement} element - The frame element
   * @returns {number} The depth (0 for root frames)
   */
  function getFrameDepth(element) {
    let depth = 0;
    let parent = element.parentElement;
    
    while (parent) {
      if (parent.classList.contains('frame')) {
        depth++;
      }
      parent = parent.parentElement;
    }
    
    return depth;
  }

  /**
   * Apply alternating colors to all frame elements based on nesting depth
   */
  function recolorFrames() {
    const frames = document.querySelectorAll('.frame');
    
    frames.forEach(frame => {
      // Remove existing color classes
      frame.classList.remove('frame--light-sand', 'frame--dark-sand');
      
      // Calculate depth
      const depth = getFrameDepth(frame);
      
      // Apply color based on depth (even = light, odd = dark)
      if (depth % 2 === 0) {
        frame.classList.add('frame--light-sand');
      } else {
        frame.classList.add('frame--dark-sand');
      }
    });
  }

  /**
   * Debounced recolor function to avoid excessive recalculations
   */
  function debouncedRecolor() {
    if (recolorTimeout) {
      clearTimeout(recolorTimeout);
    }
    recolorTimeout = setTimeout(recolorFrames, 100);
  }

  /**
   * Initialize the frame alternator
   */
  function init() {
    // Initial coloring
    recolorFrames();

    // Set up MutationObserver to watch for DOM changes
    const observer = new MutationObserver(function(mutations) {
      let shouldRecolor = false;
      
      mutations.forEach(function(mutation) {
        // Check if any added nodes contain or are .frame elements
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList && node.classList.contains('frame')) {
              shouldRecolor = true;
            } else if (node.querySelector && node.querySelector('.frame')) {
              shouldRecolor = true;
            }
          }
        });
        
        // Check if any removed nodes contain or are .frame elements
        mutation.removedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList && node.classList.contains('frame')) {
              shouldRecolor = true;
            } else if (node.querySelector && node.querySelector('.frame')) {
              shouldRecolor = true;
            }
          }
        });
      });
      
      if (shouldRecolor) {
        debouncedRecolor();
      }
    });

    // Observe the entire document body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Export recolorFrames function to window for manual access if needed
  window.recolorFrames = recolorFrames;

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
