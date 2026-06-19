(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;"
      }[char];
    });
  }

  function card(item) {
    return "<article class=\"movie-card\">" +
      "<a class=\"poster-wrap\" href=\"./" + escapeHtml(item.url) + "\" aria-label=\"" + escapeHtml(item.title) + "\">" +
      "<img src=\"" + escapeHtml(item.cover) + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">" +
      "<span class=\"play-icon\">▶</span>" +
      "<span class=\"category-pill\">" + escapeHtml(item.category) + "</span>" +
      "</a>" +
      "<div class=\"card-body\">" +
      "<h3><a href=\"./" + escapeHtml(item.url) + "\">" + escapeHtml(item.title) + "</a></h3>" +
      "<p>" + escapeHtml(item.description) + "</p>" +
      "<div class=\"card-meta\"><span>★ " + escapeHtml(item.rating) + "</span><span>" + escapeHtml(item.year) + "</span><span>" + escapeHtml(item.region) + "</span></div>" +
      "<div class=\"tag-row\"><span>" + escapeHtml(item.genre) + "</span></div>" +
      "</div>" +
      "</article>";
  }

  function runSearch(query) {
    var results = document.getElementById("searchResults");
    var defaults = document.getElementById("searchDefault");
    if (!results || !window.SEARCH_INDEX) {
      return;
    }
    var value = query.trim().toLowerCase();
    if (!value) {
      results.innerHTML = "";
      if (defaults) {
        defaults.hidden = false;
      }
      return;
    }
    var words = value.split(/\s+/).filter(Boolean);
    var matched = window.SEARCH_INDEX.filter(function (item) {
      var haystack = [item.title, item.category, item.genre, item.region, item.tags, item.description, item.year].join(" ").toLowerCase();
      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    }).slice(0, 96);
    if (defaults) {
      defaults.hidden = true;
    }
    if (!matched.length) {
      results.innerHTML = "<div class=\"no-results\"><h2>没有找到匹配内容</h2><p>可以尝试更换影片名称、地区、年份或题材关键词。</p></div>";
      return;
    }
    results.innerHTML = "<h2>搜索结果</h2><div class=\"movie-grid\">" + matched.map(card).join("") + "</div>";
  }

  ready(function () {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    var input = document.getElementById("searchInput");
    if (input) {
      input.value = initial;
      input.addEventListener("input", function () {
        runSearch(input.value);
      });
    }
    runSearch(initial);
  });
})();
