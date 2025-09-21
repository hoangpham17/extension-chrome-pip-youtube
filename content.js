(function () {
    if (!('pictureInPictureEnabled' in document)) {
      console.log('PiP not supported');
      return;
    }
  
    const BUTTON_ID = 'yt-pip-button-custom';
  
    function createButton() {
      if (document.getElementById(BUTTON_ID)) return null;
  
      const btn = document.createElement('button');
      btn.id = BUTTON_ID;
      btn.className = 'ytp-pip-button';
      btn.title = 'Toggle Picture-in-Picture';
      btn.innerHTML = `
        <span class="ytp-pip-icon">🗔</span>
        <span class="ytp-pip-label">PiP</span>
      `;
      btn.style.display = 'none';
      btn.addEventListener('click', onClickPip);
  
      return btn;
    }
  
    async function onClickPip(e) {
      e.stopPropagation();
      const video = findVideo();
      if (!video) return;
  
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await video.requestPictureInPicture();
        }
      } catch (err) {
        console.error('PiP error', err);
      }
    }
  
    function findVideo() {
      return document.querySelector('video');
    }
  
    function placeButton() {
      const player = document.querySelector('.html5-video-player');
      if (!player) return null;
  
      let existing = document.getElementById(BUTTON_ID);
      if (!existing) {
        const btn = createButton();
        if (!btn) return null;

        if (getComputedStyle(player).position === 'static') {
          player.style.position = 'relative';
        }
        player.appendChild(btn);
        existing = btn;
      }

      const video = findVideo();
      if (video) {
        existing.style.display = 'flex';
      } else {
        existing.style.display = 'none';
      }
      return existing;
    }
  
    const observer = new MutationObserver((mutations) => {
      placeButton();
    });
  
    function startObserving() {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      placeButton();
    }
  
    document.addEventListener('leavepictureinpicture', () => {
    });
  
    startObserving();
  
    (function(history){
      const pushState = history.pushState;
      history.pushState = function() {
        pushState.apply(history, arguments);
        setTimeout(placeButton, 500);
      };
    })(window.history);
  
  })();
  