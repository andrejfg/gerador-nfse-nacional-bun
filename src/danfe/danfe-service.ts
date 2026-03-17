/**
 * Serviço principal de geração da DANF-Se
 * Migrado de direction-nfse-danfe/src/Danfe/Public/DanfeService.cs
 */

import { parseNfseXml, type NfseSchema } from '../xml/nfse-parser.js'
import { renderDanfseHtml, type DanfeOptions, type DanfeWarning } from './html-renderer.js'
import { generatePdfFromHtml, type PdfOptions } from './pdf-generator.js'
import { DanfeEnvironment } from '../types/enums.js'
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
}
