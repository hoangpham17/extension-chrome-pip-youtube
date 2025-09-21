(function injectPiPButton() {
    const createButton = () => {
      if (document.getElementById('my-pip-button')) return;
      const controls = document.querySelector('.ytp-right-controls');
      if (!controls) return;
      const btn = document.createElement('button');
      btn.id = 'my-pip-button';
      btn.title = 'Toggle PiP';
      btn.style = 'width:34px;height:34px;margin-left:6px;border:none;background:transparent;cursor:pointer';
      btn.innerHTML = '⤢';
      btn.onclick = async (e) => {
        e.stopPropagation();
        const video = document.querySelector('video');
        if (!video) { alert('No video found'); return; }
        try {
          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
          } else {
            await video.requestPictureInPicture();
          }
        } catch (err) {
          console.error('PiP err', err);
          alert('PiP error: ' + err.message);
        }
      };
      controls.prepend(btn);
    };
  
    const observer = new MutationObserver(() => createButton());
    observer.observe(document, { childList: true, subtree: true });
    
    setTimeout(createButton, 1500);
  })();
  