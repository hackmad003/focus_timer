# Setup Instructions

Quick guide to get Focus Timer Pro running on your machine.

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:5173
```

That's it! The app should now be running.

## 📋 Detailed Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- **Git** (for cloning the repository)

### Verify Installation

```bash
# Check Node.js version
node --version  # Should show v18.x.x or higher

# Check npm version
npm --version   # Should show 9.x.x or higher
```

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-org/focus-timer-pro.git
cd focus-timer-pro
```

Or download the ZIP file and extract it.

#### 2. Install Dependencies

```bash
npm install
```

This installs all required packages (~200MB, takes 1-2 minutes).

#### 3. Configure Environment (Optional)

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your preferred settings
# (Most settings can stay as default)
```

#### 4. Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

#### 5. Open in Browser

Navigate to `http://localhost:5173` in your browser.

## 🎨 Asset Setup

### Audio Files

The app requires audio files for notifications and ambient sounds. Place these in `public/sounds/`:

**Required files:**
- `bell.mp3` - Notification sound
- `chime.mp3` - Notification sound
- `ding.mp3` - Notification sound
- `gong.mp3` - Notification sound
- `rain.mp3` - Ambient sound
- `ocean.mp3` - Ambient sound
- `forest.mp3` - Ambient sound
- `cafe.mp3` - Ambient sound
- `white-noise.mp3` - Ambient sound

**Note**: Placeholder files exist. Replace with actual audio files for production.

### PWA Icons

Generate PWA icons (192x192 and 512x512):

```bash
# Using a tool like pwa-asset-generator
npx pwa-asset-generator logo.svg public --scrape false
```

Or create manually:
- `public/pwa-192x192.png` (192x192px)
- `public/pwa-512x512.png` (512x512px)
- `public/apple-touch-icon.png` (180x180px)
- `public/favicon.svg` (any size, vector)

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/index.html
```

## 🔍 Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Type checking
npm run type-check

# Format code
npm run format
```

## 🏗️ Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Build output will be in `dist/` directory.

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is in use:

```bash
# Start on different port
npm run dev -- --port 3000
```

### Installation Fails

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run type-check
```

### Build Fails

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

## 🔧 Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Path Intellisense
- GitLens

### Browser DevTools

- Install React Developer Tools
- Install Redux DevTools (for Zustand)

## 📱 Testing PWA Features

### Local HTTPS (required for PWA)

```bash
# Install mkcert
npm install -g mkcert

# Create local SSL certificate
mkcert -install
mkcert localhost

# Start with HTTPS
npm run dev -- --https
```

### Test Service Worker

1. Build production version
2. Serve with HTTPS
3. Open DevTools → Application → Service Workers
4. Verify service worker registers
5. Test offline mode

## 🌐 Browser Testing

Test in multiple browsers:

```bash
# Chrome/Edge (Chromium)
npm run dev

# Firefox
npm run dev -- --host

# Safari
# Use Network URL shown in terminal
```

## 📦 Package Manager Alternatives

### Using Yarn

```bash
yarn install
yarn dev
yarn build
```

### Using pnpm

```bash
pnpm install
pnpm dev
pnpm build
```

## 🚀 Next Steps

1. **Explore the App**
   - Start a focus session
   - Check out settings
   - View statistics

2. **Read Documentation**
   - [README.md](README.md) - Overview
   - [USER_GUIDE.md](USER_GUIDE.md) - User instructions
   - [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines

3. **Customize**
   - Modify colors in `src/styles/global.css`
   - Adjust timer defaults in `src/utils/constants.ts`
   - Add new features

4. **Deploy**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
   - Choose hosting platform
   - Configure domain

## 💡 Tips

- **Hot Module Replacement**: Changes appear instantly without reload
- **React DevTools**: Inspect component state and props
- **TypeScript**: Hover over variables for type information
- **Console Logs**: Check browser console for debug info

## 📞 Need Help?

- Check [USER_GUIDE.md](USER_GUIDE.md) for usage help
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development help
- Open an issue on GitHub
- Email: support@focustimerpro.com

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Development server starts without errors
- [ ] App loads in browser at localhost:5173
- [ ] No console errors in browser DevTools
- [ ] Timer starts and counts down
- [ ] Settings panel opens and saves preferences
- [ ] Statistics panel displays (even if empty)
- [ ] All tests pass (`npm test`)
- [ ] TypeScript has no errors (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)

## 🎉 Success!

If all checks pass, you're ready to start developing or using Focus Timer Pro!

**Happy coding! 🎯**
