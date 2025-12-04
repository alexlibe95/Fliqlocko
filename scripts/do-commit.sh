#!/bin/bash
# Complete script to remove large files and commit correct files

set -e

echo "🚀 Starting git commit process..."
echo ""

# Step 1: Remove large build artifacts from git tracking
echo "📦 Step 1: Removing large build artifacts from git tracking..."
git rm -r --cached fliqlocko-new/release/ 2>/dev/null || echo "  ✓ fliqlocko-new/release/ not tracked"
git rm --cached fliqlocko-new/release/*.AppImage 2>/dev/null || true
git rm --cached fliqlocko-new/release/*.deb 2>/dev/null || true
git rm --cached fliqlocko-new/release/linux-unpacked/fliqlocko 2>/dev/null || true
git rm -r --cached release/ 2>/dev/null || echo "  ✓ release/ not tracked"
git rm -r --cached dist/ 2>/dev/null || echo "  ✓ dist/ not tracked"
echo "  ✅ Done"
echo ""

# Step 2: Stage .gitignore
echo "📝 Step 2: Staging .gitignore..."
git add .gitignore
echo "  ✅ Done"
echo ""

# Step 3: Stage all source files
echo "📝 Step 3: Staging source files and configs..."
git add package.json package-lock.json 2>/dev/null || true
git add tsconfig.json tsconfig.node.json vite.config.ts 2>/dev/null || true
git add .eslintrc.cjs 2>/dev/null || true
git add index.html 2>/dev/null || true
git add electron/ 2>/dev/null || true
git add src/ 2>/dev/null || true
git add electron-builder.yml electron-builder-linux.yml 2>/dev/null || true
git add build/afterPack.js build/icon.png build/AppRun 2>/dev/null || true
git add scripts/ 2>/dev/null || true
git add documentation/ 2>/dev/null || true
git add README.md 2>/dev/null || true
git add public/*.png public/*.svg 2>/dev/null || true
echo "  ✅ Done"
echo ""

# Step 4: Show what will be committed
echo "📋 Files staged for commit:"
git status --short
echo ""

# Step 5: Commit
echo "💾 Step 4: Committing files..."
git commit -m "Initial commit: Fliqlocko Electron app

- React + TypeScript + Vite frontend
- Electron desktop app with AppImage/DEB support
- Flip clock component with animations
- Settings panel with theme support
- Logo integration
- Sandbox fixes for Linux
- GL/VSync error suppression
- Updated .gitignore to exclude build artifacts"
echo "  ✅ Committed successfully!"
echo ""

echo "🎉 All done! You can now push with: git push"
echo ""

