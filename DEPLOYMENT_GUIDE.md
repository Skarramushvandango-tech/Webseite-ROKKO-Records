# 🚀 ROKKO Records Website - Deployment Guide

## Quick Start: Making Changes Go Live

### ✅ The Golden Rule
**To see your changes on the live website, they MUST be in the `main` branch.**

### 🌐 Live Website
https://skarramushvandango-tech.github.io/Webseite-ROKKO-Records/

## Step-by-Step: How to Deploy Changes

### Method 1: Direct Push to Main ⚡ (Fastest)

**Use this for:** Small fixes, content updates, urgent changes

```bash
# 1. Switch to main branch
git checkout main

# 2. Pull latest changes
git pull origin main

# 3. Make your changes to files...

# 4. Add and commit
git add .
git commit -m "Describe your changes here"

# 5. Push to main
git push origin main

# 6. Wait 1-2 minutes, then check live site!
```

**Expected result:** 
- GitHub Actions automatically runs
- Website updates in 1-2 minutes
- Changes are live! 🎉

### Method 2: Pull Request Workflow 🔄 (Recommended for larger changes)

**Use this for:** New features, major updates, team collaboration

```bash
# 1. Create a feature branch
git checkout -b feature/your-feature-name

# 2. Make your changes...

# 3. Commit changes
git add .
git commit -m "Add new feature"

# 4. Push feature branch
git push origin feature/your-feature-name

# 5. Go to GitHub and create a Pull Request

# 6. After review/approval, merge PR to main

# 7. GitHub Actions automatically deploys!
```

## 🔍 Checking Deployment Status

### Option 1: GitHub Actions Tab
1. Go to: https://github.com/Skarramushvandango-tech/Webseite-ROKKO-Records/actions
2. Click on the latest "Deploy static content to Pages" workflow run
3. Check the status:
   - 🟢 Green checkmark = ✅ Deployed successfully
   - 🔴 Red X = ❌ Failed (click to see error logs)
   - 🟡 Yellow dot = ⏳ Currently deploying

### Option 2: Manual Trigger
1. Go to: https://github.com/Skarramushvandango-tech/Webseite-ROKKO-Records/actions
2. Click "Deploy static content to Pages" workflow
3. Click "Run workflow" button
4. Select `main` branch
5. Click green "Run workflow" button

## ⚠️ Common Issues & Solutions

### Issue: "I pushed changes but don't see them on the live site"

**Possible causes:**

1. **Wrong branch** - You pushed to a feature branch, not `main`
   - Solution: Merge your branch to `main`
   
2. **Browser cache** - Your browser is showing an old version
   - Solution: Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
   
3. **Deployment failed** - Check GitHub Actions for errors
   - Solution: Check Actions tab for error messages
   
4. **Still deploying** - Wait a bit longer
   - Solution: Deployments take 1-2 minutes, be patient

### Issue: "GitHub Actions workflow failed"

1. Go to the Actions tab
2. Click on the failed workflow run
3. Click on the failed job
4. Read the error message
5. Fix the issue in your code
6. Commit and push again

### Issue: "I want to preview changes before they go live"

**Solution:** Test locally first!

```bash
# Start local server
python -m http.server 8000

# Open browser to http://localhost:8000
```

## 📊 Deployment Workflow Details

### What Happens When You Push to Main?

1. **Trigger**: Push to `main` branch detected
2. **Checkout**: GitHub Actions clones the repository
3. **Upload**: All files are packaged for deployment
4. **Deploy**: Files are deployed to GitHub Pages
5. **Live**: Website is updated (1-2 minutes)
6. **Cache**: CDN caches may take another minute to clear

### Files Deployed

The entire repository root is deployed, including:
- `index.html` - Main page
- `styles/` - CSS files
- `scripts/` - JavaScript files
- `images/` - All images and videos
- `artists/` - Artist pages
- `mp3/` - Audio files
- All other assets

## 🎯 Best Practices

### ✅ DO:
- Test changes locally before pushing
- Use descriptive commit messages
- Push to `main` only when ready for production
- Check GitHub Actions after pushing
- Clear browser cache if changes don't appear

### ❌ DON'T:
- Push broken code to `main`
- Push sensitive information (passwords, API keys)
- Expect feature branches to deploy automatically
- Forget to pull latest changes before pushing

## 🆘 Getting Help

If deployments are failing or changes aren't appearing:

1. **Check Actions tab** for error messages
2. **Test locally** to verify your changes work
3. **Check browser console** for JavaScript errors
4. **Verify file paths** are correct (case-sensitive!)
5. **Ask for help** with specific error messages

## 📝 Deployment Checklist

Before pushing to `main`:

- [ ] Changes tested locally
- [ ] All file paths are correct
- [ ] No broken links or missing images
- [ ] Color scheme policy maintained (if applicable)
- [ ] Commit message is descriptive
- [ ] Currently on `main` branch (`git branch` to check)
- [ ] Latest changes pulled (`git pull origin main`)

After pushing to `main`:

- [ ] Check GitHub Actions for green checkmark
- [ ] Wait 1-2 minutes for deployment
- [ ] Visit live site and verify changes
- [ ] Hard refresh browser if needed
- [ ] Test on different devices/browsers if major changes

## 🎓 Understanding the Workflow Files

### `.github/workflows/static.yml`
- **Purpose**: Deploys to GitHub Pages
- **Trigger**: Push to `main` branch
- **What it does**: Uploads all files and deploys them

### `.github/workflows/ci.yml`
- **Purpose**: Validates code quality
- **Trigger**: Push to any branch, Pull Requests
- **What it does**: Checks HTML, validates assets, runs tests

## 📚 Additional Resources

- GitHub Pages Documentation: https://docs.github.com/en/pages
- GitHub Actions Documentation: https://docs.github.com/en/actions
- Project README: [README.md](README.md)
- Color Scheme Policy: [COLOR_GUIDE.md](COLOR_GUIDE.md)

---

**Questions?** Check the Actions tab or create an issue on GitHub.
