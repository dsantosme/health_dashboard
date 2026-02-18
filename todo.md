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
