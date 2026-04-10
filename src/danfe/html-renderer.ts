/**
 * Renderizador HTML da DANF-Se
 * Migrado de direction-nfse-danfe/src/Danfe/Rendering/DanfeHtmlRenderer.cs
 */

import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import type { NfseSchema, ValoresNfseSchema, EnderNacSchema, IBSCBSSchema } from '../xml/nfse-parser.js'
import { formatCnpj, formatCpf, formatCep, formatTelefone } from '../utils/cpf-cnpj.js'
import { DanfeEnvironment } from '../types/enums.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SIMPLES_NACIONAL: Record<number, string> = {
  1: 'Não Optante', 2: 'MEI', 3: 'ME/EPP',
}

const REGIME_ESP_TRIB: Record<number, string> = {
  0: 'Nenhum', 1: 'Cooperativa', 2: 'Estimativa',
  3: 'Microempresa Municipal', 4: 'Notário ou Registrador',
  5: 'Profissional Autônomo', 6: 'Sociedade de Profissionais', 9: 'Outros',
}

const TRIB_ISSQN: Record<string, string> = {
  '1': 'Operação Tributável', '2': 'Imunidade', '3': 'Exportação de Serviço', '4': 'Não Incidência',
}

const RET_ISSQN: Record<string, string> = {
  '1': 'Não Retido', '2': 'Retido pelo Tomador', '3': 'Retido pelo Intermediário',
}

const TP_IMUNIDADE: Record<string, string> = {
  '0': 'Tipo não informado', '1': 'Patrimônio, renda ou serviços (Art 150, VI, a)',
  '2': 'Templos de qualquer culto', '3': 'Partidos, sindicatos, instituições (Art 150, VI, c)',
  '4': 'Livros, jornais, periódicos', '5': 'Fonogramas e videofonogramas',
}
// bun build gera dist/index.js (bundle único) — __dirname aponta para dist/ → ../assets
// em testes (src/danfe/) → ../../assets; tenta o mais próximo, cai no outro se não existir
const _distAssets = join(__dirname, '../assets')
const ASSETS_DIR = existsSync(_distAssets) ? _distAssets : join(__dirname, '../../assets')
const TEMPLATE_PATH = join(ASSETS_DIR, 'templates/danfe.html')
const MUNICIPIOS_CSV = join(ASSETS_DIR, 'municipios.csv')

export interface DanfeOptions {
  fontFamily?: string
  fontSize?: number
  templatePath?: string
  logoPath?: string
  /** Quando true, sobrepõe uma marca d'água "PRÉVIA" no documento renderizado. */
  isPreview?: boolean
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
  try {
    // Datas sem hora (YYYY-MM-DD) são parseadas como UTC → exibem dia anterior em GMT-3.
    // Adicionamos T12:00:00 para evitar esse problema.
    const safe = /^\d{4}-\d{2}(-\d{2})?$/.test(d) ? `${d}T12:00:00` : d
    return new Date(safe).toLocaleDateString('pt-BR')
  } catch { return d }
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

const PREVIEW_WATERMARK_HTML = `
<style>
  .danfe-preview-watermark {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; z-index: 9999; overflow: hidden;
  }
  .danfe-preview-watermark span {
    display: block;
    font-size: 90px; font-weight: 900; letter-spacing: 0.05em;
    color: rgba(200, 0, 0, 0.13);
    transform: rotate(-40deg);
    white-space: nowrap; text-transform: uppercase;
    font-family: Arial, sans-serif;
    line-height: 1;
  }
  @media print {
    .danfe-preview-watermark { position: fixed; }
  }
</style>
<div class="danfe-preview-watermark"><span>PRÉVIA — SEM VALOR FISCAL</span></div>`

function injectWatermark(html: string): string {
  const closeBody = html.lastIndexOf('</body>')
  if (closeBody !== -1) return html.slice(0, closeBody) + PREVIEW_WATERMARK_HTML + html.slice(closeBody)
  return html + PREVIEW_WATERMARK_HTML
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
  const dpsVal = dps?.valores
  // vServico pode não vir em infNFSe.valores — usa DPS como fallback
  const vServico = val?.vServico || dpsVal?.vServ || 0
  const toma = dps?.toma
  const interm = dps?.interm
  const serv = dps?.serv

  // Valores federais: prioriza infNFSe.valores, fallback para DPS.tribFed
  const irrf   = val?.IRRF   || dpsVal?.vRetIRRF  || 0
  const csll   = val?.CSLL   || dpsVal?.vRetCSLL   || 0
  const pis    = val?.PIS    || dpsVal?.vPis       || 0
  const cofins = val?.COFINS || dpsVal?.vCofins    || 0
  const cp     = val?.CP     || dpsVal?.vRetCP     || 0
  const ibs    = inf.IBSCBS

  const chNFSe = inf.chNFSe ?? ''
  const qrUrl = chNFSe ? `https://www.nfse.gov.br/ConsultaPublica/?tpc=1&chave=${chNFSe}` : 'https://www.nfse.gov.br'
  const qrImg = await QRCode.toDataURL(qrUrl, { width: 120, margin: 0 }).catch(() => '')

  // Resolve município do emitente e do local de prestação
  const munEmit = getMunicipio(emit?.enderNac?.cMun ?? '')
  const munLocPrest = getMunicipio(serv?.cLocPrestacao ?? '')

  // Regime tributário: prioriza emit (NFS-e), fallback prest (DPS)
  const regTrib = emit?.regTrib ?? dps?.prest?.regTrib

  const p: Record<string, string> = {
    '{{CHAVE_NFSE}}': h(chNFSe),
    '{{QRCODE_IMG}}': qrImg ? `<img src="${qrImg}" alt="QR Code" />` : '',
    '{{NFSE_NUMERO}}': h(inf.nNFSe),
    '{{NFSE_NDFSE}}': h(inf.nDFSe),
    '{{NFSE_COMPETENCIA}}': h(fmtDate(dps?.dCompet ?? '')),
    '{{NFSE_DH_PROC}}': h(fmtDateTime(inf.dhProc ?? '')),
    '{{NFSE_DH_EMI}}': h(fmtDateTime(dps?.dhEmi ?? '')),
    '{{DPS_NUMERO}}': h(dps?.nDPS),
    '{{DPS_SERIE}}': h(dps?.serie),
    '{{PREST_CNPJ}}': h(fmtDoc(emit?.CNPJ ?? '', '')),
    '{{PREST_XNOME}}': h(emit?.xNome),
    '{{PREST_XFANT}}': h(emit?.xFant),
    '{{PREST_IM}}': h(emit?.IM),
    '{{PREST_ENDERECO}}': h(fmtEndereco(emit?.enderNac)),
    '{{PREST_FONE}}': h(emit?.fone ? formatTelefone(emit.fone) : '-'),
    '{{PREST_EMAIL}}': h(emit?.email),
    '{{PREST_REGIME}}': h(regTrib ? (REGIME_ESP_TRIB[regTrib.regEspTrib] ?? String(regTrib.regEspTrib)) : '-'),
    '{{PREST_SIMPNAC}}': h(regTrib ? (SIMPLES_NACIONAL[regTrib.opSimpNac] ?? String(regTrib.opSimpNac)) : '-'),
    '{{TOMA_CNPJ}}': h(fmtDoc(toma?.CNPJ ?? '', toma?.CPF ?? '')),
    '{{TOMA_XNOME}}': h(toma?.xNome),
    '{{TOMA_IM}}': h(toma?.IM),
    '{{TOMA_ENDERECO}}': h(fmtEndereco(toma?.enderNac)),
    '{{TOMA_FONE}}': h(toma?.fone ? formatTelefone(toma.fone) : '-'),
    '{{TOMA_EMAIL}}': h(toma?.email),
    '{{INTERM_CNPJ}}': h(fmtDoc(interm?.CNPJ ?? '', interm?.CPF ?? '')),
    '{{INTERM_XNOME}}': h(interm?.xNome),
    '{{SERVICO_XNS}}': h(serv?.cNBS || inf.xNBS),
    '{{SERVICO_XCM}}': h(serv?.cServMun),
    '{{SERVICO_XCLES}}': munLocPrest ? h(`${munLocPrest.nome}-${munLocPrest.uf}`) : h(inf.xLocPrestacao || serv?.cLocPrestacao),
    '{{SERVICO_XPA}}': '-',
    '{{SERVICO_DESCRICAO}}': h(serv?.xDescServ ?? '-').replace(/\n/g, '<br>'),
    '{{ISSQN_TPIMUNICIPAL}}': h(TRIB_ISSQN[dpsVal?.tribISSQN ?? ''] ?? (inf.xTribMun || inf.xTribNac)),
    '{{ISSQN_CMUNICIPIO}}': munEmit ? h(`${munEmit.nome}-${munEmit.uf}`) : h(inf.xLocEmi || '-'),
    '{{ISSQN_RET}}': h(RET_ISSQN[dpsVal?.tpRetISSQN ?? ''] ?? dpsVal?.tpRetISSQN ?? '-'),
    '{{ISSQN_TPIMUNIDADE}}': h(dpsVal?.tpImunidade ? (TP_IMUNIDADE[dpsVal.tpImunidade] ?? dpsVal.tpImunidade) : '-'),
    '{{ISSQN_CPAISRESULT}}': h(dpsVal?.cPaisResult || '-'),
    '{{ISSQN_TPSUSP}}': h(dpsVal?.tpSusp || '-'),
    '{{ISSQN_NPROCESSO}}': h(dpsVal?.nProcesso || '-'),
    '{{ISSQN_NBM}}': h(dpsVal?.nBM || '-'),
    '{{ISSQN_VBASE}}': val ? h(`R$ ${fmt(val.vBC)}`) : '-',
    '{{ISSQN_PALIQ}}': val ? h(`${fmt(val.pAliqAplic, 4)}%`) : '-',
    '{{ISSQN_VCALCBM}}': val ? h(`R$ ${fmt(val.vISSQN)}`) : '-',
    '{{ISSQN_VTOTALRET}}': val ? h(`R$ ${fmt(val.vTotalRet)}`) : '-',
    '{{ISSQN_VLIQ}}': val ? h(`R$ ${fmt(val.vLiq)}`) : '-',
    '{{IRRF_VALUE}}': h(`R$ ${fmt(irrf)}`),
    '{{CP_VALUE}}': h(`R$ ${fmt(cp)}`),
    '{{CONTRIB_SOCIAIS}}': h(`R$ ${fmt(csll + pis + cofins)}`),
    '{{FED_TOTAL}}': h(`R$ ${fmt(irrf + cp + csll + pis + cofins)}`),
    '{{FINANCEIRO_VSERVICO}}': h(`R$ ${fmt(vServico)}`),
    '{{FINANCEIRO_VDESCCONDICIONAL}}': val ? h(`R$ ${fmt(val.vDescCondicionado)}`) : h(dpsVal ? `R$ ${fmt(dpsVal.vDescCond)}` : '-'),
    '{{FINANCEIRO_VDESCONTOINCOND}}': val ? h(`R$ ${fmt(val.vDescIncondicionado)}`) : h(dpsVal ? `R$ ${fmt(dpsVal.vDescIncond)}` : '-'),
    '{{FINANCEIRO_VDEDUCAO}}': h(dpsVal ? (dpsVal.vDR ? `R$ ${fmt(dpsVal.vDR)}` : dpsVal.pDR ? `${fmt(dpsVal.pDR, 2)}%` : '-') : '-'),
    '{{FINANCEIRO_VLIQ}}': val ? h(`R$ ${fmt(val.vLiq)}`) : '-',
    '{{IBSCBS_VBC}}': ibs ? h(`R$ ${fmt(ibs.vBC)}`) : '-',
    '{{IBSCBS_PIBSUF}}': ibs ? h(`${fmt(ibs.pAliqEfetUF || ibs.pIBSUF, 4)}%`) : '-',
    '{{IBSCBS_VIBSUF}}': ibs ? h(`R$ ${fmt(ibs.vIBSUF)}`) : '-',
    '{{IBSCBS_PIBSMUN}}': ibs ? h(`${fmt(ibs.pAliqEfetMun || ibs.pIBSMun, 4)}%`) : '-',
    '{{IBSCBS_VIBSMUN}}': ibs ? h(`R$ ${fmt(ibs.vIBSMun)}`) : '-',
    '{{IBSCBS_PCBS}}': ibs ? h(`${fmt(ibs.pAliqEfetCBS || ibs.pCBS, 4)}%`) : '-',
    '{{IBSCBS_VCBS}}': ibs ? h(`R$ ${fmt(ibs.vCBS)}`) : '-',
    '{{IBSCBS_VIBSTOT}}': ibs ? h(`R$ ${fmt(ibs.vIBSTot)}`) : '-',
    '{{IBSCBS_VTOTNF}}': ibs ? h(`R$ ${fmt(ibs.vTotNF)}`) : '-',
    '{{SUBST_CHAVE}}': h(dps?.subst?.chSubstda || '-'),
    '{{SUBST_CMOTIVO}}': h(dps?.subst?.cMotivo || '-'),
    '{{SUBST_XMOTIVO}}': h(dps?.subst?.xMotivo || '-'),
    '{{COMPLEMENTO_XOUTINF}}': inf.xOutInf || '',
    '{{COMPLEMENTO_XINFADINAL}}': serv?.xInfComp ?? '',
    '{{COMPLEMENTO_IDDOCTEC}}': h(serv?.idDocTec || '-'),
    '{{COMPLEMENTO_DOCREF}}': h(serv?.docRef || '-'),
    '{{COMPLEMENTO_XPED}}': h(serv?.xPed || '-'),
    '{{IS_CANCELADA}}': isCancelled ? 'block' : 'none',
  }

  const templatePath = options.templatePath ?? TEMPLATE_PATH
  let html = readFileSync(templatePath, 'utf-8')

  html = applyConditionals(html, {
    TOMADOR_IDENTIFIED: !!(toma?.CNPJ || toma?.CPF || toma?.xNome),
    INTERMEDIARIO_IDENTIFIED: !!(interm?.CNPJ || interm?.CPF),
    SUBSTITUICAO_IDENTIFIED: !!(dps?.subst),
    IBSCBS_IDENTIFIED: !!ibs,
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

  if (options.isPreview) html = injectWatermark(html)

  const env = (dps?.tpAmb ?? 1) === 1 ? DanfeEnvironment.Production : DanfeEnvironment.Restricted
  return { html, warnings, environment: env }
}
