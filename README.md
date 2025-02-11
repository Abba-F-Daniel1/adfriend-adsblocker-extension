# AdFriend Chrome Extension

AdFriend is a unique Chrome extension that transforms ad spaces into positive, interactive content widgets. Instead of simply blocking ads, it replaces them with meaningful content like inspirational quotes, interesting facts, and helpful reminders.


## Features

- **Ad Space Transformation**: Automatically detects and replaces ad spaces with positive content
- **Dynamic Content Types**:
  - Inspirational quotes from notable figures
  - Interesting facts about science and the world
  - Helpful reminders for learning, health, and productivity
- **Smooth Animations**: Beautiful transitions and animations for a pleasant user experience
- **Undetectable Ad Blocking**: Effectively blocks ads without getting detected by anti-adblock systems

## Installation

1. Download this repository as a ZIP file from GitHub
2. Unzip the file to a location on your computer
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer Mode" using the toggle in the top-right corner
5. Click "Load Unpacked" and select the folder where you extracted the ZIP file
6. The extension is now installed and ready to use!

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build the extension:
   ```bash
   npm run build
   ```

### Project Structure

- `/src/background`: Background service worker
- `/src/content`: Content script and React components
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions and ad patterns

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is open source and available under the MIT License.
