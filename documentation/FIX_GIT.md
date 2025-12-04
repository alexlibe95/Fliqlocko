# Quick Fix for Git Push Error

## Run These Commands:

```bash
# 1. Remove large files from git tracking
git rm -r --cached fliqlocko-new/release/ 2>/dev/null || echo "Directory not in git"
git rm --cached fliqlocko-new/release/*.AppImage 2>/dev/null || echo "Files not in git"
git rm --cached fliqlocko-new/release/*.deb 2>/dev/null || echo "Files not in git"
git rm --cached fliqlocko-new/release/linux-unpacked/fliqlocko 2>/dev/null || echo "File not in git"

# 2. Stage the updated .gitignore
git add .gitignore

# 3. Commit the changes
git commit -m "Remove large build artifacts and update .gitignore"

# 4. Push again
git push
```

## If That Doesn't Work:

The files might be in git history. In that case, you need to remove them from history:

```bash
# Remove from all commits
git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch fliqlocko-new/release" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: Rewrites history!)
git push --force --all
```

## Alternative: Start Fresh (if repo is new)

If you don't mind losing git history:
```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/alexlibe95/Fliqlocko.git
git push -u origin main --force
```

