# YouTube PiP Extension

Chrome extension for Picture-in-Picture functionality on YouTube videos.

## Features

- Toggle PiP via extension icon or YouTube toolbar button
- Auto-detection on YouTube video pages
- Minimal permissions for security

## Usage

**Extension Icon**: Click extension icon in Chrome toolbar  
**YouTube Button**: Click PiP button in YouTube video controls

## Installation

1. Clone/download source code
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select source folder

## Project Structure

```
pip-youtube/
├── manifest.json              # Extension configuration
├── background.js              # Service worker handling extension icon clicks
├── youtube_toolbar_button.js  # Content script for YouTube toolbar button
└── icons/                     # Extension icons
    ├── icon16.png
    └── icon128.png
```

## Permissions

- `activeTab`: Access current tab
- `scripting`: Inject scripts into YouTube pages

## Troubleshooting

**Extension not working**: Ensure you're on YouTube video page  
**PiP won't activate**: Check browser PiP support or try different video

## License

MIT License
