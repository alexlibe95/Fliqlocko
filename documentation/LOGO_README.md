# Logo Setup Complete! 🎨

I've configured the app to use your logo everywhere. Here's what's been set up:

## ✅ What's Configured

1. **Web App** (`index.html`)
   - Favicon: `public/icon-512.png`
   - PWA icon support

2. **Electron App** (`electron/main.js` & `electron-builder.yml`)
   - App icon: `build/icon.png`
   - Window icon
   - AppImage/DEB package icon

3. **UI Components**
   - Logo component created (`src/components/Logo.tsx`)
   - Settings panel shows logo
   - Reusable logo component for future use

## 🚀 Quick Setup

### Option 1: Use the Helper Script (Easiest)

```bash
./setup-logo.sh /path/to/your/logo.png
```

This will automatically copy your logo to all the right places!

### Option 2: Manual Setup

```bash
# Copy your logo file
cp /path/to/your/logo.png public/icon-512.png
cp /path/to/your/logo.png build/icon.png

# Create smaller size (optional)
convert logo.png -resize 192x192 public/icon-192.png
```

## 📍 Where Your Logo Will Appear

✅ **Browser tab** (favicon)  
✅ **Electron window** (title bar icon)  
✅ **Settings panel** (header)  
✅ **AppImage** (application icon)  
✅ **DEB package** (system menu icon)  
✅ **System launcher** (after installation)  

## 🎯 Logo Requirements

- **Format:** PNG (with transparency preferred)
- **Size:** At least 512x512 pixels (1024x1024 recommended)
- **Shape:** Square (1:1 aspect ratio)
- **Background:** Transparent or solid color

## 🔄 After Adding Your Logo

Rebuild the app to see your logo everywhere:

```bash
# Web version
npm run build

# Electron AppImage
npm run electron:build:appimage

# Or both
npm run electron:build:linux
```

## 📝 Files Created

- `src/components/Logo.tsx` - Reusable logo component
- `src/styles/logo.css` - Logo styling
- `setup-logo.sh` - Helper script to set up logo
- Updated `index.html` - Favicon links
- Updated `electron/main.js` - Window icon
- Updated `electron-builder.yml` - Build icon config

Once you add your logo image files, everything will work automatically! 🎉

