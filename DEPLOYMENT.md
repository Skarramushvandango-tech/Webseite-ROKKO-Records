# Deployment Guide for ROKKO Records Website

This repository is configured to automatically deploy to GitHub Pages.

## Automatic Deployment

The website will automatically deploy when you push changes to the `main` or `master` branch. The deployment workflow is defined in `.github/workflows/deploy.yml`.

## How to Enable GitHub Pages

To complete the deployment setup, you need to enable GitHub Pages in your repository settings:

1. Go to your repository on GitHub: https://github.com/Skarramushvandango-tech/Webseite-ROKKO-Records
2. Click on **Settings** (in the repository menu)
3. Click on **Pages** (in the left sidebar)
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
5. Save the changes

## Accessing Your Deployed Site

Once GitHub Pages is enabled and the workflow runs successfully, your site will be available at:

```
https://skarramushvandango-tech.github.io/Webseite-ROKKO-Records/
```

## Manual Deployment

You can also trigger a deployment manually:

1. Go to the **Actions** tab in your repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Choose the branch and click "Run workflow"

## Troubleshooting

- Make sure GitHub Pages is enabled in your repository settings
- Check the Actions tab for any workflow errors
- Ensure the workflow has the necessary permissions (already configured in the workflow file)

## What Gets Deployed

The entire repository content is deployed as-is, since this is a static website with HTML, CSS, and JavaScript files. No build step is required.
