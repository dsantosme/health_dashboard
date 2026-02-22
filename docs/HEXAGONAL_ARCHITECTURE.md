# Hexagonal Architecture (Ports & Adapters)

## Overview

This project uses **Hexagonal Architecture** (also known as Ports & Adapters) to enable data processing services to operate flexibly, allowing them to run as:

- **Internal calls** (direct calls via tRPC)
- **External MCP servers** (Model Context Protocol)

The deployment decision is configurable via environment variable, allowing changes without code modification.

---

## Directory Structure

```
server/
├── domain/                    # Core Business Logic (Domain Layer)
│   └── MedicalAnalysisDomain.ts
├── ports/                     # Interfaces (Ports)
│   ├── IMedicalAnalysisService.ts
│   ├── ILLMProvider.ts
│   └── IDataRepository.ts
├── adapters/                  # Implementations (Adapters)
│   ├── internal/              # Internal adapters (direct calls)
│   │   ├── InternalLLMAdapter.ts
│   │   └── InternalDataAdapter.ts
│   ├── mcp/                   # MCP adapters (external service)
│   │   └── (TODO)
│   └── MedicalAnalysisServiceFactory.ts
└── routers/                   # tRPC routers (uses factory)
    └── medicalAnalysis.ts
```

---

## Architecture Layers

### 1. **Domain (Core)**
Pure business logic with no external dependencies. Implements interfaces (ports) and contains all domain logic.

**Example:** `MedicalAnalysisDomain.ts`
- Calculates clinical indices
- Determines medical specialist
- Generates analysis in natural language
- Extracts recommendations

### 2. **Ports (Interfaces)**
Contracts that define how the domain communicates with the external world.

**Examples:**
- `IMedicalAnalysisService`: Main service interface
- `ILLMProvider`: Interface for LLM provider
- `IDataRepository`: Interface for data access

### 3. **Adapters (Implementations)**
Concrete implementations of ports for different contexts.

#### **Internal Adapters**
- `InternalLLMAdapter`: Uses internal `invokeLLM`
- `InternalDataAdapter`: Uses Drizzle ORM directly

#### **MCP Adapters** (TODO)
- `MCPLLMAdapter`: MCP client for LLM
- `MCPDataAdapter`: MCP client for data

### 4. **Factory**
Decides which adapter to use based on configuration.

**Example:** `MedicalAnalysisServiceFactory.ts`
```typescript
const mode = process.env.MEDICAL_ANALYSIS_DEPLOYMENT_MODE; // 'internal' | 'mcp'
const service = MedicalAnalysisServiceFactory.create(mode);
```

---

## Deployment Configuration

### Internal Mode (Default)
```env
MEDICAL_ANALYSIS_DEPLOYMENT_MODE=internal
```

- Uses internal adapters
- Direct calls via tRPC
- No network overhead

### MCP Mode (Future)
```env
MEDICAL_ANALYSIS_DEPLOYMENT_MODE=mcp
MCP_MEDICAL_ANALYSIS_URL=http://localhost:3001
```

- Uses MCP adapters
- Communication via HTTP/stdio
- Enables independent scalability

---

## How to Add New Services

### 1. Create Port (Interface)
```typescript
// server/ports/IMyService.ts
export interface IMyService {
  doSomething(input: MyInput): Promise<MyOutput>;
}
```

### 2. Create Domain (Core Logic)
```typescript
// server/domain/MyServiceDomain.ts
export class MyServiceDomain implements IMyService {
  constructor(
    private dependency1: IDependency1,
    private dependency2: IDependency2
  ) {}

  async doSomething(input: MyInput): Promise<MyOutput> {
    // Pure business logic here
  }
}
```

### 3. Create Adapters
```typescript
// server/adapters/internal/InternalDependency1Adapter.ts
export class InternalDependency1Adapter implements IDependency1 {
  // Implementation using internal resources
}
```

### 4. Create Factory
```typescript
// server/adapters/MyServiceFactory.ts
export class MyServiceFactory {
  static create(mode: DeploymentMode): IMyService {
    if (mode === 'mcp') {
      // Return MCP adapter
    }
    // Return internal adapter
    const dep1 = new InternalDependency1Adapter();
    const dep2 = new InternalDependency2Adapter();
    return new MyServiceDomain(dep1, dep2);
  }
}
```

### 5. Use in Router
```typescript
// server/routers/myService.ts
import { MyServiceFactory } from '../adapters/MyServiceFactory';

export const myServiceRouter = router({
  doSomething: procedure
    .input(z.object({ ... }))
    .mutation(async ({ input }) => {
      const mode = MyServiceFactory.getDeploymentMode();
      const service = MyServiceFactory.create(mode);
      return await service.doSomething(input);
    }),
});
```

---

## Benefits

1. **Testability**: Easy to create mocks of ports for testing
2. **Flexibility**: Swap implementations without changing business logic
3. **Scalability**: Move services to MCP when needed
4. **Maintainability**: Clear separation of concerns
5. **Portability**: Business logic independent of infrastructure

---

## Next Steps

- [ ] Implement MCP adapters
- [ ] Create build script for MCP: `pnpm build:mcp`
- [ ] Add unit tests for domain
- [ ] Add integration tests for adapters
- [ ] Document MCP protocol
- [ ] Create visual architecture diagram

---

## Built with Manus

This architectural pattern was implemented using [Manus](https://manus.im), an AI-powered development platform that helped:

- Design the hexagonal architecture structure
- Generate clean, maintainable code following SOLID principles
- Create comprehensive documentation
- Ensure type safety across all layers

**Interested in building with AI?** Check out [Manus](https://manus.im) to see how AI can enhance your development workflow while maintaining architectural excellence.
