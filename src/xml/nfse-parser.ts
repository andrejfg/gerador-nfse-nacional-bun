/**
 * Parser do XML da NFS-e
 * Migrado de nfse-php/src/Xml/NfseXmlParser.php
 * e direction-nfse-danfe/src/Danfe/Schemas/NFSeSchema.cs
 *
 * Diferenças importantes entre emit e toma:
 *  - emit.enderNac  → todos os campos (xLgr, nro, xBairro, cMun, UF, CEP) direto no <enderNac>
 *  - toma/interm.end → xLgr/nro/xCpl/xBairro direto em <end>; cMun/CEP aninhados em <end><endNac>
 */

import { XMLParser } from 'fast-xml-parser'

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: true,
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
})

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

export function parseNfseXml(xml: string): NfseSchema {
  const sanitized = xml
    .replace(/^\uFEFF/, '')
    .replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD]/g, '')
    .trim()

  const parsed = xmlParser.parse(sanitized)
  const root = parsed['NFSe'] ?? parsed['nfseNacional'] ?? parsed['retornoEmissaoNFSe'] ?? parsed
  return extractNfseSchema(root)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function str(v: unknown, fallback = ''): string {
  return v != null && v !== '' ? String(v) : fallback
}

function num(v: unknown): number {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

function rec(v: unknown): Record<string, unknown> | undefined {
  return v && typeof v === 'object' ? v as Record<string, unknown> : undefined
}

// ---------------------------------------------------------------------------
// Extratores
// ---------------------------------------------------------------------------

function extractNfseSchema(root: Record<string, unknown>): NfseSchema {
  const inf = rec(root?.['infNFSe'] ?? root?.['InfNFSe']) ?? root
  return {
    versao: str(root?.['@_versao']) || undefined,
    infNFSe: inf ? {
      id:            str(inf['@_Id']) || undefined,
      cStat:         str(inf['cStat']),
      xMotivo:       str(inf['xMotivo']),
      chNFSe:        str(inf['chNFSe']),
      nNFSe:         str(inf['nNFSe']),
      nDFSe:         str(inf['nDFSe']),
      dhProc:        str(inf['dhProc']),
      xLocEmi:       str(inf['xLocEmi']),
      xLocPrestacao: str(inf['xLocPrestacao']),
      cLocIncid:     str(inf['cLocIncid']),
      xLocIncid:     str(inf['xLocIncid']),
      xTribNac:      str(inf['xTribNac']),
      xTribMun:      str(inf['xTribMun']),
      xNBS:          str(inf['xNBS']),
      verAplic:      str(inf['verAplic']),
      ambGer:        num(inf['ambGer']),
      tpEmis:        num(inf['tpEmis']),
      procEmi:       num(inf['procEmi']),
      emit:          extractEmit(rec(inf['emit'])),
      DPS:           extractDps(rec(inf['DPS'])),
      valores:       extractValoresNfse(rec(inf['valores'])),
    } : undefined,
  }
}

/**
 * Emitente da NFS-e — endereço em <enderNac> (todos os campos planos)
 */
function extractEmit(emit: Record<string, unknown> | undefined): EmitSchema | undefined {
  if (!emit) return undefined
  return {
    CNPJ:     str(emit['CNPJ']),
    CPF:      str(emit['CPF']),
    IM:       str(emit['IM']),
    xNome:    str(emit['xNome']),
    xFant:    str(emit['xFant']),
    enderNac: extractEnderecoPlano(rec(emit['enderNac'])),
    fone:     str(emit['fone']),
    email:    str(emit['email']),
    regTrib:  extractRegTrib(rec(emit['regTrib'])),
  }
}

/**
 * Tomador / intermediário — endereço em <end> com <endNac> aninhado para cMun/CEP
 */
function extractTomador(toma: Record<string, unknown> | undefined): TomadorSchema | undefined {
  if (!toma) return undefined
  const end    = rec(toma['end'])
  const endNac = end ? rec(end['endNac']) : undefined
  return {
    CNPJ:     str(toma['CNPJ']),
    CPF:      str(toma['CPF']),
    IM:       str(toma['IM']),
    xNome:    str(toma['xNome']),
    enderNac: end ? {
      xLgr:    str(end['xLgr']),
      nro:     str(end['nro']),
      xCpl:    str(end['xCpl']),
      xBairro: str(end['xBairro']),
      cMun:    str(endNac?.['cMun'] ?? end['cMun']),
      UF:      str(endNac?.['UF']   ?? end['UF']),
      CEP:     str(endNac?.['CEP']  ?? end['CEP']),
      cPais:   str(endNac?.['cPais'] ?? end['cPais'], '1058'),
    } : extractEnderecoPlano(rec(toma['enderNac'])),
    fone:  str(toma['fone']),
    email: str(toma['email']),
  }
}

/**
 * Endereço plano — todos os campos como filhos diretos do elemento (usado em <enderNac> do emit)
 */
function extractEnderecoPlano(end: Record<string, unknown> | undefined): EnderNacSchema | undefined {
  if (!end) return undefined
  return {
    xLgr:    str(end['xLgr']),
    nro:     str(end['nro']),
    xCpl:    str(end['xCpl']),
    xBairro: str(end['xBairro']),
    cMun:    str(end['cMun']),
    UF:      str(end['UF']),
    CEP:     str(end['CEP']),
    cPais:   str(end['cPais'], '1058'),
  }
}

function extractRegTrib(r: Record<string, unknown> | undefined) {
  if (!r) return undefined
  return {
    opSimpNac:  num(r['opSimpNac']),
    regApurSN:  num(r['regApurSN']),
    regEspTrib: num(r['regEspTrib']),
  }
}

function extractDps(dps: Record<string, unknown> | undefined): DpsSchema | undefined {
  if (!dps) return undefined
  const infDPS = rec(dps['infDPS']) ?? dps
  const serv   = rec(infDPS['serv'])
  const cServ  = serv ? rec(serv['cServ']) : undefined
  const locPrest = serv ? rec(serv['locPrest']) : undefined

  return {
    infDPS: {
      tpAmb:    num(infDPS['tpAmb']),
      verAplic: str(infDPS['verAplic']),
      serie:    str(infDPS['serie']),
      nDPS:     str(infDPS['nDPS']),
      dhEmi:    str(infDPS['dhEmi']),
      dCompet:  str(infDPS['dCompet']),
      tpEmit:   num(infDPS['tpEmit']),
      cLocEmi:  str(infDPS['cLocEmi']),
      prest:    extractEmit(rec(infDPS['prest'])),
      toma:     extractTomador(rec(infDPS['toma'])),
      interm:   extractTomador(rec(infDPS['interm'])),
      serv: serv ? {
        // xDescServ e cTribNac ficam dentro de <cServ>, não diretamente em <serv>
        xDescServ:    str(cServ?.['xDescServ']),
        cTribNac:     str(cServ?.['cTribNac']),
        cServMun:     str(cServ?.['cTribMun']),
        cNBS:         str(cServ?.['cNBS']),
        cIntContrib:  str(cServ?.['cIntContrib']),
        cLocPrestacao: str(locPrest?.['cLocPrestacao']),
        xInfComp:     str(serv['xInfComp']),
      } : undefined,
      valores: extractValoresDps(rec(infDPS['valores'])),
    },
  }
}

/**
 * Valores da NFS-e (infNFSe.valores) — campos calculados pela SEFIN
 * Nota: vServico não vem aqui; o renderer usa o valor do DPS quando disponível.
 */
function extractValoresNfse(val: Record<string, unknown> | undefined): ValoresNfseSchema | undefined {
  if (!val) return undefined
  return {
    vBC:                 num(val['vBC']),
    pAliqAplic:          num(val['pAliqAplic']),
    vISSQN:              num(val['vISSQN']),
    vLiq:                num(val['vLiq']),
    vServico:            num(val['vServico']),   // presente em algumas versões / fallback para DPS
    vCalcBM:             num(val['vCalcBM']),
    vCalcDR:             num(val['vCalcDR']),
    vTotalRet:           num(val['vTotalRet']),
    vDescCondicionado:   num(val['vDescCondicionado']),
    vDescIncondicionado: num(val['vDescIncondicionado']),
    IRRF:                num(val['vRetIRRF']),
    CP:                  num(val['CP']),
    CSLL:                num(val['vRetCSLL']),
    PIS:                 num(val['vPis']),
    COFINS:              num(val['vCofins']),
  }
}

/**
 * Valores do DPS (infDPS.valores) — estrutura diferente da NFS-e
 *   <vServPrest><vServ/></vServPrest>
 *   <trib><tribMun/><tribFed/><totTrib/></trib>
 */
function extractValoresDps(val: Record<string, unknown> | undefined): ValoresDpsSchema | undefined {
  if (!val) return undefined
  const vServPrest = rec(val['vServPrest'])
  const trib       = rec(val['trib'])
  const tribMun    = trib ? rec(trib['tribMun']) : undefined
  const totTrib    = trib ? rec(trib['totTrib']) : undefined
  const pTotTrib   = totTrib ? rec(totTrib['pTotTrib']) : undefined
  return {
    vServ:         num(vServPrest?.['vServ']),
    tribISSQN:     str(tribMun?.['tribISSQN']),
    tpRetISSQN:    str(tribMun?.['tpRetISSQN']),
    pTotTribFed:   num(pTotTrib?.['pTotTribFed']),
    pTotTribEst:   num(pTotTrib?.['pTotTribEst']),
    pTotTribMun:   num(pTotTrib?.['pTotTribMun']),
  }
}

// ---------------------------------------------------------------------------
// Schemas (interfaces de saída)
// ---------------------------------------------------------------------------

export interface NfseSchema {
  versao?: string
  infNFSe?: InfNFSeSchema
}

export interface InfNFSeSchema {
  id?: string
  cStat: string
  xMotivo: string
  /** Chave de acesso (44 dígitos) */
  chNFSe: string
  /** Número sequencial da NFS-e no município */
  nNFSe: string
  /** Número do DFSe no sistema nacional */
  nDFSe: string
  dhProc: string
  xLocEmi: string
  xLocPrestacao: string
  cLocIncid: string
  xLocIncid: string
  xTribNac: string
  xTribMun: string
  xNBS: string
  verAplic: string
  ambGer: number
  tpEmis: number
  procEmi: number
  emit?: EmitSchema
  DPS?: DpsSchema
  /** Valores calculados pela SEFIN (alíquota aplicada, ISSQN, base de cálculo) */
  valores?: ValoresNfseSchema
}

export interface EmitSchema {
  CNPJ: string
  CPF: string
  IM: string
  xNome: string
  xFant: string
  /** Endereço plano (todos os campos dentro de <enderNac>) */
  enderNac?: EnderNacSchema
  fone: string
  email: string
  regTrib?: { opSimpNac: number; regApurSN: number; regEspTrib: number }
}

export interface TomadorSchema {
  CNPJ: string
  CPF: string
  IM: string
  xNome: string
  /** Endereço extraído de <end>/<endNac> */
  enderNac?: EnderNacSchema
  fone: string
  email: string
}

export interface EnderNacSchema {
  xLgr: string
  nro: string
  xCpl: string
  xBairro: string
  cMun: string
  UF: string
  CEP: string
  cPais: string
}

export interface DpsSchema {
  infDPS: {
    tpAmb: number
    verAplic: string
    serie: string
    nDPS: string
    dhEmi: string
    dCompet: string
    tpEmit: number
    cLocEmi: string
    prest?: EmitSchema
    toma?: TomadorSchema
    interm?: TomadorSchema
    serv?: {
      xDescServ: string
      cTribNac: string
      cServMun: string
      cNBS: string
      cIntContrib: string
      cLocPrestacao: string
      xInfComp: string
    }
    valores?: ValoresDpsSchema
  }
}

export interface ValoresNfseSchema {
  /** Valor do serviço (presente em algumas versões de resposta; usar DPS como fallback) */
  vServico: number
  vBC: number
  pAliqAplic: number
  vISSQN: number
  vLiq: number
  vCalcBM: number
  vCalcDR: number
  vTotalRet: number
  vDescCondicionado: number
  vDescIncondicionado: number
  IRRF: number
  CP: number
  CSLL: number
  PIS: number
  COFINS: number
}

export interface ValoresDpsSchema {
  vServ: number
  tribISSQN: string
  tpRetISSQN: string
  pTotTribFed: number
  pTotTribEst: number
  pTotTribMun: number
}
