/**
 * Exemplo 10 — Round-trip: extrair DPS de um XML, reemitir e comparar
 *
 * Pega um XML (NFS-e completa ou DPS avulso), extrai os dados do `<infDPS>`
 * para uma estrutura `DpsData`, valida com o Zod/regras de negócio, reemite
 * o XML via `buildDpsXml` (exportado do pacote) e compara byte a byte
 * (após normalização) com o original. O objetivo é provar que o builder
 * reconstrói o DPS fielmente.
 *
 * Uso:
 *   bun run example 10 <caminho-do-xml>
 *   bun examples/10-extrair-emitir-comparar.ts <caminho-do-xml>
 *
 * O caminho é obrigatório — não há default versionado porque XMLs reais de
 * NFS-e contêm dados sensíveis. Para iteração rápida contra um XML fixo,
 * crie `examples/10-extrair-emitir-comparar.local.ts` (arquivos `.local.ts`
 * são ignorados pelo git).
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve, basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser } from 'fast-xml-parser'
import {
  buildDpsXml,
  validateDps,
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  TipoRetencaoPisCofins,
  TipoImunidade,
  TipoSuspensao,
  MotivoEmissaoTomadorIntermediario,
  IndicadorTotalTributos,
  type DpsData,
} from 'nfse-nacional'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parser XML reutilizado por `parseDpsXmlToDpsData` — declarado antes da
// execução top-level para evitar TDZ.
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: true,
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
})

const xmlPath = process.argv[2]
if (!xmlPath) {
  console.error('Uso: bun examples/10-extrair-emitir-comparar.ts <caminho-do-xml>')
  console.error('  Ex: bun examples/10-extrair-emitir-comparar.ts ./meu-teste.xml')
  console.error()
  console.error('Para um XML fixo de referência local, crie examples/10-extrair-emitir-comparar.local.ts')
  console.error('(arquivos *.local.ts são ignorados pelo git).')
  process.exit(1)
}

const fullPath = resolve(xmlPath)
console.log(`📄 Lendo: ${basename(fullPath)}\n`)
const originalXml = readFileSync(fullPath, 'utf-8')

// ---------------------------------------------------------------------------
// 1. Extrai o bloco <DPS>…</DPS> do XML
// ---------------------------------------------------------------------------

const dpsXml = extractDpsXml(originalXml)
if (!dpsXml) {
  console.error('❌ Não foi possível localizar o bloco <DPS> no XML informado.')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// 2. Converte o XML de DPS em DpsData (via fast-xml-parser)
// ---------------------------------------------------------------------------

const dps = parseDpsXmlToDpsData(dpsXml)

console.log('✅ DPS extraído:')
console.log('  id             :', dps.infDps.id)
console.log('  nDPS           :', dps.infDps.numeroDps, '/ série', dps.infDps.serie ?? '-')
console.log('  prestador CNPJ :', dps.infDps.prestador.cnpj ?? '-')
console.log('  tomador        :', dps.infDps.tomador?.nome ?? '-')
console.log('  serviço        :', dps.infDps.servico.codigoServico.cServTribNac,
                                  '—', dps.infDps.servico.xDescServ)
console.log('  vServico       : R$', dps.infDps.valores.vServico.toFixed(2))
console.log()

// ---------------------------------------------------------------------------
// 3. Valida (Zod + regras de negócio)
// ---------------------------------------------------------------------------

const validation = validateDps(dps)
if (!validation.isValid) {
  console.error('❌ DPS inválido:')
  validation.errors.forEach(e => console.error('  •', e))
  process.exit(1)
}
console.log('✅ DpsData válido pelo validador.\n')

// ---------------------------------------------------------------------------
// 4. Reemite o XML usando o builder exportado do pacote
// ---------------------------------------------------------------------------

const rebuiltXml = buildDpsXml(dps)

// ---------------------------------------------------------------------------
// 5. Compara original vs reemitido (após normalização)
// ---------------------------------------------------------------------------

const normOriginal = normalizeXml(dpsXml)
const normRebuilt  = normalizeXml(rebuiltXml)
const prettyOriginal = prettyPrintXml(normOriginal)
const prettyRebuilt  = prettyPrintXml(normRebuilt)
const equal = normOriginal === normRebuilt

// ---------------------------------------------------------------------------
// 6. Grava relatório em arquivo para análise
// ---------------------------------------------------------------------------

const xmlBaseName = basename(fullPath, '.xml')
const reportPath = join(__dirname, `compare-${xmlBaseName}.report.md`)
const diff = equal ? null : firstDiff(normOriginal, normRebuilt)

const report = [
  `# Comparação DPS round-trip`,
  ``,
  `- **Arquivo de origem:** ${basename(fullPath)}`,
  `- **Resultado:** ${equal ? '✅ XMLs idênticos após normalização' : '⚠️ XMLs divergem'}`,
  `- **Tamanho normalizado (original):** ${normOriginal.length} bytes`,
  `- **Tamanho normalizado (reemitido):** ${normRebuilt.length} bytes`,
  ``,
  `## Validação (validateDps)`,
  ``,
  validation.errors.length === 0
    ? `- ✅ Sem erros`
    : `- ❌ ${validation.errors.length} erros`,
  ...validation.errors.map(e => `  - ${e}`),
  ``,
  `## DpsData extraído`,
  ``,
  '```json',
  JSON.stringify(dps, null, 2),
  '```',
  ``,
  `## XML original (normalizado e indentado)`,
  ``,
  '```xml',
  prettyOriginal,
  '```',
  ``,
  `## XML reemitido (normalizado e indentado)`,
  ``,
  '```xml',
  prettyRebuilt,
  '```',
  ``,
  ...(diff ? [
    `## Primeira divergência`,
    ``,
    `- **Posição:** ${diff.position}`,
    ``,
    '```diff',
    `- ${JSON.stringify(diff.original)}`,
    `+ ${JSON.stringify(diff.rebuilt)}`,
    '```',
    ``,
  ] : []),
].join('\n')

writeFileSync(reportPath, report, 'utf-8')
console.log('📝 Relatório gerado:', reportPath)

if (equal) {
  console.log('🎉 XML reemitido é idêntico ao original (após normalização).')
  console.log(`   ${normOriginal.length} bytes normalizados`)
} else {
  console.log('⚠️  XMLs diferem após normalização. Primeira divergência:')
  console.log(`   posição ${diff!.position}:`)
  console.log('   original :', JSON.stringify(diff!.original.slice(0, 120)))
  console.log('   reemitido:', JSON.stringify(diff!.rebuilt.slice(0, 120)))
  process.exit(2)
}

// ===========================================================================
// Helpers
// ===========================================================================

/** Extrai o primeiro `<DPS …>…</DPS>` do XML (NFS-e completa ou DPS avulso). */
function extractDpsXml(xml: string): string | undefined {
  const m = xml.match(/<DPS[\s>][\s\S]*?<\/DPS>/)
  return m?.[0]
}

/** Normaliza um XML para comparação estrutural. */
function normalizeXml(xml: string): string {
  return xml
    .replace(/\r\n/g, '\n')                       // line endings uniformes
    .replace(/\r/g, '\n')
    .replace(/<\?xml[^?]*\?>/g, '')               // remove declaração
    .replace(/\sxmlns="[^"]*"/g, '')              // remove namespace default
    .replace(/>\s+</g, '><')                      // remove whitespace entre tags
    .replace(/<([a-zA-Z0-9:]+)([^>]*)\/>/g,       // normaliza tags self-closing
             '<$1$2></$1>')
    .trim()
}

/** Retorna a primeira posição de divergência entre dois strings com contexto. */
function firstDiff(a: string, b: string): { position: number; original: string; rebuilt: string } {
  const len = Math.min(a.length, b.length)
  let i = 0
  while (i < len && a[i] === b[i]) i++
  const start = Math.max(0, i - 40)
  return {
    position: i,
    original: a.slice(start, Math.min(a.length, i + 200)),
    rebuilt:  b.slice(start, Math.min(b.length, i + 200)),
  }
}

/**
 * Indenta um XML sem whitespace para facilitar a leitura no relatório.
 * Funciona na forma normalizada (sem quebras entre tags).
 */
function prettyPrintXml(xml: string): string {
  const out: string[] = []
  let depth = 0
  const pad = () => '  '.repeat(depth)
  // Quebra o XML em tokens: tags e texto
  const tokens = xml.split(/(<[^>]+>)/).filter(t => t.length > 0)
  for (const tok of tokens) {
    if (tok.startsWith('</')) {
      depth = Math.max(0, depth - 1)
      out.push(pad() + tok)
    } else if (tok.startsWith('<') && !tok.endsWith('/>') && !tok.startsWith('<?') && !tok.startsWith('<!')) {
      // Verifica se é tag vazia (ex: <foo></foo>) — mantém na mesma linha
      out.push(pad() + tok)
      depth++
    } else if (tok.startsWith('<')) {
      out.push(pad() + tok)
    } else {
      // Texto — anexa à última linha se for conteúdo de tag aberta
      if (out.length > 0) out[out.length - 1] += tok
    }
  }
  // Pós-processamento: se uma tag de abertura for seguida direto do fechamento, une as linhas
  const joined: string[] = []
  for (let i = 0; i < out.length; i++) {
    const line = out[i] ?? ''
    const next = out[i + 1] ?? ''
    const openMatch = line.match(/^(\s*)<([a-zA-Z0-9:]+)(?:\s[^>]*)?>(.*)$/)
    const closeMatch = next.match(/^\s*<\/([a-zA-Z0-9:]+)>\s*$/)
    if (openMatch && closeMatch && openMatch[2] === closeMatch[1]) {
      joined.push(line + next.trim())
      i++
    } else {
      joined.push(line)
    }
  }
  return joined.join('\n')
}

// ---------------------------------------------------------------------------
// Parser XML → DpsData
// ---------------------------------------------------------------------------

function rec(v: unknown): Record<string, unknown> | undefined {
  return v && typeof v === 'object' ? v as Record<string, unknown> : undefined
}

function str(v: unknown): string | undefined {
  return v != null && v !== '' ? String(v) : undefined
}

function numOpt(v: unknown): number | undefined {
  if (v == null || v === '') return undefined
  const n = Number(v)
  return Number.isNaN(n) ? undefined : n
}

function parseDpsXmlToDpsData(xml: string): DpsData {
  const parsed  = xmlParser.parse(xml)
  const dpsRoot = rec(parsed['DPS'])
  const infDps  = rec(dpsRoot?.['infDPS'])
  if (!infDps) throw new Error('XML não contém <DPS><infDPS>.')

  const prest  = rec(infDps['prest'])
  const toma   = rec(infDps['toma'])
  const interm = rec(infDps['interm'])
  const serv   = rec(infDps['serv'])
  const valRaw = rec(infDps['valores'])

  return {
    versao: str(dpsRoot?.['@_versao']),
    infDps: {
      id:               String(infDps['@_Id'] ?? ''),
      tipoAmbiente:     Number(infDps['tpAmb']) as TipoAmbiente,
      dataEmissao:      String(infDps['dhEmi'] ?? ''),
      versaoAplicativo: str(infDps['verAplic']),
      serie:            str(infDps['serie']),
      numeroDps:        String(infDps['nDPS'] ?? ''),
      dataCompetencia:  String(infDps['dCompet'] ?? ''),
      tipoEmitente:     Number(infDps['tpEmit']) as EmitenteDPS,
      codigoLocalEmissao: String(infDps['cLocEmi'] ?? ''),
      motivoEmissao:    numOpt(infDps['cMotivoEmisTI']) as MotivoEmissaoTomadorIntermediario | undefined,
      chaveNfseRejeitada: str(infDps['chNFSeRej']),

      prestador: parsePrestador(prest),
      tomador:   toma ? parseTomador(toma) : undefined,
      intermediario: interm ? parseIntermediario(interm) : undefined,
      servico:   parseServico(serv),
      valores:   parseValores(valRaw),
      tributacao: parseTributacao(valRaw),
      ibsCbs:    parseIbsCbs(rec(infDps['IBSCBS'])),
    },
  }
}

function parseEndereco(end: Record<string, unknown> | undefined) {
  if (!end) return undefined
  const endNac = rec(end['endNac'])
  return {
    cMun:    String(endNac?.['cMun'] ?? end['cMun'] ?? ''),
    cep:     str(endNac?.['CEP'] ?? end['CEP']),
    xLgr:    str(end['xLgr']),
    nro:     str(end['nro']),
    xCpl:    str(end['xCpl']),
    xBairro: str(end['xBairro']),
  }
}

function parsePrestador(prest: Record<string, unknown> | undefined): DpsData['infDps']['prestador'] {
  if (!prest) throw new Error('DPS sem <prest>.')
  const regTrib = rec(prest['regTrib'])
  return {
    cnpj:         str(prest['CNPJ']),
    cpf:          str(prest['CPF']),
    nif:          str(prest['NIF']),
    codigoNaoNif: str(prest['cNaoNIF']),
    caepf:        str(prest['CAEPF']),
    inscricaoMunicipal: str(prest['IM']),
    nome:         str(prest['xNome']),
    endereco:     parseEndereco(rec(prest['end'])),
    telefone:     str(prest['fone']),
    email:        str(prest['email']),
    regimeTributario: regTrib ? {
      opSimpNac:  Number(regTrib['opSimpNac'] ?? 1),
      regApurSN:  numOpt(regTrib['regApTribSN']),
      regEspTrib: Number(regTrib['regEspTrib'] ?? 0),
    } : undefined,
  } as DpsData['infDps']['prestador']
}

function parseTomador(toma: Record<string, unknown>): DpsData['infDps']['tomador'] {
  return {
    cnpj:         str(toma['CNPJ']),
    cpf:          str(toma['CPF']),
    nif:          str(toma['NIF']),
    codigoNaoNif: str(toma['cNaoNIF']),
    inscricaoMunicipal: str(toma['IM']),
    nome:         String(toma['xNome'] ?? ''),
    endereco:     parseEndereco(rec(toma['end'])),
    telefone:     str(toma['fone']),
    email:        str(toma['email']),
  }
}

function parseIntermediario(interm: Record<string, unknown>): DpsData['infDps']['intermediario'] {
  return {
    cnpj:         str(interm['CNPJ']),
    cpf:          str(interm['CPF']),
    inscricaoMunicipal: str(interm['IM']),
    nome:         String(interm['xNome'] ?? ''),
  }
}

function parseServico(serv: Record<string, unknown> | undefined): DpsData['infDps']['servico'] {
  if (!serv) throw new Error('DPS sem <serv>.')
  const locPrest  = rec(serv['locPrest']) ?? {}
  const cServ     = rec(serv['cServ']) ?? {}
  const obra      = rec(serv['obra'])
  const infoCompl = rec(serv['infoCompl'])
  return {
    localPrestacao: {
      cLocPrestacao:  String(locPrest['cLocPrestacao'] ?? ''),
      cPaisPrestacao: str(locPrest['cPaisPrestacao']),
    },
    codigoServico: {
      cServTribNac: String(cServ['cTribNac'] ?? ''),
      cServMun:     str(cServ['cTribMun']),
      cNBSPrinc:    str(cServ['cNBS']),
      cIntContrib:  str(cServ['cIntContrib']),
    },
    xDescServ: String(cServ['xDescServ'] ?? ''),
    obra: obra ? {
      inscImobFisc: str(obra['inscImobFisc']),
      cObra:        str(obra['cObra']),
    } : undefined,
    informacaoComplemento: infoCompl ? {
      idDocTec: str(infoCompl['idDocTec']),
      docRef:   str(infoCompl['docRef']),
      xPed:     str(infoCompl['xPed']),
      xInfComp: str(infoCompl['xInfComp']),
    } : undefined,
  }
}

function parseValores(valRaw: Record<string, unknown> | undefined): DpsData['infDps']['valores'] {
  const vServPrest  = rec(valRaw?.['vServPrest']) ?? {}
  const descCondInc = rec(valRaw?.['vDescCondIncond'])
  return {
    vServico:            Number(vServPrest['vServ'] ?? 0),
    vReceb:              numOpt(vServPrest['vReceb']),
    vDescIncondicionado: numOpt(descCondInc?.['vDescIncond']),
    vDescCondicionado:   numOpt(descCondInc?.['vDescCond']),
  }
}

function parseTributacao(valRaw: Record<string, unknown> | undefined): DpsData['infDps']['tributacao'] {
  const trib    = rec(valRaw?.['trib'])
  if (!trib) return undefined
  const tribMun = rec(trib['tribMun'])
  const tribFed = rec(trib['tribFed'])
  const piscof  = tribFed ? rec(tribFed['piscofins']) : undefined
  const exig    = tribMun ? rec(tribMun['exigSusp']) : undefined
  const totTrib = rec(trib['totTrib'])
  const pTot    = totTrib ? rec(totTrib['pTotTrib']) : undefined
  const vTot    = totTrib ? rec(totTrib['vTotTrib']) : undefined

  const result: NonNullable<DpsData['infDps']['tributacao']> = {}

  if (tribMun) {
    result.issqn = {
      tributacaoIssqn: numOpt(tribMun['tribISSQN']) as TributacaoIssqn | undefined,
      tipoImunidade:   numOpt(tribMun['tpImunidade']) as TipoImunidade | undefined,
      tipoSuspensao:   numOpt(exig?.['tpSusp']) as TipoSuspensao | undefined,
      numeroProcessoSuspensao: str(exig?.['nProcesso']),
      tipoRetencaoIssqn: numOpt(tribMun['tpRetISSQN']) as TipoRetencaoIssqn | undefined,
      aliquota: tribMun['pAliq'] != null ? Number(tribMun['pAliq']) / 100 : undefined,
    }
  }

  if (tribFed) {
    result.federal = {
      cstPisCofins:         str(piscof?.['CST']),
      baseCalculoPisCofins: numOpt(piscof?.['vBCPisCofins']),
      aliquotaPis:          piscof?.['pAliqPis']    != null ? Number(piscof['pAliqPis'])    / 100 : undefined,
      aliquotaCofins:       piscof?.['pAliqCofins'] != null ? Number(piscof['pAliqCofins']) / 100 : undefined,
      valorPis:             numOpt(piscof?.['vPis']),
      valorCofins:          numOpt(piscof?.['vCofins']),
      tipoRetencaoPisCofins: numOpt(piscof?.['tpRetPisCofins']) as TipoRetencaoPisCofins | undefined,
      valorRetidoIrrf:      numOpt(tribFed['vRetIRRF']),
      valorRetidoCsll:      numOpt(tribFed['vRetCSLL']),
    }
  }

  if (pTot) {
    result.percentualTotalTributosFederais   = Number(pTot['pTotTribFed']  ?? 0)
    result.percentualTotalTributosEstaduais  = Number(pTot['pTotTribEst']  ?? 0)
    result.percentualTotalTributosMunicipais = Number(pTot['pTotTribMun']  ?? 0)
  } else if (vTot) {
    result.valorTotalTributosFederais   = numOpt(vTot['vTotTribFed'])
    result.valorTotalTributosEstaduais  = numOpt(vTot['vTotTribEst'])
    result.valorTotalTributosMunicipais = numOpt(vTot['vTotTribMun'])
  } else if (totTrib?.['pTotTribSN'] != null) {
    result.percentualTotalTributosSN = Number(totTrib['pTotTribSN'])
  } else if (totTrib?.['indTotTrib'] != null) {
    result.indicadorTotalTributos = Number(totTrib['indTotTrib']) as IndicadorTotalTributos
  }

  return result
}

function parseIbsCbs(ibs: Record<string, unknown> | undefined): DpsData['infDps']['ibsCbs'] {
  if (!ibs) return undefined
  const valores = rec(ibs['valores'])
  const tribInner = valores ? rec(valores['trib']) : undefined
  const gi = tribInner ? rec(tribInner['gIBSCBS']) : undefined
  if (!gi) return undefined
  return {
    finNFSe:  String(ibs['finNFSe'] ?? '0') as '0',
    indFinal: str(ibs['indFinal']) as '0' | '1' | undefined,
    cIndOp:   String(ibs['cIndOp'] ?? ''),
    tpOper:   str(ibs['tpOper']) as '1' | '2' | '3' | '4' | '5' | undefined,
    indDest:  String(ibs['indDest'] ?? '0') as '0' | '1',
    valores: {
      trib: {
        gIBSCBS: {
          CST:        String(gi['CST'] ?? ''),
          cClassTrib: String(gi['cClassTrib'] ?? ''),
          cCredPres:  str(gi['cCredPres']),
        },
      },
    },
  }
}
