# Hamsa Center Website Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Vercel will automatically detect Vite and deploy
5. Your site will be live at `https://your-project.vercel.app`

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist` folder
3. Your site will be live immediately

### Option 3: GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Your site will be live at `https://hamsaconsultancy.com`

## Files Ready for Deployment
- ✅ `dist/` folder contains all built files
- ✅ `vercel.json` for Vercel configuration
- ✅ `CNAME` file for custom domain
- ✅ All assets optimized and ready

## Local Testing
- Run `npm run preview` to test the built version locally
- Visit `http://localhost:4173` to preview

## Troubleshooting
- If you get 404 errors, make sure to deploy the `dist` folder, not the root folder
- For Vercel, the `vercel.json` file will handle routing
- For GitHub Pages, make sure to select the correct branch and folder