# Arquitetura Hexagonal (Ports & Adapters)

## Visão Geral

Este projeto utiliza **Arquitetura Hexagonal** (também conhecida como Ports & Adapters) para permitir que serviços de processamento de dados operem de forma flexível, podendo ser executados como:

- **Chamadas internas** (direct calls via tRPC)
- **Servidores MCP externos** (Model Context Protocol)

A decisão de deployment é configurável via variável de ambiente, permitindo mudanças sem alteração de código.

---

## Estrutura de Diretórios

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

## Camadas da Arquitetura

### 1. **Domain (Core)**
Lógica de negócio pura, sem dependências externas. Implementa as interfaces (ports) e contém toda a lógica de domínio.

**Exemplo:** `MedicalAnalysisDomain.ts`
- Calcula índices clínicos
- Determina especialista médico
- Gera análise em linguagem natural
- Extrai recomendações

### 2. **Ports (Interfaces)**
Contratos que definem como o domínio se comunica com o mundo externo.

**Exemplos:**
- `IMedicalAnalysisService`: Interface principal do serviço
- `ILLMProvider`: Interface para provedor de LLM
- `IDataRepository`: Interface para acesso a dados

### 3. **Adapters (Implementações)**
Implementações concretas dos ports para diferentes contextos.

#### **Internal Adapters**
- `InternalLLMAdapter`: Usa `invokeLLM` interno
- `InternalDataAdapter`: Usa Drizzle ORM direto

#### **MCP Adapters** (TODO)
- `MCPLLMAdapter`: Cliente MCP para LLM
- `MCPDataAdapter`: Cliente MCP para dados

### 4. **Factory**
Decide qual adapter usar baseado em configuração.

**Exemplo:** `MedicalAnalysisServiceFactory.ts`
```typescript
const mode = process.env.MEDICAL_ANALYSIS_DEPLOYMENT_MODE; // 'internal' | 'mcp'
const service = MedicalAnalysisServiceFactory.create(mode);
```

---

## Configuração de Deployment

### Modo Interno (Padrão)
```env
MEDICAL_ANALYSIS_DEPLOYMENT_MODE=internal
```

- Usa adapters internos
- Chamadas diretas via tRPC
- Sem overhead de rede

### Modo MCP (Futuro)
```env
MEDICAL_ANALYSIS_DEPLOYMENT_MODE=mcp
MCP_MEDICAL_ANALYSIS_URL=http://localhost:3001
```

- Usa adapters MCP
- Comunicação via HTTP/stdio
- Permite escalabilidade independente

---

## Como Adicionar Novos Serviços

### 1. Criar Port (Interface)
```typescript
// server/ports/IMyService.ts
export interface IMyService {
  doSomething(input: MyInput): Promise<MyOutput>;
}
```

### 2. Criar Domain (Core Logic)
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

### 3. Criar Adapters
```typescript
// server/adapters/internal/InternalDependency1Adapter.ts
export class InternalDependency1Adapter implements IDependency1 {
  // Implementation using internal resources
}
```

### 4. Criar Factory
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

### 5. Usar no Router
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

## Benefícios

1. **Testabilidade**: Fácil criar mocks dos ports para testes
2. **Flexibilidade**: Trocar implementações sem alterar lógica de negócio
3. **Escalabilidade**: Mover serviços para MCP quando necessário
4. **Manutenibilidade**: Separação clara de responsabilidades
5. **Portabilidade**: Lógica de negócio independente de infraestrutura

---

## Próximos Passos

- [ ] Implementar MCP adapters
- [ ] Criar script de build para MCP: `pnpm build:mcp`
- [ ] Adicionar testes unitários para domain
- [ ] Adicionar testes de integração para adapters
- [ ] Documentar protocolo MCP
- [ ] Criar diagrama de arquitetura visual
