# Deployment Guide

This guide covers deploying Focus Timer Pro to various hosting platforms.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Production build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] PWA assets generated (icons, manifest)
- [ ] Service worker tested
- [ ] Performance tested (Lighthouse)

## 🏗️ Build Configuration

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

### Build Optimization

The production build includes:
- Code splitting and lazy loading
- Tree shaking to remove unused code
- Asset optimization (minification, compression)
- Service worker for offline support
- Cache headers optimization

## 🚀 Deployment Platforms

### Vercel (Recommended)

**Why Vercel?**
- Zero configuration
- Automatic SSL
- Global CDN
- Preview deployments
- Excellent performance

**Deployment Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Production Deployment**
   ```bash
   vercel --prod
   ```

**Configuration (vercel.json):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "framework": "vite",
  "routes": [
    {
      "src": "/sw.js",
      "headers": {
        "cache-control": "public, max-age=0, must-revalidate"
      }
    }
  ]
}
```

### Netlify

**Deployment Steps:**

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

**Configuration (netlify.toml):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### GitHub Pages

**Deployment Steps:**

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deployment script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/focus-timer-pro/', // Replace with your repo name
     // ... rest of config
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Cloudflare Pages

**Deployment Steps:**

1. **Connect to GitHub repository**
   - Go to Cloudflare Pages dashboard
   - Click "Create a project"
   - Connect your GitHub account
   - Select repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

3. **Deploy**
   - Cloudflare will automatically build and deploy

### AWS S3 + CloudFront

**Deployment Steps:**

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://focus-timer-pro
   aws s3 website s3://focus-timer-pro --index-document index.html
   ```

2. **Upload Build**
   ```bash
   npm run build
   aws s3 sync dist/ s3://focus-timer-pro --delete
   ```

3. **Configure CloudFront**
   - Create CloudFront distribution
   - Point origin to S3 bucket
   - Configure custom error responses for SPA

### Docker

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /sw.js {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }
}
```

**Build and Run:**
```bash
docker build -t focus-timer-pro .
docker run -p 8080:80 focus-timer-pro
```

## 🔒 Environment Variables

### Production Environment Variables

Create `.env.production`:

```env
VITE_APP_NAME=Focus Timer Pro
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ID=your_analytics_id
VITE_ENABLE_ERROR_TRACKING=true
VITE_SENTRY_DSN=your_sentry_dsn
```

### Platform-Specific Configuration

**Vercel:**
- Configure in Vercel dashboard under Settings → Environment Variables
- Prefix with `VITE_` for client-side access

**Netlify:**
- Configure in Netlify dashboard under Site settings → Environment variables

**GitHub Pages:**
- Use GitHub Secrets for sensitive values
- Access via GitHub Actions workflow

## 🔍 Post-Deployment Verification

### Checklist

- [ ] App loads successfully
- [ ] All assets load correctly (no 404s)
- [ ] PWA installation works
- [ ] Service worker registers correctly
- [ ] Offline functionality works
- [ ] Notifications work (after permission)
- [ ] Audio plays correctly
- [ ] Data persistence works
- [ ] All routes accessible
- [ ] Mobile responsive
- [ ] Lighthouse score >90

### Testing Tools

```bash
# Test production build locally
npm run preview

# Run Lighthouse audit
npx lighthouse https://your-domain.com --view

# Test PWA
npx pwa-asset-generator
```

## 📊 Monitoring

### Analytics Integration

**Google Analytics:**
```typescript
// src/services/AnalyticsService.ts
export const trackEvent = (event: string, params?: object) => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS) {
    // Track with GA
  }
};
```

### Error Tracking

**Sentry Integration:**
```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.VITE_ENABLE_ERROR_TRACKING) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
  });
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 🌐 Custom Domain

### DNS Configuration

**For Vercel:**
1. Add domain in Vercel dashboard
2. Update DNS records:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com

**For Cloudflare:**
- Automatic DNS configuration
- SSL/TLS enabled by default

## 🔐 Security Headers

Add security headers via hosting platform:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 📈 Performance Optimization

- Enable Brotli/Gzip compression
- Configure caching headers
- Use CDN for static assets
- Enable HTTP/2
- Implement resource hints (preload, prefetch)

## 🆘 Troubleshooting

### Common Issues

**Build fails:**
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for TypeScript errors

**Service Worker not updating:**
- Clear cache
- Check service worker scope
- Verify cache-control headers

**PWA not installable:**
- Verify manifest.json
- Check HTTPS enabled
- Validate PWA with Lighthouse

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [PWA Best Practices](https://web.dev/pwa/)
- [Performance Optimization](https://web.dev/performance/)

---

Need help? Open an issue or contact support!
