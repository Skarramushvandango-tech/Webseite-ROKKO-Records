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
    
    // Check if clicked element is a track-item-widget or its child
    var trackItemWidget = target.closest('.track-item-widget');
    if(trackItemWidget) {
      e.stopPropagation();
      
      var trackSrc = trackItemWidget.getAttribute('data-src');
      var playerId = trackItemWidget.getAttribute('data-player');
      var trackTitle = trackItemWidget.getAttribute('data-title');
      
      if(trackSrc && playerId) {
        var player = document.getElementById(playerId);
        var currentTrackDisplay = document.getElementById('current-track-' + playerId.replace('player-', ''));
        
        if(player) {
          // Check if this track is currently playing
          var isCurrentTrack = (player.src.indexOf(trackSrc) !== -1);
          var isPlaying = !player.paused;
          
          if(isCurrentTrack && isPlaying) {
            // Pause if currently playing this track
            player.pause();
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
              
              // Update current track display
              if(currentTrackDisplay && trackTitle) {
                currentTrackDisplay.textContent = trackTitle;
              }
            }
            
            // Play the track
            player.play().catch(function(error) {
              console.log('Playback failed:', error);
            });
            
            // Remove active class from all tracks in this player's group
            var allWidgetTracks = document.querySelectorAll('.track-item-widget[data-player="' + playerId + '"]');
            allWidgetTracks.forEach(function(track) {
              track.style.background = '#fff';
              var playIndicator = track.querySelector('.play-indicator');
              if(playIndicator) {
                playIndicator.style.display = 'none';
              }
            });
            
            // Highlight the selected track and show play indicator
            trackItemWidget.style.background = '#f3e2c9';
            var playIndicator = trackItemWidget.querySelector('.play-indicator');
            if(playIndicator) {
              playIndicator.style.display = 'block';
            }
          }
        }
      }
    }
  });
  
  // Handle audio pause event to hide play indicators
  document.querySelectorAll('audio').forEach(function(player) {
    player.addEventListener('pause', function() {
      var playerId = player.id;
      var allWidgetTracks = document.querySelectorAll('.track-item-widget[data-player="' + playerId + '"]');
      allWidgetTracks.forEach(function(track) {
        var playIndicator = track.querySelector('.play-indicator');
        if(playIndicator) {
          playIndicator.style.display = 'none';
        }
      });
    });
    
    player.addEventListener('play', function() {
      var playerId = player.id;
      var currentSrc = player.src;
      
      // Find and show play indicator for current track
      var allWidgetTracks = document.querySelectorAll('.track-item-widget[data-player="' + playerId + '"]');
      allWidgetTracks.forEach(function(track) {
        var trackSrc = track.getAttribute('data-src');
        var playIndicator = track.querySelector('.play-indicator');
        if(playIndicator) {
          if(currentSrc.indexOf(trackSrc) !== -1) {
            playIndicator.style.display = 'block';
            track.style.background = '#f3e2c9';
          } else {
            playIndicator.style.display = 'none';
            track.style.background = '#fff';
          }
        }
      });
    });
  });

  // Music Productions Carousel functionality
  var carouselTracks = [
    // Skaramush Vandango tracks
    { src: 'mp3/vandango/set_the_fire.m4a', title: 'Set the Fire', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/set_the_fire_remix.m4a', title: 'Set the Fire (Remix)', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/always_sunny.m4a', title: 'Always Sunny', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/borrowed_time.m4a', title: 'Borrowed Time', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/like_water.m4a', title: 'Like Water', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/love_song.m4a', title: 'Love Song', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/man_on_a_mission.m4a', title: 'Man on a Mission', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/nights_go_by.m4a', title: 'Nights Go By', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/no_stitch_no_story.m4a', title: 'No Stitch No Story', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/oh_i_try.m4a', title: 'Oh I Try', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/system_failure_kortana_mix.m4a', title: 'System Failure (Kortana Mix)', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/tiptoes.m4a', title: 'Tiptoes', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/what_you_need.m4a', title: 'What You Need', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    { src: 'mp3/vandango/among_the_crowd.m4a', title: 'Among the Crowd', artist: 'Skaramush Vandango', cover: 'mp3/vandango/cover.png' },
    // Ska Schablonski tracks
    { src: 'mp3/schablonski/kohle_raus.m4a', title: 'Kohle Raus', artist: 'Ska Schablonski', cover: 'mp3/schablonski/kohle_raus_cover.png' },
    { src: 'mp3/schablonski/kohle_raus_rmx.m4a', title: 'Kohle Raus (Remix)', artist: 'Ska Schablonski', cover: 'mp3/schablonski/kohle_raus_cover.png' },
    // Henri Bellieu tracks
    { src: 'mp3/bellieu/petite_colibri.m4a', title: 'Petite Colibri', artist: 'Henri Bellieu', cover: 'mp3/bellieu/petite_colibri.png' },
    { src: 'mp3/bellieu/petite_colibri_ennio_mix.m4a', title: 'Petite Colibri (Ennio Mix)', artist: 'Henri Bellieu', cover: 'mp3/bellieu/petite_colibri.png' },
    { src: 'mp3/bellieu/petite_colibri_nocturne_mix.m4a', title: 'Petite Colibri (Nocturne Mix)', artist: 'Henri Bellieu', cover: 'mp3/bellieu/petite_colibri.png' },
    // Fleuret Beunie tracks
    { src: 'mp3/fleurbeunie/feuleger_main.m4a', title: 'Feu Leger (Main)', artist: 'Fleuret Beunie', cover: 'mp3/fleurbeunie/feu_leger_cover.png' },
    { src: 'mp3/fleurbeunie/feuleger_house.m4a', title: 'Feu Leger (House)', artist: 'Fleuret Beunie', cover: 'mp3/fleurbeunie/feu_leger_cover.png' },
    { src: 'mp3/fleurbeunie/feuleger_sundown.m4a', title: 'Feu Leger (Sundown)', artist: 'Fleuret Beunie', cover: 'mp3/fleurbeunie/feu_leger_cover.png' },
    { src: 'mp3/fleurbeunie/feuleger_electricclub1.m4a', title: 'Feu Leger (Electric Club)', artist: 'Fleuret Beunie', cover: 'mp3/fleurbeunie/feu_leger_cover.png' },
    { src: 'mp3/fleurbeunie/feuleger_frenchclassic.m4a', title: 'Feu Leger (French Classic)', artist: 'Fleuret Beunie', cover: 'mp3/fleurbeunie/feu_leger_cover.png' }
  ];

  var currentCarouselIndex = 0;
  var carouselPlayer = document.getElementById('carousel-player');
  var carouselCover = document.getElementById('carousel-cover');
  var carouselTrackInfo = document.getElementById('carousel-track-info');
  var carouselTrackGrid = document.getElementById('carousel-track-grid');
  
  if(carouselPlayer && carouselCover && carouselTrackInfo && carouselTrackGrid) {
    // Build track grid
    carouselTracks.forEach(function(track, index) {
      var trackCard = document.createElement('div');
      trackCard.className = 'carousel-track-card';
      trackCard.setAttribute('data-index', index);
      trackCard.style.cssText = 'background: #fff; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.1); text-align: center;';
      
      trackCard.innerHTML = 
        '<img src="' + track.cover + '" alt="' + track.title + '" style="width: 100%; border-radius: 6px; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">' +
        '<div style="font-size: 0.85em; font-weight: 600; color: #201613; margin-bottom: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="' + track.title + '">' + track.title + '</div>' +
        '<div style="font-size: 0.75em; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="' + track.artist + '">' + track.artist + '</div>';
      
      trackCard.addEventListener('click', function() {
        loadCarouselTrack(index);
      });
      
      trackCard.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
        this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
        this.style.background = '#f3e2c9';
      });
      
      trackCard.addEventListener('mouseleave', function() {
        if(index !== currentCarouselIndex) {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
          this.style.background = '#fff';
        }
      });
      
      carouselTrackGrid.appendChild(trackCard);
    });
    
    // Load and play track function
    function loadCarouselTrack(index) {
      if(index < 0 || index >= carouselTracks.length) return;
      
      currentCarouselIndex = index;
      var track = carouselTracks[index];
      
      // Pause all other audio players
      document.querySelectorAll('audio').forEach(function(audio) {
        if(audio !== carouselPlayer && !audio.paused) {
          audio.pause();
        }
      });
      
      // Update player
      carouselPlayer.src = track.src;
      carouselPlayer.load();
      carouselPlayer.play().catch(function(error) {
        console.log('Carousel playback failed:', error);
      });
      
      // Update cover with animation
      carouselCover.style.opacity = '0.5';
      carouselCover.style.transform = 'scale(0.95)';
      setTimeout(function() {
        carouselCover.src = track.cover;
        carouselCover.style.opacity = '1';
        carouselCover.style.transform = 'scale(1)';
      }, 200);
      
      // Update track info
      carouselTrackInfo.innerHTML = 
        '<div style="font-size: 1.1em; margin-bottom: 5px;">' + track.title + '</div>' +
        '<div style="font-size: 0.9em; opacity: 0.8;">' + track.artist + '</div>';
      
      // Update track grid highlighting
      var trackCards = carouselTrackGrid.querySelectorAll('.carousel-track-card');
      trackCards.forEach(function(card, i) {
        if(i === index) {
          card.style.background = '#C9A66F';
          card.style.transform = 'translateY(-4px)';
          card.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        } else {
          card.style.background = '#fff';
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        }
      });
    }
    
    // Previous track button
    var prevBtn = document.getElementById('carousel-prev');
    if(prevBtn) {
      prevBtn.addEventListener('click', function() {
        var newIndex = currentCarouselIndex - 1;
        if(newIndex < 0) newIndex = carouselTracks.length - 1;
        loadCarouselTrack(newIndex);
      });
      
      prevBtn.addEventListener('mouseenter', function() {
        this.style.background = '#E0C290';
        this.style.color = '#201613';
        this.style.transform = 'scale(1.1)';
      });
      
      prevBtn.addEventListener('mouseleave', function() {
        this.style.background = '#3D2817';
        this.style.color = '#E0C290';
        this.style.transform = 'scale(1)';
      });
    }
    
    // Next track button
    var nextBtn = document.getElementById('carousel-next');
    if(nextBtn) {
      nextBtn.addEventListener('click', function() {
        var newIndex = currentCarouselIndex + 1;
        if(newIndex >= carouselTracks.length) newIndex = 0;
        loadCarouselTrack(newIndex);
      });
      
      nextBtn.addEventListener('mouseenter', function() {
        this.style.background = '#E0C290';
        this.style.color = '#201613';
        this.style.transform = 'scale(1.1)';
      });
      
      nextBtn.addEventListener('mouseleave', function() {
        this.style.background = '#3D2817';
        this.style.color = '#E0C290';
        this.style.transform = 'scale(1)';
      });
    }
    
    // Shuffle button
    var shuffleBtn = document.getElementById('carousel-shuffle');
    if(shuffleBtn) {
      shuffleBtn.addEventListener('click', function() {
        var randomIndex = Math.floor(Math.random() * carouselTracks.length);
        loadCarouselTrack(randomIndex);
      });
      
      shuffleBtn.addEventListener('mouseenter', function() {
        this.style.background = '#E0C290';
        this.style.color = '#201613';
        this.style.transform = 'scale(1.05)';
      });
      
      shuffleBtn.addEventListener('mouseleave', function() {
        this.style.background = '#3D2817';
        this.style.color = '#E0C290';
        this.style.transform = 'scale(1)';
      });
    }
    
    // Auto-play next track when current ends
    carouselPlayer.addEventListener('ended', function() {
      var nextIndex = currentCarouselIndex + 1;
      if(nextIndex >= carouselTracks.length) nextIndex = 0;
      loadCarouselTrack(nextIndex);
    });
    
    // Highlight first track on load
    loadCarouselTrack(0);
    carouselPlayer.pause(); // Start paused, user must click play
  }
});