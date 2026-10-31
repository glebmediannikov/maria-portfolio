(() => {
  document.querySelectorAll('[data-badge-carousel]').forEach(card => {
    const slides = [...card.querySelectorAll('[data-badge-slide]')];
    const previousButton = card.querySelector('[data-badge-prev]');
    const nextButton = card.querySelector('[data-badge-next]');
    const count = card.querySelector('[data-badge-count]');

    if (slides.length < 2 || !previousButton || !nextButton || !count) return;

    let activeIndex = 0;

    const render = () => {
      slides.forEach((slide, index) => {
        slide.hidden = index !== activeIndex;
      });
      count.textContent = `${activeIndex + 1} / ${slides.length}`;
    };

    const move = step => {
      activeIndex = (activeIndex + step + slides.length) % slides.length;
      render();
    };

    previousButton.addEventListener('click', () => move(-1));
    nextButton.addEventListener('click', () => move(1));

    card.classList.add('is-enhanced');
    render();
  });
})();

(() => {
  if (typeof HTMLDialogElement !== 'function') return;

  let dialog;
  let image;
  let caption;
  let returnFocusTo = null;

  const build = () => {
    dialog = document.createElement('dialog');
    dialog.className = 'badge-lightbox';
    dialog.setAttribute('aria-label', 'Badge image viewer');
    dialog.innerHTML = `
      <div class="badge-lightbox-frame">
        <button type="button" class="badge-lightbox-close" aria-label="Close badge image">&times;</button>
        <img alt="">
        <p class="badge-lightbox-caption"></p>
      </div>`;
    image = dialog.querySelector('img');
    caption = dialog.querySelector('.badge-lightbox-caption');
    dialog.querySelector('.badge-lightbox-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      dialog.close();
    });
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (returnFocusTo) returnFocusTo.focus();
      returnFocusTo = null;
    });
    document.body.appendChild(dialog);
  };

  document.querySelectorAll('[data-badge-carousel] .badge-image-link').forEach(link => {
    link.addEventListener('click', event => {
      const img = link.querySelector('img');
      if (!img) return;
      event.preventDefault();
      if (!dialog) build();
      returnFocusTo = link;
      image.src = link.getAttribute('href');
      image.alt = img.alt;
      caption.textContent = img.alt;
      dialog.showModal();
      dialog.querySelector('.badge-lightbox-close').focus();
    });
  });
})();
