#!/bin/bash
# Script to remove large files from git history using git filter-branch

set -e

echo "🗑️  Removing fliqlocko-new/release/ from git history..."
echo "   This may take a few minutes..."

# Remove the directory from all commits in history
git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch fliqlocko-new/release" \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "🧹 Cleaning up..."
# Clean up refs
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin 2>/dev/null || true
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Large files removed from git history!"
echo ""
echo "📋 Next step: Force push with: git push --force --all"

