// Parcours — onglets Formation / Expérience + sliders
(function () {
  function initParcoursTabs() {
    var tabs = document.querySelectorAll('.parcours-tabs .resume-tab');
    var panes = document.querySelectorAll('.tab-pane-custom');

    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();

        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });

        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        var targetId = 'pane-' + tab.getAttribute('data-tab');
        panes.forEach(function (pane) {
          var isTarget = pane.id === targetId;
          pane.classList.toggle('d-none', !isTarget);
        });
      });
    });
  }

  function setupSlider(sliderId, paginationId) {
    var slider = document.getElementById(sliderId);
    if (!slider) return;

    var track = slider.querySelector('.resume-slide-track');
    var pagination = document.getElementById(paginationId);
    if (!track || !pagination) return;

    var slides = Array.from(slider.querySelectorAll('.resume-slide'));
    var dots = Array.from(pagination.querySelectorAll('.resume-dot'));
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var slideDuration = prefersReducedMotion ? 0 : 820;
    var currentIndex = 0;
    var isSliding = false;
    var animationTimer = null;

    function setSlidingState(nextState) {
      slider.classList.toggle('is-sliding', nextState);
      dots.forEach(function (dot) {
        dot.disabled = nextState;
      });
    }

    function getSlideWidth() {
      if (slides.length) {
        var slideWidth = slides[0].getBoundingClientRect().width;
        if (slideWidth > 0) return slideWidth;
      }

      var sliderWidth = slider.getBoundingClientRect().width;
      return sliderWidth > 0 ? sliderWidth : slider.clientWidth;
    }

    function getTrackOffset() {
      return currentIndex * getSlideWidth();
    }

    function applyTrackTransform() {
      track.style.transform = 'translate3d(-' + getTrackOffset() + 'px, 0, 0)';
    }

    function updateActiveState() {
      slides.forEach(function (slide, i) {
        var isActive = i === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      dots.forEach(function (dot, i) {
        var isActive = i === currentIndex;
        dot.classList.toggle('is-active', isActive);
        if (isActive) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
    }

    function goToSlide(index) {
      if (isSliding || index < 0 || index >= slides.length || index === currentIndex) return;
      currentIndex = index;

      window.clearTimeout(animationTimer);
      isSliding = true;
      setSlidingState(isSliding);
      updateActiveState();

      requestAnimationFrame(function () {
        applyTrackTransform();
      });

      animationTimer = window.setTimeout(function () {
        isSliding = false;
        setSlidingState(isSliding);
      }, slideDuration);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
    });

    document.addEventListener('keydown', function (e) {
      var pane = slider.closest('.tab-pane-custom');
      if (!pane || pane.classList.contains('d-none')) return;

      if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1);
      }
    });

    window.addEventListener('resize', function () {
      applyTrackTransform();
    });

    window.addEventListener('load', function () {
      applyTrackTransform();
    });

    updateActiveState();
    applyTrackTransform();
    requestAnimationFrame(applyTrackTransform);
  }

  function initParcours() {
    initParcoursTabs();
    setupSlider('slider-formation', 'pagination-formation');
    setupSlider('slider-experience', 'pagination-experience');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParcours);
  } else {
    initParcours();
  }
})();
