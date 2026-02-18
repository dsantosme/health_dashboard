# Health Dashboard TODO

## Migração para Banco de Dados
- [x] Criar schema de banco de dados para pacientes
- [x] Criar schema de banco de dados para exames
- [x] Criar schema de banco de dados para histórico de exames
- [x] Migrar dados estáticos de completeDatabase.ts para banco de dados (34 registros)
- [x] Criar tRPC procedures para consultar pacientes
- [x] Criar tRPC procedures para consultar exames
- [x] Criar tRPC procedures para consultar histórico
- [ ] Atualizar interface para consumir dados do tRPC
- [ ] Remover dados estáticos de patientsData.ts
- [ ] Testar integração completa com banco de dados

## Melhorias de Interface
- [ ] Implementar gráficos de barra comparativos (referência vs resultado)
- [ ] Usar cores para indicar status (verde=normal, amarelo=anormal, vermelho=crítico)
- [ ] Mostrar faixa de referência (mínimo e máximo) como barra de fundo

## Dados Faltantes de 2026
- [x] Adicionar 31 exames de 2026 ao banco de dados (COMPLETO)
  - [x] Todos os 31 exames do PDF resultados.pdf foram inseridos
  - [x] 3 exames com status "baixo": Ferro Sérico, Cálcio, Colesterol HDL
  - [x] 28 exames com status "normal"

## Atualização Frontend para Dados de 2026
- [ ] Mapear todas as páginas com gráficos que usam dados estáticos
- [x] Atualizar Home.tsx para consumir dados de 2026 do banco via tRPC
- [x] Atualizar ExamsDetail.tsx para incluir dados de 2026 nos gráficos
- [ ] Atualizar History.tsx para mostrar dados de 2026 na linha do tempo
- [ ] Atualizar MedicalInsights.tsx para análise com dados de 2026
- [ ] Atualizar SportsInsights.tsx para recomendações baseadas em 2026
- [ ] Garantir que todos os gráficos mostrem dados de 2026 como prioridade
- [ ] Implementar melhorias visuais nos gráficos (cores, faixas de referência)
- [ ] Testar todas as páginas para validar exibição de dados de 2026

## Processamento de Dados de 2025
- [x] Processar 27 arquivos de exames de 2025 (PDFs + JPGs)
- [x] Extrair 71 exames estruturados dos arquivos
- [x] Normalizar e inserir 64 exames no banco de dados
- [x] Validar 65 tipos de exames únicos cadastrados
- [x] Verificar consistência de dados entre banco e frontend
- [x] Garantir que dados de 2025 aparecem em todas as telas (64 exames de 2025 + 31 de 2026)

## Gráficos Misto (Barras + Linhas) e Dados Dinâmicos
- [x] Corrigir erros TypeScript em CompleteHistory.tsx
- [x] Implementar componente de gráfico misto (barras + linhas)
  - [x] Barra única mostrando faixa de referência (min-max)
  - [x] Valor atual do paciente sobreposto na barra
  - [x] Linha de evolução temporal conectando valores históricos
- [x] Atualizar ExamsDetail.tsx com novo formato de gráfico
- [x] Atualizar MedicalInsights.tsx para usar dados dinâmicos
- [x] Atualizar SportsInsights.tsx para usar dados dinâmicos
- [x] Remover TODOS os imports de dados estáticos (patientsData.ts, completeDatabase.ts, etc.)
- [x] Validar que nenhuma página usa dados estáticos (todas usam tRPC)

## Normalização de Nomes de Exames
- [x] Identificar todos os registros de Glicose no banco
- [x] Unificar "GLICOSE" e "GLICOSE JEJUM" → "Glicose Jejum" (4 registros)
- [x] Unificar "HEMOGLOBINA GLICADA" e "Hemoglobina Glicada (HbA1c)" → "Hemoglobina Glicada (HbA1c)" (2 registros)
- [x] Atualizar unidade e faixa de referência para Hemoglobina Glicada
- [x] Garantir que Glicose e Hemoglobina Glicada aparecem separados na interface

## Correções Identificadas pelo Usuário
- [x] Verificar se existe exame de Glicose em 2026 no banco de dados (94 mg/dL em 14/02/2026)
- [x] Glicose de 2026 já existe no banco - não precisa adicionar
- [x] Corrigir escala mínima do gráfico (agora só inclui 0 se valores forem < 10% do range)
- [x] Ajustar cálculo de domínio do eixo Y com padding inteligente
