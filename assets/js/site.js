document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());

const siteNavigation = document.querySelector('.site-header .nav');

if (siteNavigation) {
  const siteHeader = siteNavigation.closest('.site-header');
  const menuButton = document.createElement('button');

  siteNavigation.id = siteNavigation.id || 'site-navigation';
  menuButton.className = 'mobile-nav-toggle';
  menuButton.type = 'button';
  menuButton.setAttribute('aria-label', 'Open navigation menu');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-controls', siteNavigation.id);
  menuButton.textContent = '☰';
  siteNavigation.insertAdjacentElement('afterend', menuButton);

  const closeNavigation = () => {
    siteHeader.classList.remove('mobile-nav-open');
    menuButton.textContent = '☰';
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeNavigation();
      return;
    }

    siteHeader.classList.add('mobile-nav-open');
    menuButton.textContent = '×';
    menuButton.setAttribute('aria-label', 'Close navigation menu');
    menuButton.setAttribute('aria-expanded', 'true');
  });

  siteNavigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeNavigation();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeNavigation();
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches) closeNavigation();
  });
}