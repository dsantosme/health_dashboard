# Hacker News Submission - Health Dashboard

## Title
Health Dashboard – Open-source AI-powered medical lab analysis platform

## URL
https://github.com/dsantosme/health_dashboard

## Text (optional, for "Ask HN" or "Show HN")

### Show HN: Health Dashboard – AI-powered medical lab analysis democratizing health insights

I built Health Dashboard to help people understand their medical laboratory results through AI-powered interpretation. The problem: medical lab results are confusing, correlations aren't obvious, and understanding what values mean requires medical expertise—creating a barrier for people with limited healthcare access.

**Key features:**
- AI-powered analysis in natural language (specialist-level explanations)
- Multi-exam correlation (e.g., complete lipid profile)
- Personalized recommendations (diet, exercise, monitoring)
- Historical tracking with 24-month projections
- Demo mode with fictional patient data (`pnpm seed:demo`)

**Tech stack:**
- React 19, Tailwind CSS 4, tRPC 11 (end-to-end type safety)
- Express 4, Drizzle ORM, MySQL/TiDB
- Hexagonal Architecture (Ports & Adapters)
- Manus Forge API for AI analysis

**Built with AI:** Entire project developed using Manus (https://manus.im), demonstrating how AI can accelerate development while maintaining architectural excellence.

**Important:** Beta software—not a substitute for professional medical advice. Always consult healthcare professionals.

**Vision:** Democratize access to intelligent health information interpretation, especially for people with limited income.

**Try it:**
```
git clone https://github.com/dsantosme/health_dashboard.git
cd health_dashboard
pnpm install && pnpm db:push && pnpm seed:demo && pnpm dev
```

Demo account: health.demo@manus.im

**License:** MIT  
**Looking for contributors** passionate about healthcare accessibility, AI/ML in health-tech, and open-source.

Would love feedback from the HN community!

---

## Alternative Shorter Version

### Show HN: AI-powered medical lab analysis platform (open source)

Built Health Dashboard to help people understand their medical lab results through AI. Features: natural language analysis, multi-exam correlation, personalized recommendations, historical tracking, 24-month projections.

Tech: React 19, tRPC 11, Hexagonal Architecture. Built entirely with Manus AI.

Demo: `pnpm seed:demo` → instant fictional patient data

⚠️ Beta software—not medical advice. Consult professionals.

Vision: Democratize health information access for people with limited income.

MIT license. Contributors welcome!

https://github.com/dsantosme/health_dashboard

---

## Tips for HN Submission

1. **Best time to post**: Tuesday-Thursday, 8-10 AM EST
2. **Engage with comments**: Respond quickly and thoughtfully
3. **Be humble**: Acknowledge limitations and beta status
4. **Technical depth**: HN audience appreciates architecture details
5. **Social impact**: Emphasize democratization and accessibility
6. **AI transparency**: Be upfront about AI-assisted development
7. **Demo accessibility**: Make it easy to try (seed script is key)

## Expected Questions & Answers

**Q: How accurate is the AI analysis?**
A: The AI provides interpretations based on medical knowledge, but it's NOT a replacement for professional medical advice. All analyses should be validated by qualified healthcare professionals. This is a tool to help people understand their results, not diagnose conditions.

**Q: Privacy concerns?**
A: All data is stored locally in your database. For demo mode, we use fictional patient data. In production, implement proper encryption, LGPD/GDPR compliance, and user data isolation (already implemented via userId filtering).

**Q: Why Hexagonal Architecture?**
A: Clean separation of concerns, testability, and future-proofing. We can easily add MCP (Model Context Protocol) adapters for external integrations without touching business logic.

**Q: What LLM are you using?**
A: Manus Forge API (built on top of leading LLMs). The prompts are carefully crafted to generate medical-specialist-level explanations with appropriate disclaimers.

**Q: Can I self-host?**
A: Yes! MIT license. Clone, install dependencies, configure your database and LLM API, run seed script, and you're good to go.

**Q: Roadmap?**
A: PDF export, historical analysis storage, gamification, MCP adapters, multi-language support, mobile app (React Native), wearables integration.
