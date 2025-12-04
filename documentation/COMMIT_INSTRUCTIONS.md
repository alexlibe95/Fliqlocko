# Instructions to Commit Correct Files

Run these commands in order:

```bash
# 1. Remove large build artifacts from git tracking
git rm -r --cached fliqlocko-new/release/ 2>/dev/null || true
git rm --cached fliqlocko-new/release/*.AppImage 2>/dev/null || true
git rm --cached fliqlocko-new/release/*.deb 2>/dev/null || true
git rm --cached fliqlocko-new/release/linux-unpacked/fliqlocko 2>/dev/null || true

# 2. Stage the updated .gitignore
git add .gitignore

# 3. Stage all source files and configs
git add package.json package-lock.json
git add tsconfig.json tsconfig.node.json vite.config.ts
git add .eslintrc.cjs
git add index.html
git add electron/
git add src/
git add electron-builder.yml electron-builder-linux.yml
git add build/afterPack.js build/icon.png build/AppRun
git add scripts/
git add documentation/
git add README.md
git add public/*.png public/*.svg

# 4. Commit
git commit -m "Initial commit: Fliqlocko Electron app

- React + TypeScript + Vite frontend
- Electron desktop app with AppImage/DEB support
- Flip clock component with animations
- Settings panel with theme support
- Logo integration
- Sandbox fixes for Linux
- GL/VSync error suppression"

# 5. Push
git push
```

Or use the automated script:
```bash
chmod +x scripts/commit-files.sh
./scripts/commit-files.sh
git commit -m "Initial commit: Fliqlocko Electron app"
git push
```

