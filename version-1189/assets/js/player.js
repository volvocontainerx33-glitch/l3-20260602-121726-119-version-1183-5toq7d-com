(function () {
  function loadHlsLibrary(callback) {
    if (window.Hls) {
      callback();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = callback;
    script.onerror = function () {
      callback(new Error('hls load failed'));
    };
    document.head.appendChild(script);
  }

  function setupPlayer(wrapper) {
    var video = wrapper.querySelector('video');
    var button = wrapper.querySelector('[data-play-button]');
    var overlay = wrapper.querySelector('[data-player-overlay]');
    var source = wrapper.getAttribute('data-video-src');
    var initialized = false;

    if (!video || !source) {
      return;
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('hidden');
      }
    }

    function initAndPlay() {
      if (initialized) {
        video.play();
        hideOverlay();
        return;
      }

      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.play();
        hideOverlay();
        return;
      }

      loadHlsLibrary(function () {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });

          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play();
            hideOverlay();
          });
          return;
        }

        video.src = source;
        video.play();
        hideOverlay();
      });
    }

    if (button) {
      button.addEventListener('click', initAndPlay);
    }

    video.addEventListener('click', initAndPlay);
    video.addEventListener('play', hideOverlay);
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-video-src]')).forEach(setupPlayer);
}());
