# Git Cleanup Guide - Removing Large Build Artifacts

## Problem
GitHub rejected your push because build artifacts (AppImage, DEB) exceed size limits:
- `fliqlocko-new/release/fliqlocko_1.0.0_amd64.deb` (69.53 MB)
- `fliqlocko-new/release/fliqlocko_1.0.0_x86_64.AppImage` (100.47 MB)
- `fliqlocko-new/release/linux-unpacked/fliqlocko` (168.97 MB)

## Solution

### Step 1: Remove files from git tracking

Run the cleanup script:
```bash
chmod +x scripts/clean-git.sh
./scripts/clean-git.sh
```

Or manually:
```bash
# Remove the problematic directory from git
git rm -r --cached fliqlocko-new/release/ 2>/dev/null || true

# Remove any AppImage/DEB files
git rm --cached fliqlocko-new/release/*.AppImage 2>/dev/null || true
git rm --cached fliqlocko-new/release/*.deb 2>/dev/null || true
git rm --cached fliqlocko-new/release/linux-unpacked/fliqlocko 2>/dev/null || true

# Also remove current release directory if tracked
git rm -r --cached release/ 2>/dev/null || true
```

### Step 2: Commit the removal

```bash
git add .gitignore
git commit -m "Remove large build artifacts from git tracking"
```

### Step 3: Push again

```bash
git push
```

## If Files Are Already in Git History

If the files were committed in previous commits, you'll need to remove them from history:

### Option A: Use git filter-branch (if files are in recent commits)

```bash
# Remove fliqlocko-new/release from all commits
git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch fliqlocko-new/release" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history!)
git push --force --all
```

### Option B: Use BFG Repo-Cleaner (Recommended - Faster)

1. Install BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Run:
```bash
java -jar bfg.jar --delete-folders fliqlocko-new/release
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

### Option C: Start Fresh (If history cleanup is too complex)

If the repository is new and you don't mind losing history:
```bash
# Remove .git and start fresh
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main --force
```

## Prevention

The `.gitignore` has been updated to exclude:
- `release/` directory
- `*.AppImage` files
- `*.deb` files
- `linux-unpacked/` directories
- `fliqlocko-new/release/` (old directory)

Future builds will be automatically ignored.

## Verify

After cleanup, verify no large files are tracked:
```bash
git ls-files | xargs ls -lh | awk '{print $5, $9}' | sort -hr | head -20
```

This shows the largest tracked files. Build artifacts should not appear.

