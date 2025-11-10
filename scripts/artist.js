// Händelt Diskografie Dropdowns und YouTube-Slider Thumbnails
document.addEventListener('DOMContentLoaded', function(){
  // Toggle artist dropdown on index page
  document.querySelectorAll('.artist-header').forEach(function(header){
    header.addEventListener('click', function(){
      var parent = header.closest('.artist-item');
      var dropdown = parent.querySelector('.artist-dropdown');
      
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
    });
  });

  // Toggle disco dropdown
  document.querySelectorAll('.disco-cover-small').forEach(function(el){
    el.addEventListener('click', function(e){
      e.stopPropagation(); // Prevent parent click
      var parent = el.closest('.release');
      var dd = parent.querySelector('.disco-dropdown');
      
      if(dd.style.maxHeight && dd.style.maxHeight !== '0px'){
        // Close
        dd.style.maxHeight = '0';
      } else {
        // Close other open dropdowns in same artist section (optional)
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

  // Toggle large cover click to close
  document.querySelectorAll('.disco-cover-large').forEach(function(el){
    el.addEventListener('click', function(){
      var dd = el.closest('.disco-dropdown');
      if(dd) dd.style.maxHeight = '0';
    });
  });

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