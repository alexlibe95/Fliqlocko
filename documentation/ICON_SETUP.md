# Icon/Logo Setup Guide

## Required Icon Files

To use your logo everywhere, you need to create icon files in these locations:

### 1. Web App Icons (public/)
- `public/favicon.ico` - Browser favicon (16x16, 32x32, 48x48)
- `public/icon-192.png` - PWA icon (192x192)
- `public/icon-512.png` - PWA icon (512x512)

### 2. Electron Icons (build/)
- `build/icon.png` - Main icon (512x512 or 1024x1024)
- `build/icon.icns` - macOS icon (optional)
- `build/icon.ico` - Windows icon (optional)

## Steps to Add Your Logo

1. **Save your logo image** as `logo.png` (high resolution, at least 1024x1024)

2. **Create web icons:**
   ```bash
   # Copy to public directory
   cp logo.png public/icon-512.png
   
   # Resize for different sizes (requires imagemagick or similar)
   convert logo.png -resize 192x192 public/icon-192.png
   convert logo.png -resize 32x32 public/favicon-32.png
   ```

3. **Create Electron icon:**
   ```bash
   cp logo.png build/icon.png
   ```

4. **Rebuild the app:**
   ```bash
   npm run electron:build:appimage
   ```

## Current Setup

The app is configured to use:
- `public/icon-512.png` for web favicon
- `build/icon.png` for Electron builds

Once you add your logo files, they'll be used automatically!

