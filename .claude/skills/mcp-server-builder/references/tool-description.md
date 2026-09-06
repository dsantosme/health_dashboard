# Anatomia de uma descrição de ferramenta (SK-02)

O agente escolhe a ferramenta lendo isto. Escreva para quem não conhece o
sistema do cliente.

## Modelo

```
<verbo><objeto>: <o que faz, em uma linha>.

Use quando: <a situação concreta que pede esta ferramenta>.
Não use quando: <a confusão provável, com o nome da ferramenta certa>.
Devolve: <formato e limite>. <o que acontece se não encontrar>.
```

## Exemplo bom

```
buscar_pedido_por_nota: encontra um pedido pelo número da nota fiscal.

Use quando: o cliente citar número de nota, DANFE ou chave de acesso.
Não use quando: o cliente citar o número do pedido — use buscar_pedido_por_id,
que é mais barata e não faz varredura.
Devolve: um pedido com status, itens e datas. Se a nota não existir, devolve erro
com a sugestão de confirmar a chave de 44 dígitos.
```

## Exemplo ruim, e por quê

```
get_order: retorna pedido.
```

Não diz por qual chave busca, então o agente tenta com o identificador errado.
Não diz o que acontece quando não encontra, então o agente inventa. Não diz o
limite, então uma listagem estoura o contexto.

## Checklist antes de publicar a ferramenta

- [ ] O nome descreve o trabalho, não o endpoint.
- [ ] "Use quando" cita uma situação, não uma categoria.
- [ ] "Não use quando" aponta a ferramenta alternativa pelo nome.
- [ ] O limite de resultados está escrito.
- [ ] A mensagem de erro diz o próximo passo.
- [ ] Nenhum argumento carrega credencial.
- [ ] A ferramenta de escrita está separada da de leitura, com escopo próprio.
