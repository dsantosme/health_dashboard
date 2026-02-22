# MCP Adapters (Model Context Protocol)

## Status: 🚧 TODO

Este diretório conterá os adapters MCP para permitir que os serviços de processamento de dados sejam executados como servidores MCP externos.

---

## Arquitetura Planejada

```
server/adapters/mcp/
├── MCPLLMAdapter.ts           # Cliente MCP para LLM
├── MCPDataAdapter.ts          # Cliente MCP para dados
├── server.ts                  # Servidor MCP standalone
└── package.json               # Dependências específicas do MCP
```

---

## Como Funciona

### 1. **Servidor MCP Standalone**
O servidor MCP será um processo separado que expõe os serviços via protocolo MCP (stdio ou HTTP).

```typescript
// server.ts
import { MCPServer } from '@modelcontextprotocol/sdk';

const server = new MCPServer({
  name: 'medical-analysis-service',
  version: '1.0.0',
});

server.addTool({
  name: 'generateMedicalAnalysis',
  description: 'Generate medical analysis for exams',
  inputSchema: { ... },
  handler: async (input) => {
    // Use MedicalAnalysisDomain here
  },
});

server.start();
```

### 2. **Cliente MCP (Adapter)**
O adapter MCP será usado pelo tRPC router para se comunicar com o servidor MCP externo.

```typescript
// MCPLLMAdapter.ts
export class MCPLLMAdapter implements ILLMProvider {
  private client: MCPClient;

  constructor(serverUrl: string) {
    this.client = new MCPClient({ serverUrl });
  }

  async generateCompletion(messages: LLMMessage[]): Promise<LLMResponse> {
    const response = await this.client.callTool('generateCompletion', { messages });
    return response;
  }
}
```

---

## Configuração

### Variáveis de Ambiente

```env
MEDICAL_ANALYSIS_DEPLOYMENT_MODE=mcp
MCP_MEDICAL_ANALYSIS_URL=http://localhost:3001
```

### Build Script

```json
{
  "scripts": {
    "build:mcp": "esbuild server/adapters/mcp/server.ts --platform=node --bundle --outdir=dist/mcp"
  }
}
```

---

## Benefícios do MCP

1. **Escalabilidade**: Serviço pode rodar em container separado
2. **Isolamento**: Falhas no serviço não afetam aplicação principal
3. **Reutilização**: Outros sistemas podem consumir via MCP
4. **Monitoramento**: Métricas e logs independentes
5. **Deployment**: Deploy independente do aplicativo principal

---

## Próximos Passos

1. Instalar SDK do MCP: `pnpm add @modelcontextprotocol/sdk`
2. Implementar `MCPLLMAdapter.ts`
3. Implementar `MCPDataAdapter.ts`
4. Criar `server.ts` com MCP server
5. Adicionar script de build
6. Testar comunicação MCP
7. Documentar protocolo e endpoints
8. Criar Dockerfile para deployment
