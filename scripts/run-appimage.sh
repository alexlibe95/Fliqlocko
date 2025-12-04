#!/bin/bash
# Wrapper script to run AppImage with proper flags
# This ensures sandbox is disabled even if flags aren't in the binary

APPIMAGE="$1"
if [ -z "$APPIMAGE" ]; then
    APPIMAGE="release/fliqlocko_1.0.0_x86_64.AppImage"
fi

if [ ! -f "$APPIMAGE" ]; then
    echo "Error: AppImage not found: $APPIMAGE"
    exit 1
fi

# Make executable if needed
chmod +x "$APPIMAGE"

# Run with sandbox disabled
exec "$APPIMAGE" --no-sandbox --disable-setuid-sandbox "$@"

