// Enhanced Picture-in-Picture Extension for Facebook and other platforms (non-YouTube)
(function() {
  // Enhanced video detection for multiple platforms
  function detectVideos() {
    // Look for video elements directly
    const videoElements = document.querySelectorAll('video[src], video:not([src])');

    // Look for elements with video-related classes or attributes
    const potentialVideoContainers = document.querySelectorAll('[class*="video"], [data-video-id], [data-testid*="video"], [aria-label*="video"]');

    // Look for Facebook-specific video elements - more precise selectors
    const facebookVideoElements = document.querySelectorAll(
      '[aria-label="Video"]:not([aria-hidden="true"]), ' +
      '[aria-label*="đang phát"]:not([aria-hidden="true"]), ' +
      '[role="region"][aria-label*="video"]:not([aria-hidden="true"]), ' +
      '[data-testid="video_player"], ' +
      '[data-testid="video_ufi"], ' +
      '[data-testid="story-subtitle"] + div [aria-label*="video"], ' +
      '[data-testid="fb-feed-story-attachment"] video'
    );

    // Combine all detected elements
    const allVideoElements = [...videoElements, ...potentialVideoContainers, ...facebookVideoElements];

    // Filter out duplicates and return unique elements
    const uniqueVideoElements = [...new Set(allVideoElements)];

    return uniqueVideoElements.filter(element => {
      // Filter out elements that are too small to be meaningful videos
      if (element.tagName === 'VIDEO') {
        const rect = element.getBoundingClientRect();
        return rect.width > 50 && rect.height > 50;
      }

      // Additional filtering for non-video elements
      if (isFacebook()) {
        // Skip elements that are likely not actual video containers
        if (element.closest('[role="article"], [role="feed"], [aria-label="News Feed"], [data-pagelet="FeedUnit"]')) {
          return false;
        }

        // Skip elements that are too small
        const rect = element.getBoundingClientRect();
        return rect.width > 100 && rect.height > 100;
      }

      return true;
    });
  }

  // Function to find the actual video element within a container
  function findActualVideoElement(element) {
    if (element.tagName === 'VIDEO') {
      return element;
    }

    // Check for video elements inside the container
    const videosInside = element.querySelectorAll('video');
    if (videosInside.length > 0) {
      return videosInside[0];
    }

    // For Facebook reels and stories
    if (element.querySelector('[aria-label*="video"]')) {
      return element;
    }

    return null;
  }

  // Function to setup PiP button for a video element
  function setupPiPButton(videoElement) {
    if (!videoElement || videoElement.hasAttribute('data-pip-button-added')) {
      return null;
    }

    // Additional check for Facebook to prevent adding buttons to non-video elements
    if (isFacebook()) {
      // Skip if this element is inside newsfeed
      if (isFacebookNewsfeed()) {
        return null;
      }

      // Skip if this element doesn't look like a video container
      const rect = videoElement.getBoundingClientRect();
      if (rect.width < 100 || rect.height < 100) {
        return null;
      }

      // Skip if this element is likely a non-video element
      if (videoElement.tagName !== 'VIDEO' &&
          !videoElement.querySelector('video') &&
          !videoElement.hasAttribute('data-testid') &&
          !videoElement.hasAttribute('aria-label')) {
        return null;
      }

      // Skip if this element is inside a newsfeed story
      if (videoElement.closest('[role="article"], [data-pagelet="FeedUnit"]')) {
        return null;
      }
    }

    // Mark this element to avoid duplicate button creation
    videoElement.setAttribute('data-pip-button-added', 'true');

    // Create PiP button
    const pipButton = document.createElement('button');
    pipButton.className = 'pip-button-extension';
    pipButton.title = 'Toggle Picture-in-Picture';
    pipButton.style.position = 'absolute';
    pipButton.style.bottom = '10px';
    pipButton.style.right = '10px';
    pipButton.style.zIndex = '999999';
    pipButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    pipButton.style.color = 'white';
    pipButton.style.border = 'none';
    pipButton.style.borderRadius = '50%';
    pipButton.style.width = '30px';
    pipButton.style.height = '30px';
    pipButton.style.cursor = 'pointer';
    pipButton.style.display = 'flex';
    pipButton.style.alignItems = 'center';
    pipButton.style.justifyContent = 'center';
    pipButton.style.padding = '0';

    // Create SVG icon element directly
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("fill", "white");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.style.width = '16px';
    svg.style.height = '16px';

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("fill-rule", "evenodd");
    path1.setAttribute("d", "M16.948 12.25H18.052C18.9505 12.25 19.6997 12.2499 20.2945 12.3299 20.9223 12.4143 21.4891 12.6 21.9445 13.0555 22.4 13.5109 22.5857 14.0777 22.6701 14.7055 22.7501 15.3003 22.75 16.0495 22.75 16.948V17.052C22.75 17.9505 22.7501 18.6997 22.6701 19.2945 22.5857 19.9223 22.4 20.4891 21.9445 20.9445 21.4891 21.4 20.9223 21.5857 20.2945 21.6701 19.6997 21.7501 18.9505 21.75 18.052 21.75H16.948C16.0495 21.75 15.3003 21.7501 14.7055 21.6701 14.0777 21.5857 13.5109 21.4 13.0555 20.9445 12.6 20.4891 12.4143 19.9223 12.3299 19.2945 12.2499 18.6997 12.25 17.9505 12.25 17.052V16.948C12.25 16.0495 12.2499 15.3003 12.3299 14.7055 12.4143 14.0777 12.6 13.5109 13.0555 13.0555 13.5109 12.6 14.0777 12.4143 14.7055 12.3299 15.3003 12.2499 16.0495 12.25 16.948 12.25zM14.9054 13.8165C14.4439 13.8786 14.2464 13.9858 14.1161 14.1161 13.9858 14.2464 13.8786 14.4439 13.8165 14.9054 13.7516 15.3884 13.75 16.036 13.75 17 13.75 17.964 13.7516 18.6116 13.8165 19.0946 13.8786 19.5561 13.9858 19.7536 14.1161 19.8839 14.2464 20.0142 14.4439 20.1214 14.9054 20.1835 15.3884 20.2484 16.036 20.25 17 20.25H18C18.964 20.25 19.6116 20.2484 20.0946 20.1835 20.5561 20.1214 20.7536 20.0142 20.8839 19.8839 21.0142 19.7536 21.1214 19.5561 21.1835 19.0946 21.2484 18.6116 21.25 17.964 21.25 17 21.25 16.036 21.2484 15.3884 21.1835 14.9054 21.1214 14.4439 21.0142 14.2464 20.8839 14.1161 20.7536 13.9858 20.5561 13.8786 20.0946 13.8165 19.6116 13.7516 18.964 13.75 18 13.75H17C16.036 13.75 15.3884 13.7516 14.9054 13.8165zM6.96967 6.96967C7.26256 6.67678 7.73744 6.67678 8.03033 6.96967L10.75 9.68934V8.5C10.75 8.08579 11.0858 7.75 11.5 7.75 11.9142 7.75 12.25 8.08579 12.25 8.5V11.5C12.25 11.9142 11.9142 12.25 11.5 12.25H8.5C8.08579 12.25 7.75 11.9142 7.75 11.5 7.75 11.0858 8.08579 10.75 8.5 10.75H9.68934L6.96967 8.03033C6.67678 7.73744 6.67678 7.26256 6.96967 6.96967z");
    path1.setAttribute("clip-rule", "evenodd");

    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("fill-rule", "evenodd");
    path2.setAttribute("d", "M9.94358 2.25H14.0564C15.8942 2.24998 17.3498 2.24997 18.489 2.40314C19.6614 2.56076 20.6104 2.89288 21.3588 3.64124C22.1071 4.38961 22.4392 5.33856 22.5969 6.51098C22.75 7.65019 22.75 9.10583 22.75 10.9436V11C22.75 11.4142 22.4142 11.75 22 11.75C21.5858 11.75 21.25 11.4142 21.25 11C21.25 9.09318 21.2484 7.73851 21.1102 6.71085C20.975 5.70476 20.7213 5.12511 20.2981 4.7019C19.8749 4.27869 19.2952 4.02502 18.2892 3.88976C17.2615 3.75159 15.9068 3.75 14 3.75H10C8.09318 3.75 6.73851 3.75159 5.71085 3.88976C4.70476 4.02502 4.12511 4.27869 3.7019 4.7019C3.23045 5.17335 2.96931 5.83905 2.84789 7.07342C2.80734 7.48564 2.4403 7.78695 2.02808 7.7464C1.61585 7.70585 1.31455 7.33881 1.3551 6.92658C1.48944 5.56072 1.80633 4.47616 2.64124 3.64124C3.38961 2.89288 4.33856 2.56076 5.51098 2.40314C6.65019 2.24997 8.10582 2.24998 9.94358 2.25ZM2 10.25C2.41421 10.25 2.75 10.5858 2.75 11V13C2.75 14.9068 2.75159 16.2615 2.88976 17.2892C3.02502 18.2952 3.27869 18.8749 3.7019 19.2981C4.12511 19.7213 4.70476 19.975 5.71085 20.1102C6.73851 20.2484 8.09318 20.25 10 20.25H11C11.4142 20.25 11.75 20.5858 11.75 21C11.75 21.4142 11.4142 21.75 11 21.75H9.94359C8.10583 21.75 6.65019 21.75 5.51098 21.5969C4.33856 21.4392 3.38961 21.1071 2.64124 20.3588C1.89288 19.6104 1.56076 18.6614 1.40314 17.489C1.24997 16.3498 1.24998 14.8942 1.25 13.0564L1.25 11C1.25 10.5858 1.58579 10.25 2 10.25Z");
    path2.setAttribute("clip-rule", "evenodd");

    svg.appendChild(path1);
    svg.appendChild(path2);
    pipButton.appendChild(svg);

    // Position the button relative to the video
    if (videoElement.tagName === 'VIDEO') {
      // For direct video elements
      const container = videoElement.parentElement;
      if (container) {
        container.style.position = 'relative';
        container.appendChild(pipButton);
      } else {
        videoElement.style.position = 'relative';
        videoElement.appendChild(pipButton);
      }
    } else {
      // For video containers - find the most appropriate container
      let container = videoElement;

      // Special handling for Facebook
      if (isFacebook()) {
        // Try to find a better container for Facebook videos
        const fbVideoContainer = videoElement.closest('[data-testid="video_player"], [role="region"][aria-label*="video"], [data-testid="video_ufi"]');
        if (fbVideoContainer) {
          container = fbVideoContainer;
        }
      }

      // Find the first positioned parent
      while (container && container !== document.body) {
        if (window.getComputedStyle(container).position !== 'static') {
          break;
        }
        container = container.parentElement;
      }

      if (container && container !== document.body) {
        container.style.position = 'relative';
        container.appendChild(pipButton);
      } else {
        videoElement.style.position = 'relative';
        videoElement.appendChild(pipButton);
      }
    }

    // Add click event to request PiP
    pipButton.addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();

      try {
        const actualVideo = findActualVideoElement(videoElement);

        if (actualVideo && actualVideo.tagName === 'VIDEO') {
          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
          } else {
            await actualVideo.requestPictureInPicture();
          }
        } else if (actualVideo) {
          // For non-video elements, try to find the video inside
          const videosInside = actualVideo.querySelectorAll('video');
          if (videosInside.length > 0) {
            const videoToPiP = videosInside[0];
            if (document.pictureInPictureElement) {
              await document.exitPictureInPicture();
            } else {
              await videoToPiP.requestPictureInPicture();
            }
          }
        }
      } catch (error) {
        console.error('Error toggling PiP:', error);
        // Show error to user
        const errorMsg = document.createElement('div');
        errorMsg.textContent = 'PiP Error: ' + (error.message || String(error));
        errorMsg.style.position = 'fixed';
        errorMsg.style.bottom = '20px';
        errorMsg.style.right = '20px';
        errorMsg.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        errorMsg.style.color = 'white';
        errorMsg.style.padding = '10px';
        errorMsg.style.borderRadius = '4px';
        errorMsg.style.zIndex = '9999999';
        document.body.appendChild(errorMsg);
        setTimeout(() => errorMsg.remove(), 3000);
      }
    });

    return pipButton;
  }

  // Function to observe DOM changes for dynamically loaded videos
  function setupVideoObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          const videos = detectVideos();
          videos.forEach(video => {
            // Skip Facebook newsfeed videos to avoid adding PiP button
            if (isFacebook() && isFacebookNewsfeed()) {
              return; // Skip only newsfeed videos
            }
            setupPiPButton(video);
          });
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
  }

  // Function to check if we're on Facebook
  function isFacebook() {
    return window.location.hostname.includes('facebook.com') ||
           window.location.hostname.includes('fb.com') ||
           window.location.hostname.includes('fbcdn.net');
  }

  // Function to check if we're on Facebook newsfeed (should skip adding PiP button)
  function isFacebookNewsfeed() {
    // Check for URL patterns that indicate newsfeed
    const path = window.location.pathname;
    return path === '/' ||
           path === '/home.php' ||
           path.startsWith('/home') ||
           // Check for newsfeed-specific elements
           document.querySelector('[role="feed"]') !== null ||
           document.querySelector('[aria-label="News Feed"]') !== null ||
           document.querySelector('[role="article"]') !== null ||
           document.querySelector('[data-pagelet="FeedUnit_0"]') !== null ||
           document.querySelector('[data-pagelet="FeedUnit"]') !== null;
  }

  // Function to check if we're on a Facebook video detail page
  function isFacebookVideoDetailPage() {
    // Check for URL patterns that indicate a video detail page
    const path = window.location.pathname;
    return path.includes('/videos/') ||
           path.includes('/watch/') ||
           path.startsWith('/video/') ||
           // Check for video player elements that typically appear on detail pages
           document.querySelector('[data-testid="video_player_root"]') !== null ||
           document.querySelector('[role="main"] [aria-label*="video"]') !== null;
  }

  // Initialize the video detection and PiP functionality
  function initPiP() {
    // Detect existing videos
    const videos = detectVideos();
    videos.forEach(video => {
      // Skip Facebook newsfeed videos to avoid adding PiP button
      if (isFacebook() && isFacebookNewsfeed()) {
        return; // Skip only newsfeed videos
      }
      setupPiPButton(video);
    });

    // Setup observer for dynamically loaded videos
    setupVideoObserver();

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'detectVideos') {
        const videos = detectVideos();
        sendResponse({videos: videos.length});
      } else if (request.action === 'togglePiP') {
        const videos = detectVideos();
        if (videos.length > 0) {
          const firstVideo = videos[0];
          const pipButton = setupPiPButton(firstVideo);
          if (pipButton) {
            pipButton.click();
            sendResponse({success: true});
          } else {
            sendResponse({success: false, error: 'No PiP button created'});
          }
        } else {
          sendResponse({success: false, error: 'No videos found'});
        }
      }
      return true; // Required for async sendResponse
    });
  }

  // Start the PiP functionality when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPiP);
  } else {
    initPiP();
  }
})();