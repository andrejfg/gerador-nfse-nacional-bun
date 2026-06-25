/**
 * Renderizador HTML da DANF-Se
 * Migrado de direction-nfse-danfe/src/Danfe/Rendering/DanfeHtmlRenderer.cs
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import QRCode from 'qrcode'
import type { NfseSchema, ValoresNfseSchema, EnderNacSchema, IBSCBSSchema } from '../xml/nfse-parser.js'
import { formatCnpj, formatCpf, formatCep, formatTelefone } from '../utils/cpf-cnpj.js'
import { DanfeEnvironment } from '../types/enums.js'

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
  /** Texto exibido na marca d'água quando isPreview=true. Padrão: 'SEM VALOR FISCAL'. */
  watermarkText?: string
  /** Quando true, sobrepõe uma marca d'água no documento renderizado. */
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

// Endereço sem município e CEP (exibidos como campos separados no template)
function fmtEnderecoSemMunCep(end?: EnderNacSchema): string {
  if (!end) return '-'
  const parts: string[] = []
  if (end.xLgr) parts.push(end.xLgr)
  if (end.nro) parts.push(end.nro)
  if (end.xCpl) parts.push(end.xCpl)
  if (end.xBairro) parts.push(end.xBairro)
  return parts.join(', ') || '-'
}

function fmtDoc(cnpj: string, cpf: string, nif = ''): string {
  if (cnpj.replace(/\D/g, '').length === 14) return formatCnpj(cnpj)
  if (cpf.replace(/\D/g, '').length === 11) return formatCpf(cpf)
  // Tomador estrangeiro: NIF não tem máscara fixa — exibe como veio
  if (nif) return nif
  return '-'
}

// Município do tomador: nacional (lookup IBGE por cMun) ou estrangeiro (cidade do endExt)
function fmtMunicipio(
  mun: { nome: string; uf: string } | undefined,
  end?: EnderNacSchema,
): string {
  if (mun) return `${mun.nome} - ${mun.uf}`
  if (end?.xCidade) {
    const regiao = end.xEstProvReg || end.cPais
    return regiao ? `${end.xCidade} - ${regiao}` : end.xCidade
  }
  return end?.cMun || '-'
}

function buildWatermarkHtml(text: string): string {
  return `
<style>
  .danfe-preview-watermark {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; z-index: 9999; overflow: hidden;
  }
  .danfe-preview-watermark span {
    display: block;
    font-size: 60px; font-weight: 900; letter-spacing: 0.05em;
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
<div class="danfe-preview-watermark"><span>${text}</span></div>`
}

function injectWatermark(html: string, text: string): string {
  const watermark = buildWatermarkHtml(text)
  const closeBody = html.lastIndexOf('</body>')
  if (closeBody !== -1) return html.slice(0, closeBody) + watermark + html.slice(closeBody)
  return html + watermark
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

/**
 * Monta a URL de consulta pública embutida no QR Code da DANF-Se.
 * O host varia por ambiente: produção (`tpAmb === 1`) usa nfse.gov.br;
 * homologação (produção restrita) usa producaorestrita.nfse.gov.br.
 */
export function buildQrUrl(chNFSe: string, tpAmb?: number | string): string {
  const isProd = String(tpAmb ?? 1) === '1'
  const host = isProd ? 'https://www.nfse.gov.br' : 'https://www.producaorestrita.nfse.gov.br'
  return chNFSe ? `${host}/ConsultaPublica/?tpc=1&chave=${chNFSe}` : host
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
  const qrUrl = buildQrUrl(chNFSe, dps?.tpAmb)
  const qrImg = await QRCode.toDataURL(qrUrl, { width: 120, margin: 0 }).catch(() => '')

  // Resolve município do emitente e do local de prestação
  const munEmit = getMunicipio(emit?.enderNac?.cMun ?? '')
  const munLocPrest = getMunicipio(serv?.cLocPrestacao ?? '')
  const munToma = getMunicipio(dps?.toma?.enderNac?.cMun ?? '')

  // Regime tributário: prioriza emit (NFS-e), fallback prest (DPS)
  const regTrib = emit?.regTrib ?? dps?.prest?.regTrib

  // Formata cTribNac "171201" → "17.12.01"
  function fmtCTribNac(code: string): string {
    if (!code || code.length < 6) return code
    return `${code.slice(0, 2)}.${code.slice(2, 4)}.${code.slice(4, 6)}${code.length > 6 ? code.slice(6) : ''}`
  }

  // ISSQN Apurado: usa infNFSe.valores.vISSQN quando disponível (render from XML),
  // ou dpsVal.pAliq × vServ (calculado pelo renderer para prévia)
  const vISSQNApurado = (() => {
    if (val?.vISSQN != null && val.vISSQN > 0) return val.vISSQN
    const pAliq = dpsVal?.pAliq ? Number(dpsVal.pAliq) : 0
    const vServ = val?.vBC ?? dpsVal?.vServ ?? 0
    return pAliq > 0 && vServ > 0 ? Math.round(vServ * (pAliq / 100) * 100) / 100 : 0
  })()

  // ISSQN Retido: apenas quando tpRetISSQN ≠ 1 (Não Retido)
  const issqnNaoRetido = !dpsVal?.tpRetISSQN || dpsVal.tpRetISSQN === '1'
  const vISSQNRetido = issqnNaoRetido ? 0 : vISSQNApurado

  const totalRetFed = irrf + cp + csll

  const p: Record<string, string> = {
    '{{CHAVE_NFSE}}': h(chNFSe),
    '{{QRCODE_IMG}}': qrImg ? `<img src="${qrImg}" alt="QR Code" />` : '',
    '{{MUN_HEADER}}': munEmit ? h(`${munEmit.nome} - ${munEmit.uf}`) : h(inf.xLocEmi || ''),
    '{{NFSE_NUMERO}}': h(inf.nNFSe),
    '{{NFSE_NDFSE}}': h(inf.nDFSe),
    '{{NFSE_COMPETENCIA}}': h(fmtDate(dps?.dCompet ?? '')),
    '{{NFSE_DH_PROC}}': h(fmtDateTime(inf.dhProc ?? '')),
    '{{NFSE_DH_EMI}}': h(fmtDateTime(dps?.dhEmi ?? '')),
    '{{DPS_NUMERO}}': h(dps?.nDPS),
    '{{DPS_SERIE}}': h(dps?.serie),
    '{{PREST_CNPJ}}': h(fmtDoc(emit?.CNPJ ?? '', emit?.CPF ?? '')),
    '{{PREST_XNOME}}': h(emit?.xNome),
    '{{PREST_XFANT}}': h(emit?.xFant),
    '{{PREST_IM}}': h(emit?.IM),
    '{{PREST_ENDERECO}}': h(fmtEnderecoSemMunCep(emit?.enderNac)),
    '{{PREST_MUNICIPIO}}': munEmit ? h(`${munEmit.nome} - ${munEmit.uf}`) : h(emit?.enderNac?.cMun || '-'),
    '{{PREST_CEP}}': h(emit?.enderNac?.CEP ? formatCep(emit.enderNac.CEP) : '-'),
    '{{PREST_FONE}}': h(emit?.fone ? formatTelefone(emit.fone) : '-'),
    '{{PREST_EMAIL}}': h(emit?.email),
    '{{PREST_REGIME}}': h(regTrib ? (REGIME_ESP_TRIB[regTrib.regEspTrib] ?? String(regTrib.regEspTrib)) : '-'),
    '{{PREST_SIMPNAC}}': h(regTrib ? (SIMPLES_NACIONAL[regTrib.opSimpNac] ?? String(regTrib.opSimpNac)) : '-'),
    '{{TOMA_CNPJ}}': h(fmtDoc(toma?.CNPJ ?? '', toma?.CPF ?? '', toma?.NIF ?? '')),
    '{{TOMA_XNOME}}': h(toma?.xNome),
    '{{TOMA_IM}}': h(toma?.IM),
    '{{TOMA_ENDERECO}}': h(fmtEnderecoSemMunCep(toma?.enderNac)),
    '{{TOMA_MUNICIPIO}}': h(fmtMunicipio(munToma, toma?.enderNac)),
    '{{TOMA_CEP}}': h(
      toma?.enderNac?.CEP ? formatCep(toma.enderNac.CEP) : (toma?.enderNac?.cEndPost || '-'),
    ),
    '{{TOMA_FONE}}': h(toma?.fone ? formatTelefone(toma.fone) : '-'),
    '{{TOMA_EMAIL}}': h(toma?.email),
    '{{INTERM_CNPJ}}': h(fmtDoc(interm?.CNPJ ?? '', interm?.CPF ?? '')),
    '{{INTERM_XNOME}}': h(interm?.xNome),
    '{{SERVICO_CTRIBNAC}}': (() => {
      const ctn = serv?.cTribNac ?? ''
      const xtn = inf.xTribNac ?? ''
      const fmt_ = fmtCTribNac(ctn)
      return h(fmt_ && xtn ? `${fmt_} - ${xtn}` : (fmt_ || xtn || '-'))
    })(),
    '{{SERVICO_XNS}}': h(serv?.cNBS || inf.xNBS),
    '{{SERVICO_XCM}}': h(serv?.cServMun),
    '{{SERVICO_XCLES}}': munLocPrest ? h(`${munLocPrest.nome} - ${munLocPrest.uf}`) : h(inf.xLocPrestacao || serv?.cLocPrestacao),
    '{{SERVICO_XPA}}': '-',
    '{{SERVICO_DESCRICAO}}': h(serv?.xDescServ ?? '-').replace(/\n/g, '<br>'),
    '{{ISSQN_TPIMUNICIPAL}}': h(TRIB_ISSQN[dpsVal?.tribISSQN ?? ''] ?? (inf.xTribMun || inf.xTribNac)),
    '{{ISSQN_CPAISRESULT}}': h(dpsVal?.cPaisResult || '-'),
    '{{ISSQN_CMUNICIPIO}}': munEmit ? h(`${munEmit.nome} - ${munEmit.uf}`) : h(inf.xLocIncid || inf.xLocEmi || '-'),
    '{{ISSQN_REGESPECIA}}': h(regTrib ? (REGIME_ESP_TRIB[regTrib.regEspTrib] ?? String(regTrib.regEspTrib)) : '-'),
    '{{ISSQN_TPIMUNIDADE}}': h(dpsVal?.tpImunidade ? (TP_IMUNIDADE[dpsVal.tpImunidade] ?? dpsVal.tpImunidade) : '-'),
    '{{ISSQN_TPSUSP_TEXT}}': h(dpsVal?.tpSusp ? `Sim (tipo ${dpsVal.tpSusp})` : 'Não'),
    '{{ISSQN_NPROCESSO}}': h(dpsVal?.nProcesso || '-'),
    '{{ISSQN_NBM}}': h(dpsVal?.nBM || '-'),
    '{{ISSQN_VSERVICO}}': h(`R$ ${fmt(vServico)}`),
    '{{ISSQN_VDESCINCOND}}': dpsVal?.vDescIncond ? h(`R$ ${fmt(dpsVal.vDescIncond)}`) : '-',
    '{{ISSQN_VDEDUCOES}}': dpsVal?.vDR ? h(`R$ ${fmt(dpsVal.vDR)}`) : (dpsVal?.pDR ? h(`${fmt(dpsVal.pDR, 2)}%`) : '-'),
    '{{ISSQN_VBASE}}': val ? h(`R$ ${fmt(val.vBC)}`) : (dpsVal ? h(`R$ ${fmt(dpsVal.vServ)}`) : '-'),
    '{{ISSQN_PALIQ}}': val ? h(`${fmt(val.pAliqAplic, 2)}%`) : (dpsVal?.pAliq ? h(`${fmt(Number(dpsVal.pAliq), 2)}%`) : '-'),
    '{{ISSQN_RET}}': h(RET_ISSQN[dpsVal?.tpRetISSQN ?? ''] ?? dpsVal?.tpRetISSQN ?? '-'),
    '{{ISSQN_VCALCBM}}': h(`R$ ${fmt(vISSQNApurado)}`),
    '{{IRRF_VALUE}}': irrf > 0 ? h(`R$ ${fmt(irrf)}`) : '-',
    '{{FED_CONTRIB_PREV}}': cp > 0 ? h(`R$ ${fmt(cp)}`) : '-',
    '{{FED_CONTRIB_SOC}}': csll > 0 ? h(`R$ ${fmt(csll)}`) : '-',
    '{{FED_CONTRIB_SOC_DESC}}': '-',
    '{{FED_PIS_PROPRIO}}': pis > 0 ? h(`R$ ${fmt(pis)}`) : '-',
    '{{FED_COFINS_PROPRIO}}': cofins > 0 ? h(`R$ ${fmt(cofins)}`) : '-',
    '{{FINANCEIRO_VSERVICO}}': h(`R$ ${fmt(vServico)}`),
    '{{FINANCEIRO_VDESCCONDICIONAL}}': (() => {
      const v = val?.vDescCondicionado ?? dpsVal?.vDescCond ?? 0
      return v > 0 ? h(`R$ ${fmt(v)}`) : '-'
    })(),
    '{{FINANCEIRO_VDESCONTOINCOND}}': (() => {
      const v = val?.vDescIncondicionado ?? dpsVal?.vDescIncond ?? 0
      return v > 0 ? h(`R$ ${fmt(v)}`) : '-'
    })(),
    '{{FINANCEIRO_VISSQN_RETIDO}}': vISSQNRetido > 0 ? h(`R$ ${fmt(vISSQNRetido)}`) : '-',
    '{{FINANCEIRO_TOTALRET}}': totalRetFed > 0 ? h(`R$ ${fmt(totalRetFed)}`) : '-',
    '{{FINANCEIRO_PISCOFINS_PROPRIO}}': (pis + cofins) > 0 ? h(`R$ ${fmt(pis + cofins)}`) : '-',
    '{{FINANCEIRO_VLIQ}}': val ? h(`R$ ${fmt(val.vLiq)}`) : '-',
    '{{TRIB_PCT_FED}}': h(`${fmt(dpsVal?.pTotTribFed ?? 0, 2)} %`),
    '{{TRIB_PCT_EST}}': h(`${fmt(dpsVal?.pTotTribEst ?? 0, 2)} %`),
    '{{TRIB_PCT_MUN}}': h(`${fmt(dpsVal?.pTotTribMun ?? 0, 2)} %`),
    '{{COMPL_NBS}}': h(serv?.cNBS || inf.xNBS || '-'),
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
    '{{COMPLEMENTO_XOUTINF}}': h(inf.xOutInf || '-'),
    '{{COMPLEMENTO_XINFADINAL}}': h(serv?.xInfComp || '-'),
    '{{COMPLEMENTO_IDDOCTEC}}': h(serv?.idDocTec || '-'),
    '{{COMPLEMENTO_DOCREF}}': h(serv?.docRef || '-'),
    '{{COMPLEMENTO_XPED}}': h(serv?.xPed || '-'),
    '{{IS_CANCELADA}}': isCancelled ? 'block' : 'none',
  }

  const templatePath = options.templatePath ?? TEMPLATE_PATH
  let html = readFileSync(templatePath, 'utf-8')

  // Ambiente da nota: produção (tpAmb=1) vs homologação/produção restrita (tpAmb=2).
  // Determina, junto com isPreview, se exibimos os dizeres de "não-validade fiscal":
  // numa nota REAL de produção eles são falsos, então são suprimidos.
  const env = (dps?.tpAmb ?? 1) === 1 ? DanfeEnvironment.Production : DanfeEnvironment.Restricted
  const showSemValidade = options.isPreview === true || env === DanfeEnvironment.Restricted

  const intermIdentificado = !!(interm?.CNPJ || interm?.CPF)
  html = applyConditionals(html, {
    TOMADOR_IDENTIFIED: !!(toma?.CNPJ || toma?.CPF || toma?.NIF || toma?.xNome),
    INTERM_DADOS_IDENTIFIED: intermIdentificado,
    INTERM_NAO_IDENTIFICADO: !intermIdentificado,
    SUBSTITUICAO_IDENTIFIED: !!(dps?.subst),
    IBSCBS_IDENTIFIED: !!ibs,
    IS_CANCELADA: isCancelled,
    SEM_VALIDADE_HEADER: showSemValidade,
    SEM_VALIDADE_FOOTER: showSemValidade,
  })

  for (const [key, value] of Object.entries(p)) {
    html = html.replaceAll(key, value)
  }

  const remaining = html.match(/\{\{[A-Z_:]+\}\}/g) ?? []
  for (const ph of remaining) {
    warnings.push({ code: 'PLACEHOLDER_EMPTY', message: `Placeholder não substituído: ${ph}`, field: ph })
    html = html.replaceAll(ph, '-')
  }

  if (options.isPreview) html = injectWatermark(html, options.watermarkText ?? 'SEM VALOR FISCAL')

  return { html, warnings, environment: env }
}
