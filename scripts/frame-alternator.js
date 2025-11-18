/**
 * ROKKO Records - Frame Color Alternator
 * Automatically assigns alternating frame colors based on nesting depth
 * 
 * Rules:
 * - depth 0 (root level): light-sand background
 * - depth 1 (nested once): dark-sand background
 * - depth 2 (nested twice): light-sand background
 * - etc., strictly alternating to prevent adjacent dark-sand frames
 */

(function() {
  'use strict';

  /**
   * Calculate the nesting depth of a frame element
   * @param {HTMLElement} element - The frame element
   * @returns {number} The nesting depth
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
   * Assign color classes to all frame elements based on depth
   */
  function recolorFrames() {
    const frames = document.querySelectorAll('.frame');
    
    frames.forEach(frame => {
      const depth = getFrameDepth(frame);
      
      // Remove existing color classes
      frame.classList.remove('frame--light-sand', 'frame--dark-sand');
      
      // Assign color based on depth (even = light-sand, odd = dark-sand)
      if (depth % 2 === 0) {
        frame.classList.add('frame--light-sand');
      } else {
        frame.classList.add('frame--dark-sand');
      }
    });
    
    // Log for debugging
    console.log(`[Frame Alternator] Recolored ${frames.length} frame elements`);
  }

  /**
   * Initialize the frame alternator
   */
  function initFrameAlternator() {
    // Initial recolor on load
    recolorFrames();
    
    // Set up MutationObserver for dynamic content
    const observer = new MutationObserver((mutations) => {
      let shouldRecolor = false;
      
      mutations.forEach((mutation) => {
        // Check if any nodes were added or removed
        if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
          shouldRecolor = true;
        }
        
        // Check if class list changed (frame class might have been added)
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target.classList && target.classList.contains('frame')) {
            shouldRecolor = true;
          }
        }
      });
      
      if (shouldRecolor) {
        // Debounce: wait a bit before recoloring
        clearTimeout(window.frameRecolorTimeout);
        window.frameRecolorTimeout = setTimeout(() => {
          recolorFrames();
        }, 100);
      }
    });
    
    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
    
    console.log('[Frame Alternator] Initialized with MutationObserver');
  }

  // Export recolorFrames to window for manual invocation if needed
  window.recolorFrames = recolorFrames;

  // Auto-initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFrameAlternator);
  } else {
    // DOM already loaded
    initFrameAlternator();
  }

})();
