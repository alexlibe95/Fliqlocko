# Quick Start Guide

## ✅ AppImage Built Successfully!

Your AppImage is ready at: `release/fliqlocko_1.0.0_x86_64.AppImage`

## Run the AppImage

```bash
cd release
chmod +x fliqlocko_1.0.0_x86_64.AppImage
./fliqlocko_1.0.0_x86_64.AppImage
```

## Build DEB Package

```bash
npm run electron:build:deb
```

Then install:
```bash
sudo dpkg -i release/fliqlocko_1.0.0_amd64.deb
```

## Development Mode

```bash
npm run electron:dev
```

This runs the app with hot-reload in Electron.

## Key Differences from Tauri

✅ **More Stable** - Electron is more mature and stable
✅ **Better Timer** - Uses hybrid approach (setInterval + requestAnimationFrame)
✅ **No Freezing** - Timer continues running when window loses focus
✅ **Better Detection** - Automatically detects Electron and uses correct CSS (240%)

## Troubleshooting

If the app doesn't start, check:
1. Make sure the AppImage is executable: `chmod +x`
2. Check console for errors
3. The app should automatically use 240% height in Electron

