# Webseite-ROKKO-Records
Homepages for a record label duh

## ⚠️ Important: Color Scheme Policy

**Before making any design changes, please read [COLOR_GUIDE.md](COLOR_GUIDE.md)**

The interior color of all brown frames (`#E0C290`) is **permanently fixed** and must not be changed without explicit approval. See the [color documentation](COLOR_GUIDE.md) for full details on the color scheme and change management policy.

## 🚀 Deployment & Automatic Updates

This website automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

**🌐 Live Site:** https://skarramushvandango-tech.github.io/Webseite-ROKKO-Records/

### ✅ How Automatic Deployment Works

The site uses GitHub Actions (`.github/workflows/static.yml`) which:

1. **Automatically triggers** on every push to the `main` branch
2. **Deploys immediately** - no manual intervention needed
3. **Updates live site** within 1-2 minutes
4. Can also be **triggered manually** from the Actions tab

### 📋 How to See Your Changes Live

**Option 1: Direct Push to Main (for simple changes)**
```bash
git checkout main
git add .
git commit -m "Your change description"
git push origin main
```
→ Changes appear live in 1-2 minutes! 🎉

**Option 2: Pull Request Workflow (recommended)**
1. Create a feature branch: `git checkout -b feature/my-changes`
2. Make your changes and commit them
3. Push: `git push origin feature/my-changes`
4. Create a Pull Request on GitHub
5. After review, merge the PR to `main`
6. GitHub Actions automatically deploys to live site! 🚀

### ⚠️ Important Notes

- **Only pushes to `main` branch deploy to the live site**
- Feature branches do NOT automatically deploy (this prevents accidental changes)
- Changes take 1-2 minutes to appear after pushing to `main`
- Clear your browser cache (`Ctrl+F5` or `Cmd+Shift+R`) if changes don't appear immediately

### 🔍 Check Deployment Status

1. Go to: https://github.com/Skarramushvandango-tech/Webseite-ROKKO-Records/actions
2. Look for the "Deploy static content to Pages" workflow
3. Green checkmark ✅ = Successfully deployed
4. Red X ❌ = Deployment failed (check logs)

### 🧪 Local Development

To test the site locally before pushing:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

Then open your browser to `http://localhost:8000`

## Color Policy Validation

To verify that the immutable color scheme is maintained, run:

```bash
./validate-colors.sh
```

This script checks that the interior frame color (`#E0C290`) has not been modified and provides a summary of color usage throughout the stylesheet.
