/**
 * Exemplo 3 — Geração de DANF-Se em PDF
 *
 * Recebe o XML da NFS-e (retornado pela API SEFIN após emissão aprovada)
 * e gera o PDF da DANF-Se.
 *
 * O arquivo `nfse-exemplo.xml` nesta pasta simula a resposta real da API
 * e pode ser substituído por um XML obtido em homologação/produção.
 *
 * Requer puppeteer instalado:
 *   bun add puppeteer
 *
 * Uso:
 *   bun run examples/3-danfe.ts
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DanfeService, parseNfseXml } from 'nfse-nacional'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Opção A: gerar PDF a partir do XML de exemplo (ou substitua por nfse.xml real)
// ---------------------------------------------------------------------------

const xmlNfse = readFileSync(join(__dirname, 'nfse-exemplo.xml'), 'utf-8')

const danfe = new DanfeService()
const result = await danfe.generateFromXml(xmlNfse)

writeFileSync(join(__dirname, 'danfe.pdf'), result.pdfBytes)
console.log('✅ DANF-Se gerada:', './danfe.pdf')

if (result.warnings.length > 0) {
  console.warn('⚠️  Avisos:')
  result.warnings.forEach(w => console.warn('  •', w.field, '—', w.message))
}

// ---------------------------------------------------------------------------
// Opção B: gerar PDF a partir do GZip+Base64 retornado pela API
// (descomente para usar)
// ---------------------------------------------------------------------------

// const nfseGzipB64 = '<string retornada pela API SEFIN>'
// const result2 = await danfe.generateFromGzipB64(nfseGzipB64)
// writeFileSync('./danfe.pdf', result2.pdfBytes)

// ---------------------------------------------------------------------------
// Bônus: inspecionar campos da NFS-e sem gerar o PDF
// ---------------------------------------------------------------------------

const nfse = parseNfseXml(xmlNfse)
console.log('\n📄 Dados da NFS-e:')
console.log('  Número     :', nfse.infNFSe?.nNFSe)
console.log('  Chave      :', nfse.infNFSe?.chNFSe)
console.log('  Emitente   :', nfse.infNFSe?.emit?.xNome)
console.log('  Valor      :', nfse.infNFSe?.serv?.vServ)
console.log('  Emitido em :', nfse.infNFSe?.dhProc)
