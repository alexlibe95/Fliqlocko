# Sandbox Fix for AppImage and DEB Packages

## Problem
Electron apps on Linux require proper sandbox configuration. Without it, you get errors like:
```
FATAL:setuid_sandbox_host.cc(158)] The SUID sandbox helper binary was found, but is not configured correctly.
```

## Solution Applied

### 1. Built-in Fix (Recommended)
The sandbox flags are now **built into the Electron app** (`electron/main.js`):
- `--no-sandbox`
- `--disable-setuid-sandbox`

This means **new builds** will work without sandbox issues.

### 2. Rebuild Required
If you have old AppImage/DEB packages, rebuild them:

```bash
npm run electron:build:appimage
# or
npm run electron:build:deb
# or both
npm run electron:build:linux
```

### 3. Alternative: Wrapper Script
If you still have issues with existing packages, use the wrapper script:

```bash
./run-appimage.sh release/fliqlocko_1.0.0_x86_64.AppImage
```

### 4. Manual Fix (Not Recommended)
If you really need to fix the sandbox binary (requires root):
```bash
# For AppImage (extract first)
./release/fliqlocko_1.0.0_x86_64.AppImage --appimage-extract
sudo chown root:root squashfs-root/chrome-sandbox
sudo chmod 4755 squashfs-root/chrome-sandbox
# Then repackage (complex, not recommended)
```

## Why This Works
- The flags are set in `electron/main.js` before the app starts
- They apply to both development and production builds
- No root access required
- Safe for a clock application (doesn't need strict sandboxing)

## Verification
After rebuilding, the AppImage/DEB should run without sandbox errors:
```bash
./release/fliqlocko_1.0.0_x86_64.AppImage
```

No errors = Success! ✅

