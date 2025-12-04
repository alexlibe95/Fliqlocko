# Remove Large Files from Git History

The large build artifacts are already in git history, so we need to remove them from all commits.

## Quick Fix (Recommended)

Run this script:
```bash
chmod +x scripts/remove-from-history.sh
./scripts/remove-from-history.sh
```

Then force push:
```bash
git push --force --all
```

## Manual Method

If you prefer to do it manually:

```bash
# 1. Remove from all commits
git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch fliqlocko-new/release" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Clean up refs
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 3. Force push
git push --force --all
```

## Alternative: Start Fresh (If repo is new)

If you don't mind losing git history:

```bash
# Remove git history
rm -rf .git

# Start fresh
git init
git add .
git commit -m "Initial commit: Fliqlocko Electron app"
git branch -M main
git remote add origin https://github.com/alexlibe95/Fliqlocko.git
git push -u origin main --force
```

## Verify

After removing from history, verify the files are gone:
```bash
git log --all --full-history -- fliqlocko-new/release/
```

Should return nothing if successful.

