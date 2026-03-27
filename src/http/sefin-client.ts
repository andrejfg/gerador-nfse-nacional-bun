/**
 * Cliente HTTP para a API SEFIN Nacional com mTLS
 * Migrado de nfse-php/src/Http/Client/SefinClient.php
 */

import type { NfseContext } from '../types/context.js'
import type {
  EmissaoNfseResponse,
  ConsultaNfseResponse,
  ConsultaDpsResponse,
  RegistroEventoResponse,
} from '../types/dtos.js'
import { resolveBaseUrl } from '../utils/endpoint-resolver.js'
import { decompressXml } from '../crypto/xml-signer.js'
import { parseNfseXml } from '../xml/nfse-parser.js'
import { loadCertificate, resolveCertSource } from '../crypto/certificate.js'

export class SefinClient {
  private baseUrl: string
  private tlsKey: string
  private tlsCert: string

  constructor(private context: NfseContext) {
    this.baseUrl = resolveBaseUrl(context).replace(/\/$/, '')
    const cert = loadCertificate(resolveCertSource(context), context.certificatePassword)
    this.tlsKey = cert.privateKeyPem
    this.tlsCert = cert.certificatePem
  }

  async emitirNfse(dpsXmlGZipB64: string): Promise<EmissaoNfseResponse> {
    const data = await this.post('/nfse', { dpsXmlGZipB64 })
    return this.parseEmissaoResponse(data)
  }

  async consultarNfse(chaveAcesso: string): Promise<ConsultaNfseResponse> {
    const data = await this.get(`/nfse/${chaveAcesso}`)
    return this.parseConsultaResponse(data)
  }

  async consultarDps(idDps: string): Promise<ConsultaDpsResponse> {
    // O endpoint GET /dps/{id} espera 42 dígitos numéricos (sem prefixo DPS)
    // e retorna a chave de acesso da NFS-e correspondente.
    const id = idDps.replace(/^DPS/, '')
    const data = await this.get(`/dps/${id}`) as Record<string, unknown>

    if (this.context.debug) {
      console.log('[debug] Resposta bruta consultarDps:', JSON.stringify(data, null, 2))
    }

    return {
      chaveAcesso: data?.['chaveAcesso'] ? String(data['chaveAcesso']) : undefined,
      cStat:   data?.['cStat']   ? String(data['cStat'])   : undefined,
      xMotivo: data?.['xMotivo'] ? String(data['xMotivo']) : undefined,
    }
  }

  /** HEAD /dps/{id} — verifica existência sem retornar chave de acesso. */
  async verificarDps(idDps: string): Promise<boolean> {
    try {
      const id = idDps.replace(/^DPS/, '')
      const res = await fetch(`${this.baseUrl}/dps/${id}`, {
        method: 'HEAD',
        // @ts-ignore
        tls: { key: this.tlsKey, cert: this.tlsCert, rejectUnauthorized: false },
      })
      return res.ok
    } catch { return false }
  }

  async registrarEvento(chaveAcesso: string, eventoXmlGZipB64: string): Promise<RegistroEventoResponse> {
    // Campo correto conforme PHP SDK de referência: pedidoRegistroEventoXmlGZipB64
    const data = await this.post(`/nfse/${chaveAcesso}/eventos`, { pedidoRegistroEventoXmlGZipB64: eventoXmlGZipB64 }) as Record<string, unknown>
    if (this.context.debug) {
      console.log('[debug] Resposta bruta registrarEvento:', JSON.stringify(data, null, 2))
    }

    const result: RegistroEventoResponse = {
      cStat:   String(data?.['cStat']   ?? ''),
      xMotivo: String(data?.['xMotivo'] ?? ''),
    }

    // A API retorna o XML do evento processado em eventoXmlGZipB64
    // cStat/xMotivo costumam estar dentro do XML, não na raiz do JSON
    const xmlB64 = data?.['eventoXmlGZipB64'] ? String(data['eventoXmlGZipB64']) : undefined
    if (xmlB64) {
      result.eventoXmlGZipB64 = xmlB64
      try {
        const xml = await decompressXml(xmlB64)
        // Extrai cStat/xMotivo do XML de retorno do evento
        const cStatMatch  = xml.match(/<cStat>(\d+)<\/cStat>/)
        const xMotivoMatch = xml.match(/<xMotivo>([^<]+)<\/xMotivo>/)
        if (!result.cStat   && cStatMatch?.[1])   result.cStat   = cStatMatch[1]
        if (!result.xMotivo && xMotivoMatch?.[1]) result.xMotivo = xMotivoMatch[1]
      } catch { /* mantém o que tiver */ }
    }

    return result
  }

  async downloadDanfse(chaveAcesso: string): Promise<string> {
    const data = await this.get(`/nfse/${chaveAcesso}/pdf`) as Record<string, unknown>
    return String(data?.['pdf'] ?? data?.['danfse'] ?? '')
  }

  /** GET /nfse/{chaveAcesso}/eventos */
  async listarEventos(chaveAcesso: string): Promise<unknown[]> {
    const data = await this.get(`/nfse/${chaveAcesso}/eventos`)
    return Array.isArray(data) ? data : ((data as Record<string, unknown>)?.['eventos'] as unknown[] ?? [])
  }

  /** GET /nfse/{chaveAcesso}/eventos/{tipoEvento} */
  async listarEventosPorTipo(chaveAcesso: string, tipoEvento: number): Promise<unknown[]> {
    const data = await this.get(`/nfse/${chaveAcesso}/eventos/${tipoEvento}`)
    return Array.isArray(data) ? data : ((data as Record<string, unknown>)?.['eventos'] as unknown[] ?? [])
  }

  /** GET /nfse/{chaveAcesso}/eventos/{tipoEvento}/{numSeqEvento} */
  async consultarEvento(chaveAcesso: string, tipoEvento: number, numSeqEvento: number): Promise<unknown> {
    return this.get(`/nfse/${chaveAcesso}/eventos/${tipoEvento}/${numSeqEvento}`)
  }

  /** GET /parametros_municipais/{codigoMunicipio}/convenio */
  async consultarParametrosConvenio(codMunicipio: string): Promise<unknown> {
    return this.get(`/parametros_municipais/${codMunicipio}/convenio`)
  }

  /** GET /parametros_municipais/{codigoMunicipio}/{codigoServico} */
  async consultarAliquota(codMunicipio: string, codServico: string): Promise<unknown> {
    return this.get(`/parametros_municipais/${codMunicipio}/${codServico}`)
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
      // @ts-ignore — Bun tls option for mTLS
      tls: { key: this.tlsKey, cert: this.tlsCert, rejectUnauthorized: false },
    })
    return this.handleResponse(res)
  }

  private async get(path: string): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      // @ts-ignore — Bun tls option for mTLS
      tls: { key: this.tlsKey, cert: this.tlsCert, rejectUnauthorized: false },
    })
    return this.handleResponse(res)
  }

  private async handleResponse(res: Response): Promise<unknown> {
    const text = await res.text()
    if (!res.ok) throw new NfseApiError(`Erro ${res.status}: ${res.statusText}`, res.status, text)
    try { return JSON.parse(text) } catch { return { raw: text } }
  }

  private async parseEmissaoResponse(data: unknown): Promise<EmissaoNfseResponse> {
    const d = data as Record<string, unknown>

    if (this.context.debug) {
      console.log('[debug] Resposta bruta da API:', JSON.stringify(d, null, 2))
    }

    const result: EmissaoNfseResponse = {
      cStat:       String(d?.['cStat'] ?? ''),
      xMotivo:     String(d?.['xMotivo'] ?? ''),
      chaveAcesso: d?.['chaveAcesso'] ? String(d['chaveAcesso']) : undefined,
      idNfse:      d?.['idDps'] ? String(d['idDps']) : undefined,
    }

    if (d?.['nfseXmlGZipB64']) {
      result.nfseXmlGZipB64 = String(d['nfseXmlGZipB64'])
      try {
        const xml = await decompressXml(result.nfseXmlGZipB64)
        const schema = parseNfseXml(xml)
        result.nfse = {
          infNfse: schema.infNFSe ? {
            id: schema.infNFSe.id,
            chNFSe: schema.infNFSe.chNFSe,
            nNFSe: schema.infNFSe.nNFSe,
            dhProc: schema.infNFSe.dhProc,
            cStat: schema.infNFSe.cStat,
            xMotivo: schema.infNFSe.xMotivo,
          } : undefined,
          originalXml: xml,
        }
        // A API retorna cStat/xMotivo no XML da NFS-e quando não os inclui na raiz
        if (!result.cStat && schema.infNFSe?.cStat) result.cStat = String(schema.infNFSe.cStat)
        if (!result.xMotivo && schema.infNFSe?.xMotivo) result.xMotivo = String(schema.infNFSe.xMotivo)
        // chaveAcesso pode vir no XML como chNFSe
        if (!result.chaveAcesso && schema.infNFSe?.chNFSe) result.chaveAcesso = String(schema.infNFSe.chNFSe)
      } catch { /* mantém só o base64 */ }
    }

    // Fallback: nfseXmlGZipB64 presente = emissão aprovada
    if (!result.cStat && result.nfseXmlGZipB64) result.cStat = '100'
    if (result.cStat === '100' && !result.xMotivo) result.xMotivo = 'NFS-e emitida com sucesso'

    return result
  }

  private async parseConsultaResponse(data: unknown): Promise<ConsultaNfseResponse> {
    const d = data as Record<string, unknown>

    if (this.context.debug) {
      console.log('[debug] Resposta bruta consulta:', JSON.stringify(d, null, 2))
    }

    const result: ConsultaNfseResponse = {
      cStat: String(d?.['cStat'] ?? ''),
      xMotivo: String(d?.['xMotivo'] ?? ''),
    }

    const xmlB64 = d?.['nfseXmlGZipB64'] ? String(d['nfseXmlGZipB64']) : undefined
    if (xmlB64) {
      try {
        const xml = await decompressXml(xmlB64)
        const schema = parseNfseXml(xml)
        result.nfse = { originalXml: xml }
        // cStat/xMotivo costumam vir dentro do XML, não no root do JSON
        if (!result.cStat && schema.infNFSe?.cStat)   result.cStat   = String(schema.infNFSe.cStat)
        if (!result.xMotivo && schema.infNFSe?.xMotivo) result.xMotivo = String(schema.infNFSe.xMotivo)
      } catch { /* mantém o que tiver */ }
      // Fallback: se o XML chegou, a nota existe e está ativa
      if (!result.cStat)   result.cStat   = '100'
      if (!result.xMotivo) result.xMotivo = 'NFS-e ativa'
    }

    return result
  }
}

export class NfseApiError extends Error {
  constructor(message: string, public readonly statusCode: number, public readonly body: string) {
    super(message)
    this.name = 'NfseApiError'
  }
}
