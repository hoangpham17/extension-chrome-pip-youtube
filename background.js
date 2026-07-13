// Main background script that routes to appropriate implementation based on URL

chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;

    // Check if we're on YouTube
    if (tab.url && tab.url.includes('youtube.com')) {
        // Use YouTube-specific implementation
        await handleYouTubePiP(tab);
    }
    // Check if we're on Facebook
    else if (tab.url && (tab.url.includes('facebook.com') || tab.url.includes('fb.com'))) {
        // Use Facebook/other platforms implementation
        await handleOtherPlatformsPiP(tab);
    }
    else {
        console.log('Not on a supported page (YouTube or Facebook)');
    }
});

// YouTube-specific PiP implementation
async function handleYouTubePiP(tab) {
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
}

// Other platforms (Facebook) PiP implementation
async function handleOtherPlatformsPiP(tab) {
    if (!tab.id) return;

    // Check if we're on a supported non-YouTube page
    if (!tab.url ||
        !(tab.url.includes('facebook.com') ||
          tab.url.includes('fb.com'))) {
        console.log('Not on a supported non-YouTube page (Facebook)');
        return;
    }

    try {
        // First, check if there are videos on the page
        const detectionResult = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                // Try to find video elements
                const videos = document.querySelectorAll('video');
                return videos.length > 0;
            }
        });

        // If videos are found, try to toggle PiP
        if (detectionResult && detectionResult[0] && detectionResult[0].result) {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const video = document.querySelector('video');
                    if (!video) {
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
        } else {
            // If no videos found with simple query, use our enhanced detection
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    // Send message to content script to toggle PiP
                    return new Promise((resolve) => {
                        chrome.runtime.sendMessage(
                            {action: 'togglePiP'},
                            (response) => {
                                resolve(response || {success: false, error: 'No response from content script'});
                            }
                        );
                    });
                }
            });
        }
    } catch (err) {
        console.error("Toggle PiP error:", err);
        // Try to send an error message to the content script
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (error) => {
                    console.error('PiP Extension Error:', error);
                    return { ok: false, msg: error.message || String(error) };
                },
                args: [err]
            });
        } catch (e) {
            console.error("Error sending error to content script:", e);
        }
    }
}