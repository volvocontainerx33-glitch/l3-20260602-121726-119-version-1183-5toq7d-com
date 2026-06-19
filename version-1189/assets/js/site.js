(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    showSlide(0);

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

  panels.forEach(function (panel) {
    var searchInput = panel.querySelector('[data-search-input]');
    var scope = panel.closest('main') || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var empty = scope.querySelector('[data-empty-state]');
    var filters = {
      type: '',
      region: ''
    };

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.getAttribute('data-region'),
          card.getAttribute('data-category'),
          card.textContent
        ].join(' '));
        var matchedQuery = !query || haystack.indexOf(query) !== -1;
        var matchedType = !filters.type || card.getAttribute('data-type') === filters.type;
        var matchedRegion = !filters.region || card.getAttribute('data-region') === filters.region;
        var show = matchedQuery && matchedType && matchedRegion;

        card.style.display = show ? '' : 'none';

        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    panel.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-filter-type]');

      if (!button) {
        return;
      }

      var type = button.getAttribute('data-filter-type');
      var value = button.getAttribute('data-value') || '';
      filters[type] = value;

      Array.prototype.slice.call(panel.querySelectorAll('button[data-filter-type="' + type + '"]')).forEach(function (item) {
        item.classList.toggle('active', item === button);
      });

      applyFilters();
    });
  });
}());
