# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-beta] - 2026-02-22

### 🎉 Initial Beta Release

First public beta release of Health Dashboard - an open-source platform democratizing access to intelligent medical laboratory exam analysis.

### ✨ Features

#### Core Functionality
- **Medical Exam Management**: Store and track complete laboratory exam history with reference ranges
- **Intelligent Analysis**: AI-powered medical analysis in natural language, explaining results as a specialist would
- **Multi-Exam Correlation**: Select 2-4 related exams for integrated analysis (e.g., complete lipid profile)
- **Personalized Recommendations**: Action plans with diet, exercise, and monitoring schedules
- **Temporal Evolution**: Historical charts showing exam trends from 2022-2026
- **Year Filtering**: Focus on current year (2026) or explore complete history

#### Data Visualization
- **Mixed Charts**: Bar charts with reference ranges + line charts showing evolution
- **Status Indicators**: Visual badges for Normal/Abnormal/Critical exam results
- **Anthropometric Data**: Weight, height, BMI, waist circumference tracking
- **Health Projections**: 24-month forecasts with Optimistic/Maintenance/Pessimistic scenarios
- **Correlation Detection**: Automatic identification of related exams (cholesterol, glucose, hormones)

#### Medical Intelligence
- **Specialist Identification**: Recommends appropriate specialists (cardiologist, endocrinologist, etc.)
- **Clinical Indices**: Calculates TG/HDL ratio, CT/HDL ratio, and other risk markers
- **Risk Assessment**: Identifies atherogenic profiles and metabolic patterns
- **Natural Language Explanations**: Converts medical data into understandable insights

#### Architecture
- **Hexagonal Architecture**: Clean separation of domain logic, ports, and adapters
- **Type-Safe API**: tRPC for end-to-end type safety
- **Database Integration**: MySQL/TiDB with Drizzle ORM
- **OAuth Authentication**: Manus OAuth integration
- **LLM Integration**: Manus Forge API for AI-powered analysis

#### Developer Experience
- **Demo Mode**: Pre-configured demo user (health.demo@manus.im) with fictional patient data
- **Seed Script**: `pnpm seed:demo` for instant local setup
- **TypeScript**: Full type safety across frontend and backend
- **Modern Stack**: React 19, Tailwind CSS 4, Express 4, Node.js 22
- **Testing**: Vitest for unit and integration tests

### 🏗️ Technical Stack

- **Frontend**: React 19, Tailwind CSS 4, Wouter (routing), Recharts (visualizations)
- **Backend**: Express 4, tRPC 11, Drizzle ORM
- **Database**: MySQL/TiDB
- **Authentication**: Manus OAuth
- **AI**: Manus Forge (LLM integration)
- **Build**: Vite, esbuild
- **Testing**: Vitest
- **CI/CD**: GitHub Actions

### 📚 Documentation

- Comprehensive README with quick start guide
- Contributing guidelines (CONTRIBUTING.md)
- Code of Conduct (CODE_OF_CONDUCT.md)
- Security policy (SECURITY.md)
- Environment setup guide (docs/ENV_SETUP.md)
- Hexagonal architecture documentation (docs/HEXAGONAL_ARCHITECTURE.md)

### 🔒 Security & Privacy

- User data isolation (userId-based filtering)
- JWT session management
- OAuth authentication
- LGPD/GDPR considerations documented
- Security best practices guide

### ⚠️ Known Limitations

- **Beta Software**: Active development, not production-ready
- **Medical Disclaimer**: Not a substitute for professional medical advice
- **Demo Data**: Fictional patient data for testing only
- **Language**: Currently Portuguese (BR) UI, English documentation
- **MCP Adapters**: Planned but not yet implemented

### 🎯 Target Audience

- Patients seeking to understand their lab results
- Healthcare providers exploring digital health tools
- Developers interested in health-tech and AI applications
- Open-source contributors passionate about democratizing healthcare

### 🤖 Built with AI

This project was developed using [Manus](https://manus.im), demonstrating how AI can accelerate development while maintaining architectural excellence and code quality.

### 📝 Notes

- All exam data is fictional (patient: Denis Santos)
- Demo account: health.demo@manus.im
- Requires MySQL/TiDB database for local development
- Node.js 22+ required

---

## [Unreleased]

### Planned Features

- [ ] Historical analysis storage and comparison
- [ ] PDF export for sharing with healthcare providers
- [ ] Gamification (goals, progress tracking, achievements)
- [ ] MCP (Model Context Protocol) adapters for external integrations
- [ ] Multi-language support (English, Spanish)
- [ ] Mobile app (React Native)
- [ ] Integration with wearables (Apple Health, Google Fit)
- [ ] Medication tracking
- [ ] Appointment scheduling

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
