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
 * - Frames alternate in pairs: dark-sand → light-sand → dark-sand → light-sand
 * - Pattern: (dark, light), (dark, light), (dark, light), ...
 * - This creates fixed pair blocks as specified
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
   * Assign color classes to all frame elements based on position
   * Pattern: dark-sand → light-sand → dark-sand → light-sand (in pairs at same depth)
   */
  function recolorFrames() {
    // Get all root-level frames (depth 0) to establish pattern
    const allFrames = document.querySelectorAll('.frame');
    const rootFrames = [];
    
    allFrames.forEach(frame => {
      const depth = getFrameDepth(frame);
      if (depth === 0) {
        rootFrames.push(frame);
      }
    });
    
    // Assign colors to root frames in pairs: dark-sand, light-sand, dark-sand, light-sand
    rootFrames.forEach((frame, index) => {
      // Remove existing color classes
      frame.classList.remove('frame--light-sand', 'frame--dark-sand');
      
      // Pair pattern: index 0,1 = pair 0, index 2,3 = pair 1, etc.
      // Within each pair: first is dark-sand, second is light-sand
      const pairIndex = Math.floor(index / 2);
      const isFirstInPair = (index % 2) === 0;
      
      // Pattern: first of pair = dark-sand, second of pair = light-sand
      // This creates: dark→light, dark→light, dark→light...
      if (isFirstInPair) {
        frame.classList.add('frame--dark-sand');
      } else {
        frame.classList.add('frame--light-sand');
      }
    });
    
    // For nested frames, alternate based on parent color
    allFrames.forEach(frame => {
      const depth = getFrameDepth(frame);
      if (depth > 0) {
        // Remove existing color classes
        frame.classList.remove('frame--light-sand', 'frame--dark-sand');
        
        // Find parent frame
        let parent = frame.parentElement;
        while (parent && !parent.classList.contains('frame')) {
          parent = parent.parentElement;
        }
        
        // Alternate from parent: if parent is dark-sand, child is light-sand, and vice versa
        if (parent) {
          if (parent.classList.contains('frame--dark-sand')) {
            frame.classList.add('frame--light-sand');
          } else {
            frame.classList.add('frame--dark-sand');
          }
        }
      }
    });
    
    // Log for debugging
    console.log(`[Frame Alternator] Recolored ${allFrames.length} frame elements in pair pattern`);
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
