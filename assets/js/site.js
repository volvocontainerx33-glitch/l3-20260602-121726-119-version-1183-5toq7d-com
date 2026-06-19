(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    initMenu();
    initCarousel();
    initFilters();
    initPlayers();
  });

  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".mobile-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initCarousel() {
    var carousel = document.querySelector("[data-carousel]");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-dot]"));
    var prev = carousel.querySelector("[data-carousel-prev]");
    var next = carousel.querySelector("[data-carousel-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-carousel-dot")) || 0);
        restart();
      });
    });
    restart();
  }

  function initFilters() {
    var grids = Array.prototype.slice.call(document.querySelectorAll(".search-grid"));
    if (!grids.length) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    grids.forEach(function (grid) {
      var section = grid.closest("section") || document;
      var queryInput = section.querySelector(".page-search");
      var yearFilter = section.querySelector(".year-filter");
      var categoryFilter = section.querySelector(".category-filter");
      var empty = section.querySelector(".empty-state");
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".searchable-card"));
      if (queryInput && initialQuery) {
        queryInput.value = initialQuery;
      }

      function apply() {
        var query = queryInput ? queryInput.value.trim().toLowerCase() : "";
        var year = yearFilter ? yearFilter.value : "";
        var category = categoryFilter ? categoryFilter.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var text = card.getAttribute("data-search") || "";
          var cardYear = card.getAttribute("data-year") || "";
          var cardCategory = card.getAttribute("data-category") || "";
          var matched = true;
          if (query && text.indexOf(query) === -1) {
            matched = false;
          }
          if (year && cardYear !== year) {
            matched = false;
          }
          if (category && cardCategory !== category) {
            matched = false;
          }
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (queryInput) {
        queryInput.addEventListener("input", apply);
      }
      if (yearFilter) {
        yearFilter.addEventListener("change", apply);
      }
      if (categoryFilter) {
        categoryFilter.addEventListener("change", apply);
      }
      apply();
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (box) {
      var video = box.querySelector("video");
      var button = box.querySelector(".play-overlay");
      var stream = box.getAttribute("data-stream");
      var started = false;
      var hls = null;

      function attach() {
        if (!video || !stream || started) {
          return;
        }
        started = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function play() {
        attach();
        box.classList.add("is-playing");
        var action = video.play();
        if (action && typeof action.catch === "function") {
          action.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener("click", play);
      }
      if (video) {
        video.addEventListener("click", function () {
          if (!started || video.paused) {
            play();
          }
        });
        video.addEventListener("play", function () {
          box.classList.add("is-playing");
        });
        video.addEventListener("emptied", function () {
          if (hls && typeof hls.destroy === "function") {
            hls.destroy();
          }
          hls = null;
          started = false;
        });
      }
    });
  }
})();
