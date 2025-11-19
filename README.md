# Webseite-ROKKO-Records
Homepages for a record label duh

## ⚠️ Important: Color Scheme Policy

**Before making any design changes, please read [COLOR_GUIDE.md](COLOR_GUIDE.md)**

The interior color of all brown frames (`#E0C290`) is **permanently fixed** and must not be changed without explicit approval. See the [color documentation](COLOR_GUIDE.md) for full details on the color scheme and change management policy.

## Deployment

This website is automatically deployed to GitHub Pages via GitHub Actions.

**Live Site:** https://skarramushvandango-tech.github.io/Webseite-ROKKO-Records/

### How it Works

The site uses the GitHub Actions workflow defined in `.github/workflows/static.yml` which:
- Triggers automatically on every push to the `main` branch
- Can also be triggered manually from the Actions tab
- Deploys the entire repository as static content to GitHub Pages

### Local Development

To test the site locally, you can use any static file server. For example:

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
