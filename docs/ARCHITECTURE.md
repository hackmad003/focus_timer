# Architecture Documentation

Technical architecture overview of Focus Timer Pro.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│  (React Components - Timer, Settings, Statistics)       │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│                   State Management                       │
│        (Zustand Stores - Timer, Settings, Stats)        │
└────────────┬───────────────────────┬────────────────────┘
             │                       │
┌────────────▼─────────┐  ┌─────────▼─────────────────────┐
│   Service Layer      │  │    Utility Functions           │
│ - Storage Service    │  │ - Time utilities               │
│ - Notification Svc   │  │ - Validation                   │
│ - Audio Service      │  │ - Constants                    │
│ - Vibration Service  │  │ - Error handling               │
└──────────────────────┘  └────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────┐
│                Browser APIs & Storage                    │
│  (localStorage, Notifications, Audio, Web Workers)      │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
focus-timer-pro/
├── public/                 # Static assets
│   ├── sounds/            # Audio files
│   ├── manifest.json      # PWA manifest
│   └── robots.txt
├── src/
│   ├── components/        # React components
│   │   ├── Layout/       # Header, Footer
│   │   ├── Settings/     # Settings panels
│   │   ├── Statistics/   # Stats & charts
│   │   └── Timer/        # Timer display & controls
│   ├── hooks/            # Custom React hooks
│   │   ├── useTimer.ts
│   │   ├── useNotificationPermission.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── pages/            # Page components
│   │   └── TimerPage.tsx
│   ├── services/         # Business logic services
│   │   ├── StorageService.ts
│   │   ├── NotificationService.ts
│   │   ├── AudioService.ts
│   │   └── VibrationService.ts
│   ├── store/            # State management
│   │   ├── useTimerStore.ts
│   │   ├── useSettingsStore.ts
│   │   └── useStatisticsStore.ts
│   ├── styles/           # Global styles
│   │   └── global.css
│   ├── test/             # Test files
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── constants.ts
│   │   ├── time.ts
│   │   └── validation.ts
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── .github/              # GitHub configs
│   └── workflows/        # CI/CD pipelines
├── index.html            # HTML entry point
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
└── README.md             # Documentation
```

## 🎯 Design Patterns

### 1. Repository Pattern
**Location**: `src/services/StorageService.ts`

Abstracts data access logic from business logic:
```typescript
class StorageService {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
}
```

### 2. Service Layer Pattern
**Location**: `src/services/`

Encapsulates business logic and external API interactions:
- `NotificationService` - Handles notifications
- `AudioService` - Manages audio playback
- `VibrationService` - Controls device vibration

### 3. Observer Pattern
**Location**: `src/store/`

Zustand implements observer pattern for state management:
```typescript
const useTimerStore = create((set, get) => ({
  state: TimerState.IDLE,
  start: () => set({ state: TimerState.RUNNING }),
  // Observers automatically notified
}));
```

### 4. Custom Hooks Pattern
**Location**: `src/hooks/`

Encapsulates reusable logic:
```typescript
export function useTimer() {
  const timerState = useTimerStore();
  // Coordinate timer logic, services, effects
  return { /* timer controls */ };
}
```

### 5. Component Composition
**Location**: `src/components/`

Build complex UIs from simple components:
```
TimerPage
  ├── Header
  ├── TimerDisplay
  │   ├── SessionIndicator
  │   └── DigitCard
  ├── TimerControls
  ├── SessionCounter
  └── TaskLabel
```

## 🔄 Data Flow

### Starting a Timer

```
1. User clicks "Start" button
   └─> TimerControls component

2. Calls timer.start()
   └─> useTimer hook

3. Updates store state
   └─> useTimerStore.start()

4. Creates session object
   └─> Stores in timer state

5. Component re-renders
   └─> TimerDisplay shows running state

6. Interval starts
   └─> useTimer effect starts tick interval

7. Every second
   └─> Calls timer.tick()
   └─> Updates timeRemaining
   └─> UI updates via React

8. On completion
   └─> Triggers notifications
   └─> Plays sounds
   └─> Saves to statistics
```

### State Updates

```
User Action
    ↓
Component Handler
    ↓
Store Action (Zustand)
    ↓
State Update
    ↓
Service Calls (if needed)
    ↓
Persistence (localStorage)
    ↓
Component Re-render
    ↓
UI Update
```

## 💾 State Management

### Zustand Stores

#### TimerStore
**Responsibility**: Current timer state

```typescript
interface TimerStore {
  // State
  state: TimerState;
  sessionType: SessionType;
  timeRemaining: number;
  timeElapsed: number;
  
  // Actions
  start: () => void;
  pause: () => void;
  tick: () => void;
  // ...
}
```

#### SettingsStore
**Responsibility**: User preferences

```typescript
interface SettingsStore extends Settings {
  // Actions
  updateSettings: (partial: Partial<Settings>) => void;
  resetSettings: () => void;
  loadSettings: () => void;
}
```

#### StatisticsStore
**Responsibility**: Session history and analytics

```typescript
interface StatisticsStore extends Statistics {
  // Actions
  addSession: (session: Session) => void;
  calculateStatistics: () => void;
  exportData: () => string;
}
```

### Why Zustand?

- **Simple API** - Easy to learn and use
- **No boilerplate** - Minimal setup required
- **TypeScript support** - Full type safety
- **Performance** - Optimized re-renders
- **DevTools support** - Redux DevTools compatible
- **Small bundle** - Only ~1KB

## 🎨 Component Architecture

### Component Hierarchy

```
App
└── TimerPage
    ├── Header
    │   ├── Logo
    │   └── Navigation
    │       ├── StatsButton
    │       └── SettingsButton
    ├── Main Content
    │   ├── TaskLabel
    │   ├── TimerDisplay
    │   │   ├── SessionIndicator
    │   │   └── TimeDigits
    │   │       └── DigitCard × 6
    │   ├── TimerControls
    │   │   ├── SecondaryControls
    │   │   │   ├── ResetButton
    │   │   │   └── SkipButton
    │   │   └── PrimaryControl
    │   │       └── StartPauseButton
    │   └── SessionCounter
    └── Modals (Conditional)
        ├── SettingsPanel
        │   ├── TabNavigation
        │   └── SettingsContent
        │       ├── TimerSettings
        │       ├── NotificationSettings
        │       ├── AudioSettings
        │       ├── DisplaySettings
        │       └── AccessibilitySettings
        └── StatisticsPanel
            ├── StatCards
            ├── StatisticsChart
            └── Actions
```

### Component Design Principles

1. **Single Responsibility** - Each component has one job
2. **Composability** - Build complex from simple
3. **Reusability** - Can be used in multiple contexts
4. **Type Safety** - All props typed with TypeScript
5. **Accessibility** - ARIA labels, keyboard support

## 🔌 Service Layer

### Service Responsibilities

#### StorageService
- localStorage abstraction
- Type-safe get/set operations
- Error handling
- Data migration support

#### NotificationService
- Permission management
- Notification display
- Browser compatibility checks

#### AudioService
- Audio playback control
- Volume management
- Loop handling for ambient sounds
- Multiple audio instances

#### VibrationService
- Vibration API abstraction
- Pattern support
- Device capability detection

## 🧪 Testing Strategy

### Test Pyramid

```
        ┌──────┐
       │  E2E   │  (Coming soon)
      ┌┴────────┴┐
     │Integration│  (Store tests)
    ┌┴────────────┴┐
   │   Unit Tests   │  (Utils, validation)
  └─────────────────┘
```

### What We Test

1. **Unit Tests**
   - Utility functions (time, validation)
   - Pure functions
   - Edge cases

2. **Integration Tests**
   - Store logic
   - State transitions
   - Business logic

3. **Component Tests** (Future)
   - User interactions
   - Props handling
   - Rendering

### Test Coverage Goals

- Utilities: 100%
- Services: >80%
- Stores: >90%
- Components: >70%
- Overall: >80%

## 🚀 Performance Optimization

### Techniques Used

1. **Code Splitting**
   - Lazy load heavy components
   - Dynamic imports for routes

2. **Memoization**
   - React.memo for expensive components
   - useMemo for expensive calculations
   - useCallback for stable references

3. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression (gzip/brotli)

4. **Asset Optimization**
   - Image optimization
   - Font subsetting
   - SVG optimization

5. **Rendering Optimization**
   - Avoid unnecessary re-renders
   - Optimize selector usage
   - Efficient state updates

### Performance Metrics

- **Bundle Size**: ~180KB (gzipped)
- **FCP**: <1s (First Contentful Paint)
- **TTI**: <2s (Time to Interactive)
- **FPS**: 60fps (animations)
- **Lighthouse**: 95+ (Performance score)

## 🔒 Security Considerations

### Data Security
- All data stored locally
- No external API calls
- No PII collection
- Input sanitization (XSS prevention)

### Content Security Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
```

### Dependencies
- Regular updates
- Vulnerability scanning
- Minimal dependencies

## 📱 PWA Architecture

### Service Worker Strategy

**Cache-First Strategy** for static assets:
```
Request → Cache → Network (if miss) → Cache
```

**Network-First Strategy** for API (future):
```
Request → Network → Cache → Fallback
```

### Offline Capabilities

1. **Cached Resources**
   - HTML, CSS, JS files
   - Images and icons
   - Fonts

2. **Available Offline**
   - Timer functionality
   - Settings changes
   - View statistics
   - Local data operations

3. **Requires Online**
   - Initial app load
   - Service worker updates
   - External resources (if any)

## 🔄 Future Architecture Plans

### Planned Improvements

1. **State Management**
   - Add Redux DevTools integration
   - Implement time-travel debugging
   - State persistence middleware

2. **Performance**
   - Web Workers for heavy calculations
   - Virtual scrolling for long lists
   - Optimize re-renders further

3. **Features**
   - Cloud sync (optional)
   - Real-time collaboration
   - Advanced analytics

4. **Architecture**
   - Micro-frontends for teams
   - Plugin system for extensions
   - GraphQL for future APIs

---

This architecture balances simplicity with scalability, making it easy to maintain while allowing for future growth.
