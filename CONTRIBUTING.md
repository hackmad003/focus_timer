# Contributing to Focus Timer Pro

First off, thank you for considering contributing to Focus Timer Pro! It's people like you that make Focus Timer Pro such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and encourage diverse contributions
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows, macOS, Linux]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- A detailed description of the proposed functionality
- Explain why this enhancement would be useful
- List any alternatives you've considered

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/focus-timer-pro.git
   cd focus-timer-pro
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clear, concise commit messages
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

5. **Commit Your Changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

   Follow conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Test additions or changes
   - `chore:` - Build process or tooling changes

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Git

### Setup Steps

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Code Style Guidelines

### TypeScript

- Use strict TypeScript mode
- Avoid `any` types when possible
- Document complex functions with JSDoc comments
- Use meaningful variable and function names

```typescript
// Good
function calculateSessionProgress(elapsed: number, total: number): number {
  return (elapsed / total) * 100;
}

// Bad
function calc(e: any, t: any): any {
  return (e / t) * 100;
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props

```typescript
// Good
interface TimerDisplayProps {
  timeRemaining: number;
  sessionType: SessionType;
  isRunning: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  timeRemaining, 
  sessionType, 
  isRunning 
}) => {
  // Component logic
};
```

### CSS

- Use CSS custom properties for theming
- Follow BEM naming convention
- Keep specificity low
- Use mobile-first responsive design

```css
/* Good */
.timer-display {
  /* base styles */
}

.timer-display--running {
  /* modifier styles */
}

.timer-display__digit {
  /* element styles */
}
```

## Testing Guidelines

### Unit Tests

- Test individual functions and utilities
- Mock external dependencies
- Aim for >80% coverage

```typescript
describe('formatTime', () => {
  it('should format seconds as MM:SS', () => {
    expect(formatTime(125)).toBe('02:05');
  });
});
```

### Integration Tests

- Test component interactions
- Test state management
- Test user workflows

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update CHANGELOG.md for notable changes
- Include code examples where helpful

## Performance Considerations

- Optimize re-renders with React.memo and useMemo
- Lazy load components when appropriate
- Keep bundle size minimal
- Test performance on low-end devices

## Accessibility

- Ensure keyboard navigation works
- Add proper ARIA labels
- Test with screen readers
- Maintain color contrast ratios
- Support reduced motion preferences

## Questions?

Feel free to open an issue with the "question" label or reach out to the maintainers.

Thank you for contributing! 🎉
