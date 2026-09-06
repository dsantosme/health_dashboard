# MCP servers (MOD-00)

Conectores para sistemas de cliente. Vazio até o primeiro pod: conector sem
cliente é conector adivinhado.

Para construir um, use a skill **SK-02** (`.claude/skills/mcp-server-builder/`).
O que ela cobra, e que costuma faltar:

- Ferramenta modelada pelo trabalho, não pelo endpoint.
- Descrição com "use quando" e "não use quando" — o agente escolhe lendo isso.
- Leitura e escrita em escopos separados (HR-03).
- Erro que diz o próximo passo.
- Nenhuma credencial em argumento de ferramenta (ST-04).
