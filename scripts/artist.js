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

    // Prevent page scroll when dragging carousel
    carouselElem.addEventListener('touchstart', function() {
      document.body.style.overflow = 'hidden';
    });
    carouselElem.addEventListener('touchend', function() {
      document.body.style.overflow = '';
    });
  }

  // Toggle artist details when clicking carousel images
  document.querySelectorAll('.artist-header[data-artist]').forEach(function(header){
    header.addEventListener('click', function(){
      var artistId = this.dataset.artist;
      var detailsSection = document.getElementById('artist-' + artistId);
      
      if(detailsSection) {
        var dropdown = detailsSection.querySelector('.artist-dropdown');
        
        // Check if this dropdown is already open
        var isOpen = detailsSection.style.display === 'block' && dropdown && dropdown.style.maxHeight !== '0px';
        
        // Close all artist details first
        document.querySelectorAll('.artist-details').forEach(function(details){
          var dd = details.querySelector('.artist-dropdown');
          if(dd) {
            dd.style.maxHeight = '0';
            dd.style.overflow = 'hidden';
          }
          details.style.display = 'none';
        });
        
        // If it wasn't open, open this one
        if(!isOpen) {
          detailsSection.style.display = 'block';
          
          // Use a timeout to ensure display:block is applied before calculating height
          setTimeout(function() {
            if(dropdown) {
              // Calculate actual content height
              var contentHeight = dropdown.scrollHeight;
              // Set max-height to allow full expansion, then switch to visible overflow
              dropdown.style.maxHeight = Math.max(contentHeight, 3000) + 'px';
              
              // After transition, allow overflow to be visible
              setTimeout(function() {
                dropdown.style.overflow = 'visible';
              }, 500);
            }
            
            // Scroll to the details section smoothly
            setTimeout(function() {
              detailsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
          }, 10);
        }
      }
    });
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
  document.querySelectorAll('.disco-cover-small').forEach(function(el){
    el.addEventListener('click', function(e){
      e.stopPropagation(); // Prevent parent click
      var parent = el.closest('.release');
      var dd = parent.querySelector('.disco-dropdown');
      
      if(dd.style.maxHeight && dd.style.maxHeight !== '0px'){
        // Close
        dd.style.maxHeight = '0';
      } else {
        // Close other open dropdowns in same artist section
        var artistSection = el.closest('.artist-item, .artist-wrapper');
        if(artistSection){
          artistSection.querySelectorAll('.disco-dropdown').forEach(function(o){ 
            o.style.maxHeight = '0';
          });
        }
        // Open this one
        dd.style.maxHeight = dd.scrollHeight + 'px';
      }
    });
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
          b.style.background = '#f3e2c9';
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
});