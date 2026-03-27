/**
 * Serviço principal de geração da DANF-Se
 * Migrado de direction-nfse-danfe/src/Danfe/Public/DanfeService.cs
 */

import { parseNfseXml, type NfseSchema } from '../xml/nfse-parser.js'
import { renderDanfseHtml, type DanfeOptions, type DanfeWarning } from './html-renderer.js'
import { generatePdfFromHtml, type PdfOptions } from './pdf-generator.js'
import { buildPreviewSchema } from './preview-builder.js'
import { DanfeEnvironment, DanfePreviewFormat } from '../types/enums.js'
import type { InfDpsData } from '../types/dtos.js'
import { writeFileSync } from 'node:fs'

export interface DanfeResult {
  environment: DanfeEnvironment
  html: string
  pdfBytes: Buffer
  warnings: DanfeWarning[]
}

export interface DanfeGenerateOptions {
  danfe?: DanfeOptions
  pdf?: PdfOptions
  isCancelled?: boolean
  /**
   * Chave de acesso da NFS-e retornada pela API SEFIN (`chaveAcesso` no JSON).
   * Usada quando o XML da NFS-e não contém o elemento `<chNFSe>` — o que ocorre
   * em algumas versões do EmissorWeb onde a chave é enviada apenas na raiz JSON.
   */
  chaveAcesso?: string
}

export { DanfePreviewFormat } from '../types/enums.js'

export interface PreviewOptions {
  /** Formato de saída. Padrão: `DanfePreviewFormat.Html`. */
  format?: DanfePreviewFormat
  danfe?: Omit<DanfeOptions, 'isPreview'>
  pdf?: PdfOptions
}

export interface PreviewResult {
  format: DanfePreviewFormat
  html: string
  /** Disponível apenas quando `format === DanfePreviewFormat.Pdf`. */
  pdfBytes?: Buffer
  warnings: DanfeWarning[]
  environment: DanfeEnvironment
}

export class DanfeService {
  constructor(private options: DanfeOptions = {}) {}

  async generateFromXml(xml: string, opts: DanfeGenerateOptions = {}): Promise<DanfeResult> {
    return this.generate(parseNfseXml(xml), opts)
  }

  async generateFromGzipB64(gzipB64: string, opts: DanfeGenerateOptions = {}): Promise<DanfeResult> {
    const { decompressXml } = await import('../crypto/xml-signer.js')
    const xml = await decompressXml(gzipB64)
    return this.generateFromXml(xml, opts)
  }

  async generate(schema: NfseSchema, opts: DanfeGenerateOptions = {}): Promise<DanfeResult> {
    // Injeta chaveAcesso quando o XML não traz <chNFSe> (comportamento do EmissorWeb)
    if (opts.chaveAcesso && schema.infNFSe && !schema.infNFSe.chNFSe) {
      schema.infNFSe.chNFSe = opts.chaveAcesso
    }
    const danfeOpts = { ...this.options, ...opts.danfe }
    const { html, warnings, environment } = await renderDanfseHtml(schema, opts.isCancelled ?? false, danfeOpts)
    const pdfBytes = await generatePdfFromHtml(html, opts.pdf)
    return { environment, html, pdfBytes, warnings }
  }

  async saveToFile(xmlOrGzipB64: string, outputPath: string, isGzip = false, opts: DanfeGenerateOptions = {}): Promise<DanfeResult> {
    const result = isGzip
      ? await this.generateFromGzipB64(xmlOrGzipB64, opts)
      : await this.generateFromXml(xmlOrGzipB64, opts)
    writeFileSync(outputPath, result.pdfBytes)
    return result
  }

  /**
   * Gera um preview da DANF-Se a partir dos dados do DPS, **antes** de enviar
   * à API SEFIN. O documento gerado possui uma marca d'água "PRÉVIA — SEM VALOR
   * FISCAL" e não representa uma NFS-e válida.
   *
   * @param dps    - Dados do DPS (o mesmo objeto passado para `emitirNfse`).
   * @param opts   - Opções de saída (`format`: `'html'` ou `'pdf'`).
   */
  async previewFromDps(dps: InfDpsData, opts: PreviewOptions = {}): Promise<PreviewResult> {
    const format = opts.format ?? DanfePreviewFormat.Html
    const schema = buildPreviewSchema(dps)
    const danfeOpts: DanfeOptions = { ...this.options, ...opts.danfe, isPreview: true }
    const { html, warnings, environment } = await renderDanfseHtml(schema, false, danfeOpts)

    if (format === DanfePreviewFormat.Html) {
      return { format, html, warnings, environment }
    }

    const pdfBytes = await generatePdfFromHtml(html, opts.pdf)
    return { format, html, pdfBytes, warnings, environment }
  }
}
