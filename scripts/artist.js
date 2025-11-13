// Händelt Diskografie Dropdowns, Video Controls, News Pagination und Carousel
document.addEventListener('DOMContentLoaded', function(){
  // Intro video mute/unmute control
  var video = document.getElementById('introVideo');
  var muteBtn = document.getElementById('muteButton');
  
  if(video && muteBtn) {
    // Start muted (video starts without sound)
    video.muted = true;
    muteBtn.textContent = 'UNMUTE';
    
    muteBtn.addEventListener('click', function() {
      if(video.muted) {
        video.muted = false;
        muteBtn.textContent = 'MUTE';
      } else {
        video.muted = true;
        muteBtn.textContent = 'UNMUTE';
      }
    });
  }

  // Initialize Flickity carousel if element exists
  var carouselElem = document.querySelector('.artist-carousel');
  if(carouselElem && typeof Flickity !== 'undefined') {
    var flkty = new Flickity(carouselElem, {
      cellAlign: 'center',
      contain: true,
      wrapAround: true,
      prevNextButtons: true,
      pageDots: true,
      draggable: true,
      freeScroll: false,
      friction: 0.6,
      selectedAttraction: 0.1,
      dragThreshold: 10
    });
    // Prevent page scroll when dragging carousel - improved handling
    var touchStartY = 0;
    carouselElem.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
    });
    
    carouselElem.addEventListener('touchmove', function(e) {
      // Only prevent scroll if moving horizontally (carousel drag)
      var touchMoveY = e.touches[0].clientY;
      var deltaY = Math.abs(touchMoveY - touchStartY);
      
      // If horizontal movement is significant, prevent vertical scroll
      if (deltaY < 10) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Toggle artist details when clicking carousel images - FULL PAGE MODAL
  document.querySelectorAll('.artist-header[data-artist]').forEach(function(header){
    header.addEventListener('click', function(){
      var artistId = this.dataset.artist;
      var detailsSection = document.getElementById('artist-' + artistId);
      
      if(detailsSection) {
        // Get the modal and content container
        var modal = document.getElementById('artistModal');
        var modalContent = document.getElementById('artistModalContent');
        
        if(modal && modalContent) {
          // Get artist image from the clicked header
          var artistImg = this.querySelector('img.artist-main-image');
          
          // Build modal content with artist image at top
          // Get the content from the details section
          var detailsDropdown = detailsSection.querySelector('.artist-dropdown');
          
          if(modal && modalContent && detailsDropdown) {
            // Clear previous content
            modalContent.innerHTML = '';
            
            // Add artist image at top if available
            if(artistImg) {
              var imgContainer = document.createElement('div');
              imgContainer.style.textAlign = 'center';
              imgContainer.style.marginBottom = '30px';
              imgContainer.style.cursor = 'pointer';
              imgContainer.title = 'Klicken zum Schließen';
              
              var clonedImg = artistImg.cloneNode(true);
              clonedImg.style.maxWidth = '100%';
              clonedImg.style.borderRadius = '8px';
              clonedImg.alt = 'Artist';
              
              imgContainer.appendChild(clonedImg);
              
              // Add click handler to close modal when clicking artist image
              imgContainer.addEventListener('click', function() {
                var closeBtn = document.getElementById('closeArtistModal');
                if(closeBtn) closeBtn.click();
              });
              
              modalContent.appendChild(imgContainer);
            }
            
            // Clone and append the details content
            var contentWrapper = document.createElement('div');
            contentWrapper.innerHTML = detailsDropdown.innerHTML;
            modalContent.appendChild(contentWrapper);
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Pause all playing audio tracks
            document.querySelectorAll('audio').forEach(function(audio) {
              if(!audio.paused) {
                audio.pause();
              }
            });
            
            // Scroll to top of modal
            modal.scrollTop = 0;
          }
        }
      }
    });
  });
  
  // Close modal button handler
  var closeModalBtn = document.getElementById('closeArtistModal');
  if(closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
      var modal = document.getElementById('artistModal');
      if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        
        // Pause all audio in modal
        document.querySelectorAll('#artistModal audio').forEach(function(audio) {
          if(!audio.paused) {
            audio.pause();
          }
        });
      }
    });
  }
  
  // Close modal when clicking outside content
  var artistModal = document.getElementById('artistModal');
  if(artistModal) {
    artistModal.addEventListener('click', function(e) {
      if(e.target === artistModal) {
        var closeBtn = document.getElementById('closeArtistModal');
        if(closeBtn) closeBtn.click();
      }
    });
  }
  
  // Close modal on ESC key
  document.addEventListener('keydown', function(e) {
    if(e.key === 'Escape') {
      var modal = document.getElementById('artistModal');
      if(modal && modal.style.display === 'block') {
        var closeBtn = document.getElementById('closeArtistModal');
        if(closeBtn) closeBtn.click();
      }
    }
  });

  // Also handle old-style artist headers (for backward compatibility)
  document.querySelectorAll('.artist-header:not([data-artist])').forEach(function(header){
    header.addEventListener('click', function(){
      var parent = header.closest('.artist-item');
      var dropdown = parent.querySelector('.artist-dropdown');
      
      if(dropdown) {
        if(dropdown.style.maxHeight && dropdown.style.maxHeight !== '0px'){
          // Close
          dropdown.style.maxHeight = '0';
        } else {
          // Close all other artist dropdowns first
          document.querySelectorAll('.artist-dropdown').forEach(function(dd){
            dd.style.maxHeight = '0';
          });
          // Open this one
          dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
        }
      }
    });
  });

  // Toggle disco dropdown - shows songs directly without nested large cover
  // Use event delegation to work with dynamically added content in modal
  document.body.addEventListener('click', function(e) {
    var target = e.target;
    
    // Check if clicked element is a disco cover
    if(target.classList && target.classList.contains('disco-cover-small')) {
      e.stopPropagation(); // Prevent parent click
      
      var parent = target.closest('.release');
      if(!parent) return;
      
      var dd = parent.querySelector('.disco-dropdown');
      if(!dd) return;
      
      if(dd.style.maxHeight && dd.style.maxHeight !== '0px'){
        // Close
        dd.style.maxHeight = '0';
      } else {
        // Close other open dropdowns in same artist section
        var artistSection = target.closest('.artist-item, .artist-wrapper, #artistModalContent');
        if(artistSection){
          artistSection.querySelectorAll('.disco-dropdown').forEach(function(o){ 
            o.style.maxHeight = '0';
          });
        }
        // Open this one
        dd.style.maxHeight = dd.scrollHeight + 'px';
      }
    }
  });

  // News pagination
  var pageButtons = document.querySelectorAll('.page-btn');
  var newsItems = document.querySelectorAll('.news-item');
  
  if(pageButtons.length > 0 && newsItems.length > 0) {
    pageButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var page = this.dataset.page;
        
        // Hide all news items
        newsItems.forEach(function(item) {
          item.style.display = 'none';
        });
        
        // Show selected page
        var selectedItem = document.querySelector('.news-item[data-page="' + page + '"]');
        if(selectedItem) {
          selectedItem.style.display = 'block';
        }
        
        // Update active button
        pageButtons.forEach(function(b) {
          b.classList.remove('active');
          b.style.background = '#fff';
          b.style.color = 'var(--rokko-brown)';
        });
        
        this.classList.add('active');
        this.style.background = 'var(--rokko-brown)';
        this.style.color = '#fff';
      });
    });
  }

  // YouTube slider: set iframe src when thumb clicked (non-API solution)
  document.querySelectorAll('.yt-slider .yt-thumb').forEach(function(thumb){
    thumb.addEventListener('click', function(){
      var iframe = thumb.closest('.yt-slider-wrapper').querySelector('.yt-player');
      var videoId = thumb.dataset.videoId;
      if(iframe && videoId){
        // load embed - use privacy-enhanced URL
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?rel=0&autoplay=1';
      }
    });
  });

  // Audio playback control: only one track plays at a time
  document.querySelectorAll('audio').forEach(function(audio) {
    audio.addEventListener('play', function() {
      // Pause all other audio elements when this one starts playing
      document.querySelectorAll('audio').forEach(function(otherAudio) {
        if (otherAudio !== audio && !otherAudio.paused) {
          otherAudio.pause();
        }
      });
    });
  });
});