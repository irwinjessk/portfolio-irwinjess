document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('home')) {
    return;
  }

  normalizeHomeEntry();
});

window.addEventListener('pageshow', function (event) {
  if (!document.getElementById('home')) {
    return;
  }

  if (event.persisted) {
    normalizeHomeEntry();
  }
});

function normalizeHomeEntry() {
  const { hash, pathname, search } = window.location;
  const referrer = document.referrer || '';
  const fromProjectsPage = referrer.includes('projects.html');

  if (!hash || hash === '#') {
    history.replaceState(null, '', `${pathname}${search}`);
    scrollToHome();
    return;
  }

  if (hash === '#portfolio' && !fromProjectsPage) {
    history.replaceState(null, '', `${pathname}${search}#home`);
    scrollToHome();
  }
}

function scrollToHome() {
  const homeSection = document.getElementById('home');

  if (homeSection) {
    homeSection.scrollIntoView({ behavior: 'auto', block: 'start' });
    return;
  }

  window.scrollTo({ top: 0, behavior: 'auto' });
}
