/**
 * Carrega as ilustracoes dos materiais-fonte, quando elas existem.
 *
 * Os arquivos ficam em src/assets/livro e nao sao versionados (ver o README de
 * la). Se a pasta estiver vazia, o glob devolve {} e todo o app cai nas figuras
 * SVG geradas por codigo — nada quebra.
 */
const arquivos = import.meta.glob('../assets/livro/*.{webp,jpg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const porNome = new Map<string, string>()
for (const [caminho, url] of Object.entries(arquivos)) {
  const nome = caminho.split('/').pop()!.replace(/\.(webp|jpg|png)$/, '')
  porNome.set(nome, url)
}

export function imagem(nome: string | undefined): string | undefined {
  return nome ? porNome.get(nome) : undefined
}

export function temImagens(): boolean {
  return porNome.size > 0
}

export function quantidadeDeImagens(): number {
  return porNome.size
}
