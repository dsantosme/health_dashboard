# Health Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Built with Manus](https://img.shields.io/badge/Built%20with-Manus-blue)](https://manus.im)
[![Stability: Beta](https://img.shields.io/badge/Stability-Beta-orange)](https://github.com/dsantosme/health_dashboard/releases)

> **⚠️ Beta Software**: This project is under active development. Do not use as the sole source of medical information. Always consult qualified healthcare professionals.

> **Intelligent medical laboratory exam analysis platform democratizing access to health insights**

Health Dashboard is an open-source platform that helps patients understand their medical laboratory results through AI-powered analysis, correlations, and personalized recommendations. Built with modern web technologies and hexagonal architecture, it aims to democratize access to intelligent health information interpretation.

---

## ⚠️ Medical Disclaimer

**THIS SOFTWARE IS IN ACTIVE DEVELOPMENT AND SHOULD NOT BE USED AS A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE.**

- ❌ **NOT a diagnostic tool** - Results must be validated by qualified healthcare professionals
- ❌ **NOT medical advice** - Always consult with your doctor before making health decisions
- ❌ **IN DEVELOPMENT** - Features may be incomplete, inaccurate, or subject to change
- ✅ **Educational purpose** - Designed to help patients better understand their lab results
- ✅ **Collaborative tool** - Share generated reports with your healthcare provider for discussion

**By using this software, you acknowledge that you understand these limitations and will seek appropriate medical guidance.**

---

## ✨ Features

### 📊 Comprehensive Exam Tracking
- **Multi-year history** - Track lab results from 2022-2026
- **Trend visualization** - Interactive charts showing value evolution over time
- **Status indicators** - Clear visual markers for normal, abnormal, and critical values
- **Reference ranges** - Compare your results against clinical standards

### 🔗 Intelligent Correlations
- **Multi-exam analysis** - Select 2-4 related exams for integrated insights
- **Clinical indices** - Automatic calculation of ratios (TG/HDL, CT/HDL, etc.)
- **Pattern recognition** - Identify metabolic profiles and risk patterns
- **Contextual interpretation** - Combine lab data with anthropometric measurements

### 🤖 AI-Powered Medical Analysis
- **Natural language reports** - Specialist-style explanations in conversational tone
- **Personalized recommendations** - Tailored diet, exercise, and lifestyle suggestions
- **Action plans** - Specific goals with monthly milestones and monitoring schedules
- **Multiple specialties** - Cardiology, endocrinology, nephrology, and more

### 🏗️ Modern Architecture
- **Hexagonal (Ports & Adapters)** - Clean separation of concerns, easily extensible
- **Type-safe** - Full TypeScript coverage with tRPC for end-to-end type safety
- **Modular services** - Domain logic decoupled from infrastructure
- **Future-ready** - Designed for MCP (Model Context Protocol) integration

---

## 🤖 Built with AI

This project was developed using [Manus](https://manus.im), an AI-powered development platform that enables rapid prototyping and maintains high code quality. Manus helped with:

- **Architecture Design**: Implementing hexagonal architecture (ports & adapters)
- **Code Generation**: Creating type-safe, maintainable code following SOLID principles
- **Documentation**: Generating comprehensive docs and examples
- **Testing**: Writing unit and integration tests

**Interested in building with AI?** Visit [manus.im](https://manus.im) to see how AI can enhance your development workflow.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ (includes pnpm)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dsantosme/health_dashboard.git
   cd health-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (or use demo defaults)
   ```

4. **Initialize database with demo data**
   ```bash
   pnpm db:push
   pnpm seed:demo
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

7. **Login with demo account**
   ```
   Email: health.demo@manus.im
   Password: (OAuth handled automatically in demo mode)
   ```

### Demo Data

The demo account includes:
- **Patient**: John Doe (fictional)
- **Exam history**: 2022-2026 (31 different lab tests)
- **Anthropometric data**: Weight, height, BMI, waist circumference
- **Complete lipid profile**: HDL, LDL, Total Cholesterol, Triglycerides
- **Metabolic markers**: Glucose, HbA1c, Insulin
- **Hormonal panel**: Testosterone, Estradiol, TSH, T4
- **Kidney function**: Creatinine, Urea, GFR
- **Vitamins & minerals**: Vitamin D, B12, Calcium, Magnesium

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first styling
- **Wouter** - Lightweight routing
- **tRPC** - End-to-end type-safe APIs
- **TanStack Query** - Data fetching & caching
- **Recharts** - Data visualization
- **shadcn/ui** - Accessible component library

### Backend
- **Express 4** - Web server
- **tRPC 11** - Type-safe RPC framework
- **Drizzle ORM** - Type-safe database toolkit
- **MySQL/TiDB** - Relational database
- **Superjson** - Rich data serialization

### AI & Services
- **LLM Integration** - Medical analysis generation
- **Hexagonal Architecture** - Clean, maintainable codebase
- **Factory Pattern** - Flexible service deployment

---

## 📖 Documentation

- [Architecture Overview](docs/HEXAGONAL_ARCHITECTURE.md) - Hexagonal architecture explained
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines
- [Security Policy](SECURITY.md) - Reporting vulnerabilities

---

## 🤝 Contributing

We welcome contributions from the community! This project aims to democratize access to intelligent health information interpretation, especially for underserved populations.

**Ways to contribute:**
- 🐛 Report bugs and issues
- 💡 Suggest new features or improvements
- 📝 Improve documentation
- 🌍 Add translations (Portuguese, Spanish, etc.)
- 🧪 Write tests
- 💻 Submit pull requests

Please read our [Contributing Guide](CONTRIBUTING.md) before submitting PRs.

---

## 🌟 Built with Manus

This project was developed using [Manus](https://manus.im), an AI-powered development platform that accelerates software creation while maintaining high code quality and architectural standards.

Manus enabled:
- ✅ Rapid prototyping and iteration
- ✅ Consistent code patterns and best practices
- ✅ Comprehensive documentation generation
- ✅ Hexagonal architecture implementation
- ✅ Type-safe full-stack development

**Interested in building with AI?** Check out [Manus](https://manus.im) to see how AI can enhance your development workflow.

---

## 🎯 Project Vision

### Mission
Democratize access to intelligent medical laboratory exam interpretation, helping patients—especially those with limited resources—better understand their health data and make informed decisions in consultation with healthcare professionals.

### Goals
1. **Accessibility** - Free, open-source tool available to everyone
2. **Education** - Help patients understand medical terminology and results
3. **Empowerment** - Enable informed conversations with healthcare providers
4. **Collaboration** - Build a community-driven platform with global contributions
5. **Safety** - Maintain clear medical disclaimers and encourage professional validation

### Future Roadmap
- [ ] Multi-language support (Portuguese, Spanish, French, etc.)
- [ ] Mobile application (iOS/Android)
- [ ] MCP server for external integrations
- [ ] PDF report generation
- [ ] Family health tracking
- [ ] Integration with wearable devices
- [ ] Telemedicine consultation booking
- [ ] Community health insights (anonymized data)

---

## 📊 Project Status

**Current Version**: Beta (v0.1.0)

**Stability**: This project is in active development. Features may change, and bugs are expected. Not recommended for production medical use.

**Development Stage**:
- ✅ Core exam tracking functionality
- ✅ AI-powered medical analysis
- ✅ Correlation detection
- ✅ Personalized recommendations
- ✅ Hexagonal architecture
- 🚧 Multi-language support
- 🚧 MCP integration
- 🚧 Mobile responsiveness optimization
- 📋 Comprehensive test coverage
- 📋 PDF export

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Manus Team** - For providing the AI development platform
- **Open Source Community** - For tools, libraries, and inspiration
- **Medical Professionals** - For guidance on clinical interpretation
- **Contributors** - Everyone who helps improve this project

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/dsantosme/health_dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/dsantosme/health_dashboard/discussions)
- **Email**: d.santos.me@outlook.com

---

<p align="center">
  <strong>Made with ❤️ by the community, for the community</strong>
  <br>
  <sub>Democratizing access to health insights, one exam at a time</sub>
</p>
