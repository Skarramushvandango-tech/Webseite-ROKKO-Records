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

  // Music Productions - Horizontal Album Carousel with Dropdown
  var artistAlbums = {
    'Skaramush Vandango': {
      cover: 'mp3/vandango/cover.png',
      tracks: [
        { src: 'mp3/vandango/set_the_fire.m4a', title: 'Set the Fire' },
        { src: 'mp3/vandango/set_the_fire_remix.m4a', title: 'Set the Fire (Remix)' },
        { src: 'mp3/vandango/always_sunny.m4a', title: 'Always Sunny' },
        { src: 'mp3/vandango/borrowed_time.m4a', title: 'Borrowed Time' },
        { src: 'mp3/vandango/like_water.m4a', title: 'Like Water' },
        { src: 'mp3/vandango/love_song.m4a', title: 'Love Song' },
        { src: 'mp3/vandango/man_on_a_mission.m4a', title: 'Man on a Mission' },
        { src: 'mp3/vandango/nights_go_by.m4a', title: 'Nights Go By' },
        { src: 'mp3/vandango/no_stitch_no_story.m4a', title: 'No Stitch No Story' },
        { src: 'mp3/vandango/oh_i_try.m4a', title: 'Oh I Try' },
        { src: 'mp3/vandango/system_failure_kortana_mix.m4a', title: 'System Failure (Kortana Mix)' },
        { src: 'mp3/vandango/tiptoes.m4a', title: 'Tiptoes' },
        { src: 'mp3/vandango/what_you_need.m4a', title: 'What You Need' },
        { src: 'mp3/vandango/among_the_crowd.m4a', title: 'Among the Crowd' }
      ]
    },
    'Ska Schablonski': {
      cover: 'mp3/schablonski/kohle_raus_cover.png',
      tracks: [
        { src: 'mp3/schablonski/kohle_raus.m4a', title: 'Kohle Raus' },
        { src: 'mp3/schablonski/kohle_raus_rmx.m4a', title: 'Kohle Raus (Remix)' }
      ]
    },
    'Henri Bellieu': {
      cover: 'mp3/bellieu/petite_colibri.png',
      tracks: [
        { src: 'mp3/bellieu/petite_colibri.m4a', title: 'Petite Colibri' },
        { src: 'mp3/bellieu/petite_colibri_ennio_mix.m4a', title: 'Petite Colibri (Ennio Mix)' },
        { src: 'mp3/bellieu/petite_colibri_nocturne_mix.m4a', title: 'Petite Colibri (Nocturne Mix)' }
      ]
    },
    'Fleuret Beunie': {
      cover: 'mp3/fleurbeunie/feu_leger_cover.png',
      tracks: [
        { src: 'mp3/fleurbeunie/feuleger_main.m4a', title: 'Feu Leger (Main)' },
        { src: 'mp3/fleurbeunie/feuleger_house.m4a', title: 'Feu Leger (House)' },
        { src: 'mp3/fleurbeunie/feuleger_sundown.m4a', title: 'Feu Leger (Sundown)' },
        { src: 'mp3/fleurbeunie/feuleger_electricclub1.m4a', title: 'Feu Leger (Electric Club)' },
        { src: 'mp3/fleurbeunie/feuleger_frenchclassic.m4a', title: 'Feu Leger (French Classic)' }
      ]
    }
  };

  // Horizontal Album Carousel Implementation
  var albumCarousel = document.getElementById('album-carousel');
  var playerDropdown = document.getElementById('artist-player-dropdown');
  var artistPlayer = document.getElementById('artist-player');
  var artistTrackTitle = document.getElementById('artist-track-title');
  var artistNameDisplay = document.getElementById('artist-name-display');
  var artistSongList = document.getElementById('artist-song-list');
  var artistPrevBtn = document.getElementById('artist-prev');
  var artistNextBtn = document.getElementById('artist-next');
  var artistPlayPauseBtn = document.getElementById('artist-play-pause');
  
  var currentArtist = null;
  var currentTrackIndex = 0;
  var currentTracks = [];
  
  // Build horizontal album carousel
  if(albumCarousel) {
    Object.keys(artistAlbums).forEach(function(artistName) {
      var album = artistAlbums[artistName];
      var albumCard = document.createElement('div');
      albumCard.className = 'album-card';
      albumCard.setAttribute('data-artist', artistName);
      albumCard.style.cssText = 'min-width: 200px; cursor: pointer; transition: all 0.3s ease; position: relative;';
      
      albumCard.innerHTML = 
        '<div style="position: relative; overflow: hidden; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); transition: all 0.3s ease;">' +
        '<img src="' + album.cover + '" alt="' + artistName + '" style="width: 200px; height: 200px; object-fit: cover; display: block; transition: transform 0.3s ease;">' +
        '<div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(32,22,19,0.95), transparent); padding: 12px 10px 8px; opacity: 0; transition: opacity 0.3s ease;">' +
        '<div style="color: #E0C290; font-size: 0.85em; font-weight: 700; text-align: center;">' + artistName + '</div>' +
        '</div>' +
        '</div>';
      
      // Hover effects
      albumCard.addEventListener('mouseenter', function() {
        var img = this.querySelector('img');
        var overlay = this.querySelector('div > div:last-child');
        img.style.transform = 'scale(1.08)';
        overlay.style.opacity = '1';
        this.style.transform = 'translateY(-5px)';
      });
      
      albumCard.addEventListener('mouseleave', function() {
        var img = this.querySelector('img');
        var overlay = this.querySelector('div > div:last-child');
        img.style.transform = 'scale(1)';
        overlay.style.opacity = '0';
        this.style.transform = 'translateY(0)';
      });
      
      // Click to load artist
      albumCard.addEventListener('click', function() {
        loadArtist(artistName);
      });
      
      albumCarousel.appendChild(albumCard);
    });
  }
  
  // Load artist and show dropdown
  function loadArtist(artistName) {
    if(!artistAlbums[artistName]) return;
    
    currentArtist = artistName;
    currentTracks = artistAlbums[artistName].tracks;
    currentTrackIndex = 0;
    
    // Pause current playback
    if(artistPlayer && !artistPlayer.paused) {
      artistPlayer.pause();
    }
    
    // Update artist name
    if(artistNameDisplay) {
      artistNameDisplay.textContent = artistName;
    }
    
    // Build song list (elegant, minimalist)
    if(artistSongList) {
      artistSongList.innerHTML = '';
      
      currentTracks.forEach(function(track, index) {
        var songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.setAttribute('data-index', index);
        songItem.style.cssText = 'padding: 8px 12px; cursor: pointer; transition: all 0.2s ease; border-radius: 4px; display: flex; align-items: center; gap: 10px;';
        
        songItem.innerHTML = 
          '<span style="color: rgba(224, 194, 144, 0.5); font-size: 0.8em; min-width: 25px;">' + (index + 1) + '.</span>' +
          '<span style="color: #E0C290; font-size: 0.9em; flex: 1; font-weight: 400; letter-spacing: 0.3px;">' + track.title + '</span>' +
          '<span class="play-icon" style="color: rgba(224, 194, 144, 0.6); font-size: 0.75em; opacity: 0; transition: opacity 0.2s;">▶</span>';
        
        songItem.addEventListener('mouseenter', function() {
          this.style.background = 'rgba(224, 194, 144, 0.12)';
          this.querySelector('.play-icon').style.opacity = '1';
        });
        
        songItem.addEventListener('mouseleave', function() {
          if(parseInt(this.getAttribute('data-index')) !== currentTrackIndex) {
            this.style.background = 'transparent';
            this.querySelector('.play-icon').style.opacity = '0';
          }
        });
        
        songItem.addEventListener('click', function() {
          var idx = parseInt(this.getAttribute('data-index'));
          loadTrack(idx);
        });
        
        artistSongList.appendChild(songItem);
      });
    }
    
    // Load first track
    loadTrack(0);
    
    // Show dropdown with animation
    if(playerDropdown) {
      playerDropdown.style.maxHeight = '600px';
    }
  }
  
  // Load specific track
  function loadTrack(index) {
    if(index < 0 || index >= currentTracks.length) return;
    
    currentTrackIndex = index;
    var track = currentTracks[index];
    
    // Pause all other audio
    document.querySelectorAll('audio').forEach(function(audio) {
      if(audio !== artistPlayer && !audio.paused) {
        audio.pause();
      }
    });
    
    // Update player
    if(artistPlayer) {
      artistPlayer.src = track.src;
      artistPlayer.load();
    }
    
    // Update track info
    if(artistTrackTitle) {
      artistTrackTitle.textContent = track.title;
    }
    
    // Update play/pause button
    if(artistPlayPauseBtn) {
      artistPlayPauseBtn.textContent = '▶ Play';
    }
    
    // Highlight active song
    updateSongListHighlight();
  }
  
  // Update song list highlighting
  function updateSongListHighlight() {
    if(!artistSongList) return;
    
    var songItems = artistSongList.querySelectorAll('.song-item');
    songItems.forEach(function(item, i) {
      if(i === currentTrackIndex) {
        item.style.background = 'rgba(224, 194, 144, 0.15)';
        item.querySelector('.play-icon').style.opacity = '1';
        item.querySelector('span:first-child').style.color = '#E0C290';
        item.querySelector('span:nth-child(2)').style.fontWeight = '600';
      } else {
        item.style.background = 'transparent';
        item.querySelector('.play-icon').style.opacity = '0';
        item.querySelector('span:first-child').style.color = 'rgba(224, 194, 144, 0.5)';
        item.querySelector('span:nth-child(2)').style.fontWeight = '400';
      }
    });
  }
  
  // Previous button
  if(artistPrevBtn) {
    artistPrevBtn.addEventListener('click', function() {
      var newIndex = currentTrackIndex - 1;
      if(newIndex < 0) newIndex = currentTracks.length - 1;
      loadTrack(newIndex);
      if(artistPlayer && !artistPlayer.paused) {
        artistPlayer.play().catch(function(e) { console.log(e); });
      }
    });
    
    artistPrevBtn.addEventListener('mouseenter', function() {
      this.style.background = 'rgba(224, 194, 144, 0.15)';
      this.style.borderColor = '#E0C290';
    });
    
    artistPrevBtn.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
      this.style.borderColor = 'rgba(224, 194, 144, 0.4)';
    });
  }
  
  // Next button
  if(artistNextBtn) {
    artistNextBtn.addEventListener('click', function() {
      var newIndex = currentTrackIndex + 1;
      if(newIndex >= currentTracks.length) newIndex = 0;
      loadTrack(newIndex);
      if(artistPlayer && !artistPlayer.paused) {
        artistPlayer.play().catch(function(e) { console.log(e); });
      }
    });
    
    artistNextBtn.addEventListener('mouseenter', function() {
      this.style.background = 'rgba(224, 194, 144, 0.15)';
      this.style.borderColor = '#E0C290';
    });
    
    artistNextBtn.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
      this.style.borderColor = 'rgba(224, 194, 144, 0.4)';
    });
  }
  
  // Play/Pause button
  if(artistPlayPauseBtn) {
    artistPlayPauseBtn.addEventListener('click', function() {
      if(!artistPlayer) return;
      
      if(artistPlayer.paused) {
        artistPlayer.play().catch(function(e) { console.log(e); });
        this.textContent = '❚❚ Pause';
      } else {
        artistPlayer.pause();
        this.textContent = '▶ Play';
      }
    });
    
    artistPlayPauseBtn.addEventListener('mouseenter', function() {
      this.style.background = '#D4B584';
      this.style.transform = 'scale(1.05)';
    });
    
    artistPlayPauseBtn.addEventListener('mouseleave', function() {
      this.style.background = '#E0C290';
      this.style.transform = 'scale(1)';
    });
  }
  
  // Listen to player events
  if(artistPlayer) {
    artistPlayer.addEventListener('play', function() {
      if(artistPlayPauseBtn) {
        artistPlayPauseBtn.textContent = '❚❚ Pause';
      }
      updateSongListHighlight();
    });
    
    artistPlayer.addEventListener('pause', function() {
      if(artistPlayPauseBtn) {
        artistPlayPauseBtn.textContent = '▶ Play';
      }
    });
    
    artistPlayer.addEventListener('ended', function() {
      var newIndex = currentTrackIndex + 1;
      if(newIndex >= currentTracks.length) newIndex = 0;
      loadTrack(newIndex);
      artistPlayer.play().catch(function(e) { console.log(e); });
    });
  }
});