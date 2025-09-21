# YouTube PiP Extension

A simple Chrome extension to toggle Picture-in-Picture (PiP) for YouTube videos with just one click.

## Features

- **Direct Click**: Click the extension icon to toggle PiP instantly
- **No Popup Required**: No need to open popup or click additional buttons
- **Auto Detection**: Only works on YouTube pages
- **Smart Toggle**: Automatically enables PiP if not active, disables PiP if already active

## Usage

1. Install the extension in Chrome
2. Visit any YouTube video
3. Click the extension icon in the toolbar
4. Video will automatically switch to Picture-in-Picture mode

## Installation

### From source code:

1. Clone or download this source code
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the folder containing the source code
5. The extension will appear in the list and on the toolbar

## Project Structure

```
pip-utube/
├── manifest.json          # Extension configuration
├── background.js          # Service worker handling click events
├── content.js            # Script injecting PiP button into YouTube
├── content_script.js     # Simpler script for injecting button
└── icons/                 # Extension icons
    ├── icon16.png
    └── icon128.png
```

## Permissions

The extension requires the following permissions:
- `activeTab`: To access the current tab
- `scripting`: To inject scripts into YouTube pages
- `tabs`: To query tab information
- `host_permissions`: Only works on `youtube.com`

## Technical Features

- **Manifest V3**: Uses the latest Chrome Extension Manifest V3
- **Service Worker**: Background script runs as a service worker
- **Content Scripts**: Injects PiP button directly into YouTube player
- **Error Handling**: Handles errors when video is not found or PiP is not supported

## Troubleshooting

### Extension not working:
- Make sure you're on a YouTube page (youtube.com)
- Check console for any errors
- Try reloading the YouTube page

### PiP won't activate:
- Check if your browser supports Picture-in-Picture
- Some videos may be blocked from PiP by YouTube
- Try with a different video

## Development

### Making changes:
1. Edit code in the respective files
2. Go to `chrome://extensions/`
3. Click "Reload" button on the extension
4. Test again on YouTube

### Debugging:
- Open Developer Tools (F12) on YouTube page to see console
- Go to `chrome://extensions/` to see background script logs

## License

MIT License - Free to use and modify.

## Contributing

All contributions are welcome! Create an issue or pull request if you have ideas to improve the extension.
