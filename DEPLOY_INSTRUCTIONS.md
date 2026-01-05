# Deployment Instructions - Focus Timer Pro

Step-by-step guide to deploy your application to production.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended) ⚡

**Why Vercel?**
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier generous
- ✅ Perfect for React/Vite
- ✅ Instant deployments

#### Method A: Deploy via Vercel Website (Easiest)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (recommended)

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Or drag & drop your project folder

3. **Configure (Auto-detected)**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app is live! 🎉

5. **Get Your URL**
   - Vercel provides: `https://focus-timer-pro.vercel.app`
   - Add custom domain if desired

#### Method B: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy (from project root)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? focus-timer-pro
# - Directory? ./
# - Override settings? No

# 4. Deploy to production
vercel --prod

# Your app is now live! 🎉
```

**Automatic Deployments:**
- Push to `main` branch → Auto-deploys to production
- Push to other branches → Preview deployments
- Pull requests → Preview URLs automatically

---

### Option 2: Netlify 🌐

#### Method A: Deploy via Netlify Website

1. **Create Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider
   - Select repository

3. **Build Settings** (Auto-detected)
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - Live at: `https://your-site-name.netlify.app`

#### Method B: Netlify CLI

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Build your site
npm run build

# 4. Deploy
netlify deploy

# Follow prompts:
# - Create new site
# - Team: [Your team]
# - Site name: focus-timer-pro
# - Publish directory: dist

# 5. Deploy to production
netlify deploy --prod

# Done! 🎉
```

---

### Option 3: GitHub Pages 📄

**Perfect for:** Free hosting, open-source projects

```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add to package.json scripts:
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

# 3. Update vite.config.ts (important!)
export default defineConfig({
  base: '/focus-timer-pro/', // Your repo name
  // ... rest of config
})

# 4. Deploy
npm run deploy

# 5. Enable GitHub Pages
# Go to: Settings → Pages → Source → gh-pages branch

# Live at: https://yourusername.github.io/focus-timer-pro/
```

---

### Option 4: Cloudflare Pages ☁️

1. **Connect Repository**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Connect GitHub account
   - Select repository

2. **Configure**
   ```
   Production branch: main
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```

3. **Deploy**
   - Click "Save and Deploy"
   - Wait 2-3 minutes
   - Live at: `https://focus-timer-pro.pages.dev`

---

## 🔧 Pre-Deployment Checklist

Before deploying, ensure:

### 1. Build Test
```bash
# Test production build locally
npm run build
npm run preview

# Check for errors in console
# Test all features work
```

### 2. Environment Variables

Create `.env.production`:
```env
VITE_APP_NAME=Focus Timer Pro
VITE_APP_VERSION=1.0.0
```

**For Vercel:**
- Dashboard → Project → Settings → Environment Variables

**For Netlify:**
- Site settings → Build & deploy → Environment

**For GitHub Pages:**
- Use GitHub Secrets in Actions workflow

### 3. Assets Ready

✅ Audio files in `public/sounds/`:
- bell.mp3
- chime.mp3
- ding.mp3
- gong.mp3
- rain.mp3
- ocean.mp3
- forest.mp3
- cafe.mp3
- white-noise.mp3

✅ PWA icons in `public/`:
- pwa-192x192.png
- pwa-512x512.png
- apple-touch-icon.png
- favicon.svg

### 4. Update URLs

In these files, replace placeholders:
- `README.md` - Repository URL
- `PRIVACY_POLICY.md` - Contact email
- `TERMS_OF_SERVICE.md` - Contact email
- `package.json` - Repository URL

### 5. DNS & Custom Domain (Optional)

**Vercel:**
1. Vercel Dashboard → Domains
2. Add your domain
3. Update DNS records:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com

**Netlify:**
1. Site settings → Domain management
2. Add custom domain
3. Update nameservers or add DNS records

---

## 🎯 Post-Deployment Steps

### 1. Verify Deployment

Check these:
- ✅ App loads without errors
- ✅ Timer functions work
- ✅ Settings save properly
- ✅ Notifications work (after permission)
- ✅ PWA installable
- ✅ Offline mode works
- ✅ All pages accessible
- ✅ Mobile responsive

### 2. Test PWA Installation

**Desktop:**
1. Open your deployed URL
2. Look for install icon in browser
3. Click "Install"
4. Verify app works standalone

**Mobile:**
1. Open in mobile browser
2. Add to home screen
3. Test offline functionality

### 3. Performance Testing

```bash
# Run Lighthouse audit
npx lighthouse https://your-deployed-url.com --view

# Check scores:
# Performance: 90+
# Accessibility: 90+
# Best Practices: 90+
# SEO: 90+
# PWA: All checks passed
```

### 4. SEO Setup

**Update these meta tags** in `index.html`:
```html
<meta property="og:url" content="https://your-domain.com" />
<meta property="og:image" content="https://your-domain.com/og-image.png" />
<link rel="canonical" href="https://your-domain.com" />
```

**Create sitemap** (`public/sitemap.xml`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Update robots.txt**:
```
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

### 5. Analytics (Optional)

Add Google Analytics or Plausible:

```typescript
// src/services/AnalyticsService.ts (optional)
export const trackPageView = () => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    // Your analytics code
  }
};
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

**Vercel/Netlify** (automatic after initial setup):
```bash
# Just push to GitHub
git add .
git commit -m "Update feature"
git push origin main

# Automatically deploys!
```

### GitHub Actions (for other platforms)

Already configured in `.github/workflows/ci.yml`

**To add deployment:**

```yaml
# Add to .github/workflows/deploy.yml
- name: Deploy to Production
  run: |
    npm run build
    # Your deploy command
```

---

## 🌍 Multiple Environments

### Development
```bash
npm run dev
# http://localhost:5173
```

### Staging (Vercel example)
```bash
vercel
# https://focus-timer-pro-staging.vercel.app
```

### Production
```bash
vercel --prod
# https://focus-timer-pro.com
```

---

## 📊 Monitoring & Maintenance

### Health Checks

**Weekly:**
- ✅ Check uptime
- ✅ Test key features
- ✅ Review analytics
- ✅ Check error logs

**Monthly:**
- ✅ Update dependencies (`npm update`)
- ✅ Security audit (`npm audit`)
- ✅ Performance review
- ✅ User feedback review

### Vercel Analytics
- Enable in Vercel dashboard
- Monitor Core Web Vitals
- Track user traffic

### Error Tracking (Optional)

Add Sentry:
```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'your-sentry-dsn',
    environment: 'production',
  });
}
```

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules dist .vite
npm install
npm run build
```

### PWA Not Working

1. Ensure HTTPS enabled
2. Check manifest.json is accessible
3. Verify service worker registers
4. Clear cache and reload

### 404 on Refresh

**Problem:** SPA needs all routes to go to index.html

**Solution:** Already configured in:
- `vercel.json` - Rewrites configured
- `netlify.toml` - Redirects configured

### Slow Performance

1. Check bundle size: `npm run build -- --report`
2. Enable compression on hosting
3. Optimize images
4. Use CDN for assets

---

## 🎉 Your Site is Live!

### Share Your App

**Get your URL:**
- Vercel: `https://focus-timer-pro.vercel.app`
- Netlify: `https://focus-timer-pro.netlify.app`
- GitHub Pages: `https://username.github.io/focus-timer-pro`
- Custom domain: `https://your-domain.com`

**Share on:**
- Product Hunt
- Hacker News
- Reddit (r/productivity, r/webdev)
- Twitter
- LinkedIn
- Dev.to

### Add Badges to README

```markdown
![Vercel Status](https://img.shields.io/badge/vercel-deployed-success)
![Build Status](https://github.com/user/repo/workflows/CI/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)
```

---

## 🚀 Next Steps

1. **Monitor performance** - Use Vercel Analytics or Lighthouse
2. **Collect feedback** - Add feedback form or GitHub discussions
3. **Iterate** - Add requested features
4. **Market** - Share on social media
5. **Maintain** - Keep dependencies updated

---

## 📞 Need Help?

- **Vercel Support**: vercel.com/support
- **Netlify Support**: netlify.com/support
- **GitHub Issues**: Open an issue in your repo
- **Documentation**: See DEPLOYMENT.md

---

**Congratulations! Your Focus Timer Pro is now live! 🎉🎯**

*Start helping people be more productive!*
