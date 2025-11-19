/**
 * ROKKO Records - Frame Color Alternator
 * Automatically assigns alternating frame colors in fixed pair pattern
 * 
 * ============================================================================
 * ⚠️ CRITICAL - DO NOT MODIFY WITHOUT EXPLICIT APPROVAL ⚠️
 * ============================================================================
 * 
 * This code is subject to strict change control policies.
 * All color values and patterns are MANDATORY and must NOT be changed 
 * without explicit written approval from the project owner.
 * 
 * MANDATORY COLOR PATTERN:
 * - ALL root-level frames (depth 0) have light-sand background (#E0C290)
 * - Nested frames (depth 1+) alternate: dark-sand → light-sand → dark-sand...
 * - Pattern: light-sand (root) → dark-sand (nested level 1) → light-sand (nested level 2) → ...
 * 
 * Protected elements:
 * - Color values: #E0C290 (light-sand), #B8935F (dark-sand) - IMMUTABLE
 * - Alternation pattern - IMMUTABLE
 * 
 * ============================================================================
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
   * Assign color classes to all frame elements based on nesting depth
   * Pattern: ALL root frames = light-sand, nested frames alternate (dark-sand, then light-sand, etc.)
   */
  function recolorFrames() {
    // Get all frame elements
    const allFrames = document.querySelectorAll('.frame');
    
    allFrames.forEach(frame => {
      const depth = getFrameDepth(frame);
      
      // Remove existing color classes
      frame.classList.remove('frame--light-sand', 'frame--dark-sand');
      
      // Root frames (depth 0) are ALWAYS light-sand
      if (depth === 0) {
        frame.classList.add('frame--light-sand');
      } else {
        // Nested frames alternate based on depth:
        // depth 1 = dark-sand, depth 2 = light-sand, depth 3 = dark-sand, etc.
        if (depth % 2 === 1) {
          frame.classList.add('frame--dark-sand');
        } else {
          frame.classList.add('frame--light-sand');
        }
      }
    });
    
    // Log for debugging
    console.log(`[Frame Alternator] Recolored ${allFrames.length} frame elements - all root frames are light-sand`);
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
        // Check if any frame nodes were added or removed
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (node.classList.contains('frame') || node.querySelector('.frame'))) {
              shouldRecolor = true;
            }
          });
        }
        
        if (mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach(node => {
            if (node.nodeType === 1 && (node.classList.contains('frame') || node.querySelector('.frame'))) {
              shouldRecolor = true;
            }
          });
        }
        
        // Check if class list changed and frame class was added/removed
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target.classList && target.classList.contains('frame')) {
            const oldClasses = mutation.oldValue || '';
            const hadFrame = oldClasses.includes('frame');
            const hasFrame = target.classList.contains('frame');
            if (hadFrame !== hasFrame) {
              shouldRecolor = true;
            }
          }
        }
      });
      
      if (shouldRecolor) {
        // Debounce: wait a bit before recoloring
        clearTimeout(window.frameRecolorTimeout);
        window.frameRecolorTimeout = setTimeout(() => {
          recolorFrames();
        }, 200);
      }
    });
    
    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true
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
