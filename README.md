# Fliqlocko Application

A beautiful, accurate clock application built with React, TypeScript, Vite, and Electron.

## Features

- ⏰ Accurate time display with smooth flip animations
- 🎨 Dark/Light theme support (auto-detect system preference)
- ⚙️ Customizable settings (12/24h, seconds, date, animation speed)
- ⌨️ Keyboard shortcuts for quick access
- 💾 Settings persistence
- 🎯 Hybrid timer system (never freezes when window loses focus)
- 📱 Responsive design
- 🖥️ Desktop app support (Electron)

## Quick Start

### Web Version

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Desktop App (Electron)

**Development:**
```bash
npm run electron:dev
```

**Build for Linux:**
```bash
# Build AppImage
npm run electron:build:appimage

# Build DEB package
npm run electron:build:deb

# Build both
npm run electron:build:linux
```

See [BUILD.md](./BUILD.md) for detailed build instructions.

## Keyboard Shortcuts

- `S` - Toggle settings panel
- `T` - Cycle through themes (Auto → Light → Dark)
- `Esc` - Close settings panel
- `+/-` - Adjust brightness
- `[/]` - Adjust scale
- `0` - Reset brightness to 100%
- `Arrow Keys` - Adjust brightness/scale

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Electron** - Desktop app wrapper
- **CSS Custom Properties** - Design tokens

## Project Structure

```
fliqlocko-new/
├── electron/          # Electron main process
│   └── main.js       # Main Electron entry point
├── src/              # React application
│   ├── components/   # React components
│   ├── styles/       # CSS files
│   ├── utils/        # Utilities (timer, storage)
│   └── types/        # TypeScript types
├── build/            # Build assets (icons, etc.)
└── dist/             # Production build output
```

## Specification

This application is built according to the complete specification document (`FLIP_CLOCK_SPECIFICATION.md`).

## License

MIT
