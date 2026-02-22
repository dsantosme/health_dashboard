# Architecture Diagrams

This directory contains visual representations of the Health Dashboard architecture. These diagrams help developers understand the system structure, data flow, and technology stack.

## Diagrams

### 1. System Architecture (`system_architecture.png`)

**Overview**: High-level view of all major components and their interactions.

**Shows**:
- Frontend (React) layer
- API layer (tRPC)
- Backend (Express) with hexagonal architecture
- External services (LLM)
- Data layer (Database)
- Shared types

**Use this when**: You need to understand how the overall system is organized and how components communicate.

**Source**: `system_architecture.mmd` (Mermaid diagram)

---

### 2. Hexagonal Architecture (`hexagonal_architecture.png`)

**Overview**: Detailed view of the backend's hexagonal (ports & adapters) architecture.

**Shows**:
- Primary ports (inbound) - HTTP, Events
- Domain layer (business logic, models, rules)
- Secondary ports (outbound) - Database, LLM, Storage
- Adapters (implementations)
- External services
- Service layer

**Use this when**: You're developing backend features or need to understand how to add new integrations.

**Key Insight**: The domain layer is at the center, completely independent of external frameworks. All external interactions go through ports and adapters.

**Source**: `hexagonal_architecture.mmd` (Mermaid diagram)

---

### 3. Data Flow (`data_flow.png`)

**Overview**: Sequence diagram showing how data flows through the system during a typical user interaction.

**Shows**:
- User action triggers frontend
- Frontend calls tRPC API
- Backend routes to handler
- Domain logic processes request
- External services (LLM) are called
- Data flows back through layers
- Frontend updates UI

**Use this when**: You want to understand the complete journey of a request through the system.

**Example Flow**: User selects exams → Frontend calls `analyzeExams` → Backend fetches data → LLM generates analysis → Result displayed in UI.

**Source**: `data_flow.mmd` (Mermaid diagram)

---

### 4. Technology Stack (`tech_stack.png`)

**Overview**: Visual representation of all technologies used in each layer.

**Shows**:
- Presentation layer (React, TypeScript, Tailwind, shadcn/ui, Recharts)
- State management (TanStack Query, tRPC)
- Routing (Wouter)
- API layer (tRPC, Express)
- Business logic (TypeScript, Hexagonal Architecture, Factories)
- Data layer (Drizzle ORM, MySQL/TiDB)
- AI services (LLM Integration)
- Utilities (Superjson, Vite, Vitest)

**Use this when**: You need to understand what technologies are used and where they fit in the architecture.

**Source**: `tech_stack.mmd` (Mermaid diagram)

---

## Mermaid Source Files

All diagrams are created using Mermaid, a JavaScript-based diagramming and charting tool. The source files (`.mmd`) are included for reference and can be edited to update diagrams.

### Editing Diagrams

To edit a diagram:

1. Open the `.mmd` file in any text editor
2. Modify the Mermaid syntax
3. Render to PNG using: `manus-render-diagram diagram.mmd diagram.png`
4. Commit both `.mmd` and `.png` files

### Mermaid Documentation

- [Mermaid Official Documentation](https://mermaid.js.org)
- [Mermaid Diagram Types](https://mermaid.js.org/intro/syntax-reference.html)
- [Mermaid Themes and Styling](https://mermaid.js.org/syntax/themes.html)

---

## Architecture Principles

### Hexagonal Architecture

The core principle: **Business logic should be independent of external frameworks and services.**

**Benefits**:
- ✅ Testability: Test business logic without mocking external dependencies
- ✅ Flexibility: Swap implementations without changing domain code
- ✅ Maintainability: Clear boundaries between layers
- ✅ Scalability: Add features without affecting existing code
- ✅ Reusability: Domain logic works in different contexts

### Type Safety

End-to-end type safety from frontend to backend using TypeScript and tRPC.

### Ports & Adapters

- **Ports**: Interface definitions for external service interactions
- **Adapters**: Concrete implementations of ports (database, LLM, storage, etc.)

---

## Related Documentation

- [Full Architecture Guide](../ARCHITECTURE.md) - Comprehensive architecture documentation
- [Contributing Guide](../../CONTRIBUTING.md) - How to contribute to the project
- [Tech Stack Details](../../README.md#-tech-stack) - Detailed technology stack information

---

## Questions?

For questions about the architecture:

1. Read the [Full Architecture Guide](../ARCHITECTURE.md)
2. Check [GitHub Discussions](https://github.com/dsantosme/health_dashboard/discussions)
3. Open an issue with the `architecture` label
4. Contact the maintainers

---

## Diagram Generation

These diagrams were generated using Mermaid and rendered to PNG format for better visibility in documentation.

**Tool**: `manus-render-diagram`

**Command**: `manus-render-diagram input.mmd output.png`

**Last Updated**: February 22, 2026
