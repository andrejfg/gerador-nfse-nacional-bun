/**
 * Parser do XML da NFS-e
 * Migrado de nfse-php/src/Xml/NfseXmlParser.php
 * e direction-nfse-danfe/src/Danfe/Schemas/NFSeSchema.cs
 */

import { XMLParser } from 'fast-xml-parser'

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: true,
  parseTagValue: true,
  parseAttributeValue: true,
  trimValues: true,
})

export function parseNfseXml(xml: string): NfseSchema {
  const sanitized = xml
    .replace(/^\uFEFF/, '')
    .replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD]/g, '')
    .trim()

  const parsed = xmlParser.parse(sanitized)
  const root = parsed['NFSe'] ?? parsed['nfseNacional'] ?? parsed['retornoEmissaoNFSe'] ?? parsed
  return extractNfseSchema(root)
}

function extractNfseSchema(root: Record<string, unknown>): NfseSchema {
  const infNFSe = (root?.['infNFSe'] ?? root?.['InfNFSe'] ?? root) as Record<string, unknown>
  return {
    versao: root?.['@_versao'] as string | undefined,
    infNFSe: infNFSe ? {
      id: infNFSe?.['@_Id'] as string | undefined,
      cStat: String(infNFSe?.['cStat'] ?? ''),
      xMotivo: String(infNFSe?.['xMotivo'] ?? ''),
      chNFSe: String(infNFSe?.['chNFSe'] ?? ''),
      nNFSe: String(infNFSe?.['nNFSe'] ?? ''),
      dhProc: String(infNFSe?.['dhProc'] ?? ''),
      xLocEmi: String(infNFSe?.['xLocEmi'] ?? ''),
      xLocPrestacao: String(infNFSe?.['xLocPrestacao'] ?? ''),
      cLocIncid: String(infNFSe?.['cLocIncid'] ?? ''),
      xTribNac: String(infNFSe?.['xTribNac'] ?? ''),
      xTribMun: String(infNFSe?.['xTribMun'] ?? ''),
      xNBS: String(infNFSe?.['xNBS'] ?? ''),
      verAplic: String(infNFSe?.['verAplic'] ?? ''),
      ambGer: Number(infNFSe?.['ambGer'] ?? 0),
      tpEmis: Number(infNFSe?.['tpEmis'] ?? 0),
      procEmi: Number(infNFSe?.['procEmi'] ?? 0),
      emit: extractEmit(infNFSe?.['emit'] as Record<string, unknown>),
      DPS: extractDps(infNFSe?.['DPS'] as Record<string, unknown>),
      valores: extractValores(infNFSe?.['valores'] as Record<string, unknown>),
    } : undefined,
  }
}

function extractEmit(emit: Record<string, unknown> | undefined): EmitSchema | undefined {
  if (!emit) return undefined
  return {
    CNPJ: String(emit?.['CNPJ'] ?? ''),
    CPF: String(emit?.['CPF'] ?? ''),
    IM: String(emit?.['IM'] ?? ''),
    xNome: String(emit?.['xNome'] ?? ''),
    xFant: String(emit?.['xFant'] ?? ''),
    enderNac: extractEndereco(emit?.['enderNac'] as Record<string, unknown>),
    fone: String(emit?.['fone'] ?? ''),
    email: String(emit?.['email'] ?? ''),
    regTrib: emit?.['regTrib'] ? {
      opSimpNac: Number((emit['regTrib'] as Record<string, unknown>)?.['opSimpNac'] ?? 0),
      regApurSN: Number((emit['regTrib'] as Record<string, unknown>)?.['regApurSN'] ?? 0),
      regEspTrib: Number((emit['regTrib'] as Record<string, unknown>)?.['regEspTrib'] ?? 0),
    } : undefined,
  }
}

function extractEndereco(end: Record<string, unknown> | undefined): EnderNacSchema | undefined {
  if (!end) return undefined
  return {
    xLgr: String(end?.['xLgr'] ?? ''),
    nro: String(end?.['nro'] ?? ''),
    xCpl: String(end?.['xCpl'] ?? ''),
    xBairro: String(end?.['xBairro'] ?? ''),
    cMun: String(end?.['cMun'] ?? ''),
    UF: String(end?.['UF'] ?? ''),
    CEP: String(end?.['CEP'] ?? ''),
    cPais: String(end?.['cPais'] ?? '1058'),
  }
}

function extractTomador(toma: Record<string, unknown> | undefined): TomadorSchema | undefined {
  if (!toma) return undefined
  return {
    CNPJ: String(toma?.['CNPJ'] ?? ''),
    CPF: String(toma?.['CPF'] ?? ''),
    IM: String(toma?.['IM'] ?? ''),
    xNome: String(toma?.['xNome'] ?? ''),
    enderNac: extractEndereco(toma?.['enderNac'] as Record<string, unknown>),
    fone: String(toma?.['fone'] ?? ''),
    email: String(toma?.['email'] ?? ''),
  }
}

function extractDps(dps: Record<string, unknown> | undefined): DpsSchema | undefined {
  if (!dps) return undefined
  const infDPS = (dps?.['infDPS'] ?? dps) as Record<string, unknown>
  const serv = infDPS?.['serv'] as Record<string, unknown> | undefined
  const cServ = serv?.['cServ'] as Record<string, unknown> | undefined
  return {
    infDPS: {
      tpAmb: Number(infDPS?.['tpAmb'] ?? 1),
      nDPS: String(infDPS?.['nDPS'] ?? ''),
      serie: String(infDPS?.['serie'] ?? ''),
      dhEmi: String(infDPS?.['dhEmi'] ?? ''),
      dCompet: String(infDPS?.['dCompet'] ?? ''),
      prest: extractEmit(infDPS?.['prest'] as Record<string, unknown>),
      toma: extractTomador(infDPS?.['toma'] as Record<string, unknown>),
      interm: extractTomador(infDPS?.['interm'] as Record<string, unknown>),
      serv: serv ? {
        xDescServ: String(serv?.['xDescServ'] ?? ''),
        cServTribNac: String(cServ?.['cServTribNac'] ?? ''),
        cServMun: String(cServ?.['cServMun'] ?? ''),
        xNBS: String(serv?.['xNBS'] ?? ''),
        xCOD: String(serv?.['xCOD'] ?? ''),
        xCLS: String((serv?.['locPrest'] as Record<string, unknown>)?.['xCLS'] ?? ''),
        xPA: String((serv?.['locPrest'] as Record<string, unknown>)?.['xPA'] ?? ''),
        xInfComp: String(serv?.['xInfComp'] ?? ''),
      } : undefined,
      valores: extractValores(infDPS?.['valores'] as Record<string, unknown>),
    },
  }
}

function extractValores(val: Record<string, unknown> | undefined): ValoresNfseSchema | undefined {
  if (!val) return undefined
  return {
    vServico: Number(val?.['vServico'] ?? 0),
    vBC: Number(val?.['vBC'] ?? 0),
    pAliqAplic: Number(val?.['pAliqAplic'] ?? 0),
    vISSQN: Number(val?.['vISSQN'] ?? 0),
    vTotalRet: Number(val?.['vTotalRet'] ?? 0),
    vLiq: Number(val?.['vLiq'] ?? 0),
    vCalcDR: Number(val?.['vCalcDR'] ?? 0),
    vCalcBM: Number(val?.['vCalcBM'] ?? 0),
    vDescCondicionado: Number(val?.['vDescCondicionado'] ?? 0),
    vDescIncondicionado: Number(val?.['vDescIncondicionado'] ?? 0),
    IRRF: Number(val?.['vRetIRRF'] ?? 0),
    CP: Number(val?.['CP'] ?? 0),
    CSLL: Number(val?.['vRetCSLL'] ?? 0),
    PIS: Number(val?.['vPis'] ?? 0),
    COFINS: Number(val?.['vCofins'] ?? 0),
  }
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export interface NfseSchema {
  versao?: string
  infNFSe?: InfNFSeSchema
}

export interface InfNFSeSchema {
  id?: string
  cStat: string
  xMotivo: string
  chNFSe: string
  nNFSe: string
  dhProc: string
  xLocEmi: string
  xLocPrestacao: string
  cLocIncid: string
  xTribNac: string
  xTribMun: string
  xNBS: string
  verAplic: string
  ambGer: number
  tpEmis: number
  procEmi: number
  emit?: EmitSchema
  DPS?: DpsSchema
  valores?: ValoresNfseSchema
}

export interface EmitSchema {
  CNPJ: string
  CPF: string
  IM: string
  xNome: string
  xFant: string
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
    nDPS: string
    serie: string
    dhEmi: string
    dCompet: string
    prest?: EmitSchema
    toma?: TomadorSchema
    interm?: TomadorSchema
    serv?: {
      xDescServ: string
      cServTribNac: string
      cServMun: string
      xNBS: string
      xCOD: string
      xCLS: string
      xPA: string
      xInfComp: string
    }
    valores?: ValoresNfseSchema
  }
}

export interface ValoresNfseSchema {
  vServico: number
  vBC: number
  pAliqAplic: number
  vISSQN: number
  vTotalRet: number
  vLiq: number
  vCalcDR: number
  vCalcBM: number
  vDescCondicionado: number
  vDescIncondicionado: number
  IRRF: number
  CP: number
  CSLL: number
  PIS: number
  COFINS: number
}
