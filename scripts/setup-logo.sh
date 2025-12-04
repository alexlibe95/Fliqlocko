#!/bin/bash
# Helper script to set up logo files

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <path-to-logo.png>"
    echo ""
    echo "This script will copy your logo to the required locations:"
    echo "  - public/icon-512.png (for web app)"
    echo "  - build/icon.png (for Electron)"
    echo ""
    echo "Example:"
    echo "  $0 ~/Downloads/my-logo.png"
    exit 1
fi

LOGO_FILE="$1"

if [ ! -f "$LOGO_FILE" ]; then
    echo "Error: Logo file not found: $LOGO_FILE"
    exit 1
fi

echo "Setting up logo from: $LOGO_FILE"
echo ""

# Create directories if they don't exist
mkdir -p public build

# Copy to public folder (web app)
echo "Copying to public/icon-512.png..."
cp "$LOGO_FILE" public/icon-512.png
echo "✅ Created public/icon-512.png"

# Copy to build folder (Electron)
echo "Copying to build/icon.png..."
cp "$LOGO_FILE" build/icon.png
echo "✅ Created build/icon.png"

# Create smaller sizes if imagemagick is available
if command -v convert &> /dev/null; then
    echo ""
    echo "Creating additional sizes..."
    convert "$LOGO_FILE" -resize 192x192 public/icon-192.png
    echo "✅ Created public/icon-192.png"
else
    echo ""
    echo "⚠️  ImageMagick not found. Skipping additional sizes."
    echo "   You can manually create icon-192.png if needed."
fi

echo ""
echo "✅ Logo setup complete!"
echo ""
echo "Next steps:"
echo "  1. Rebuild the web app: npm run build"
echo "  2. Rebuild Electron: npm run electron:build:appimage"
echo ""

