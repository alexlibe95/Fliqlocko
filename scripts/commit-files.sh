#!/bin/bash
# Script to commit correct files while excluding large build artifacts

set -e

echo "🔍 Checking git status..."

# Remove large build artifacts from git tracking (if they exist)
echo "📦 Removing large build artifacts from git tracking..."
git rm -r --cached fliqlocko-new/release/ 2>/dev/null || echo "  ✓ fliqlocko-new/release/ not tracked"
git rm -r --cached release/ 2>/dev/null || echo "  ✓ release/ not tracked"
git rm --cached fliqlocko-new/release/*.AppImage 2>/dev/null || true
git rm --cached fliqlocko-new/release/*.deb 2>/dev/null || true
git rm --cached fliqlocko-new/release/linux-unpacked/fliqlocko 2>/dev/null || true

# Stage the updated .gitignore
echo "📝 Staging .gitignore..."
git add .gitignore

# Stage all source files and configs (excluding build artifacts)
echo "📝 Staging source files..."
git add package.json package-lock.json
git add tsconfig.json tsconfig.node.json vite.config.ts
git add .eslintrc.cjs
git add index.html

# Stage electron files
echo "📝 Staging Electron files..."
git add electron/*.js electron/*.ts electron/*.json electron/*.sh 2>/dev/null || true

# Stage source files
echo "📝 Staging source files..."
git add src/

# Stage build configs (but not build outputs)
echo "📝 Staging build configs..."
git add electron-builder.yml electron-builder-linux.yml
git add build/afterPack.js build/icon.png build/AppRun 2>/dev/null || true

# Stage scripts
echo "📝 Staging scripts..."
git add scripts/*.sh 2>/dev/null || true

# Stage documentation
echo "📝 Staging documentation..."
git add documentation/*.md 2>/dev/null || true
git add README.md 2>/dev/null || true

# Stage public assets (but not dist)
echo "📝 Staging public assets..."
git add public/*.png public/*.svg 2>/dev/null || true

echo ""
echo "✅ Files staged successfully!"
echo ""
echo "📋 Summary of changes:"
git status --short

echo ""
echo "💡 To commit, run:"
echo "   git commit -m 'Initial commit: Fliqlocko Electron app'"
echo ""
echo "💡 To push, run:"
echo "   git push"

