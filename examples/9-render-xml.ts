/**
 * Exemplo 9 — Render de XML sob demanda
 *
 * Recebe um caminho para um arquivo XML e renderiza a DANF-Se em HTML,
 * abrindo automaticamente no browser para inspeção visual.
 *
 * Suporta dois tipos de XML:
 *   - NFS-e completa (<NFSe>): renderiza normalmente
 *   - DPS avulso (<DPS>): renderiza como prévia com marca d'água
 *
 * Uso:
 *   bun run example 9 caminho/para/arquivo.xml
 *   bun examples/9-render-xml.ts caminho/para/arquivo.xml
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseNfseXml, renderDanfseHtml } from 'nfse-nacional'

const __dirname = dirname(fileURLToPath(import.meta.url))

const xmlPath = process.argv[2]

if (!xmlPath) {
  console.error('Uso: bun examples/9-render-xml.ts <caminho-do-xml>')
  console.error('  Ex: bun examples/9-render-xml.ts debug/2026-04-09T20-30-48-446Z_dps.xml')
  console.error('  Ex: bun examples/9-render-xml.ts examples/nfse-exemplo.xml')
  process.exit(1)
}

const fullPath = resolve(xmlPath)
const xml = readFileSync(fullPath, 'utf-8')

const isDps = xml.includes('<DPS') && !xml.includes('<NFSe') && !xml.includes('<infNFSe')

let html: string
let warnings: { code: string; message: string; field?: string }[] = []

if (isDps) {
  console.log('Detectado XML de DPS — renderizando como prévia...\n')
  const schema = parseNfseXml(wrapDpsAsNfse(xml))
  const result = await renderDanfseHtml(schema, false, { isPreview: true })
  html = result.html
  warnings = result.warnings
} else {
  console.log('Detectado XML de NFS-e — renderizando DANF-Se...\n')
  const schema = parseNfseXml(xml)
  const result = await renderDanfseHtml(schema)
  html = result.html
  warnings = result.warnings
}

const xmlBaseName = basename(fullPath, '.xml')
const outPath = join(__dirname, `render-${xmlBaseName}.html`)
writeFileSync(outPath, html, 'utf-8')
console.log('HTML gerado:', outPath)

if (warnings.length > 0) {
  console.warn('\nAvisos do renderer:')
  warnings.forEach(w => console.warn('  -', w.field, '—', w.message))
}

// Tenta abrir no browser
try {
  Bun.spawn(process.platform === 'win32' ? ['cmd', '/c', 'start', '', outPath] : ['xdg-open', outPath])
} catch {
  console.log('Abra manualmente no browser:', outPath)
}

/**
 * Envolve um XML de DPS numa estrutura <NFSe> mínima para que o parser/renderer consiga processar.
 */
function wrapDpsAsNfse(dpsXml: string): string {
  const body = dpsXml.replace(/<\?xml[^?]*\?>/, '').trim()
  return `<?xml version="1.0" encoding="UTF-8"?>
<NFSe xmlns="http://www.sped.fazenda.gov.br/nfse" versao="1.00">
  <infNFSe>
    <cStat>000</cStat>
    <xMotivo>PRÉVIA — documento sem valor fiscal</xMotivo>
    <chNFSe></chNFSe>
    <nNFSe>PRÉVIA</nNFSe>
    <dhProc>${new Date().toISOString()}</dhProc>
    <xLocEmi></xLocEmi>
    <xLocPrestacao></xLocPrestacao>
    <cLocIncid></cLocIncid>
    <xLocIncid></xLocIncid>
    <xTribNac></xTribNac>
    <xTribMun></xTribMun>
    <xNBS></xNBS>
    <verAplic>1.01</verAplic>
    <ambGer>2</ambGer>
    <tpEmis>1</tpEmis>
    <procEmi>1</procEmi>
    ${body}
  </infNFSe>
</NFSe>`
}
