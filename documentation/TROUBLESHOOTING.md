# Troubleshooting Guide

## Common Issues and Solutions

### Sandbox Error in Development

**Error:**
```
FATAL:setuid_sandbox_host.cc(158)] The SUID sandbox helper binary was found, but is not configured correctly.
```

**Solution:**
This is already fixed in the code. The app automatically disables sandbox in development mode. If you still see this:

1. Make sure you're running: `npm run electron:dev`
2. The `--no-sandbox` flag is automatically added in development
3. For production builds (AppImage/DEB), sandbox is handled automatically by electron-builder

### GL Surface Error

**Error:**
```
ERROR:gl_surface_presentation_helper.cc(260)] GetVSyncParametersIfAvailable() failed
```

**Solution:**
This is harmless and already suppressed. It's just Electron trying to detect VSync parameters. Doesn't affect functionality.

### AppImage Won't Run

**Solution:**
```bash
chmod +x release/fliqlocko_1.0.0_x86_64.AppImage
./release/fliqlocko_1.0.0_x86_64.AppImage
```

### DEB Installation Fails

**Solution:**
```bash
sudo apt-get install -f
sudo dpkg -i release/fliqlocko_1.0.0_amd64.deb
```

### Timer Freezing

**Solution:**
The app uses a hybrid timer system that should prevent freezing. If you experience issues:
1. Check browser console for errors
2. Make sure the app detects Electron correctly (should use 240% height)
3. The timer continues running even when window loses focus

### Development Mode Not Starting

**Solution:**
```bash
# Kill any running processes
pkill -f electron
pkill -f vite

# Start fresh
npm run electron:dev
```

### Build Fails

**Solution:**
1. Clean and rebuild:
   ```bash
   rm -rf dist dist-electron release node_modules
   npm install
   npm run build
   npm run electron:build:appimage
   ```

2. Check for missing dependencies:
   ```bash
   npm install
   ```

