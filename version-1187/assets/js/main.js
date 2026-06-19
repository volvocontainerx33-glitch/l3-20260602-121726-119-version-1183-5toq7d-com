(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMobileNav() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".mobile-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      var isOpen = nav.hasAttribute("hidden");
      if (isOpen) {
        nav.removeAttribute("hidden");
        toggle.setAttribute("aria-expanded", "true");
        toggle.textContent = "×";
      } else {
        nav.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      }
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initListings() {
    var grids = Array.prototype.slice.call(document.querySelectorAll("[data-listing]"));
    if (!grids.length) {
      return;
    }
    var filter = document.querySelector(".filter-input");
    var sort = document.querySelector(".sort-select");

    function apply() {
      grids.forEach(function (grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
        var query = filter ? filter.value.trim().toLowerCase() : "";
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-genre") || ""
          ].join(" ").toLowerCase();
          card.classList.toggle("is-hidden-card", query && haystack.indexOf(query) === -1);
        });
        if (sort) {
          var mode = sort.value;
          cards.sort(function (a, b) {
            if (mode === "rating") {
              return Number(b.getAttribute("data-rating")) - Number(a.getAttribute("data-rating"));
            }
            if (mode === "views") {
              return Number(b.getAttribute("data-views")) - Number(a.getAttribute("data-views"));
            }
            if (mode === "year") {
              return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
            }
            return 0;
          }).forEach(function (card) {
            grid.appendChild(card);
          });
        }
      });
    }

    if (filter) {
      filter.addEventListener("input", apply);
    }
    if (sort) {
      sort.addEventListener("change", apply);
    }
  }

  ready(function () {
    initMobileNav();
    initHero();
    initListings();
  });
})();
