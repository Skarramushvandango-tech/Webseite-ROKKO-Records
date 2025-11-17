document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.artist-carousel .carousel-track');
  if(!track) return;
  const left = document.querySelector('.carousel-arrow.left');
  const right = document.querySelector('.carousel-arrow.right');

  const scrollBy = 260;

  left && left.addEventListener('click', () => {
    track.scrollBy({ left: -scrollBy, behavior: 'smooth' });
  });
  right && right.addEventListener('click', () => {
    track.scrollBy({ left: scrollBy, behavior: 'smooth' });
  });
});
