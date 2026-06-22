/**
 * Testes da URL de consulta pública embutida no QR Code da DANF-Se.
 * O host muda conforme o ambiente (tpAmb).
 */

import { describe, test, expect } from 'bun:test'
import { buildQrUrl } from '../../src/danfe/html-renderer.js'

const CHAVE = '35260112345678000190000000000000000000000001'

describe('buildQrUrl', () => {
  test('produção (tpAmb=1) usa host nfse.gov.br', () => {
    expect(buildQrUrl(CHAVE, 1)).toBe(
      `https://www.nfse.gov.br/ConsultaPublica/?tpc=1&chave=${CHAVE}`
    )
  })

  test('tpAmb ausente assume produção', () => {
    expect(buildQrUrl(CHAVE)).toBe(
      `https://www.nfse.gov.br/ConsultaPublica/?tpc=1&chave=${CHAVE}`
    )
  })

  test('homologação (tpAmb=2) usa host producaorestrita.nfse.gov.br', () => {
    expect(buildQrUrl(CHAVE, 2)).toBe(
      `https://www.producaorestrita.nfse.gov.br/ConsultaPublica/?tpc=1&chave=${CHAVE}`
    )
  })

  test('suporta tpAmb como string (defensivo p/ schemas montados à mão)', () => {
    expect(buildQrUrl(CHAVE, '1')).toBe(
      `https://www.nfse.gov.br/ConsultaPublica/?tpc=1&chave=${CHAVE}`
    )
    expect(buildQrUrl(CHAVE, '2')).toBe(
      `https://www.producaorestrita.nfse.gov.br/ConsultaPublica/?tpc=1&chave=${CHAVE}`
    )
  })

  test('sem chave retorna apenas o host do ambiente', () => {
    expect(buildQrUrl('', 1)).toBe('https://www.nfse.gov.br')
    expect(buildQrUrl('', 2)).toBe('https://www.producaorestrita.nfse.gov.br')
  })
})
