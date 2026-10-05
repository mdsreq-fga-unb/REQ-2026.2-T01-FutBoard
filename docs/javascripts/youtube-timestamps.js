(function () {
  "use strict";

  var players = new Map();
  var pendingSeek = new Map();
  var apiReady;

  function getVideoId(value) {
    var url = new URL(value, window.location.href);
    var parts = url.pathname.split("/").filter(Boolean);

    if (url.hostname === "youtu.be") {
      return parts[0];
    }

    var embedIndex = parts.indexOf("embed");
    return embedIndex >= 0 ? parts[embedIndex + 1] : null;
  }

  function getTimestamp(value) {
    var url = new URL(value, window.location.href);
    return Number(url.searchParams.get("t"));
  }

  function prepareIframes() {
    document.querySelectorAll('iframe[src*="youtube.com/embed/"]').forEach(function (iframe) {
      var url = new URL(iframe.src, window.location.href);
      url.searchParams.set("enablejsapi", "1");
      url.searchParams.set("origin", window.location.origin);
      iframe.src = url.toString();
    });
  }

  function loadApi() {
    if (apiReady) {
      return apiReady;
    }

    apiReady = new Promise(function (resolve) {
      window.onYouTubeIframeAPIReady = resolve;
      var script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    });

    return apiReady;
  }

  function initializePlayers() {
    prepareIframes();

    loadApi().then(function () {
      document.querySelectorAll('iframe[src*="youtube.com/embed/"]').forEach(function (iframe) {
        if (players.has(iframe)) {
          return;
        }

        var videoId = getVideoId(iframe.src);
        var player = new YT.Player(iframe, {
          events: {
            onReady: function () {
              players.set(iframe, player);
              var seconds = pendingSeek.get(videoId);

              if (seconds !== undefined) {
                player.seekTo(seconds, true);
                player.playVideo();
                pendingSeek.delete(videoId);
              }
            }
          }
        });

        players.set(iframe, player);
      });
    });
  }

  function seekInPlayer(videoId, seconds) {
    var iframe = Array.from(document.querySelectorAll('iframe[src*="youtube.com/embed/"]')).find(function (candidate) {
      return getVideoId(candidate.src) === videoId;
    });
    var player = iframe && players.get(iframe);

    if (iframe) {
      iframe.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (player && typeof player.seekTo === "function") {
      player.seekTo(seconds, true);
      player.playVideo();
      return;
    }

    pendingSeek.set(videoId, seconds);
    initializePlayers();
  }

  function handleTimestampClick(event) {
    var link = event.target.closest('a[href*="youtu.be"][href*="?t="]');

    if (!link) {
      return;
    }

    var seconds = getTimestamp(link.href);
    var videoId = getVideoId(link.href);

    if (!videoId || !Number.isFinite(seconds)) {
      return;
    }

    event.preventDefault();
    seekInPlayer(videoId, seconds);
  }

  function start() {
    document.addEventListener("click", handleTimestampClick);
    initializePlayers();

    if (window.document$) {
      window.document$.subscribe(initializePlayers);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();