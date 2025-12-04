#!/bin/bash
# Script to remove large build artifacts from git tracking

echo "Removing large build artifacts from git tracking..."

# Remove release directories from git
git rm -r --cached release/ 2>/dev/null || true
git rm -r --cached fliqlocko-new/release/ 2>/dev/null || true
git rm -r --cached dist/ 2>/dev/null || true
git rm -r --cached fliqlocko-new/dist/ 2>/dev/null || true

# Remove specific large files
git rm --cached fliqlocko-new/release/*.AppImage 2>/dev/null || true
git rm --cached fliqlocko-new/release/*.deb 2>/dev/null || true
git rm --cached fliqlocko-new/release/linux-unpacked/fliqlocko 2>/dev/null || true
git rm --cached release/*.AppImage 2>/dev/null || true
git rm --cached release/*.deb 2>/dev/null || true
git rm --cached release/linux-unpacked/fliqlocko 2>/dev/null || true

# Remove any AppImage or DEB files anywhere
find . -name "*.AppImage" -exec git rm --cached {} \; 2>/dev/null || true
find . -name "*.deb" -exec git rm --cached {} \; 2>/dev/null || true

echo "✅ Large files removed from git tracking"
echo ""
echo "Next steps:"
echo "1. Commit the changes: git commit -m 'Remove large build artifacts from git'"
echo "2. Push again: git push"

