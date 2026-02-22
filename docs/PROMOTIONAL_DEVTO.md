# Dev.to Article - Health Dashboard

## Title
Building an Open-Source AI-Powered Medical Lab Analysis Platform with Hexagonal Architecture

## Tags
#opensource #typescript #react #healthcare #ai

## Cover Image
(Screenshot of the dashboard showing exam analysis)

## Article Body

# Building an Open-Source AI-Powered Medical Lab Analysis Platform

## TL;DR

I built [Health Dashboard](https://github.com/dsantosme/health_dashboard), an open-source platform that uses AI to help people understand their medical laboratory results. It's built with React 19, tRPC 11, and follows Hexagonal Architecture principles.

**Try it now**: `git clone` → `pnpm seed:demo` → instant demo with fictional patient data.

---

## The Problem: Health Data Accessibility

Medical laboratory results are confusing. You get a PDF with numbers, reference ranges, and cryptic abbreviations. Understanding what it all means requires medical expertise—creating a barrier for millions of people worldwide, especially those with limited access to healthcare.

## The Solution: AI-Powered Interpretation

Health Dashboard bridges this gap by providing:

### 1. **Natural Language Medical Analysis**

Instead of just showing numbers, the platform generates analysis like this:

> "Your HDL cholesterol is 38 mg/dL. For men, the ideal is above 40 mg/dL—you're slightly below the protective threshold. Combined with elevated triglycerides (198 mg/dL), this pattern suggests insulin resistance..."

### 2. **Multi-Exam Correlation**

Select 2-4 related exams (e.g., complete lipid profile) and get integrated analysis explaining patterns and correlations—not just isolated values.

### 3. **Personalized Recommendations**

Get actionable plans:
- Specific dietary changes
- Exercise recommendations
- Monitoring schedules
- Specialist referrals

### 4. **Historical Tracking & Projections**

- Complete exam history (2022-2026)
- Trend analysis with mixed charts
- 24-month projections (Optimistic/Maintenance/Pessimistic scenarios)

---

## Tech Stack & Architecture

### Frontend
- **React 19** + **Tailwind CSS 4**
- **Wouter** for routing
- **Recharts** for data visualization
- **shadcn/ui** for components

### Backend
- **Express 4** + **tRPC 11** (end-to-end type safety)
- **Drizzle ORM** + MySQL/TiDB
- **Manus OAuth** for authentication
- **Manus Forge API** for AI-powered analysis

### Architecture: Hexagonal (Ports & Adapters)

The platform follows **Hexagonal Architecture** to separate concerns:

```
server/
├── domain/          # Pure business logic
├── ports/           # Interfaces (contracts)
├── adapters/        # Implementations
│   ├── internal/    # Direct calls (tRPC)
│   └── mcp/         # MCP protocol (future)
└── routers/         # tRPC procedures
```

**Why Hexagonal?**
- **Testability**: Domain logic is pure, no external dependencies
- **Flexibility**: Swap adapters without touching business logic
- **Future-proof**: Easy to add MCP (Model Context Protocol) adapters for external integrations

---

## Key Features

### 1. Demo Mode
```bash
pnpm seed:demo
```
Instantly creates a demo user (`health.demo@manus.im`) with fictional patient data (John Doe) including:
- 126 exam records (2022-2026)
- Anthropometric data (weight, height, BMI, waist circumference)
- Pre-calculated correlations

### 2. AI-Powered Medical Analysis

Uses LLM to generate specialist-level interpretations:
- Identifies appropriate specialist (cardiologist, endocrinologist, etc.)
- Calculates clinical indices (TG/HDL ratio, CT/HDL ratio)
- Explains patterns (e.g., atherogenic profile, insulin resistance)
- Provides urgency level (not urgent, attention needed, urgent)

### 3. Health Projections

Realistic 24-month forecasts based on:
- Historical trends (linear regression)
- Anthropometric changes (weight, BMI)
- Medical studies (e.g., caloric deficit, metabolism)

---

## Built with AI

This entire project was developed using [Manus](https://manus.im), an AI-powered development platform. From architecture design to implementation, AI accelerated the process while maintaining:
- Clean code principles
- Type safety
- Comprehensive documentation
- Test coverage

---

## Open Source & Community

**License**: MIT  
**Repository**: https://github.com/dsantosme/health_dashboard  
**Status**: Beta (v0.1.0-beta)

### Vision

Democratize access to intelligent health information interpretation, making it a tool for people with limited income to have better access to information about their health.

### Looking for Contributors

Passionate about:
- Healthcare accessibility
- AI/ML in health-tech
- TypeScript/React
- Open-source collaboration

**Join us!** See [CONTRIBUTING.md](https://github.com/dsantosme/health_dashboard/blob/main/CONTRIBUTING.md)

---

## Important Disclaimer

⚠️ This is **beta software** and should NOT be used as the sole source of medical information. Always consult qualified healthcare professionals.

---

## What's Next?

- [ ] Historical analysis storage
- [ ] PDF export for sharing with doctors
- [ ] Gamification (goals, progress tracking)
- [ ] MCP adapters for external integrations
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## Try It Now

```bash
git clone https://github.com/dsantosme/health_dashboard.git
cd health_dashboard
pnpm install
pnpm db:push
pnpm seed:demo
pnpm dev
```

Visit `http://localhost:3000` and explore with the demo account!

---

**What do you think?** Would love to hear your feedback and ideas! 💬

#opensource #typescript #react #healthcare #ai #webdev #healthtech
