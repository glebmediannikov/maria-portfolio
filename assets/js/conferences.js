const lightbox = document.querySelector('#conference-lightbox');

if (lightbox) {
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const previousButton = lightbox.querySelector('.lightbox-previous');
  const nextButton = lightbox.querySelector('.lightbox-next');
  const figure = lightbox.querySelector('.lightbox-figure');
  let activeGallery = [];
  let activeIndex = 0;
  let returnFocus = null;
  let scrollPosition = 0;
  let touchStartX = null;

  const showPhoto = index => {
    activeIndex = (index + activeGallery.length) % activeGallery.length;
    const photo = activeGallery[activeIndex];
    const image = photo.querySelector('img');

    lightboxImage.src = photo.href;
    lightboxImage.alt = image.alt;
    lightboxCounter.textContent = `${activeIndex + 1} / ${activeGallery.length}`;
  };

  const openLightbox = photo => {
    const galleryName = photo.dataset.gallery;
    activeGallery = [...document.querySelectorAll('.conference-photo')]
      .filter(item => item.dataset.gallery === galleryName);
    returnFocus = photo;
    scrollPosition = window.scrollY;

    showPhoto(Number(photo.dataset.index));
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    document.body.style.top = `-${scrollPosition}px`;
    closeButton.focus();
  };

  const closeLightbox = () => {
    if (lightbox.hidden) return;

    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    document.body.style.top = '';
    returnFocus?.focus({ preventScroll: true });
    window.requestAnimationFrame(() => window.scrollTo({ top: scrollPosition, behavior: 'instant' }));
  };

  document.querySelectorAll('.conference-photo').forEach(photo => {
    photo.addEventListener('click', event => {
      event.preventDefault();
      openLightbox(photo);
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => showPhoto(activeIndex - 1));
  nextButton.addEventListener('click', () => showPhoto(activeIndex + 1));

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPhoto(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(activeIndex + 1);
    } else if (event.key === 'Tab') {
      const controls = [closeButton, previousButton, nextButton];
      const currentIndex = controls.indexOf(document.activeElement);
      const nextIndex = event.shiftKey
        ? (currentIndex <= 0 ? controls.length - 1 : currentIndex - 1)
        : (currentIndex < 0 || currentIndex === controls.length - 1 ? 0 : currentIndex + 1);

      event.preventDefault();
      controls[nextIndex].focus();
    }
  });

  figure.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  figure.addEventListener('touchend', event => {
    if (touchStartX === null) return;

    const swipeDistance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(swipeDistance) > 50) {
      showPhoto(activeIndex + (swipeDistance < 0 ? 1 : -1));
    }
    touchStartX = null;
  }, { passive: true });
}
