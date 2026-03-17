/**
 * Gerador de PDF via Puppeteer (HTML → PDF)
 * Migrado de direction-nfse-danfe/src/Danfe/Pdf/DanfePdfGenerator.cs
 * (que usava NReco.PdfGenerator em .NET)
 */

import puppeteer from 'puppeteer'

export interface PdfOptions {
  format?: 'A4' | 'A3' | 'Letter'
  printBackground?: boolean
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
}

const DEFAULT_OPTIONS: PdfOptions = {
  format: 'A4',
  printBackground: true,
  marginTop: '10mm',
  marginBottom: '0mm',
  marginLeft: '0mm',
  marginRight: '0mm',
}

export async function generatePdfFromHtml(html: string, options: PdfOptions = {}): Promise<Buffer> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({
      format: opts.format,
      printBackground: opts.printBackground,
      margin: {
        top: opts.marginTop,
        bottom: opts.marginBottom,
        left: opts.marginLeft,
        right: opts.marginRight,
      },
    })

    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}
