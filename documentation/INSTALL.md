# Installation Guide

## ✅ Packages Built Successfully!

Both AppImage and DEB packages are ready in the `release/` directory:

- **AppImage**: `fliqlocko_1.0.0_x86_64.AppImage` (101 MB)
- **DEB Package**: `fliqlocko_1.0.0_amd64.deb` (70 MB)

## Install AppImage (Recommended - No Installation Required)

**Option 1: Direct run (sandbox flags are built-in)**
```bash
cd release
chmod +x fliqlocko_1.0.0_x86_64.AppImage
./fliqlocko_1.0.0_x86_64.AppImage
```

**Option 2: Use wrapper script (if sandbox issues occur)**
```bash
./run-appimage.sh release/fliqlocko_1.0.0_x86_64.AppImage
```

**Note:** The sandbox flags (`--no-sandbox --disable-setuid-sandbox`) are now built into the Electron app, so it should work without issues. If you still encounter sandbox errors, use the wrapper script.

**Advantages:**
- No installation needed
- Portable - can run from anywhere
- No root access required
- Easy to update (just replace the file)

## Install DEB Package (System Integration)

```bash
cd release
sudo dpkg -i fliqlocko_1.0.0_amd64.deb
```

If dependencies are missing:
```bash
sudo apt-get install -f
```

**Advantages:**
- Integrated into system menu
- Can be launched from applications menu
- Uninstall with: `sudo apt remove fliqlocko`

## Verify Installation

After installation, you can:
- Launch from applications menu (DEB)
- Or run the AppImage directly
- The app should automatically detect Electron and use correct styling (240% height)

## Uninstall

**AppImage:**
- Just delete the file

**DEB Package:**
```bash
sudo apt remove fliqlocko
```

## Troubleshooting

**AppImage won't run:**
```bash
chmod +x fliqlocko_1.0.0_x86_64.AppImage
```

**DEB installation fails:**
```bash
sudo apt-get install -f
sudo dpkg -i fliqlocko_1.0.0_amd64.deb
```

**App doesn't start:**
- Check console output
- Make sure you have required libraries (usually auto-installed with DEB)

