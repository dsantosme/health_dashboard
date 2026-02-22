# Architecture Documentation

## Overview

Health Dashboard is built using **Hexagonal Architecture** (also known as Ports & Adapters pattern), a design pattern that emphasizes clean separation of concerns and maximum flexibility. This document provides a comprehensive guide to understanding and contributing to the architecture.

## Table of Contents

1. [Hexagonal Architecture Principles](#hexagonal-architecture-principles)
2. [System Components](#system-components)
3. [Layer Breakdown](#layer-breakdown)
4. [Data Flow](#data-flow)
5. [Technology Stack](#technology-stack)
6. [Design Patterns](#design-patterns)
7. [Contributing to Architecture](#contributing-to-architecture)

---

## Hexagonal Architecture Principles

Hexagonal Architecture organizes code into concentric layers, with the business domain at the center:

### Core Principle

> **Business logic should be independent of external frameworks, databases, and services.**

### Benefits

- **Testability**: Test business logic without mocking external dependencies
- **Flexibility**: Swap implementations without changing domain code
- **Maintainability**: Clear boundaries between layers make code easier to understand
- **Scalability**: Add new features without affecting existing functionality
- **Reusability**: Domain logic can be used in different contexts (web, CLI, API, etc.)

### The Three Layers

```
┌─────────────────────────────────────────────────────┐
│              External Systems                        │
│  (Frontend, Databases, APIs, File Systems)          │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Adapters (Implementation)               │
│  (Drizzle ORM, LLM Adapter, Storage Adapter)        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Ports (Interfaces)                      │
│  (Database Port, LLM Port, Storage Port)            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Domain Layer (Core)                     │
│  (Business Logic, Domain Models, Rules)             │
└─────────────────────────────────────────────────────┘
```

---

## System Components

### Frontend Layer (React)

**Location**: `/client/src`

**Responsibilities**:
- User interface rendering
- User interaction handling
- Data visualization and charts
- Client-side state management
- Form validation

**Key Technologies**:
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- Recharts for data visualization
- shadcn/ui for accessible components
- TanStack Query for data fetching
- Wouter for routing

**Example**: The exam list component fetches data via tRPC and displays results with interactive charts.

### API Layer (tRPC)

**Location**: `/server/routers`

**Responsibilities**:
- Define type-safe RPC procedures
- Route requests to appropriate services
- Handle input validation
- Manage authentication/authorization
- Serialize responses

**Key Technologies**:
- tRPC 11 for type-safe RPC
- Superjson for rich data serialization
- Express middleware integration

**Example**: The `analyzeExams` procedure receives exam IDs, validates them, calls the analysis service, and returns the result with full type safety.

### Backend Services Layer

**Location**: `/server/services`

**Responsibilities**:
- Orchestrate use cases
- Coordinate between domain and adapters
- Handle business logic orchestration
- Manage transactions

**Key Services**:
- `AuthService`: User authentication and authorization
- `CorrelationEngine`: Exam correlation analysis
- `ReportService`: Medical report generation

### Domain Layer (Core Business Logic)

**Location**: `/server/domain`

**Responsibilities**:
- Define domain models
- Implement business rules
- Validate domain invariants
- Calculate clinical indices

**Key Models**:
- `Exam`: Laboratory test result
- `Patient`: Patient information
- `Analysis`: Correlation analysis
- `Report`: Generated medical report

**Important**: Domain models are **framework-agnostic**. They don't import Express, Drizzle, or any other external library.

### Ports (Interface Definitions)

**Location**: `/server/ports`

**Responsibilities**:
- Define interfaces for external services
- Specify contracts for adapters
- Enable dependency injection

**Key Ports**:
- `DatabasePort`: CRUD operations interface
- `LLMPort`: AI analysis interface
- `StoragePort`: File persistence interface

**Example**:
```typescript
export interface DatabasePort {
  getExam(id: string): Promise<Exam>;
  saveAnalysis(analysis: Analysis): Promise<void>;
}
```

### Adapters (Implementation)

**Location**: `/server/adapters`

**Responsibilities**:
- Implement port interfaces
- Handle external service integration
- Translate between domain models and external formats

**Key Adapters**:
- `DrizzleAdapter`: Implements DatabasePort using Drizzle ORM
- `LLMAdapter`: Implements LLMPort using OpenAI API
- `FileStorageAdapter`: Implements StoragePort using file system

**Example**:
```typescript
export class DrizzleAdapter implements DatabasePort {
  async getExam(id: string): Promise<Exam> {
    const result = await db.query.exams.findFirst({
      where: eq(exams.id, id)
    });
    return mapToExam(result);
  }
}
```

### Data Layer (Database)

**Location**: `/drizzle`

**Responsibilities**:
- Define database schema
- Manage migrations
- Provide type-safe ORM access

**Key Technologies**:
- Drizzle ORM for type-safe database access
- MySQL/TiDB for data persistence
- Migration system for schema changes

---

## Layer Breakdown

### Directory Structure

```
server/
├── _core/                 # Core utilities and constants
├── adapters/              # External service implementations
│   ├── database.ts        # Drizzle ORM adapter
│   ├── llm.ts             # LLM service adapter
│   └── storage.ts         # File storage adapter
├── domain/                # Pure business logic
│   ├── models/            # Domain entities
│   ├── rules/             # Business rules
│   └── services/          # Domain services
├── ports/                 # Interface definitions
│   ├── database.ts        # Database contract
│   ├── llm.ts             # LLM contract
│   └── storage.ts         # Storage contract
├── routers/               # tRPC route handlers
│   ├── exams.ts           # Exam procedures
│   ├── analysis.ts        # Analysis procedures
│   └── reports.ts         # Report procedures
├── services/              # Use case orchestration
│   ├── auth.ts            # Authentication service
│   ├── correlation.ts     # Correlation analysis
│   └── reports.ts         # Report generation
├── correlationEngine.ts   # Correlation calculation logic
├── db.ts                  # Database initialization
├── index.ts               # Server entry point
└── routers.ts             # tRPC router setup
```

---

## Data Flow

### Example: Analyzing Multiple Exams

```
1. User selects 3 exams in frontend
   ↓
2. Frontend calls tRPC: client.analysis.analyzeExams([id1, id2, id3])
   ↓
3. tRPC router receives request and validates input
   ↓
4. Router calls AnalysisService.analyze(ids)
   ↓
5. Service retrieves exams via DatabasePort
   ↓
6. Domain layer calculates correlations
   ↓
7. Service calls LLMPort to generate analysis
   ↓
8. LLMAdapter calls OpenAI API
   ↓
9. Response flows back through layers
   ↓
10. tRPC serializes and returns to frontend
   ↓
11. Frontend updates UI with analysis results
```

### Type Safety Throughout

One of the key benefits of this architecture is **end-to-end type safety**:

```typescript
// Frontend
const result = await trpc.analysis.analyzeExams.mutate({
  examIds: ['exam1', 'exam2']
});
// TypeScript knows exactly what `result` contains

// Backend Router
export const analysisRouter = router({
  analyzeExams: publicProcedure
    .input(z.object({ examIds: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      // TypeScript knows input shape
      const analysis = await service.analyze(input.examIds);
      return analysis; // TypeScript validates return type
    })
});
```

---

## Technology Stack

### Frontend Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI Framework | React 19 | Component-based UI |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Routing | Wouter | Lightweight routing |
| Data Fetching | TanStack Query | Caching and synchronization |
| API Client | tRPC Client | Type-safe API calls |
| Charts | Recharts | Data visualization |
| Components | shadcn/ui | Accessible UI components |

### Backend Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js 22+ | JavaScript runtime |
| Framework | Express 4 | HTTP server |
| Language | TypeScript | Type safety |
| API | tRPC 11 | Type-safe RPC |
| Database | Drizzle ORM | Type-safe database access |
| Database | MySQL/TiDB | Data persistence |
| Serialization | Superjson | Rich data types |
| Testing | Vitest | Unit testing |

### External Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| OpenAI API | Medical analysis generation | LLM Adapter |
| OAuth Provider | User authentication | Auth Service |
| File System | Report storage | Storage Adapter |

---

## Design Patterns

### Factory Pattern

Used for flexible service deployment:

```typescript
export function createDatabaseAdapter(config: Config): DatabasePort {
  if (config.db.type === 'mysql') {
    return new DrizzleAdapter(config.db.mysql);
  } else if (config.db.type === 'postgres') {
    return new PostgresAdapter(config.db.postgres);
  }
  throw new Error('Unknown database type');
}
```

### Dependency Injection

Services receive dependencies through constructor:

```typescript
export class AnalysisService {
  constructor(
    private dbPort: DatabasePort,
    private llmPort: LLMPort
  ) {}

  async analyze(examIds: string[]): Promise<Analysis> {
    const exams = await this.dbPort.getExams(examIds);
    const analysis = await this.llmPort.generateAnalysis(exams);
    return analysis;
  }
}
```

### Repository Pattern

Database access is abstracted through ports:

```typescript
interface DatabasePort {
  getExam(id: string): Promise<Exam>;
  getExams(ids: string[]): Promise<Exam[]>;
  saveAnalysis(analysis: Analysis): Promise<void>;
}
```

### Service Layer Pattern

Business logic is organized into services:

```typescript
export class CorrelationEngine {
  calculateIndices(exams: Exam[]): ClinicalIndices {
    return {
      triglyceridesToHDL: exams.triglycerides / exams.hdl,
      cholesterolToHDL: exams.totalCholesterol / exams.hdl,
      // ... more calculations
    };
  }
}
```

---

## Contributing to Architecture

### Adding a New Feature

1. **Define Domain Model** (`/server/domain/models`)
   - Create the entity representing your feature
   - Keep it framework-agnostic

2. **Create Port Interface** (`/server/ports`)
   - Define the interface for external service interaction
   - Use TypeScript interfaces

3. **Implement Adapter** (`/server/adapters`)
   - Implement the port interface
   - Handle external service integration

4. **Create Service** (`/server/services`)
   - Orchestrate domain logic and adapters
   - Handle use case implementation

5. **Add Router** (`/server/routers`)
   - Create tRPC procedures
   - Wire up the service

6. **Update Frontend** (`/client/src`)
   - Create React components
   - Call tRPC procedures

### Example: Adding Wearable Device Integration

```typescript
// 1. Domain Model
export interface WearableData {
  heartRate: number;
  steps: number;
  sleepHours: number;
  date: Date;
}

// 2. Port Interface
export interface WearablePort {
  fetchData(userId: string): Promise<WearableData[]>;
}

// 3. Adapter Implementation
export class FitbitAdapter implements WearablePort {
  async fetchData(userId: string): Promise<WearableData[]> {
    const response = await fetch(`https://api.fitbit.com/user/${userId}/data`);
    return response.json();
  }
}

// 4. Service
export class WearableService {
  constructor(private wearablePort: WearablePort) {}
  
  async correlateWithExams(userId: string, exams: Exam[]): Promise<Correlation> {
    const wearableData = await this.wearablePort.fetchData(userId);
    return this.calculateCorrelation(wearableData, exams);
  }
}

// 5. Router
export const wearableRouter = router({
  getCorrelation: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await wearableService.correlateWithExams(input.userId);
    })
});
```

### Testing Architecture

The hexagonal architecture makes testing straightforward:

```typescript
// Mock the port
class MockDatabasePort implements DatabasePort {
  async getExam(id: string): Promise<Exam> {
    return { id, name: 'Test Exam', value: 100 };
  }
}

// Test the service with mock
describe('AnalysisService', () => {
  it('should analyze exams correctly', async () => {
    const mockDb = new MockDatabasePort();
    const service = new AnalysisService(mockDb);
    
    const result = await service.analyze(['exam1']);
    expect(result).toBeDefined();
  });
});
```

---

## Best Practices

1. **Keep Domain Logic Pure**: No external dependencies in domain models
2. **Use Ports for Abstraction**: Never import adapters directly in services
3. **Validate at Boundaries**: Validate input at tRPC routers
4. **Type Everything**: Use TypeScript strictly for end-to-end type safety
5. **Test Business Logic**: Test domain and services without external dependencies
6. **Document Contracts**: Keep port interfaces well-documented
7. **Use Dependency Injection**: Inject dependencies rather than creating them

---

## Resources

- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)

---

## Questions?

If you have questions about the architecture, please:

1. Check existing issues and discussions
2. Open a new discussion in GitHub Discussions
3. Create an issue with the `architecture` label
4. Contact the maintainers

We're happy to help explain architectural decisions and guide new contributors!
