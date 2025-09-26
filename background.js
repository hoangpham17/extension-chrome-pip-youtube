chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;
    
    if (!tab.url || !tab.url.includes('youtube.com')) {
      console.log('Not on YouTube page');
      return;
    }
    
    try {
      // Execute the PiP toggle function directly
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const video = document.querySelector('video');
          if (!video) {
            console.log('No video found');
            return { ok: false, msg: 'No video found' };
          }
          
          return (async () => {
            try {
              if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
                return { ok: true, msg: 'Exited PiP' };
              } else {
                await video.requestPictureInPicture();
                return { ok: true, msg: 'Entered PiP' };
              }
            } catch (e) {
              return { ok: false, msg: e.message || String(e) };
            }
          })();
        }
      });
    } catch (err) {
      console.error("Toggle PiP error:", err);
    }
  });
  