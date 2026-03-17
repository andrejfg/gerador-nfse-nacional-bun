/**
 * Cliente HTTP para a API SEFIN Nacional com mTLS
 * Migrado de nfse-php/src/Http/Client/SefinClient.php
 */

import https from 'node:https'
import { readFileSync } from 'node:fs'
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

export class SefinClient {
  private baseUrl: string
  private agent: https.Agent

  constructor(private context: NfseContext) {
    this.baseUrl = resolveBaseUrl(context).replace(/\/$/, '')
    const pfxBuffer = readFileSync(context.certificatePath)
    this.agent = new https.Agent({
      pfx: pfxBuffer,
      passphrase: context.certificatePassword,
      rejectUnauthorized: false,
    })
  }

  async emitirNfse(dpsXmlGZipB64: string): Promise<EmissaoNfseResponse> {
    const data = await this.post('/nfse/dps', { dpsXmlGZipB64 })
    return this.parseEmissaoResponse(data)
  }

  async consultarNfse(chaveAcesso: string): Promise<ConsultaNfseResponse> {
    const data = await this.get(`/nfse/${chaveAcesso}`)
    return this.parseConsultaResponse(data)
  }

  async consultarDps(idDps: string): Promise<ConsultaDpsResponse> {
    const data = await this.get(`/dps/${idDps}`) as Record<string, unknown>
    return {
      cStat: String(data?.['cStat'] ?? ''),
      xMotivo: String(data?.['xMotivo'] ?? ''),
      situacao: String(data?.['situacao'] ?? ''),
    }
  }

  async registrarEvento(chaveAcesso: string, eventoXmlGZipB64: string): Promise<RegistroEventoResponse> {
    const data = await this.post(`/nfse/${chaveAcesso}/eventos`, { pedRegEventoXmlGZipB64: eventoXmlGZipB64 }) as Record<string, unknown>
    return { cStat: String(data?.['cStat'] ?? ''), xMotivo: String(data?.['xMotivo'] ?? '') }
  }

  async downloadDanfse(chaveAcesso: string): Promise<string> {
    const data = await this.get(`/nfse/${chaveAcesso}/pdf`) as Record<string, unknown>
    return String(data?.['pdf'] ?? data?.['danfse'] ?? '')
  }

  async listarEventos(chaveAcesso: string): Promise<unknown[]> {
    const data = await this.get(`/nfse/${chaveAcesso}/eventos`)
    return Array.isArray(data) ? data : ((data as Record<string, unknown>)?.['eventos'] as unknown[] ?? [])
  }

  async verificarDps(idDps: string): Promise<boolean> {
    try {
      const data = await this.get(`/dps/${idDps}/existe`)
      return Boolean((data as Record<string, unknown>)?.['existe'] ?? false)
    } catch { return false }
  }

  async consultarParametrosConvenio(codMunicipio: string): Promise<unknown> {
    return this.get(`/municipios/${codMunicipio}/convenio`)
  }

  async consultarAliquota(codMunicipio: string, codServico: string): Promise<unknown> {
    return this.get(`/municipios/${codMunicipio}/aliquotas/${codServico}`)
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
      // @ts-ignore — Bun/Node.js agent for mTLS
      agent: this.agent,
    })
    return this.handleResponse(res)
  }

  private async get(path: string): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      // @ts-ignore
      agent: this.agent,
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
    const result: EmissaoNfseResponse = {
      cStat: String(d?.['cStat'] ?? ''),
      xMotivo: String(d?.['xMotivo'] ?? ''),
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
      } catch { /* mantém só o base64 */ }
    }
    return result
  }

  private async parseConsultaResponse(data: unknown): Promise<ConsultaNfseResponse> {
    const d = data as Record<string, unknown>
    const result: ConsultaNfseResponse = {
      cStat: String(d?.['cStat'] ?? ''),
      xMotivo: String(d?.['xMotivo'] ?? ''),
    }
    if (d?.['nfseXmlGZipB64']) {
      try {
        const xml = await decompressXml(String(d['nfseXmlGZipB64']))
        result.nfse = { originalXml: xml }
      } catch { /* ignora */ }
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
