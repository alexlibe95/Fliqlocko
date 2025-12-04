# Building Fliqlocko for Linux

This guide explains how to build Fliqlocko as a desktop application for Linux (AppImage or DEB).

## Prerequisites

- Node.js 18+ and npm
- Linux system (for building Linux packages)

## Development

Run the app in development mode:

```bash
npm run electron:dev
```

This will:
1. Start the Vite dev server
2. Wait for it to be ready
3. Launch Electron with the app

## Building for Production

### Build AppImage (Recommended)

```bash
npm run electron:build:appimage
```

Output: `release/Fliqlocko_1.0.0_amd64.AppImage`

### Build DEB Package

```bash
npm run electron:build:deb
```

Output: `release/fliqlocko_1.0.0_amd64.deb`

### Build Both

```bash
npm run electron:build:linux
```

This creates both AppImage and DEB packages.

## Installing

### AppImage

1. Make it executable:
   ```bash
   chmod +x release/Fliqlocko_1.0.0_amd64.AppImage
   ```

2. Run it:
   ```bash
   ./release/Fliqlocko_1.0.0_amd64.AppImage
   ```

### DEB Package

```bash
sudo dpkg -i release/fliqlocko_1.0.0_amd64.deb
```

If dependencies are missing:
```bash
sudo apt-get install -f
```

## Troubleshooting

### Build fails with "electron-builder" errors

Make sure you have all required dependencies:
```bash
npm install
```

### App doesn't start

Check the console output for errors. The app should automatically detect Electron and use the correct CSS variable (240%).

### Icon missing

Create a `build/icon.png` file (512x512px recommended) or the build will use a default icon.

## Notes

- The app automatically detects Electron environment and uses `240%` for digit content height
- Timer system uses hybrid approach (setInterval + requestAnimationFrame) to prevent freezing
- Settings are stored in Electron's userData directory (not localStorage in production)

