// Händelt Diskografie Dropdowns und YouTube-Slider Thumbnails
document.addEventListener('DOMContentLoaded', function(){
  // Toggle disco dropdown
  document.querySelectorAll('.disco-cover-small').forEach(function(el){
    el.addEventListener('click', function(){
      var parent = el.closest('.artist-disco');
      var dd = parent.querySelector('.disco-dropdown');
      if(dd.classList.contains('open')){
        dd.classList.remove('open');
      } else {
        // close other open dropdowns (optional)
        document.querySelectorAll('.disco-dropdown.open').forEach(function(o){ o.classList.remove('open'); });
        dd.classList.add('open');
      }
    });
  });

  // Toggle large cover click to close
  document.querySelectorAll('.disco-cover-large').forEach(function(el){
    el.addEventListener('click', function(){
      var dd = el.closest('.disco-dropdown');
      if(dd) dd.classList.remove('open');
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