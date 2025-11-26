// Händelt Diskografie Dropdowns, News Pagination und Carousel
// NOTE: Video autoplay is handled by video-autoplay.js

// ROKKO Brand Colors - from COLOR_GUIDE.md
var ROKKO_COLORS = {
  SAND: '#E0C290',           // Permanent sand interior (IMMUTABLE)
  ACCENT: '#B8935F',         // Accent sand/brown
  BROWN_DARK: '#3D2817',     // Dark brown frame borders
  BROWN: '#201613'           // Dark brown text
};

// Artist ID to name mapping for template player integration
var ARTIST_NAME_MAP = {
  'vandango': 'Skaramush Vandango',
  'schablonski': 'Skank Schablonski',
  'bellieu': 'Henri Bellieu',
  'beunie': 'Fléur et Beunié'
};

document.addEventListener('DOMContentLoaded', function(){

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
              
              // Note: Artist image is clickable to close modal (handled by parent click handler)
              // The audio player is available inline below in the artist profile
              
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
            
            // Remove highlight from all tracks in this player's group
            var allWidgetTracks = document.querySelectorAll('.track-item-widget[data-player="' + playerId + '"]');
            allWidgetTracks.forEach(function(track) {
              track.style.background = 'transparent';
            });
            
            // Highlight the selected track with semi-transparent brown bar
            trackItemWidget.style.background = 'rgba(61, 40, 23, 0.3)';
          }
        }
      }
    }
  });
  
  // Handle audio pause event - update track highlighting
  document.querySelectorAll('audio').forEach(function(player) {
    player.addEventListener('pause', function() {
      // Keep highlight on paused track (no change needed)
    });
    
    player.addEventListener('play', function() {
      var playerId = player.id;
      var currentSrc = player.src;
      
      // Highlight current track with semi-transparent brown bar
      var allWidgetTracks = document.querySelectorAll('.track-item-widget[data-player="' + playerId + '"]');
      allWidgetTracks.forEach(function(track) {
        var trackSrc = track.getAttribute('data-src');
        if(currentSrc.indexOf(trackSrc) !== -1) {
          track.style.background = 'rgba(61, 40, 23, 0.3)';
        } else {
          track.style.background = 'transparent';
        }
      });
    });
  });

  // Music Productions - Horizontal Album Carousel with Dropdown
  var artistAlbums = {
    'Skaramush Vandango': {
      cover: 'mp3/vandango/cover.png',
      albumName: 'Neurocentric',
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
    'Skank Schablonski': {
      cover: 'mp3/schablonski/kohle_raus_cover.png',
      albumName: 'Kohle Raus',
      tracks: [
        { src: 'mp3/schablonski/kohle_raus.m4a', title: 'Kohle Raus' },
        { src: 'mp3/schablonski/kohle_raus_rmx.m4a', title: 'Kohle Raus (Remix)' }
      ]
    },
    'Henri Bellieu': {
      cover: 'mp3/bellieu/petite_colibri.png',
      albumName: 'Petite Colibri',
      tracks: [
        { src: 'mp3/bellieu/petite_colibri.m4a', title: 'Petite Colibri' },
        { src: 'mp3/bellieu/petite_colibri_ennio_mix.m4a', title: 'Petite Colibri (Ennio Mix)' },
        { src: 'mp3/bellieu/petite_colibri_nocturne_mix.m4a', title: 'Petite Colibri (Nocturne Mix)' }
      ]
    },
    'Fléur et Beunié': {
      cover: 'mp3/fleurbeunie/feu_leger_cover.png',
      albumName: 'Feu Leger',
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
  
  var currentArtist = null;
  var currentTrackIndex = 0;
  var currentTracks = [];
  var selectedCardElement = null;
  
  // Build horizontal album carousel with infinite loop
  if(albumCarousel) {
    var artistNames = Object.keys(artistAlbums);
    
    // Create cards for each artist (we'll duplicate them for infinite scroll effect)
    var createCard = function(artistName) {
      var album = artistAlbums[artistName];
      var albumCard = document.createElement('div');
      albumCard.className = 'album-card';
      albumCard.setAttribute('data-artist', artistName);
      albumCard.style.cssText = 'min-width: 180px; max-width: 180px; cursor: pointer; transition: all 0.3s ease; position: relative; flex-shrink: 0; background: #997A4B; padding: 12px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; scroll-snap-align: center;';
      
      albumCard.innerHTML = 
        '<div style="width: 160px; height: 160px; position: relative; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); transition: all 0.3s ease; flex-shrink: 0;">' +
        '<img src="' + album.cover + '" alt="' + artistName + '" style="width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease;">' +
        '</div>' +
        '<div style="text-align: center; margin-top: 8px; width: 100%;">' +
        '<div style="color: #E0C290; font-size: 0.55em; font-weight: 600; line-height: 1.3;">' + artistName + ' – ' + album.albumName + '</div>' +
        '</div>';
      
      // Hover effects
      albumCard.addEventListener('mouseenter', function() {
        var img = this.querySelector('img');
        img.style.transform = 'scale(1.05)';
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
      });
      
      albumCard.addEventListener('mouseleave', function() {
        // Only reset if not selected
        if(selectedCardElement !== this) {
          var img = this.querySelector('img');
          img.style.transform = 'scale(1)';
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = 'none';
        }
      });
      
      // Click to open inline dropdown player with zoom effect
      albumCard.addEventListener('click', function() {
        var card = this;
        if (artistAlbums[artistName]) {
          // Reset previous selected card
          if(selectedCardElement && selectedCardElement !== card) {
            var prevImg = selectedCardElement.querySelector('img');
            if(prevImg) prevImg.style.transform = 'scale(1)';
            selectedCardElement.style.transform = 'translateY(0)';
            selectedCardElement.style.boxShadow = 'none';
            selectedCardElement.style.zIndex = '1';
          }
          
          // Apply zoom effect to clicked card
          var img = card.querySelector('img');
          if(img) {
            img.style.transform = 'scale(1.15)';
          }
          card.style.transform = 'translateY(-8px) scale(1.08)';
          card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.5)';
          card.style.zIndex = '10';
          selectedCardElement = card;
          
          loadArtist(artistName);
          // Scroll to player
          if(playerDropdown) {
            playerDropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
      
      return albumCard;
    };
    
    // Add cards multiple times for infinite scroll effect (more duplicates for smoother loop)
    for(var i = 0; i < 5; i++) {
      artistNames.forEach(function(artistName) {
        albumCarousel.appendChild(createCard(artistName));
      });
    }
    
    // Set initial scroll position to middle set to enable seamless scrolling in both directions
    var singleSetWidth = (artistNames.length * 195); // 180px width + 15px gap
    albumCarousel.scrollLeft = singleSetWidth * 2; // Start at middle
    
    // Enable infinite scrolling by repositioning when reaching boundaries
    var isScrolling = false;
    albumCarousel.addEventListener('scroll', function() {
      if(isScrolling) return;
      
      var scrollLeft = this.scrollLeft;
      var scrollWidth = this.scrollWidth;
      var clientWidth = this.clientWidth;
      var singleSetWidth = (artistNames.length * 195);
      
      // If scrolled too far right, jump back seamlessly
      if (scrollLeft >= singleSetWidth * 4) {
        isScrolling = true;
        this.scrollLeft = scrollLeft - singleSetWidth;
        setTimeout(function() { isScrolling = false; }, 50);
      }
      
      // If scrolled too far left, jump forward seamlessly
      if (scrollLeft <= singleSetWidth) {
        isScrolling = true;
        this.scrollLeft = scrollLeft + singleSetWidth;
        setTimeout(function() { isScrolling = false; }, 50);
      }
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
      var coverUrl = artistAlbums[artistName].cover;
      
      currentTracks.forEach(function(track, index) {
        var songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.setAttribute('data-index', index);
        songItem.style.cssText = 'padding: 8px 12px; cursor: pointer; transition: all 0.2s ease; border-radius: 6px; display: flex; align-items: center; gap: 10px; background: ' + ROKKO_COLORS.ACCENT + '; margin: 3px 0; border: 1px solid ' + ROKKO_COLORS.BROWN_DARK + ';';
        
        songItem.innerHTML = 
          '<img src="' + coverUrl + '" alt="Cover" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px; flex-shrink: 0; border: 1px solid ' + ROKKO_COLORS.BROWN_DARK + ';">' +
          '<span style="color: ' + ROKKO_COLORS.BROWN_DARK + '; font-size: 0.75em; min-width: 25px; font-weight: 600;">' + (index + 1) + '.</span>' +
          '<span style="color: ' + ROKKO_COLORS.BROWN + '; font-size: 0.85em; flex: 1; font-weight: 600;">' + track.title + '</span>';
        
        songItem.addEventListener('mouseenter', function() {
          this.style.background = ROKKO_COLORS.SAND;
          this.style.transform = 'translateX(3px)';
        });
        
        songItem.addEventListener('mouseleave', function() {
          if(parseInt(this.getAttribute('data-index')) !== currentTrackIndex) {
            this.style.background = ROKKO_COLORS.ACCENT;
            this.style.transform = 'translateX(0)';
          }
        });
        
        songItem.addEventListener('click', function() {
          var idx = parseInt(this.getAttribute('data-index'));
          loadTrack(idx);
          // Auto-play when clicking on a track
          if(artistPlayer) {
            artistPlayer.play().catch(function(e) { console.log(e); });
          }
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
    
    // Update play/pause button - buttons are transparent overlays on playerleiste.png
    // No text content needed
    
    // Highlight active song
    updateSongListHighlight();
  }
  
  // Update song list highlighting
  function updateSongListHighlight() {
    if(!artistSongList) return;
    
    var songItems = artistSongList.querySelectorAll('.song-item');
    songItems.forEach(function(item, i) {
      if(i === currentTrackIndex) {
        item.style.background = ROKKO_COLORS.SAND;
        item.style.borderColor = ROKKO_COLORS.BROWN;
        item.style.borderWidth = '2px';
        var numSpan = item.querySelector('span:first-child');
        var titleSpan = item.querySelector('span:last-child');
        if(numSpan) numSpan.style.color = ROKKO_COLORS.BROWN;
        if(titleSpan) titleSpan.style.fontWeight = '700';
      } else {
        item.style.background = ROKKO_COLORS.ACCENT;
        item.style.borderColor = ROKKO_COLORS.BROWN_DARK;
        item.style.borderWidth = '1px';
        var numSpan = item.querySelector('span:first-child');
        var titleSpan = item.querySelector('span:last-child');
        if(numSpan) numSpan.style.color = ROKKO_COLORS.BROWN_DARK;
        if(titleSpan) titleSpan.style.fontWeight = '600';
      }
    });
  }
  
  // Listen to player events
  if(artistPlayer) {
    artistPlayer.addEventListener('play', function() {
      updateSongListHighlight();
    });
    
    artistPlayer.addEventListener('pause', function() {
      // No action needed on pause
    });
    
    artistPlayer.addEventListener('ended', function() {
      // Auto-advance to next track
      var newIndex = currentTrackIndex + 1;
      if(newIndex >= currentTracks.length) newIndex = 0;
      loadTrack(newIndex);
      artistPlayer.play().catch(function(e) { console.log(e); });
    });
  }
  
  // Waveform Progress Bar Functionality
  function formatTime(seconds) {
    if(isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }
  
  function updateWaveformProgress(player, waveformContainer) {
    if(!player || !waveformContainer) return;
    
    var fill = waveformContainer.querySelector('.waveform-fill');
    var timeDisplay = waveformContainer.querySelector('.waveform-time');
    
    if(fill && player.duration && isFinite(player.duration)) {
      var progress = (player.currentTime / player.duration) * 100;
      fill.style.width = progress + '%';
    }
    
    if(timeDisplay && player.duration && isFinite(player.duration)) {
      timeDisplay.textContent = formatTime(player.currentTime) + ' / ' + formatTime(player.duration);
    }
  }
  
  function setupWaveformForPlayer(playerId) {
    var player = document.getElementById(playerId);
    var waveformContainer = document.querySelector('.waveform-progress[data-player="' + playerId + '"]');
    
    if(!player || !waveformContainer) return;
    
    // Update progress during playback
    player.addEventListener('timeupdate', function() {
      updateWaveformProgress(player, waveformContainer);
    });
    
    // Update time display when duration is known
    player.addEventListener('loadedmetadata', function() {
      var timeDisplay = waveformContainer.querySelector('.waveform-time');
      if(timeDisplay && player.duration && isFinite(player.duration)) {
        timeDisplay.textContent = '0:00 / ' + formatTime(player.duration);
      }
    });
    
    // Click to seek
    waveformContainer.addEventListener('click', function(e) {
      if(!player.duration || !isFinite(player.duration)) return;
      
      var rect = waveformContainer.getBoundingClientRect();
      var clickX = e.clientX - rect.left;
      var percentage = Math.max(0, Math.min(1, clickX / rect.width));
      player.currentTime = percentage * player.duration;
      
      // If not playing, start playing
      if(player.paused) {
        player.play().catch(function(err) { console.log('[' + playerId + '] Waveform seek playback failed:', err); });
      }
    });
    
    // Reset progress when track ends
    player.addEventListener('ended', function() {
      var fill = waveformContainer.querySelector('.waveform-fill');
      if(fill) fill.style.width = '0%';
    });
  }
  
  // Initialize waveform for all players
  setupWaveformForPlayer('player-vandango');
  setupWaveformForPlayer('player-schablonski');
  setupWaveformForPlayer('player-bellieu');
  setupWaveformForPlayer('player-beunie');
  setupWaveformForPlayer('artist-player');
  
  // Audio Player Modal Functions
  var audioPlayerModal = document.getElementById('audioPlayerModal');
  var modalAudioPlayer = document.getElementById('modal-audio-player');
  var modalCurrentTrack = document.getElementById('modal-current-track');
  var modalCoverImage = document.getElementById('modal-cover-image');
  var modalArtistName = document.getElementById('modal-artist-name');
  var modalTrackList = document.getElementById('modal-track-list');
  var closeAudioPlayerModalBtn = document.getElementById('closeAudioPlayerModal');
  
  var modalCurrentArtist = null;
  var modalCurrentTrackIndex = 0;
  var modalCurrentTracks = [];
  
  // Open audio player modal with artist data
  function openAudioPlayerModal(artistName) {
    if(!artistAlbums[artistName] || !audioPlayerModal) return;
    
    var album = artistAlbums[artistName];
    modalCurrentArtist = artistName;
    modalCurrentTracks = album.tracks;
    modalCurrentTrackIndex = 0;
    
    // Pause all audio
    document.querySelectorAll('audio').forEach(function(audio) {
      if(!audio.paused) audio.pause();
    });
    
    // Set artist name and cover
    if(modalArtistName) modalArtistName.textContent = artistName;
    if(modalCoverImage) modalCoverImage.src = album.cover;
    
    // Build track list
    if(modalTrackList) {
      modalTrackList.innerHTML = '';
      modalCurrentTracks.forEach(function(track, index) {
        var trackItem = document.createElement('div');
        trackItem.className = 'track-item-widget modal-track-item';
        trackItem.setAttribute('data-index', index);
        trackItem.style.cssText = 'display: flex; align-items: center; gap: 10px; padding: 10px; margin: 5px 0; background: ' + ROKKO_COLORS.ACCENT + '; border: 2px solid ' + ROKKO_COLORS.BROWN_DARK + '; border-radius: 6px; cursor: pointer; transition: all 0.2s; position: relative;';
        
        trackItem.innerHTML = 
          '<div class="track-cover-mini" style="width: 35px; height: 35px; flex-shrink: 0; position: relative;">' +
          '<img loading="lazy" src="' + album.cover + '" alt="Cover" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px; border: 1px solid ' + ROKKO_COLORS.BROWN_DARK + ';">' +
          '<div class="play-indicator" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: ' + ROKKO_COLORS.BROWN + '; font-size: 10px; font-weight: bold; background: rgba(224, 194, 144, 0.9); padding: 2px 4px; border-radius: 3px;">PLAY</div>' +
          '</div>' +
          '<div style="flex: 1; color: ' + ROKKO_COLORS.BROWN + '; font-size: 0.85em; font-weight: 600;">' + track.title + '</div>';
        
        trackItem.addEventListener('click', function() {
          loadModalTrack(parseInt(this.getAttribute('data-index')));
        });
        
        modalTrackList.appendChild(trackItem);
      });
    }
    
    // Load first track
    loadModalTrack(0);
    
    // Show modal
    audioPlayerModal.style.display = 'block';
    audioPlayerModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  
  // Load track in modal
  function loadModalTrack(index) {
    if(index < 0 || index >= modalCurrentTracks.length || !modalAudioPlayer) return;
    
    modalCurrentTrackIndex = index;
    var track = modalCurrentTracks[index];
    
    // Pause all other audio
    document.querySelectorAll('audio').forEach(function(audio) {
      if(audio !== modalAudioPlayer && !audio.paused) audio.pause();
    });
    
    // Load and play track
    modalAudioPlayer.src = track.src;
    modalAudioPlayer.load();
    modalAudioPlayer.play().catch(function(e) { console.log('Modal playback failed:', e); });
    
    // Update current track display
    if(modalCurrentTrack) {
      modalCurrentTrack.textContent = track.title;
    }
    
    // Update track list highlights
    updateModalTrackListHighlight();
  }
  
  // Update track list highlighting in modal
  function updateModalTrackListHighlight() {
    if(!modalTrackList) return;
    
    var allTracks = modalTrackList.querySelectorAll('.modal-track-item');
    allTracks.forEach(function(item, index) {
      var playIndicator = item.querySelector('.play-indicator');
      if(index === modalCurrentTrackIndex) {
        item.style.background = '#f3e2c9';
        if(playIndicator) playIndicator.style.display = 'block';
      } else {
        item.style.background = '#A68968';
        if(playIndicator) playIndicator.style.display = 'none';
      }
    });
  }
  
  // Close modal button
  if(closeAudioPlayerModalBtn) {
    closeAudioPlayerModalBtn.addEventListener('click', function() {
      if(audioPlayerModal) {
        audioPlayerModal.style.display = 'none';
        audioPlayerModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Pause modal audio
        if(modalAudioPlayer && !modalAudioPlayer.paused) {
          modalAudioPlayer.pause();
        }
      }
    });
  }
  
  // Close modal when clicking outside
  if(audioPlayerModal) {
    audioPlayerModal.addEventListener('click', function(e) {
      if(e.target === audioPlayerModal) {
        closeAudioPlayerModalBtn.click();
      }
    });
  }
  
  // Close modal on ESC key
  document.addEventListener('keydown', function(e) {
    if(e.key === 'Escape' && audioPlayerModal && audioPlayerModal.style.display === 'block') {
      closeAudioPlayerModalBtn.click();
    }
  });
  
  // Handle clicks on artist cover images in artist profiles
  document.body.addEventListener('click', function(e) {
    var coverImage = e.target.closest('.artist-cover-clickable');
    if(coverImage) {
      e.preventDefault();
      e.stopPropagation();
      
      var artistName = coverImage.getAttribute('data-artist');
      if(artistName) {
        // Add hover effect
        coverImage.style.transform = 'scale(1.05)';
        setTimeout(function() {
          coverImage.style.transform = 'scale(1)';
        }, 200);
        
        openAudioPlayerModal(artistName);
      }
    }
  });
  
  // Auto-advance to next track when current ends
  if(modalAudioPlayer) {
    modalAudioPlayer.addEventListener('ended', function() {
      var nextIndex = modalCurrentTrackIndex + 1;
      if(nextIndex >= modalCurrentTracks.length) nextIndex = 0;
      loadModalTrack(nextIndex);
    });
    
    modalAudioPlayer.addEventListener('play', function() {
      updateModalTrackListHighlight();
    });
  }

  // Scroll to Top Button functionality
  var scrollToTopBtn = document.getElementById('scrollToTop');
  
  if(scrollToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'block';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    });
    
    // Smooth scroll to top when clicked
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Hover effect
    scrollToTopBtn.addEventListener('mouseenter', function() {
      this.style.background = '#2d1f1b';
      this.style.transform = 'scale(1.1)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
      this.style.background = 'var(--rokko-brown)';
      this.style.transform = 'scale(1)';
    });
  }
});