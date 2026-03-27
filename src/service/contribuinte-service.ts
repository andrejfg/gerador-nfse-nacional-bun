/**
 * Serviço principal para emissão e consulta de NFS-e pelo prestador
 * Migrado de nfse-php/src/Service/ContribuinteService.php
 *
 * Fluxo: DPS → XML → XMLDSig → GZip+Base64 → API SEFIN Nacional
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { NfseContext } from '../types/context.js'
import type {
  DpsData,
  EmissaoNfseResponse,
  ConsultaNfseResponse,
  ConsultaDpsResponse,
  RegistroEventoResponse,
  PedRegEventoData,
} from '../types/dtos.js'
import { buildDpsXml } from '../xml/dps-builder.js'
import { buildPedRegEventoXml } from '../xml/eventos-builder.js'
import { loadCertificate, resolveCertSource } from '../crypto/certificate.js'
import { signXml, compressXml } from '../crypto/xml-signer.js'
import { SefinClient, NfseApiError } from '../http/sefin-client.js'
import { validateDps } from '../validator/dps-validator.js'

export class ContribuinteService {
  private client: SefinClient

  constructor(private context: NfseContext) {
    this.client = new SefinClient(context)
  }

  /**
   * Emite uma NFS-e a partir de um DPS.
   * Valida o DPS (schema XSD v1.01 + regras de negócio) antes de enviar.
   * Lança `DpsValidationError` se houver erros, evitando chamadas desnecessárias à API.
   */
  async emitir(dps: DpsData): Promise<EmissaoNfseResponse> {
    const validation = validateDps(dps)
    if (!validation.isValid) {
      throw new DpsValidationError(validation.errors)
    }
    const xml = buildDpsXml(dps)
    const cert = loadCertificate(resolveCertSource(this.context), this.context.certificatePassword)
    const signedXml = signXml(xml, 'infDPS', cert, 'SHA256')
    if (this.context.debug) {
      await saveDebugXml(dps.infDps.id, xml, signedXml)
    }
    const gzipB64 = await compressXml(signedXml)
    return this.client.emitirNfse(gzipB64)
  }

  async consultar(chaveAcesso: string): Promise<ConsultaNfseResponse> {
    return this.client.consultarNfse(chaveAcesso)
  }

  async consultarDps(idDps: string): Promise<ConsultaDpsResponse> {
    return this.client.consultarDps(idDps)
  }

  async verificarDps(idDps: string): Promise<boolean> {
    return this.client.verificarDps(idDps)
  }

  /**
   * Cancela uma NFS-e via registro de evento.
   *
   * Antes de enviar o cancelamento, consulta a NFS-e pela chave de acesso para
   * verificar sua existência. Lança `NfseNaoEncontradaError` se não for localizada.
   */
  async cancelar(evento: PedRegEventoData): Promise<RegistroEventoResponse> {
    const consulta = await this.client.consultarNfse(evento.chNFSe)
    if (!consulta.nfse?.originalXml) {
      throw new NfseNaoEncontradaError(
        evento.chNFSe,
        consulta.cStat || '404',
        consulta.xMotivo || 'NFS-e não localizada na SEFIN.',
      )
    }

    const eventoXml = buildPedRegEventoXml(evento)
    const cert = loadCertificate(resolveCertSource(this.context), this.context.certificatePassword)
    const signedEvento = signXml(eventoXml, 'infPedReg', cert, 'SHA256')
    if (this.context.debug) {
      await saveDebugXml(`EVT_${evento.chNFSe}`, eventoXml, signedEvento)
    }
    const gzipB64 = await compressXml(signedEvento)
    try {
      return await this.client.registrarEvento(evento.chNFSe, gzipB64)
    } catch (err) {
      if (err instanceof NfseApiError && err.body?.includes('E0840')) {
        throw new NfseJaCanceladaError(evento.chNFSe)
      }
      throw err
    }
  }

  /** Lista todos os eventos de uma NFS-e. */
  async consultarEventos(chaveAcesso: string): Promise<unknown[]> {
    return this.client.listarEventos(chaveAcesso)
  }

  /** Lista eventos de um tipo específico (ex: `TipoEventoCancelamento.ErroEmissao`). */
  async consultarEventosPorTipo(chaveAcesso: string, tipoEvento: number): Promise<unknown[]> {
    return this.client.listarEventosPorTipo(chaveAcesso, tipoEvento)
  }

  /** Consulta um evento específico por tipo e número sequencial. */
  async consultarEvento(chaveAcesso: string, tipoEvento: number, numSeqEvento = 1): Promise<unknown> {
    return this.client.consultarEvento(chaveAcesso, tipoEvento, numSeqEvento)
  }

  async downloadDanfse(chaveAcesso: string): Promise<string> {
    return this.client.downloadDanfse(chaveAcesso)
  }

  async consultarConvenio(codMunicipio: string): Promise<unknown> {
    return this.client.consultarParametrosConvenio(codMunicipio)
  }

  async consultarAliquota(codMunicipio: string, codServico: string): Promise<unknown> {
    return this.client.consultarAliquota(codMunicipio, codServico)
  }
}

async function saveDebugXml(id: string, xml: string, signedXml: string): Promise<void> {
  const dir = join(process.cwd(), 'debug')
  await mkdir(dir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  await writeFile(join(dir, `${ts}_dps.xml`), xml, 'utf-8')
  await writeFile(join(dir, `${ts}_dps-signed.xml`), signedXml, 'utf-8')
  console.log(`[debug] XMLs salvos em debug/${ts}_dps.xml e debug/${ts}_dps-signed.xml`)
}

/**
 * Erro lançado quando o DPS falha na validação antes do envio à API.
 * A propriedade `errors` contém todas as mensagens em português com o campo correspondente.
 */
export class DpsValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`DPS inválido — ${errors.length} erro(s):\n${errors.map(e => `  • ${e}`).join('\n')}`)
    this.name = 'DpsValidationError'
  }
}

/**
 * Erro lançado quando a NFS-e não é localizada na SEFIN antes do cancelamento.
 */
export class NfseNaoEncontradaError extends Error {
  override readonly name = 'NfseNaoEncontradaError'
  constructor(
    public readonly chaveAcesso: string,
    public readonly cStat: string,
    public readonly xMotivo: string,
  ) {
    super(`NFS-e nao encontrada para cancelamento - chave: ${chaveAcesso} | cStat: ${cStat} | ${xMotivo}`)
  }
}

/**
 * Erro lançado quando a NFS-e já possui um evento de cancelamento vinculado (E0840).
 * A nota não pode ser cancelada novamente.
 */
export class NfseJaCanceladaError extends Error {
  override readonly name = 'NfseJaCanceladaError'
  constructor(public readonly chaveAcesso: string) {
    super(`NFS-e ja esta cancelada - chave: ${chaveAcesso}`)
  }
}
