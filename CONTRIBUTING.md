# Contributing to Health Dashboard

First off, thank you for considering contributing to Health Dashboard! It's people like you that make this project a reality and help democratize access to health insights.

## 🌟 Vision

This project aims to provide free, intelligent medical laboratory exam interpretation to everyone, especially underserved populations with limited access to healthcare resources. Every contribution—no matter how small—helps achieve this mission.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Testing Guidelines](#testing-guidelines)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** - Descriptive summary of the issue
- **Steps to reproduce** - Detailed steps to trigger the bug
- **Expected behavior** - What you expected to happen
- **Actual behavior** - What actually happened
- **Screenshots** - If applicable
- **Environment** - OS, browser, Node version, etc.

### 💡 Suggesting Features

Feature suggestions are welcome! Please provide:

- **Use case** - Why this feature would be useful
- **Proposed solution** - How you envision it working
- **Alternatives** - Other approaches you've considered
- **Additional context** - Screenshots, mockups, examples

### 🌍 Translations

Help make Health Dashboard accessible worldwide:

1. Copy `client/src/locales/en.json` to your language code (e.g., `pt-BR.json`)
2. Translate all strings while preserving placeholders (`{{variable}}`)
3. Test the translation in the UI
4. Submit a PR with your translation file

### 📝 Documentation

Documentation improvements are always appreciated:

- Fix typos or clarify existing docs
- Add examples or use cases
- Translate documentation to other languages
- Create tutorials or guides

### 💻 Code Contributions

Ready to write code? Great! Follow the [Development Setup](#development-setup) below.

---

## Development Setup

### Prerequisites

- **Node.js 22+** (includes pnpm)
- **Git**
- **MySQL/TiDB** (optional - demo mode uses in-memory DB)

### Initial Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/health-dashboard.git
   cd health-dashboard
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/health-dashboard.git
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env if needed (demo mode works out of the box)
   ```

6. **Initialize database**
   ```bash
   pnpm db:push
   pnpm seed:demo
   ```

7. **Start development server**
   ```bash
   pnpm dev
   ```

8. **Open browser** at `http://localhost:3000`

### Project Structure

```
health_dashboard/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable UI components
│   │   ├── lib/         # Utilities and tRPC client
│   │   └── index.css    # Global styles
├── server/              # Backend Express + tRPC
│   ├── domain/          # Core business logic (hexagonal architecture)
│   ├── ports/           # Interfaces for adapters
│   ├── adapters/        # Infrastructure implementations
│   ├── routers/         # tRPC route handlers
│   └── db.ts            # Database helpers
├── drizzle/             # Database schema and migrations
├── docs/                # Documentation
└── shared/              # Shared types and constants
```

---

## Pull Request Process

### Before Submitting

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow [Coding Standards](#coding-standards)
   - Write meaningful commit messages
   - Add tests for new features
   - Update documentation if needed

3. **Test your changes**
   ```bash
   pnpm test           # Run unit tests
   pnpm build          # Ensure build succeeds
   npx tsc --noEmit    # Check TypeScript errors
   ```

4. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting the PR

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template:
   - **Title**: Clear, concise description
   - **Description**: What changes were made and why
   - **Related Issues**: Link any related issues (#123)
   - **Screenshots**: If UI changes
   - **Testing**: How you tested the changes

### Review Process

- Maintainers will review your PR within 3-5 business days
- Address any requested changes
- Once approved, a maintainer will merge your PR
- Your contribution will be credited in the release notes!

---

## Coding Standards

### TypeScript

- **Strict mode enabled** - No `any` types without justification
- **Explicit return types** - For public functions
- **Interfaces over types** - For object shapes
- **Descriptive names** - `getUserExamHistory` not `getUEH`

### React

- **Functional components** - Use hooks, avoid class components
- **Custom hooks** - Extract reusable logic (prefix with `use`)
- **PropTypes** - Use TypeScript interfaces instead
- **Accessibility** - Include ARIA labels, keyboard navigation

### Styling

- **Tailwind CSS** - Use utility classes
- **Responsive design** - Mobile-first approach
- **Dark mode** - Support theme switching
- **Consistent spacing** - Use design tokens

### Backend

- **tRPC procedures** - Type-safe API endpoints
- **Hexagonal architecture** - Keep domain logic pure
- **Error handling** - Use TRPCError with appropriate codes
- **Validation** - Use Zod schemas for input validation

### General

- **DRY principle** - Don't repeat yourself
- **SOLID principles** - Especially Single Responsibility
- **Comments** - Explain *why*, not *what*
- **No console.log** - Use proper logging in production code

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(analysis): add personalized recommendations section

Implemented AI-generated action plans with diet, exercise, and
monitoring schedules. Includes monthly milestones and specific goals.

Closes #42
```

```bash
fix(correlation): correct TG/HDL ratio calculation

The ratio was inverted, causing incorrect risk assessment.
Now properly calculates triglycerides divided by HDL.

Fixes #87
```

---

## Testing Guidelines

### Unit Tests

- **Coverage**: Aim for 80%+ coverage
- **Test files**: Co-locate with source (`*.test.ts`)
- **Naming**: `describe('ComponentName', () => { it('should...') })`
- **Mocking**: Use vitest mocks for external dependencies

### Integration Tests

- **Database**: Use test database or in-memory SQLite
- **API**: Test tRPC procedures end-to-end
- **Fixtures**: Create reusable test data

### Running Tests

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Generate coverage report
```

---

## Questions?

- **GitHub Discussions**: Ask questions, share ideas
- **GitHub Issues**: Report bugs or request features
- **Email**: health.dashboard@example.com

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the About page of the application

Thank you for helping democratize access to health insights! 🙏

---

<p align="center">
  <strong>Every contribution matters, no matter how small</strong>
  <br>
  <sub>Together, we're making healthcare more accessible</sub>
</p>
