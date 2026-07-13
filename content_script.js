// Simple YouTube PiP implementation - the enhanced implementation is in youtube_toolbar_button.js
(function() {
  // This simple implementation provides basic PiP functionality
  // The enhanced YouTube toolbar button is loaded from youtube_toolbar_button.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'togglePiP') {
      const video = document.querySelector('video');
      if (video) {
        (async () => {
          try {
            if (document.pictureInPictureElement) {
              await document.exitPictureInPicture();
            } else {
              await video.requestPictureInPicture();
            }
            sendResponse({success: true});
          } catch (error) {
            console.error('PiP error:', error);
            sendResponse({success: false, error: error.message});
          }
        })();
      } else {
        sendResponse({success: false, error: 'No video found'});
      }
      return true; // Required for async sendResponse
    }
  });
})();
  