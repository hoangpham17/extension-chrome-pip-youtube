(function () {
  "use strict";

  // Check if PiP is supported
  if (!("pictureInPictureEnabled" in document)) {
    return;
  }

  const BUTTON_ID = "yt-pip-extension-button";
  let pipButton = null;
  let observer = null;

  // Create the PiP button
  function createPiPButton() {
    if (pipButton) return pipButton;

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.className = "ytp-button";
    button.title = "Picture-in-Picture (Extension)";
    button.setAttribute("aria-label", "Picture-in-Picture");

    // Style the button to match YouTube's design
    button.style.cssText = `
            display: inline-block;
            width: 48px;
            height: 100%;
            border: none;
            background: transparent;
            cursor: pointer;
            padding: 0;
            margin: 0;
            vertical-align: top;
        `;

    // Create the icon using SVG from icon.svg
    const iconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    iconSvg.setAttribute("height", "28");
    iconSvg.setAttribute("width", "28");
    iconSvg.setAttribute("viewBox", "0 0 24 24");
    iconSvg.setAttribute("fill", "none");

    // First path (small PiP window)
    const path1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path1.setAttribute("fill", "#fff");
    path1.setAttribute("fill-rule", "evenodd");
    path1.setAttribute(
      "d",
      "M16.948 12.25H18.052C18.9505 12.25 19.6997 12.2499 20.2945 12.3299 20.9223 12.4143 21.4891 12.6 21.9445 13.0555 22.4 13.5109 22.5857 14.0777 22.6701 14.7055 22.7501 15.3003 22.75 16.0495 22.75 16.948V17.052C22.75 17.9505 22.7501 18.6997 22.6701 19.2945 22.5857 19.9223 22.4 20.4891 21.9445 20.9445 21.4891 21.4 20.9223 21.5857 20.2945 21.6701 19.6997 21.7501 18.9505 21.75 18.052 21.75H16.948C16.0495 21.75 15.3003 21.7501 14.7055 21.6701 14.0777 21.5857 13.5109 21.4 13.0555 20.9445 12.6 20.4891 12.4143 19.9223 12.3299 19.2945 12.2499 18.6997 12.25 17.9505 12.25 17.052V16.948C12.25 16.0495 12.2499 15.3003 12.3299 14.7055 12.4143 14.0777 12.6 13.5109 13.0555 13.0555 13.5109 12.6 14.0777 12.4143 14.7055 12.3299 15.3003 12.2499 16.0495 12.25 16.948 12.25zM14.9054 13.8165C14.4439 13.8786 14.2464 13.9858 14.1161 14.1161 13.9858 14.2464 13.8786 14.4439 13.8165 14.9054 13.7516 15.3884 13.75 16.036 13.75 17 13.75 17.964 13.7516 18.6116 13.8165 19.0946 13.8786 19.5561 13.9858 19.7536 14.1161 19.8839 14.2464 20.0142 14.4439 20.1214 14.9054 20.1835 15.3884 20.2484 16.036 20.25 17 20.25H18C18.964 20.25 19.6116 20.2484 20.0946 20.1835 20.5561 20.1214 20.7536 20.0142 20.8839 19.8839 21.0142 19.7536 21.1214 19.5561 21.1835 19.0946 21.2484 18.6116 21.25 17.964 21.25 17 21.25 16.036 21.2484 15.3884 21.1835 14.9054 21.1214 14.4439 21.0142 14.2464 20.8839 14.1161 20.7536 13.9858 20.5561 13.8786 20.0946 13.8165 19.6116 13.7516 18.964 13.75 18 13.75H17C16.036 13.75 15.3884 13.7516 14.9054 13.8165zM6.96967 6.96967C7.26256 6.67678 7.73744 6.67678 8.03033 6.96967L10.75 9.68934V8.5C10.75 8.08579 11.0858 7.75 11.5 7.75 11.9142 7.75 12.25 8.08579 12.25 8.5V11.5C12.25 11.9142 11.9142 12.25 11.5 12.25H8.5C8.08579 12.25 7.75 11.9142 7.75 11.5 7.75 11.0858 8.08579 10.75 8.5 10.75H9.68934L6.96967 8.03033C6.67678 7.73744 6.67678 7.26256 6.96967 6.96967z"
    );
    path1.setAttribute("clip-rule", "evenodd");

    // Second path (main window with arrow)
    const path2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path2.setAttribute("fill", "#fff");
    path2.setAttribute("fill-rule", "evenodd");
    path2.setAttribute(
      "d",
      "M9.94358 2.25H14.0564C15.8942 2.24998 17.3498 2.24997 18.489 2.40314C19.6614 2.56076 20.6104 2.89288 21.3588 3.64124C22.1071 4.38961 22.4392 5.33856 22.5969 6.51098C22.75 7.65019 22.75 9.10583 22.75 10.9436V11C22.75 11.4142 22.4142 11.75 22 11.75C21.5858 11.75 21.25 11.4142 21.25 11C21.25 9.09318 21.2484 7.73851 21.1102 6.71085C20.975 5.70476 20.7213 5.12511 20.2981 4.7019C19.8749 4.27869 19.2952 4.02502 18.2892 3.88976C17.2615 3.75159 15.9068 3.75 14 3.75H10C8.09318 3.75 6.73851 3.75159 5.71085 3.88976C4.70476 4.02502 4.12511 4.27869 3.7019 4.7019C3.23045 5.17335 2.96931 5.83905 2.84789 7.07342C2.80734 7.48564 2.4403 7.78695 2.02808 7.7464C1.61585 7.70585 1.31455 7.33881 1.3551 6.92658C1.48944 5.56072 1.80633 4.47616 2.64124 3.64124C3.38961 2.89288 4.33856 2.56076 5.51098 2.40314C6.65019 2.24997 8.10582 2.24998 9.94358 2.25ZM2 10.25C2.41421 10.25 2.75 10.5858 2.75 11V13C2.75 14.9068 2.75159 16.2615 2.88976 17.2892C3.02502 18.2952 3.27869 18.8749 3.7019 19.2981C4.12511 19.7213 4.70476 19.975 5.71085 20.1102C6.73851 20.2484 8.09318 20.25 10 20.25H11C11.4142 20.25 11.75 20.5858 11.75 21C11.75 21.4142 11.4142 21.75 11 21.75H9.94359C8.10583 21.75 6.65019 21.75 5.51098 21.5969C4.33856 21.4392 3.38961 21.1071 2.64124 20.3588C1.89288 19.6104 1.56076 18.6614 1.40314 17.489C1.24997 16.3498 1.24998 14.8942 1.25 13.0564L1.25 11C1.25 10.5858 1.58579 10.25 2 10.25Z"
    );
    path2.setAttribute("clip-rule", "evenodd");

    const parentDiv = document.createElement("div");
    parentDiv.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        `;

    iconSvg.appendChild(path1);
    iconSvg.appendChild(path2);
    parentDiv.appendChild(iconSvg);
    button.appendChild(parentDiv);

    // Add hover effect
    // button.addEventListener("mouseenter", () => {
    //   button.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    // });

    // button.addEventListener("mouseleave", () => {
    //   button.style.backgroundColor = "transparent";
    // });

    // Add click handler
    button.addEventListener("click", handlePiPClick);

    pipButton = button;
    return button;
  }

  // Handle PiP button click
  async function handlePiPClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const video = document.querySelector("video");
    if (!video) {
      return;
    }

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error("PiP error:", error);
    }
  }

  // Place the PiP button in ytp-right-controls
  function placePiPButton() {
    const rightControls = document.querySelector(".ytp-right-controls");
    if (!rightControls) {
      return;
    }

    // Check if button already exists
    if (document.getElementById(BUTTON_ID)) {
      stopPolling();
      return;
    }

    const button = createPiPButton();

    // Insert the button at the beginning of right controls (leftmost position)
    rightControls.insertBefore(button, rightControls.firstChild);

    // Stop polling since button is successfully placed
    stopPolling();
  }

  // Remove the PiP button
  function removePiPButton() {
    const button = document.getElementById(BUTTON_ID);
    if (button) {
      button.remove();
      pipButton = null;
    }
    // Restart polling when button is removed (e.g., navigating away from video)
    startPolling();
  }

  // Check if we're on a video page
  function isVideoPage() {
    return (
      window.location.pathname.includes("/watch") &&
      document.querySelector("video")
    );
  }

  // Main function to handle button placement
  function handlePageChange() {
    if (isVideoPage()) {
      // Try multiple times with increasing delays to ensure YouTube controls are loaded
      const tryPlaceButton = (attempt = 1) => {
        const rightControls = document.querySelector(".ytp-right-controls");
        if (rightControls && !document.getElementById(BUTTON_ID)) {
          placePiPButton();
        } else if (attempt < 5) {
          // Try again with exponential backoff: 500ms, 1s, 2s, 4s
          setTimeout(
            () => tryPlaceButton(attempt + 1),
            500 * Math.pow(2, attempt - 1)
          );
        }
      };
      tryPlaceButton();
    } else {
      removePiPButton();
    }
  }

  // Set up mutation observer to watch for page changes
  function startObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        // Check for URL changes or new video elements
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes);
          if (
            addedNodes.some(
              (node) =>
                node.nodeType === Node.ELEMENT_NODE &&
                (node.classList?.contains("ytp-right-controls") ||
                  node.querySelector?.(".ytp-right-controls") ||
                  node.classList?.contains("ytp-chrome-bottom") ||
                  node.querySelector?.(".ytp-chrome-bottom") ||
                  node.tagName === "VIDEO" ||
                  node.querySelector?.("video"))
            )
          ) {
            shouldUpdate = true;
          }
        }
      });

      if (shouldUpdate) {
        handlePageChange();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Track current URL to detect SPA navigation
  let currentUrl = window.location.href;

  // Handle browser navigation (back/forward) and SPA navigation
  function handleNavigation() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
      originalPushState.apply(history, arguments);
      checkUrlChange();
    };

    history.replaceState = function () {
      originalReplaceState.apply(history, arguments);
      checkUrlChange();
    };

    window.addEventListener("popstate", () => {
      checkUrlChange();
    });

    // Also listen for YouTube's custom navigation events
    window.addEventListener("yt-navigate-start", () => {});

    window.addEventListener("yt-navigate-finish", () => {
      setTimeout(handlePageChange, 100);
    });
  }

  // Check if URL has changed and handle accordingly
  function checkUrlChange() {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      currentUrl = newUrl;
      setTimeout(handlePageChange, 100);
    }
  }

  // Backup polling mechanism to ensure button is placed
  let pollingInterval = null;

  function startPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    pollingInterval = setInterval(() => {
      if (isVideoPage() && !document.getElementById(BUTTON_ID)) {
        const rightControls = document.querySelector(".ytp-right-controls");
        if (rightControls) {
          placePiPButton();
        }
      }
    }, 2000); // Check every 2 seconds
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  // Initialize
  function init() {
    // Initial placement
    handlePageChange();

    // Start observing for changes
    startObserver();

    // Handle navigation
    handleNavigation();

    // Start backup polling
    startPolling();
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
