# Focus Timer Pro 🎯

Enterprise-grade Focus Timer application implementing the Pomodoro Technique. Built with React, TypeScript, and modern web technologies for maximum productivity and user experience.

![Focus Timer Pro](./docs/screenshot.png)

## ✨ Features

### Core Functionality
- ⏱️ **Pomodoro Timer** - Classic 25/5/10 minute intervals (customizable)
- 🎯 **Multiple Session Types** - Focus, Short Break, Long Break
- ⏸️ **Full Control** - Start, Pause, Resume, Reset, Skip
- 🏷️ **Task Labeling** - Track what you're working on
- 🔄 **Auto-start Options** - Seamlessly transition between sessions

### Notifications & Audio
- 🔔 **Desktop Notifications** - Get notified when sessions complete
- 🔊 **Custom Sounds** - Bell, Chime, Ding, Gong notification sounds
- 🎵 **Ambient Sounds** - Rain, Ocean, Forest, Café, White Noise
- 📳 **Vibration Support** - Haptic feedback on mobile devices

### Statistics & Analytics
- 📊 **Comprehensive Stats** - Track focus time, sessions, streaks
- 📈 **Visual Charts** - 7-day focus time visualization
- 🔥 **Streak Tracking** - Monitor daily and longest streaks
- 💾 **Data Export** - Export your data as JSON/CSV

### User Experience
- 🌙 **Dark/Light Theme** - Multiple theme options
- ♿ **Accessibility** - Full keyboard navigation, screen reader support
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **PWA Support** - Install as a native app, works offline
- 🎨 **Customizable** - Fonts, colors, animations, sounds

### Technical Excellence
- 🔒 **Data Privacy** - All data stored locally, no tracking
- 💪 **Performance** - 60fps animations, optimized rendering
- 🧪 **Well Tested** - >80% code coverage
- 📦 **Modern Stack** - React 18, TypeScript, Vite
- 🎯 **Type Safe** - Full TypeScript coverage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern browser with ES2020 support

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/focus-timer-pro.git
cd focus-timer-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run lint         # Lint code
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
```

## 🎮 Usage

### Basic Operation

1. **Start a Focus Session**
   - Click the "Start" button or press `Space`
   - Timer counts down from 25 minutes (default)
   - Stay focused on your task!

2. **Take Breaks**
   - After completing a focus session, take a 5-minute short break
   - After 4 focus sessions, enjoy a 10-minute long break

3. **Track Your Progress**
   - View session counter to see progress towards long break
   - Check statistics to see your productivity patterns

### Keyboard Shortcuts

- `Space` - Start/Pause/Resume timer
- `R` - Reset timer
- `S` - Skip to next session
- `Tab` - Navigate between elements
- `Esc` - Close modals

### Customization

1. **Timer Settings**
   - Adjust focus/break durations
   - Choose timer presets (Classic, Extended, Quick Sprints)
   - Enable auto-start options

2. **Notifications**
   - Enable desktop notifications
   - Select notification sounds
   - Adjust volume levels
   - Toggle vibration (mobile)

3. **Ambient Audio**
   - Choose from 5 ambient sounds
   - Adjust background volume
   - Sounds play during focus sessions

4. **Display & Theme**
   - Toggle dark/light/auto theme
   - Adjust font size (50-200%)
   - Enable high contrast mode
   - Reduce animations

## 🏗️ Project Structure

```
focus-timer-pro/
├── public/
│   ├── sounds/          # Audio files (notification & ambient)
│   ├── pwa-192x192.png  # PWA icons
│   ├── pwa-512x512.png
│   └── robots.txt
├── src/
│   ├── components/      # React components
│   │   ├── Layout/      # Header, Footer
│   │   ├── Settings/    # Settings panels
│   │   ├── Statistics/  # Stats & charts
│   │   └── Timer/       # Timer display & controls
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # Service layer (Audio, Notifications, Storage)
│   ├── store/           # State management (Zustand)
│   ├── styles/          # Global styles
│   ├── test/            # Test files
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🏛️ Architecture

### Design Patterns

- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic separation
- **Observer Pattern** - State management with Zustand
- **Component Composition** - Reusable UI components

### State Management

The app uses **Zustand** for state management with three main stores:

1. **Timer Store** - Timer state, session management
2. **Settings Store** - User preferences
3. **Statistics Store** - Session history, analytics

### Data Flow

```
User Action → Component → Store → Service → Local Storage
                ↓           ↓        ↓
            UI Update   State   Persistence
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/index.html
```

### Test Coverage

- **Unit Tests** - Utilities, validation, time functions
- **Integration Tests** - Store logic, state management
- **Component Tests** - UI components (coming soon)

Current coverage: **>80%**

## 📦 Building for Production

```bash
# Build the app
npm run build

# Preview the build
npm run preview
```

The production build will be in the `dist/` directory.

### Build Optimization

- Code splitting and lazy loading
- Tree shaking for smaller bundle size
- Asset optimization (images, fonts)
- Service worker for offline support
- Cache optimization

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Static Hosting

Upload the `dist/` folder to any static hosting service:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
VITE_APP_NAME=Focus Timer Pro
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false
```

See `.env.example` for all available options.

## 🌍 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## 📱 PWA Installation

### Desktop

1. Open the app in a supported browser
2. Look for the install icon in the address bar
3. Click "Install" to add to your desktop

### Mobile

1. Open the app in mobile browser
2. Tap the share/menu button
3. Select "Add to Home Screen"

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write TypeScript with strict mode
- Follow the existing code style
- Add tests for new features
- Update documentation
- Keep commits atomic and descriptive

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Pomodoro Technique® by Francesco Cirillo
- Icons from React Icons
- Charts powered by Recharts
- Built with Vite and React

## 📞 Support

- 📧 Email: support@focustimerpro.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/focus-timer-pro/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-org/focus-timer-pro/discussions)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Calendar integration
- [ ] Team collaboration features
- [ ] Cloud sync (optional)
- [ ] Custom themes
- [ ] More ambient sounds
- [ ] Browser extension

## 📊 Performance

- Lighthouse Score: 95+
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Bundle Size: <200KB (gzipped)

---

Made with ❤️ by the Focus Timer Pro Team

**Stay Focused. Stay Productive. 🎯**
