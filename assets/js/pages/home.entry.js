document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('home')) {
    return;
  }

  const { hash, pathname, search } = window.location;

  if (!hash || hash === '#') {
    history.replaceState(null, '', `${pathname}${search}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
});
