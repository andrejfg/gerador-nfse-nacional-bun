/**
 * Renderizador HTML da DANF-Se
 * Migrado de direction-nfse-danfe/src/Danfe/Rendering/DanfeHtmlRenderer.cs
 */

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import type { NfseSchema, ValoresNfseSchema, EnderNacSchema } from '../xml/nfse-parser.js'
import { formatCnpj, formatCpf, formatCep, formatTelefone } from '../utils/cpf-cnpj.js'
import { DanfeEnvironment } from '../types/enums.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = join(__dirname, '../../assets')
const TEMPLATE_PATH = join(ASSETS_DIR, 'templates/danfe.html')
const MUNICIPIOS_CSV = join(ASSETS_DIR, 'municipios.csv')

export interface DanfeOptions {
  fontFamily?: string
  fontSize?: number
  templatePath?: string
  logoPath?: string
}

export interface DanfeWarning {
  code: string
  message: string
  field?: string
}

export interface DanfeRenderResult {
  html: string
  warnings: DanfeWarning[]
  environment: DanfeEnvironment
}

let municipioCache: Map<string, { nome: string; uf: string }> | null = null

function loadMunicipios(): Map<string, { nome: string; uf: string }> {
  if (municipioCache) return municipioCache
  municipioCache = new Map()
  try {
    const lines = readFileSync(MUNICIPIOS_CSV, 'utf-8').split('\n').slice(1)
    for (const line of lines) {
      const [cod, nome, uf] = line.split(';')
      if (cod && nome) municipioCache.set(cod.trim(), { nome: nome.trim(), uf: (uf ?? '').trim() })
    }
  } catch { /* CSV não obrigatório */ }
  return municipioCache
}

function getMunicipio(codIbge: string) {
  return loadMunicipios().get(codIbge.padStart(7, '0'))
}

function fmt(value: number, decimals = 2): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function fmtDate(d: string): string {
  if (!d) return '-'
  try { return new Date(d).toLocaleDateString('pt-BR') } catch { return d }
}

function fmtDateTime(d: string): string {
  if (!d) return '-'
  try { return new Date(d).toLocaleString('pt-BR') } catch { return d }
}

function h(value: string | undefined | null): string {
  return (value ?? '-')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function fmtEndereco(end?: EnderNacSchema): string {
  if (!end) return '-'
  const parts: string[] = []
  if (end.xLgr) parts.push(end.xLgr)
  if (end.nro) parts.push(end.nro)
  if (end.xCpl) parts.push(end.xCpl)
  if (end.xBairro) parts.push(end.xBairro)
  const mun = getMunicipio(end.cMun)
  if (mun) parts.push(`${mun.nome}/${mun.uf}`)
  else if (end.cMun) parts.push(end.cMun)
  if (end.CEP) parts.push(`CEP: ${formatCep(end.CEP)}`)
  return parts.join(', ') || '-'
}

function fmtDoc(cnpj: string, cpf: string): string {
  if (cnpj.replace(/\D/g, '').length === 14) return formatCnpj(cnpj)
  if (cpf.replace(/\D/g, '').length === 11) return formatCpf(cpf)
  return '-'
}

function applyConditionals(html: string, flags: Record<string, boolean>): string {
  let result = html
  for (const [key, show] of Object.entries(flags)) {
    const begin = `{{${key}:BEGIN}}`, end = `{{${key}:END}}`
    const bi = result.indexOf(begin), ei = result.indexOf(end)
    if (bi === -1 || ei === -1) continue
    if (show) { result = result.replace(begin, '').replace(end, '') }
    else { result = result.slice(0, bi) + result.slice(ei + end.length) }
  }
  return result
}

export async function renderDanfseHtml(
  schema: NfseSchema,
  isCancelled = false,
  options: DanfeOptions = {}
): Promise<DanfeRenderResult> {
  const warnings: DanfeWarning[] = []
  const inf = schema.infNFSe
  if (!inf) throw new Error('NFS-e inválida: infNFSe não encontrado')

  const emit = inf.emit
  const dps = inf.DPS?.infDPS
  const val = inf.valores
  const toma = dps?.toma
  const interm = dps?.interm
  const serv = dps?.serv

  const chNFSe = inf.chNFSe ?? ''
  const qrUrl = chNFSe ? `https://nfse.gov.br/consulta?chave=${chNFSe}` : 'https://nfse.gov.br'
  const qrImg = await QRCode.toDataURL(qrUrl, { width: 120, margin: 0 }).catch(() => '')

  const p: Record<string, string> = {
    '{{CHAVE_NFSE}}': h(chNFSe),
    '{{QRCODE_IMG}}': qrImg ? `<img src="${qrImg}" alt="QR Code" />` : '',
    '{{NFSE_NUMERO}}': h(inf.nNFSe),
    '{{NFSE_COMPETENCIA}}': h(fmtDate(dps?.dCompet ?? '')),
    '{{NFSE_DH_PROC}}': h(fmtDateTime(inf.dhProc ?? '')),
    '{{NFSE_DH_EMI}}': h(fmtDateTime(dps?.dhEmi ?? '')),
    '{{PREST_CNPJ}}': h(fmtDoc(emit?.CNPJ ?? '', '')),
    '{{PREST_XNOME}}': h(emit?.xNome),
    '{{PREST_IM}}': h(emit?.IM),
    '{{PREST_ENDERECO}}': h(fmtEndereco(emit?.enderNac)),
    '{{PREST_FONE}}': h(emit?.fone ? formatTelefone(emit.fone) : '-'),
    '{{PREST_EMAIL}}': h(emit?.email),
    '{{PREST_REGIME}}': h(emit?.regTrib ? String(emit.regTrib.regEspTrib) : '-'),
    '{{TOMA_CNPJ}}': h(fmtDoc(toma?.CNPJ ?? '', toma?.CPF ?? '')),
    '{{TOMA_XNOME}}': h(toma?.xNome),
    '{{TOMA_IM}}': h(toma?.IM),
    '{{TOMA_ENDERECO}}': h(fmtEndereco(toma?.enderNac)),
    '{{TOMA_FONE}}': h(toma?.fone ? formatTelefone(toma.fone) : '-'),
    '{{TOMA_EMAIL}}': h(toma?.email),
    '{{INTERM_CNPJ}}': h(fmtDoc(interm?.CNPJ ?? '', interm?.CPF ?? '')),
    '{{INTERM_XNOME}}': h(interm?.xNome),
    '{{SERVICO_XNS}}': h(serv?.xNBS ?? inf.xNBS),
    '{{SERVICO_XCM}}': h(serv?.xCOD),
    '{{SERVICO_XCLES}}': h(serv?.xCLS),
    '{{SERVICO_XPA}}': h(serv?.xPA),
    '{{SERVICO_DESCRICAO}}': serv?.xDescServ ?? '-',
    '{{ISSQN_TPIMUNICIPAL}}': h(inf.xTribMun ?? inf.xTribNac),
    '{{ISSQN_CMUNICIPIO}}': (() => { const m = getMunicipio(emit?.enderNac?.cMun ?? ''); return m ? h(`${m.nome}/${m.uf}`) : '-' })(),
    '{{ISSQN_VBASE}}': val ? h(`R$ ${fmt(val.vBC)}`) : '-',
    '{{ISSQN_PALIQ}}': val ? h(`${fmt(val.pAliqAplic, 4)}%`) : '-',
    '{{ISSQN_VCALCBM}}': val ? h(`R$ ${fmt(val.vCalcBM)}`) : '-',
    '{{ISSQN_VTOTALRET}}': val ? h(`R$ ${fmt(val.vTotalRet)}`) : '-',
    '{{ISSQN_VLIQ}}': val ? h(`R$ ${fmt(val.vLiq)}`) : '-',
    '{{IRRF_VALUE}}': val ? h(`R$ ${fmt(val.IRRF)}`) : '-',
    '{{CP_VALUE}}': val ? h(`R$ ${fmt(val.CP)}`) : '-',
    '{{CSLL_VALUE}}': val ? h(`R$ ${fmt(val.CSLL)}`) : '-',
    '{{PIS_VALUE}}': val ? h(`R$ ${fmt(val.PIS)}`) : '-',
    '{{COFINS_VALUE}}': val ? h(`R$ ${fmt(val.COFINS)}`) : '-',
    '{{FED_TOTAL}}': val ? h(`R$ ${fmt(val.IRRF + val.CP + val.CSLL + val.PIS + val.COFINS)}`) : '-',
    '{{FINANCEIRO_VSERVICO}}': val ? h(`R$ ${fmt(val.vServico)}`) : '-',
    '{{FINANCEIRO_VDESCCONDICIONAL}}': val ? h(`R$ ${fmt(val.vDescCondicionado)}`) : '-',
    '{{FINANCEIRO_VDESCONTOINCOND}}': val ? h(`R$ ${fmt(val.vDescIncondicionado)}`) : '-',
    '{{FINANCEIRO_VLIQ}}': val ? h(`R$ ${fmt(val.vLiq)}`) : '-',
    '{{COMPLEMENTO_XINFADINAL}}': serv?.xInfComp ?? '',
    '{{IS_CANCELADA}}': isCancelled ? 'block' : 'none',
  }

  const templatePath = options.templatePath ?? TEMPLATE_PATH
  let html = readFileSync(templatePath, 'utf-8')

  html = applyConditionals(html, {
    TOMADOR_IDENTIFIED: !!(toma?.CNPJ || toma?.CPF || toma?.xNome),
    INTERMEDIARIO_IDENTIFIED: !!(interm?.CNPJ || interm?.CPF),
    IS_CANCELADA: isCancelled,
  })

  for (const [key, value] of Object.entries(p)) {
    html = html.replaceAll(key, value)
  }

  const remaining = html.match(/\{\{[A-Z_:]+\}\}/g) ?? []
  for (const ph of remaining) {
    warnings.push({ code: 'PLACEHOLDER_EMPTY', message: `Placeholder não substituído: ${ph}`, field: ph })
    html = html.replaceAll(ph, '-')
  }

  const env = (dps?.tpAmb ?? 1) === 1 ? DanfeEnvironment.Production : DanfeEnvironment.Restricted
  return { html, warnings, environment: env }
}
