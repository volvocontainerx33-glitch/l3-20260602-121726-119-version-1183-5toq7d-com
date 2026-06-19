(function() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-menu-panel]");
    if (toggle && panel) {
        toggle.addEventListener("click", function() {
            panel.classList.toggle("open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var active = 0;
        function showSlide(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle("active", i === active);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle("active", i === active);
            });
        }
        dots.forEach(function(dot) {
            dot.addEventListener("click", function() {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });
        if (slides.length > 1) {
            setInterval(function() {
                showSlide(active + 1);
            }, 5200);
        }
    }

    var queryInput = document.querySelector("[data-local-search]");
    var yearFilter = document.querySelector("[data-year-filter]");
    var typeFilter = document.querySelector("[data-type-filter]");
    var cardList = document.querySelector("[data-card-list]");

    if (queryInput && queryInput.hasAttribute("data-query-sync")) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q) {
            queryInput.value = q;
        }
    }

    function filterCards() {
        if (!cardList) {
            return;
        }
        var q = queryInput ? queryInput.value.trim().toLowerCase() : "";
        var year = yearFilter ? yearFilter.value : "";
        var type = typeFilter ? typeFilter.value : "";
        var cards = cardList.querySelectorAll(".movie-card");
        cards.forEach(function(card) {
            var haystack = [
                card.getAttribute("data-title") || "",
                card.getAttribute("data-tags") || "",
                card.textContent || ""
            ].join(" ").toLowerCase();
            var okQuery = !q || haystack.indexOf(q) !== -1;
            var okYear = !year || card.getAttribute("data-year") === year;
            var okType = !type || card.getAttribute("data-type") === type;
            card.classList.toggle("is-filtered-out", !(okQuery && okYear && okType));
        });
    }

    [queryInput, yearFilter, typeFilter].forEach(function(el) {
        if (el) {
            el.addEventListener("input", filterCards);
            el.addEventListener("change", filterCards);
        }
    });
    filterCards();
})();
