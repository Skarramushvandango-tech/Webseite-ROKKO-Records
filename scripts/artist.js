// Händelt Diskografie Dropdowns, Video Controls, News Pagination und Carousel
document.addEventListener('DOMContentLoaded', function(){
  // Video preloader handling
  var video = document.getElementById('introVideo');
  var preloader = document.getElementById('videoPreloader');
  var loadingBar = document.getElementById('loadingBar');
  
  if(video && preloader && loadingBar) {
    // Update loading bar as video loads
    video.addEventListener('progress', function() {
      if(video.buffered.length > 0) {
        var bufferedEnd = video.buffered.end(video.buffered.length - 1);
        var duration = video.duration;
        if(duration > 0) {
          var percentLoaded = (bufferedEnd / duration) * 100;
          loadingBar.style.width = percentLoaded + '%';
        }
      }
    });
    
    // Hide preloader when video can play
    video.addEventListener('canplaythrough', function() {
      setTimeout(function() {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease';
        setTimeout(function() {
          preloader.style.display = 'none';
        }, 500);
      }, 300);
    });
    
    // Fallback: hide preloader after 3 seconds even if not fully loaded
    setTimeout(function() {
      if(preloader.style.display !== 'none') {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease';
        setTimeout(function() {
          preloader.style.display = 'none';
        }, 500);
      }
    }, 3000);
  }
  
  // Intro video mute/unmute control
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

  // Toggle artist details when clicking grid images - FULL PAGE MODAL
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
            modal.setAttribute('aria-hidden', 'false');
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
        modal.setAttribute('aria-hidden', 'true');
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

  // News pagination with arrow buttons
  var prevBtn = document.querySelector('.page-btn-prev');
  var nextBtn = document.querySelector('.page-btn-next');
  var pageIndicator = document.querySelector('.page-indicator');
  var newsItems = document.querySelectorAll('.news-item');
  var currentPage = 1;
  var totalPages = newsItems.length;
  
  function showNewsPage(page) {
    // Hide all news items
    newsItems.forEach(function(item) {
      item.style.display = 'none';
    });
    
    // Show selected page
    var selectedItem = document.querySelector('.news-item[data-page="' + page + '"]');
    if(selectedItem) {
      selectedItem.style.display = 'block';
    }
    
    // Update page indicator
    if(pageIndicator) {
      pageIndicator.textContent = page + ' / ' + totalPages;
    }
    
    // Disable/enable buttons at boundaries
    if(prevBtn) {
      prevBtn.disabled = (page === 1);
      prevBtn.style.opacity = (page === 1) ? '0.5' : '1';
      prevBtn.style.cursor = (page === 1) ? 'not-allowed' : 'pointer';
    }
    if(nextBtn) {
      nextBtn.disabled = (page === totalPages);
      nextBtn.style.opacity = (page === totalPages) ? '0.5' : '1';
      nextBtn.style.cursor = (page === totalPages) ? 'not-allowed' : 'pointer';
    }
  }
  
  if(prevBtn && nextBtn && newsItems.length > 0) {
    // Show first page initially
    showNewsPage(currentPage);
    
    prevBtn.addEventListener('click', function() {
      if(currentPage > 1) {
        currentPage--;
        showNewsPage(currentPage);
      }
    });
    
    nextBtn.addEventListener('click', function() {
      if(currentPage < totalPages) {
        currentPage++;
        showNewsPage(currentPage);
      }
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

  // Track item click handler - load track into player and play/pause
  document.body.addEventListener('click', function(e) {
    var target = e.target;
    
    // Check if clicked element is a track-item or its child
    var trackItem = target.closest('.track-item');
    if(trackItem) {
      e.stopPropagation();
      
      var trackSrc = trackItem.getAttribute('data-src');
      var playerId = trackItem.getAttribute('data-player');
      
      if(trackSrc && playerId) {
        var player = document.getElementById(playerId);
        if(player) {
          // Check if this track is currently playing
          var isCurrentTrack = (player.src.indexOf(trackSrc) !== -1);
          var isPlaying = !player.paused;
          
          if(isCurrentTrack && isPlaying) {
            // Pause if currently playing this track
            player.pause();
            
            // Update visual state - remove highlight
            trackItem.style.background = '#fff';
            trackItem.style.borderWidth = '1px';
          } else {
            // Stop all other players first
            document.querySelectorAll('audio').forEach(function(audio) {
              if(!audio.paused) {
                audio.pause();
              }
            });
            
            // If it's a different track, load and play it
            if(!isCurrentTrack) {
              player.src = trackSrc;
              player.load();
            }
            
            // Play the track
            player.play().catch(function(error) {
              console.log('Playback failed:', error);
            });
            
            // Remove active class from all tracks in this player's group
            var allTracks = document.querySelectorAll('[data-player="' + playerId + '"]');
            allTracks.forEach(function(track) {
              track.style.background = '#fff';
              track.style.borderWidth = '1px';
            });
            
            // Highlight the selected track
            trackItem.style.background = '#f3e2c9';
            trackItem.style.borderWidth = '2px';
          }
        }
      }
    }
  });
});