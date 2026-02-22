# Reddit Post - Health Dashboard Launch

## Title
[Open Source] Health Dashboard - AI-powered medical lab analysis democratizing access to health insights 🏥

## Post Body

Hey r/opensource! 👋

I'm excited to share **Health Dashboard**, an open-source platform I built to help people understand their medical laboratory results through AI-powered analysis.

### 🎯 The Problem

Medical lab results are confusing. Reference ranges vary, correlations between exams aren't obvious, and understanding what values mean for your health requires medical expertise. This creates a barrier for people—especially those with limited access to healthcare—to understand their own health data.

### 💡 The Solution

Health Dashboard provides:
- **AI-powered analysis** in natural language (like a specialist explaining results)
- **Multi-exam correlation** (e.g., complete lipid profile analysis)
- **Personalized recommendations** (diet, exercise, monitoring schedules)
- **Historical tracking** with trend analysis and 24-month projections
- **Demo mode** with fictional patient data for instant testing

### 🏗️ Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Recharts
- **Backend**: Express 4, tRPC 11 (end-to-end type safety)
- **Database**: MySQL/TiDB with Drizzle ORM
- **AI**: Manus Forge API for medical analysis
- **Architecture**: Hexagonal (Ports & Adapters) for clean separation

### 🤖 Built with AI

This project was developed using [Manus](https://manus.im), demonstrating how AI can accelerate development while maintaining architectural excellence and code quality.

### 🚀 Try it Now

```bash
git clone https://github.com/dsantosme/health_dashboard.git
cd health_dashboard
pnpm install
pnpm db:push
pnpm seed:demo
pnpm dev
```

**Demo account**: health.demo@manus.im

### ⚠️ Important Disclaimer

This is **beta software** and should NOT be used as the sole source of medical information. Always consult qualified healthcare professionals.

### 🎯 Vision

My goal is to democratize access to intelligent health information interpretation, making it a tool for people with limited income to have better access to information about their health.

### 🤝 Looking for Contributors

I'm looking for contributors passionate about:
- Healthcare accessibility
- AI/ML applications in health-tech
- Open-source collaboration
- TypeScript/React development

**Repository**: https://github.com/dsantosme/health_dashboard  
**License**: MIT  
**Status**: Beta (v0.1.0-beta)

Would love to hear your thoughts and feedback! 🙏

---

**Subreddits to post:**
- r/opensource
- r/healthIT
- r/programming
- r/typescript
- r/reactjs
- r/webdev
- r/SideProject
