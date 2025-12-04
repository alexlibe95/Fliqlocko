# How to Add Your Logo

## Quick Steps

1. **Save your logo image** as `logo.png` in the project root (or wherever you have it)

2. **Copy it to the required locations:**
   ```bash
   cd fliqlocko-new
   
   # Copy to public folder (for web app)
   cp /path/to/your/logo.png public/icon-512.png
   
   # Copy to build folder (for Electron)
   cp /path/to/your/logo.png build/icon.png
   
   # Create smaller sizes for favicon (optional, requires imagemagick)
   # If you don't have imagemagick, just use the same file
   cp public/icon-512.png public/icon-192.png
   ```

3. **Rebuild the app:**
   ```bash
   # For web
   npm run build
   
   # For Electron AppImage
   npm run electron:build:appimage
   ```

## Where the Logo Will Appear

✅ **Browser tab** (favicon)  
✅ **App window title bar** (Electron)  
✅ **Settings panel header**  
✅ **AppImage/DEB package icon**  
✅ **System application menu** (after DEB install)  

## Logo Specifications

- **Format:** PNG (with transparency preferred)
- **Size:** At least 512x512 pixels (1024x1024 recommended)
- **Aspect Ratio:** Square (1:1)
- **Background:** Transparent or solid color

## Current Status

The app is configured to use:
- `public/icon-512.png` - Web favicon and PWA icon
- `build/icon.png` - Electron app icon

Once you add these files, the logo will appear everywhere automatically!

