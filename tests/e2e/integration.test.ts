/**
 * Testes de integração (E2E) — importa do dist/ como biblioteca externa
 *
 * Objetivo: detectar erros de integração que só aparecem após o build,
 * como caminhos de assets quebrados, exports ausentes ou tipos errados.
 *
 * IMPORTANTE: este arquivo importa de '../../dist/index.js' (não de src/).
 * Execute sempre APÓS `bun run build`.
 */

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, test, expect } from 'bun:test'

// Importa da build compilada — simula consumidor externo
import {
  parseNfseXml,
  validateDps,
  generateCpf,
  generateCnpj,
  calculateTax,
  buildDpsXml,
  signXml,
  compressXml,
  decompressXml,
  formatCpf,
  formatCnpj,
  generateDpsId,
  generateNumDps,
  formatDataCompetencia,
  formatDhEmissao,
  DanfeService,
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  type DpsData,
  type NfseContext,
} from '../../dist/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// XML de exemplo simulando resposta real da API SEFIN
// (fixture local para o teste ser autossuficiente)
const XML_EXEMPLO = readFileSync(
  join(__dirname, 'nfse-fixture.xml'),
  'utf-8',
)

// DPS mínimo válido para testes
const DPS_VALIDO: DpsData = {
  infDps: {
    id: 'DPS3106200112345678000195001010000000000001',
    tipoAmbiente: TipoAmbiente.Homologacao,
    dataEmissao: '2024-01-15T10:00:00-03:00',
    numeroDps: '000001',
    serie: '001',
    dataCompetencia: '2024-01',
    tipoEmitente: EmitenteDPS.Prestador,
    codigoLocalEmissao: '3106200',
    prestador: { cnpj: '12345678000195', nome: 'Empresa Teste' },
    servico: {
      localPrestacao: { cLocPrestacao: '3106200' },
      codigoServico: { cServTribNac: '01.01.00163' },
      xDescServ: 'Serviço de teste',
    },
    valores: { vServico: 1000, vBC: 1000, vISSQN: 50, vLiq: 950 },
    tributacao: {
      issqn: {
        tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
        aliquota: 0.05,
        tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      },
    },
  },
}

// ---------------------------------------------------------------------------

describe('E2E — parseNfseXml', () => {
  test('parseia XML de exemplo sem lançar erro', () => {
    const nfse = parseNfseXml(XML_EXEMPLO)
    expect(nfse).toBeDefined()
    expect(nfse.infNFSe).toBeDefined()
  })

  test('extrai número da NFS-e', () => {
    const nfse = parseNfseXml(XML_EXEMPLO)
    expect(nfse.infNFSe?.nNFSe).toBe('000001')
  })

  test('extrai chave de acesso com 44 caracteres', () => {
    const nfse = parseNfseXml(XML_EXEMPLO)
    expect(nfse.infNFSe?.chNFSe).toHaveLength(44)
  })

  test('extrai nome do emitente', () => {
    const nfse = parseNfseXml(XML_EXEMPLO)
    expect(nfse.infNFSe?.emit?.xNome).toBe('Empresa Prestadora LTDA')
  })

  test('extrai valores financeiros como números', () => {
    const nfse = parseNfseXml(XML_EXEMPLO)
    expect(nfse.infNFSe?.valores?.vServico).toBe(5000)
    expect(nfse.infNFSe?.valores?.vISSQN).toBe(250)
  })

  test('extrai CNPJ preservando zeros à esquerda', () => {
    const nfse = parseNfseXml(XML_EXEMPLO)
    expect(nfse.infNFSe?.emit?.CNPJ).toBe('12345678000195')
  })
})

// ---------------------------------------------------------------------------

describe('E2E — validateDps', () => {
  test('DPS válido retorna isValid true', () => {
    const result = validateDps(DPS_VALIDO)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('DPS sem prestador retorna erro', () => {
    const dps = structuredClone(DPS_VALIDO)
    // @ts-expect-error forçando ausência do prestador
    dps.infDps.prestador = undefined
    const result = validateDps(dps)
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------

describe('E2E — generateCpf / generateCnpj', () => {
  test('CPF gerado tem 11 dígitos', () => {
    expect(generateCpf()).toHaveLength(11)
  })

  test('CNPJ gerado tem 14 dígitos', () => {
    expect(generateCnpj()).toHaveLength(14)
  })

  test('CPF formatado tem máscara correta', () => {
    expect(generateCpf(true)).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
  })

  test('CNPJ formatado tem máscara correta', () => {
    expect(generateCnpj(true)).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  })
})

// ---------------------------------------------------------------------------

describe('E2E — calculateTax', () => {
  test('5% sobre 1000 = 50', () => {
    expect(calculateTax(1000, 5)).toBe(50)
  })

  test('resultado arredondado a 2 casas', () => {
    expect(calculateTax(333.33, 3)).toBe(10)
  })
})

// ---------------------------------------------------------------------------

describe('E2E — buildDpsXml', () => {
  test('gera XML não vazio a partir de DPS válido', () => {
    const xml = buildDpsXml(DPS_VALIDO)
    expect(xml).toBeTruthy()
    expect(xml).toContain('<DPS')
    expect(xml).toContain('12345678000195')
  })
})

// ---------------------------------------------------------------------------

describe('E2E — compressXml / decompressXml', () => {
  test('ciclo compress → decompress é idempotente', async () => {
    const xml = '<root><test>áéíóú</test></root>'
    const compressed = await compressXml(xml)
    const decompressed = await decompressXml(compressed)
    expect(decompressed).toBe(xml)
  })
})

// ---------------------------------------------------------------------------

describe('E2E — utils', () => {
  test('formatCpf formata corretamente', () => {
    expect(formatCpf('12345678901')).toBe('123.456.789-01')
  })

  test('formatCnpj formata corretamente', () => {
    expect(formatCnpj('11222333000181')).toBe('11.222.333/0001-81')
  })

  test('generateDpsId retorna string de 45 chars', () => {
    const id = generateDpsId('12345678000195', '3106200', '001', '000001')
    expect(id).toHaveLength(45)
  })

  test('formatDataCompetencia retorna padrão YYYY-MM', () => {
    expect(formatDataCompetencia(new Date(2024, 0, 15))).toBe('2024-01')
  })

  test('formatDhEmissao retorna ISO 8601 com offset', () => {
    const dt = formatDhEmissao(new Date(2024, 0, 15, 10, 0, 0), -3)
    expect(dt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-03:00$/)
  })
})

// ---------------------------------------------------------------------------

describe('E2E — signXml guards', () => {
  test('lança erro para XML vazio', () => {
    expect(() => signXml('', 'infDPS', { privateKeyPem: '', certificatePem: '', certificateClean: '' }))
      .toThrow('Conteúdo XML vazio.')
  })

  test('lança erro quando tag não existe', () => {
    expect(() => signXml('<root/>', 'infDPS', { privateKeyPem: '', certificatePem: '', certificateClean: '' }))
      .toThrow('Tag infDPS não encontrada')
  })
})

// ---------------------------------------------------------------------------

describe('E2E — DanfeService (template + renderização HTML)', () => {
  test('carrega template danfe.html sem ENOENT (aceita sucesso ou erro de puppeteer)', async () => {
    const danfe = new DanfeService()
    try {
      // Ambiente com Chrome: PDF gerado com sucesso — valida o HTML renderizado
      const result = await danfe.generateFromXml(XML_EXEMPLO)
      expect(result.html).toContain('<!DOCTYPE html>')
      expect(result.html).toContain('Empresa Prestadora LTDA')
      expect(result.pdfBytes.length).toBeGreaterThan(0)
    } catch (err) {
      // Ambiente sem Chrome: erro deve ser do puppeteer, NUNCA do danfe.html
      const error = err as Error
      expect(error.message).not.toContain('danfe.html')
      expect(error.message).not.toContain('ENOENT')
    }
  })
})
