(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function setup(wrapper) {
    var video = wrapper.querySelector("video");
    var overlay = wrapper.querySelector(".player-overlay");
    if (!video) {
      return;
    }
    var streamUrl = video.getAttribute("data-stream");
    var prepared = false;
    var hls = null;

    function prepare() {
      if (prepared) {
        return Promise.resolve();
      }
      prepared = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.load();
        return Promise.resolve();
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        return new Promise(function (resolve) {
          hls.on(window.Hls.Events.MANIFEST_PARSED, resolve);
          window.setTimeout(resolve, 1400);
        });
      }
      video.src = streamUrl;
      video.load();
      return Promise.resolve();
    }

    function start(event) {
      if (event) {
        event.preventDefault();
      }
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      prepare().then(function () {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", start);
    }
    Array.prototype.slice.call(document.querySelectorAll(".play-jump")).forEach(function (button) {
      button.addEventListener("click", start);
    });
    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });
    video.addEventListener("click", function () {
      if (!prepared || video.paused) {
        start();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll(".video-shell")).forEach(setup);
  });
})();
