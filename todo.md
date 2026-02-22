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

## Revisão de Gráficos e Dados Inconsistentes
- [x] Corrigir valores absurdos de Hemoglobina (2000→20.00, 1300→13.00, 5.20→15.20)
- [x] Faixa de referência de Hemoglobina já está correta (13-17 g/dL)
- [x] Investigar e corrigir valores de Plaquetas (15.10→151000, 14.40→144000, 308→308000)
- [x] Melhorar visualização das barras de referência (faixa azul de fundo com stackId)
- [x] Garantir que barras de referência apareçam em todos os gráficos
- [x] Corrigir cor da linha de evolução (sempre verde para continuidade)
- [ ] Adicionar mais dados históricos para Colesterol HDL se disponíveis

## Doublecheck de Todos os Dados
- [x] Verificar distribuição de dados por ano (2022: 1, 2023: 14, 2024: 16, 2025: 64, 2026: 31)
- [x] Identificar valores biologicamente impossíveis (CREATININA 31.60 e 24.70 mg/dL)
- [x] Corrigir CREATININA de 2023 e 2024 (0.32, 1.16, 0.25, 1.06 mg/dL)
- [ ] Corrigir faixas de referência de Basófilos, Eosinófilos, Linfócitos (% vs contagem absoluta)
- [ ] Adicionar faixas de referência para 10 exames sem referência

## Foco EXCLUSIVO em Dados de 2026 (Ano Vigente)
- [x] Atualizar Home para mostrar APENAS exames de 2026
  - [x] Indicador visual de que está mostrando dados de 2026
  - [x] Usar tRPC listByPatientAndPeriod com year=2026
- [x] Atualizar ExamsDetail para mostrar APENAS exames de 2026
  - [x] Indicador visual de período 2026
  - [x] Histórico completo acessível ao selecionar exame
- [x] Atualizar MedicalInsights para análise EXCLUSIVA de 2026
  - [x] Usar tRPC listByPatientAndPeriod com year=2026
  - [x] Corrigir nomes de exames para match correto
- [x] Atualizar SportsInsights para recomendações baseadas EXCLUSIVAMENTE em 2026
  - [x] Usar tRPC listByPatientAndPeriod com year=2026
  - [x] Corrigir nomes de exames para match correto
- [x] Atualizar CompleteHistory com indicador de histórico completo
  - [x] Indicador visual de que mostra 2022-2026
  - [x] Link para voltar à Home para dados de 2026
- [x] Dashboard: contar apenas exames de 2026 (normais/anormais/críticos)
- [ ] Exames sem dados de 2026: mostrar como "Pendente" com recomendação (próxima fase)
- [ ] Remover alertas críticos baseados em dados antigos (2022-2025) (próxima fase)

## Correcao de Faixas de Referencia
- [x] Identificar 26 exames com faixa minima = 0 (biologicamente incorreto)
- [x] Corrigir faixas de referencia para:
  - [x] COLESTEROL TOTAL: 150-200 mg/dL
  - [x] COLESTEROL HDL: 40-100 mg/dL
  - [x] FERRO SERICO: 30-175 mg/dL
  - [x] VITAMINA B12: 200-890 pg/mL
  - [x] Eletrolitos (K, Na, Mg, Ca, P): valores biologicamente corretos
  - [x] Enzimas hepaticas (TGP, TGO, GAMA GT): valores biologicamente corretos
  - [x] Funcao renal (CREATININA, UREIA): valores biologicamente corretos
  - [x] Hormonios (TSH, T4, FSH, LH, ESTRADIOL, TESTOSTERONA): valores biologicamente corretos

## Correcao de Valores Atuais
- [x] ExamsDetail.tsx: valor atual agora mostra o ULTIMO (mais recente) de 2026
- [x] Todos os testes passam (vitest)
- [x] TypeScript sem erros


## Histórico Completo e Filtro de Anos
- [x] Corrigir faixa de Testosterona: mínimo deve ser ~264 ng/dL (não 0.10) para homem 42 anos
- [x] Revisar todas as faixas de referência para homem de 42 anos
- [x] Implementar filtro de anos no gráfico (checkboxes: 2022, 2023, 2024, 2025, 2026)
- [x] Atualizar ExamChart para carregar histórico completo (2022-2026)
- [x] Mostrar evolução temporal com filtro de anos selecionados
- [x] Adicionar indicador visual de qual ano está selecionado no filtro

## Melhorias na Tela de Exames
- [x] Adicionar indicadores de status (Normal/Anormal/Critico) aos exames
  - [x] Calcular status baseado em referenceMin/Max vs valor atual
  - [x] Mostrar badge visual em cada exame na lista
- [x] Implementar filtros por indicadores
  - [x] Botoes de filtro (Normais, Anormais, Criticos)
  - [x] Filtrar lista de exames ao clicar
  - [x] Mostrar contador de exames por filtro
- [ ] Adicionar titulo do exame na area do grafico
  - [ ] Exibir nome do exame selecionado acima do grafico
  - [ ] Mostrar categoria e unidade de medida
- [ ] Adicionar box descritivo do exame
  - [ ] Explicacao do que e o exame
  - [ ] Importancia clinica
  - [ ] O que significam valores altos/baixos
  - [ ] Recomendacoes gerais


## Dados Antropométricos e Projeções
- [x] Verificar se banco tem dados de peso, altura, circunferência abdominal
- [x] Criar seção "Dados Antropométricos" na Home com peso, altura, IMC, circunferência
- [x] Implementar gráficos de projeção (3 em 3 meses, 2 anos futuros)
  - [x] Cenário Otimista: redução de peso/circunferência
  - [x] Cenário Manutenção: dados atuais
  - [x] Cenário Pessimista: aumento de peso/circunferência
  - Código implementado e renderizando corretamente
- [ ] Correlacionar projeções com impacto em exames relevantes
- [ ] Mostrar recomendações de saúde baseadas nas projeções

## Correção de Faixas Invertidas
- [x] Identificar faixas de referência invertidas (min > max)
- [x] Corrigir MAGNÉSIO: 1.70-2.20 mg/dL (estava 7.00-2.60)
- [x] Corrigir FÓSFORO: 2.50-4.50 mg/dL (estava invertido)
- [x] Validar que não há mais faixas invertidas no banco

## Melhorias em Gráficos de Projeção
- [x] Corrigir cálculo de tendência usando regressão linear (todos os dados históricos)
- [x] Implementar progressão real dos 3 cenários (divergem ao longo de 24 meses)
- [x] Adicionar linhas de baseline (faixa de referência) no gráfico
- [x] Melhorar visualização com ComposedChart (barras + linhas)
- [x] Adicionar interpretação dos cenários com cards descritivos
- [ ] Pesquisar health prediction frameworks para melhorar CX
- [ ] Implementar insights de health prediction na plataforma


## Melhoria de Gr\u00e1ficos de Proje\u00e7\u00e3o com Interpola\u00e7\u00e3o
- [ ] Implementar ComposedChart com barras + linhas interpoladas nos gr\u00e1ficos de proje\u00e7\u00e3o
- [ ] Adicionar dados antropom\u00e9tricos (peso, IMC, circunfer\u00eancia) nas barras de proje\u00e7\u00e3o
- [ ] Melhorar c\u00e1lculo de tend\u00eancia para detectar e tratar varia\u00e7\u00f5es pequenas (evitar linhas flat)
- [ ] Correlacionar varia\u00e7\u00f5es de peso/circunfer\u00eancia com impacto em exames
- [ ] Adicionar tooltips mostrando valores de peso/IMC/circunfer\u00eancia em cada per\u00edodo

## Correção de Escala do Eixo Y em Gráficos de Projeção
- [x] Corrigir cálculo da escala do eixo Y (filtrar valores inválidos: null, undefined, Infinity, NaN)
- [x] Adicionar padding mínimo de 5 unidades para melhor visualização
- [x] Testar com Creatinina (escala agora apropriada em vez de 999999)
- [x] Testar com Glicose Jejum (escala 67.1-101.9 mg/dL)

## Visualização de Dados Antropométricos em Gráficos
- [x] Carregar dados antropométricos do banco em vez de hardcoded
- [x] Adicionar eixo Y secundário para peso/IMC no gráfico de projeção
- [x] Mostrar barras de peso projetado para cada cenário (Otimista, Manutenção, Pessimista)
- [x] Correlacionar visualmente mudanças de peso com impacto em exames
- [x] Adicionar legenda para dados antropométricos

## Melhoria de Projeções com Tendência Estável
- [ ] Detectar quando tendência é estável (< 0.001 unidades/mês)
- [ ] Para tendências estáveis, considerar usar escala logarítmica
- [ ] Ou adicionar anotações explicativas ("Tendência estável - sem mudanças esperadas")
- [ ] Testar com múltiplos exames para validar visualização

## Versioning de Dados Antropométricos
- [ ] Criar tabela no banco para histórico de peso/IMC/circunferência
- [ ] Implementar interface para usuário atualizar dados antropométricos
- [ ] Rastrear datas de atualização
- [ ] Usar histórico para calcular correlações mais precisas
- [ ] Mostrar gráfico de evolução de peso/IMC ao longo do tempo

## Correlação entre Mudanças Antropométricas e Exames
- [x] Implementar algoritmo para calcular correlação entre peso e glicose
- [x] Implementar algoritmo para calcular correlação entre peso e colesterol
- [x] Mostrar projeções com base em mudanças de peso esperadas
- [x] Exemplo: "Se perder 5kg, glicose pode reduzir ~15 mg/dL"
- [x] Adicionar insights sobre qual exame é mais sensível a mudanças de peso


## Melhoria de Progressão de Peso em Projeções
- [x] Implementar modelo realista de perda de peso (3-5kg a cada 3 meses inicialmente)
- [x] Aplicar fator de redução gradual conforme se aproxima do IMC ideal
- [x] Implementar modelo realista de ganho de peso com fatores médicos
- [x] Basear progressões em estudos médicos conhecidos (ex: déficit calórico, metabolismo)
- [x] Calcular IMC ideal baseado em altura e idade
- [x] Ajustar velocidade de perda/ganho conforme proximidade do IMC ideal
- [x] Testar progressões com múltiplos cenários de peso


## Sistema de Correlação entre Exames
- [x] Criar modelo de correlações entre exames (colesterol, glicemia, ferro, ferritina, etc)
- [x] Implementar busca de exames correlacionados dentro de período aceitável (mesma data ou curto período)
- [x] Criar análise em linguagem natural de especialista médico
- [x] Implementar sistema de recomendação de especialistas (cardiologista, nutrólogo, endocrinologista, etc)
- [x] Construir interface com botão "Correlações" ao lado de "Projeção"
- [x] Adicionar explicações sobre status (bom/ruim/precisa melhorar)
- [x] Testar correlações com múltiplos exames
- [x] Validar recomendações de especialistas


## Motor Automático de Correlações
- [x] Criar schema de banco para armazenar correlações geradas (tabela `exam_correlations`)
- [x] Adicionar campos: id, patientId, correlationDate, examsInvolved, analysis, recommendations, specialists, createdAt
- [x] Implementar motor de processamento que agrupa exames por data (mesma semana/mês)
- [x] Criar algoritmo para detectar exames correlacionáveis (colesterol+glicose+peso, ferro+ferritina, etc)
- [x] Gerar análise em linguagem natural usando LLM com contexto médico
- [x] Implementar gatilho automático ao inserir novos exames (trigger ou procedure)
- [x] Criar tRPC procedure para listar correlações históricas por paciente
- [x] Construir interface com timeline de correlações (mais recente no topo)
- [x] Adicionar seletor de data para visualizar correlações anteriores
- [x] Testar motor com inserção de novos exames
- [x] Validar que correlações são geradas automaticamente


## Redesign Mobile-First Inspirado em Samsung Health e Sleep Cycle
- [ ] Atualizar tema dark para background #0f1419 (azul-escuro sofisticado, não preto puro)
- [ ] Configurar paleta de cores com gradientes ciano/turquesa (#00d4ff, #00b8d4)
- [ ] Atualizar sistema de design com border-radius: 24px para cards
- [ ] Configurar tipografia grande e legível para mobile
- [ ] Criar componente de card arredondado reutilizável
- [ ] Redesenhar Home com cards de dados antropométricos estilo Samsung Health
- [ ] Adicionar gráficos circulares de progresso (estilo coração colorido)
- [ ] Criar barras de progresso horizontais coloridas
- [ ] Implementar navegação bottom tab fixa (Home, Exames, Correlações, Perfil)
- [ ] Redesenhar página de exames com gráficos otimizados para mobile
- [ ] Adicionar medidores circulares para valores de exame
- [ ] Criar timeline vertical de exames com badges coloridos
- [ ] Redesenhar página de correlações com insights visuais
- [ ] Adicionar ilustrações coloridas e amigáveis
- [ ] Testar responsividade em telas pequenas (320px-428px)
- [ ] Validar navegação touch-friendly (botões grandes, espaçamento adequado)


## Segurança e LGPD - Isolamento de Dados por Usuário
- [x] Adicionar coluna `userId` na tabela `patients` vinculando ao `user.id`
- [x] Adicionar coluna `userId` na tabela `examHistory` para redundância e performance
- [x] Adicionar coluna `userId` na tabela `exam_correlations`
- [x] Criar middleware `ownershipProcedure` que valida `ctx.user.id`
- [x] Atualizar todos os procedures de `patients.*` para filtrar por `userId`
- [x] Atualizar todos os procedures de `exams.*` para filtrar por `userId`
- [x] Atualizar todos os procedures de `correlations.*` para filtrar por `userId`
- [x] Remover `patientId: 'denis-santos'` hardcoded de Home.tsx
- [x] Remover `patientId: 'denis-santos'` hardcoded de ExamsDetail.tsx
- [x] Remover `patientId: 'denis-santos'` hardcoded de todas as páginas
- [x] Criar hook `useCurrentPatient()` que retorna patient do usuário autenticado
- [x] Adicionar índices no banco: `patients(userId)`, `examHistory(userId)`, `exam_correlations(userId)`
- [ ] Testar que usuário A não consegue acessar dados do usuário B
- [ ] Adicionar logs de auditoria para acessos a dados sensíveis
- [ ] Documentar política de privacidade e retenção de dados


## Correção de Listagem de Pacientes
- [x] Investigar userId do usuário autenticado atual
- [x] Verificar userId dos dados no banco (patients, examHistory, exam_correlations)
- [x] Criar script de migração para vincular dados ao owner automaticamente
- [x] Implementar lógica de migração automática no login (detecta denissys@gmail.com)
- [x] Criar script initOwnerData que roda no startup do servidor
- [x] Owner criado automaticamente com userId=1 vinculado a denissys@gmail.com
- [ ] Testar login via Google SSO no mobile e validar que dados aparecem


## Correção de Tela de Login
- [x] Adicionar tela de boas-vindas na Home quando usuário não está autenticado
- [x] Mostrar botão de login em vez de erro "Paciente não encontrado"
- [x] Adicionar loading state durante autenticação
- [x] Separar estados: não autenticado vs autenticado sem paciente
- [x] Botão "Fazer Login com Google" implementado
- [ ] Testar fluxo completo no mobile: não autenticado → login → dados aparecem


## Processamento de Correlações e Redesign
- [x] Processar correlações automáticas do John Doe (exames de 2026)
- [x] Implementar tema dark (#0f1419) com gradientes ciano/turquesa
- [x] Atualizar paleta de cores para dark mode
- [x] Redesenhar cards antropométricos com avatar dinâmico baseado no IMC
- [x] Criar componente de avatar que muda conforme IMC (magro/normal/sobrepeso/obeso)
- [x] Agrupar dados antropométricos em card único mais compacto
- [x] Atualizar cores dos cards de status para tema dark
- [ ] Testar correlações processadas na interface
- [ ] Validar tema dark em todas as páginas


## Correções de UI - Tema Dark Completo
- [x] Corrigir botões brancos para tema dark (variant outline transparente)
- [x] Atualizar cards de navegação (Histórico Completo, Correlações) para bg-card
- [x] Agrupar indicadores de exames (31, 28, 3, 0) em grid compacto 2x2
- [x] Substituir emoji de avatar por silhueta SVG flat monocromática
- [x] Criar componente de silhueta que muda cor baseado no IMC
- [x] Componente ExamStatsCard criado para agrupar estatísticas
- [ ] Testar todas as páginas para garantir consistência do tema dark


## Redesign Completo de Exames Detalhados
- [x] Aplicar tema dark em toda a página ExamsDetail.tsx
- [x] Criar biblioteca de ícones SVG personalizados (lipídios, hormônios, glicose, etc)
- [x] Redesenhar lista de exames com cards compactos e status visual
- [x] Implementar busca inteligente e filtros visuais (Todos, Normais, Anormais, Críticos)
- [x] Reduzir tamanho dos números (valores de referência) para layout mais compacto
- [x] Criar componente CorrelationMedicalAnalysis com interpretação médica
- [x] Adicionar análise "ótica do médico" explicando se correlação está boa/preocupante
- [x] Remover emojis e usar apenas ícones SVG customizados
- [ ] Substituir gráficos de barras por visualizações mobile-friendly (spark lines, progress rings)
- [ ] Testar experiência mobile em telas pequenas


## Refatoração de Análise de Correlações
- [ ] Buscar correlações processadas reais do banco de dados (exam_correlations)
- [ ] Criar tRPC procedure para buscar correlações por patientId e date
- [ ] Buscar valores reais dos exames correlacionados do banco
- [ ] Cruzar dados dos exames (valores, faixas de referência, status)
- [ ] Gerar análise médica personalizada baseada nos valores reais
- [ ] Identificar especialista médico apropriado (cardiologista, endocrinologista, etc)
- [ ] Criar explicação "como se fosse um médico falando com paciente"
- [ ] Atualizar ExamsDetail.tsx para exibir correlações reais
- [ ] Testar com dados do John Doe (2026-02-14)


## Refatoração de Análise de Correlações
- [x] Buscar correlações processadas do banco (exam_correlations)
- [x] Criar procedure getWithMedicalAnalysis em routers.ts
- [x] Criar função getCorrelationsWithMedicalAnalysis em correlationEngine.ts
- [x] Atualizar UI para exibir análise real com dados cruzados
- [x] Criar componente CorrelationSection para exibir análises
- [x] Exibir analysis, recommendations e specialists do banco
- [x] Adicionar indicadores visuais (good/attention/urgent)
- [x] Integrar CorrelationSection em ExamsDetail.tsx
- [ ] Testar com dados reais do John Doe


## Melhoria de UX da Lista de Exames
- [x] Reduzir tamanho da fonte do nome do exame para permitir visualização completa (text-sm)
- [x] Remover truncate e permitir wrap de texto em 2 linhas (line-clamp-2)
- [x] Criar scroll interno fixo para lista de exames (max-height: 60vh)
- [x] Adicionar âncora automática (scrollIntoView) ao selecionar exame
- [x] Adicionar useRef e useEffect para scroll suave
- [ ] Testar scroll suave e comportamento em mobile


## Análise Médica em Linguagem Natural
- [ ] Criar serviço separado `medicalAnalysisService.ts` para análise com LLM
- [ ] Buscar valores reais dos exames correlacionados do banco
- [ ] Calcular índices clínicos (TG/HDL, CT/HDL, etc)
- [ ] Gerar análise em linguagem natural como especialista falando com paciente
- [ ] Incluir valores específicos, faixas de referência e interpretação contextualizada
- [ ] Explicar padrões (ex: HDL baixo + TG alto = resistência à insulina)
- [ ] Indicar nível de urgência (não urgente, atenção necessária, urgente)
- [ ] Adicionar recomendações práticas (dieta, exercícios, acompanhamento)
- [ ] Estruturar para futuro consumo via MCP
- [ ] Atualizar CorrelationSection para exibir análise detalhada
- [x] Testar com dados reais do John Doe (HDL 38, LDL 138, TG 198)


## Análise Médica em Linguagem Natural
- [x] Criar serviço separado `medicalAnalysisService.ts` para análise com LLM
- [x] Buscar valores reais dos exames correlacionados do banco
- [x] Calcular índices clínicos (TG/HDL, CT/HDL, etc)
- [x] Gerar análise em linguagem natural como especialista falando com paciente
- [x] Incluir valores específicos, faixas de referência e interpretação contextualizada
- [x] Explicar padrões (ex: HDL baixo + TG alto = resistência à insulina)
- [x] Indicar nível de urgência (não urgente, atenção necessária, urgente)
- [x] Adicionar recomendações práticas (dieta, exercícios, acompanhamento)
- [x] Estruturar para futuro consumo via MCP
- [x] Criar componente MedicalAnalysisSection para exibir análise detalhada
- [x] Integrar MedicalAnalysisSection em ExamsDetail.tsx
- [x] Criar tRPC procedure medicalAnalysis.generate
- [x] Testar com dados reais do John Doe (HDL 38, LDL 138, TG 198)


## Análise de Múltiplos Exames Correlacionados
- [x] Adicionar seleção múltipla de exames no CorrelationSection (checkboxes)
- [x] Permitir selecionar 2-3 exames relacionados para análise integrada
- [x] Atualizar MedicalAnalysisSection para aceitar array de múltiplos exames
- [x] Atualizar medicalAnalysisService para gerar análise integrada de múltiplos exames
- [x] Melhorar prompt do LLM para análise de perfil completo (ex: perfil lipídico)
- [x] Testar com perfil lipídico completo (HDL + LDL + Triglicerídeos + Colesterol Total)
- [x] Validar que análise integrada é mais rica que análise individual


## Recomendações Personalizadas na Análise Médica
- [ ] Atualizar medicalAnalysisService para gerar seção de recomendações personalizadas
- [ ] Incluir plano de ação específico (metas de peso, dieta, exercícios)
- [ ] Adicionar sugestões de receitas saudáveis baseadas nos resultados
- [ ] Incluir cronograma de acompanhamento (quando repetir exames)
- [ ] Atualizar MedicalAnalysisSection para exibir seção de recomendações
- [ ] Testar recomendações com perfil lipídico completo


## Refatoração para Arquitetura Hexagonal (Ports & Adapters)
- [x] Criar estrutura de diretórios: `server/domain/` (core), `server/ports/` (interfaces), `server/adapters/` (implementações)
- [x] Definir ports (interfaces) para serviços de domínio: `IMedicalAnalysisService`, `ILLMProvider`, `IDataRepository`
- [x] Refatorar `medicalAnalysisService.ts` para domain core (lógica de negócio pura, sem dependências externas)
- [x] Criar adapter interno: `InternalLLMAdapter` e `InternalDataAdapter` (usa invokeLLM e Drizzle ORM)
- [ ] Criar adapter MCP: `MCPLLMAdapter` e `MCPDataAdapter` (clientes MCP)
- [x] Implementar factory pattern: `MedicalAnalysisServiceFactory` (decide qual adapter usar baseado em config)
- [x] Adicionar configuração de deployment: `MEDICAL_ANALYSIS_DEPLOYMENT_MODE=internal|mcp` em `.env`
- [ ] Criar script de build para MCP: `pnpm build:mcp` (gera servidor MCP standalone)
- [x] Atualizar tRPC routers para usar factory pattern
- [x] Documentar arquitetura hexagonal e como adicionar novos adapters
- [x] Testar modo interno (chamadas diretas via tRPC)
- [ ] Testar modo MCP (servidor standalone, comunicação via stdio/HTTP)
- [ ] Criar diagrama de arquitetura hexagonal


## Preparação para Open Source
- [ ] Criar LICENSE (MIT)
- [ ] Criar README.md principal em inglês (completo, com badges, screenshots, quick start)
- [ ] Criar CONTRIBUTING.md (guia de contribuição)
- [ ] Criar CODE_OF_CONDUCT.md (código de conduta)
- [ ] Criar SECURITY.md (política de segurança)
- [ ] Criar .github/ISSUE_TEMPLATE/ (templates de issues)
- [ ] Criar .github/PULL_REQUEST_TEMPLATE.md (template de PR)
- [ ] Criar .github/workflows/ (CI/CD básico)
- [ ] Adicionar badges (build status, license, version, stability)
- [ ] Adicionar referências ao Manus (desenvolvido com IA usando Manus)
- [ ] Traduzir HEXAGONAL_ARCHITECTURE.md para inglês
- [ ] Criar usuário demo: health.demo@manus.im
- [ ] Criar dados fictícios de paciente para teste local
- [ ] Criar script de seed para popular BD local com dados demo
- [ ] Atualizar .env.example com configurações demo
- [ ] Adicionar disclaimer médico (não substituir médico, em desenvolvimento)
- [ ] Testar git clone + setup local com usuário demo


## Preparação para Open Source (CONCLUÍDO)
- [x] Criar LICENSE (MIT)
- [x] Criar README.md principal em inglês com badges e referências Manus
- [x] Criar CONTRIBUTING.md
- [x] Criar CODE_OF_CONDUCT.md
- [x] Criar SECURITY.md
- [x] Criar script de seed para dados demo: `pnpm seed:demo`
- [x] Criar usuário demo: health.demo@manus.im
- [x] Criar dados fictícios de paciente (John Doe)
- [x] Adicionar badges (License, CI, PRs Welcome, Built with Manus, Stability)
- [x] Criar templates GitHub (bug_report, feature_request, pull_request)
- [x] Criar workflow CI (.github/workflows/ci.yml)
- [x] Traduzir documentação técnica para inglês
- [x] Adicionar referências Manus em documentação
- [x] Criar CONTRIBUTORS.md
- [x] Criar ENV_SETUP.md com guia de variáveis de ambiente
- [ ] Testar setup local com usuário demo


## Substituição de Dados do Paciente Demo
- [ ] Atualizar script seed-demo.mjs com dados fictícios de John Doe
- [ ] Substituir todos os valores de exames por dados completamente fictícios
- [ ] Atualizar dados antropométricos (peso, altura, IMC, circunferência)
- [ ] Atualizar documentação (README, CHANGELOG, materiais promocionais)
- [ ] Substituir referências "John Doe" por "John Doe"
- [ ] Limpar histórico Git para remover dados reais
- [ ] Fazer force push para GitHub
- [ ] Testar seed com dados de John Doe


## Refatoração de Nomes Próprios para Nomes Genéricos
- [ ] Refatorar patientsData.ts para usar nomes genéricos (patient, exams, trends)
- [ ] Remover variáveis com nomes próprios (denisSantos, denisExams, denisTrends)
- [ ] Usar padrões como `samplePatient`, `sampleExams`, `sampleTrends`
- [ ] Refatorar completeDatabase.ts para usar nomes genéricos
- [ ] Verificar todos os arquivos .ts/.tsx para remover nomes próprios
- [ ] Manter "John Doe" apenas em seed-demo.mjs e documentação
- [ ] Limpar histórico Git para remover dados reais (Denis Santos)
- [ ] Force push para GitHub com histórico limpo
