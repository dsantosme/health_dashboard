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
