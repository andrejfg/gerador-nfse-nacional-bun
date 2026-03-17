/**
 * Serviço principal para emissão e consulta de NFS-e pelo prestador
 * Migrado de nfse-php/src/Service/ContribuinteService.php
 *
 * Fluxo: DPS → XML → XMLDSig → GZip+Base64 → API SEFIN Nacional
 */

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
import { loadCertificate } from '../crypto/certificate.js'
import { signXml, compressXml } from '../crypto/xml-signer.js'
import { SefinClient } from '../http/sefin-client.js'

export class ContribuinteService {
  private client: SefinClient

  constructor(private context: NfseContext) {
    this.client = new SefinClient(context)
  }

  /**
   * Emite uma NFS-e a partir de um DPS
   */
  async emitir(dps: DpsData): Promise<EmissaoNfseResponse> {
    const xml = buildDpsXml(dps)
    const cert = loadCertificate(this.context.certificatePath, this.context.certificatePassword)
    const signedXml = signXml(xml, 'infDPS', cert, 'SHA256')
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
   * Cancela uma NFS-e via registro de evento
   */
  async cancelar(evento: PedRegEventoData): Promise<RegistroEventoResponse> {
    const eventoXml = buildPedRegEventoXml(evento)
    const cert = loadCertificate(this.context.certificatePath, this.context.certificatePassword)
    const signedEvento = signXml(eventoXml, 'infPedReg', cert, 'SHA256')
    const gzipB64 = await compressXml(signedEvento)
    return this.client.registrarEvento(evento.chNFSe, gzipB64)
  }

  async consultarEventos(chaveAcesso: string): Promise<unknown[]> {
    return this.client.listarEventos(chaveAcesso)
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
