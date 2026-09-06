# design.md — EP-04 Gateway e guardrails v0.1

## Decisão

Um `Gateway` de domínio puro, sem I/O, orquestra três colaboradores injetados
por port: política de roteamento, guardrails e livro-razão de custo. Provedores
de modelo entram como adapters (ADR-0001).

## Componentes

| Módulo | Papel | Contrato (port) |
| --- | --- | --- |
| MOD-01 | Seleciona modelo, executa com fallback, mede tokens | `ModelProvider` |
| MOD-02 | Mascara PII na entrada, verifica vazamento na saída | `Guardrail` |
| MOD-06 | Registra custo por agente/caso de uso e aplica teto | `CostLedger` |

```
agente
  │  GatewayRequest { agentId, useCaseId, messages, regulated?, maxLatencyMs? }
  ▼
Gateway ──1──▶ RoutingPolicy.select()      → lista ordenada de modelos elegíveis (R1–R3)
         ──2──▶ CostLedger.checkBudget()   → recusa se estourado (R8)
         ──3──▶ Guardrail.maskInput()      → texto mascarado + mapa de marcadores (R9, R10)
         ──4──▶ ModelProvider.complete()   → tenta em ordem, com fallback (R4, R5)
         ──5──▶ Guardrail.inspectOutput()  → restaura marcadores, bloqueia PII nova (R11, R12)
         ──6──▶ CostLedger.record()        → sempre, inclusive em erro (R6)
  ▼
GatewayResponse { content, model, attempts, cost, maskedTypes }
```

## Decisões de detalhe

**Marcador estável de PII.** O marcador é `«TIPO_n»` com `n` sequencial por tipo
dentro da requisição. Estável dentro da chamada (R10) e sem valor embutido, para
que o log possa registrar o marcador sem registrar o dado (R9). O mapa
marcador→valor vive apenas em memória, durante a chamada, e nunca é persistido.

**PII nova na saída é bloqueio, não filtro.** Silenciosamente remover PII
inventada esconde o sintoma; o vazamento pode vir do índice de outro cliente
(US-08). R12 devolve erro e registra incidente.

**Validação de dígito verificador em CPF/CNPJ.** Sem ela, qualquer sequência de
11 dígitos — inclusive código interno do cliente — viraria marcador e corromperia
a entrada (R13).

**Custo é registrado também em erro** (R6). Uma tentativa que falhou depois de
consumir tokens de entrada custou dinheiro; ignorá-la subestima o custo por
resultado (KPI-06).

**O relógio entra por parâmetro.** `Gateway` recebe `now()` do chamador, para que
os testes de orçamento diário e os graders de eval sejam determinísticos
(ADR-0001, P-03).

## Riscos e mitigação

| Risco | Como percebemos | Mitigação |
| --- | --- | --- |
| Regex de PII com falso negativo em formato regional | Caso de EV-01 com telefone sem DDD | Bateria de formatos brasileiros nos testes; toda falha vira caso novo |
| Marcador aparecer no texto original do usuário | Saída com marcador não emitido | `inspectOutput` só restaura marcadores emitidos naquela chamada |
| Política ordenar por custo e degradar qualidade | Pass rate de EV-01 caindo sem mudança de código | Política declara qualidade mínima por caso de uso; eval mede |
| Livro-razão em memória perder lançamentos | Painel de custo divergindo do provedor | Port permite adapter persistente; conciliação com billing em F-06.1 |
