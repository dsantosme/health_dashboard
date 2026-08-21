/**
 * Junta o build em um unico arquivo HTML.
 *
 * Serve para abrir o app direto de um .html (celular, pendrive, anexo de
 * e-mail) e para publicar como pagina unica. As imagens ja saem em data URI
 * porque o build com SINGLE=1 usa assetsInlineLimit alto.
 *
 *   npm run build:unico            -> dist-single/ciclo-coach.html (pagina completa)
 *   npm run build:unico -- --frag  -> tambem gera o fragmento sem <html>/<head>
 */
import { readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'dist-single'
const html = readFileSync(join(dir, 'index.html'), 'utf8')
const assets = readdirSync(join(dir, 'assets'))

const js = assets.find((f) => f.endsWith('.js'))
const css = assets.find((f) => f.endsWith('.css'))
if (!js) throw new Error('bundle JS nao encontrado — rode com SINGLE=1')

// "</script" dentro do bundle encerraria a tag antes da hora
const codigo = readFileSync(join(dir, 'assets', js), 'utf8').replaceAll('</script', '<\\/script')
const estilo = css ? readFileSync(join(dir, 'assets', css), 'utf8') : ''

const titulo = (html.match(/<title>([^<]*)<\/title>/) || [, 'Ciclo Coach'])[1]

const fragmento = `<title>${titulo}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<style>${estilo}</style>
<div id="root"></div>
<script type="module">${codigo}</script>
`

writeFileSync(join(dir, 'ciclo-coach.fragmento.html'), fragmento)
writeFileSync(
  join(dir, 'ciclo-coach.html'),
  `<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="UTF-8" />\n${fragmento}</head>\n<body></body>\n</html>\n`,
)

// o HTML unico substitui os arquivos soltos
rmSync(join(dir, 'assets'), { recursive: true, force: true })
rmSync(join(dir, 'index.html'), { force: true })

const kb = (n) => `${(n / 1024).toFixed(0)} kB`
console.log(`ciclo-coach.html          ${kb(Buffer.byteLength(fragmento) + 120)}`)
console.log(`ciclo-coach.fragmento.html ${kb(Buffer.byteLength(fragmento))}`)
