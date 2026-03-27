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
  generateDpsId, formatDataCompetencia,
  formatDhEmissao,
  DanfeService,
  DanfePreviewFormat,
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  OpcaoSimplesNacional,
  RegimeEspecialTributacao,
  type DpsData, type InfDpsData
} from '../../dist/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// XML de exemplo simulando resposta real da API SEFIN
// (fixture local para o teste ser autossuficiente)
const XML_EXEMPLO = readFileSync(
  join(__dirname, 'nfse-fixture.xml'),
  'utf-8',
)

// DPS mínimo válido para testes
// ID = DPS + 3106200(7) + 2(CNPJ) + 53193608000146(14) + 00001(5) + 000000000000001(15) = 45 chars
const DPS_VALIDO: DpsData = {
  infDps: {
    id: 'DPS310620025319360800014600001000000000000001',
    tipoAmbiente: TipoAmbiente.Homologacao,
    dataEmissao: '2024-01-15T10:00:00-03:00',
    numeroDps: '1',
    serie: '001',
    dataCompetencia: '2024-01-15',
    tipoEmitente: EmitenteDPS.Prestador,
    codigoLocalEmissao: '3106200',
    prestador: {
      cnpj: '53193608000146',
      nome: 'Empresa Teste',
      regimeTributario: { opSimpNac: 1, regEspTrib: 0 },
    },
    servico: {
      localPrestacao: { cLocPrestacao: '3106200' },
      codigoServico: { cServTribNac: '010100' },
      xDescServ: 'Serviço de teste',
    },
    valores: { vServico: 1000 },
    tributacao: {
      issqn: {
        tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
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
    expect(nfse.infNFSe?.emit?.CNPJ).toBe('53193608000146')
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
    expect(xml).toContain('53193608000146')
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
    const id = generateDpsId('53193608000146', '3106200', '001', '000001')
    expect(id).toHaveLength(45)
  })

  test('formatDataCompetencia retorna padrão YYYY-MM-DD', () => {
    expect(formatDataCompetencia(new Date(2024, 0, 15))).toBe('2024-01-15')
  })

  test('formatDhEmissao retorna ISO 8601 com offset', () => {
    const dt = formatDhEmissao(new Date(2024, 0, 15, 10, 0, 0), -3)
    expect(dt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-03:00$/)
  })
})

// ---------------------------------------------------------------------------

const FAKE_CERT_E2E = {
  privateKeyPem: '', certificatePem: '', certificateClean: '',
  expiresAt: new Date(), commonName: '', pfxBuffer: Buffer.alloc(0), password: '',
}

describe('E2E — signXml guards', () => {
  test('lança erro para XML vazio', () => {
    expect(() => signXml('', 'infDPS', FAKE_CERT_E2E))
      .toThrow('Conteúdo XML vazio.')
  })

  test('lança erro quando tag não existe', () => {
    expect(() => signXml('<root/>', 'infDPS', FAKE_CERT_E2E))
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

// ---------------------------------------------------------------------------

const DPS_PREVIEW_E2E: InfDpsData = {
  id: 'DPS310620025319360800014600001000000000000099',
  tipoAmbiente: TipoAmbiente.Homologacao,
  dataEmissao: '2024-03-15T10:00:00-03:00',
  numeroDps: '000000000000099',
  serie: '001',
  dataCompetencia: '2024-03-15',
  tipoEmitente: EmitenteDPS.Prestador,
  codigoLocalEmissao: '3106200',
  prestador: {
    cnpj: '53193608000146',
    nome: 'Empresa E2E LTDA',
    telefone: '3133334444',
    email: 'e2e@empresa.com',
    endereco: { cMun: '3106200', uf: 'MG', cep: '30130170', xLgr: 'Rua E2E', nro: '1' },
    regimeTributario: {
      opSimpNac: OpcaoSimplesNacional.NaoOptante,
      regEspTrib: RegimeEspecialTributacao.Nenhum,
    },
  },
  tomador: {
    cnpj: '00000000000191',
    nome: 'Tomador E2E S/A',
    endereco: { cMun: '3550308', uf: 'SP', cep: '01310100', xLgr: 'Av E2E', nro: '99' },
  },
  servico: {
    localPrestacao: { cLocPrestacao: '3106200' },
    codigoServico: { cServTribNac: '010100163', cNBSPrinc: '109102000' },
    xDescServ: 'Serviço E2E de preview — sprint 99',
  },
  valores: { vServico: 2500, vBC: 2500, vISSQN: 125 },
  tributacao: {
    issqn: {
      tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
      tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      aliquota: 0.05,
    },
    percentualTotalTributosFederais: 11.33,
    percentualTotalTributosEstaduais: 0,
    percentualTotalTributosMunicipais: 2,
  },
}

describe('E2E — DanfeService.previewFromDps (dist)', () => {
  test('DanfePreviewFormat exportado do dist como enum válido', () => {
    expect(DanfePreviewFormat.Html).toBe('html' as DanfePreviewFormat)
    expect(DanfePreviewFormat.Pdf).toBe('pdf' as DanfePreviewFormat)
  })

  test('preview HTML retorna resultado com html e sem pdfBytes', async () => {
    const danfe = new DanfeService()
    const result = await danfe.previewFromDps(DPS_PREVIEW_E2E, { format: DanfePreviewFormat.Html })
    expect(result.html).toContain('<!DOCTYPE html>')
    expect(result.format).toBe(DanfePreviewFormat.Html)
    expect(result.pdfBytes).toBeUndefined()
  })

  test('preview HTML contém marca d\'água "PRÉVIA"', async () => {
    const danfe = new DanfeService()
    const { html } = await danfe.previewFromDps(DPS_PREVIEW_E2E, { format: DanfePreviewFormat.Html })
    expect(html).toContain('PRÉVIA')
    expect(html).toContain('SEM VALOR FISCAL')
    expect(html).toContain('danfe-preview-watermark')
  })

  test('preview HTML contém dados do prestador e tomador', async () => {
    const danfe = new DanfeService()
    const { html } = await danfe.previewFromDps(DPS_PREVIEW_E2E, { format: DanfePreviewFormat.Html })
    expect(html).toContain('Empresa E2E LTDA')
    expect(html).toContain('Tomador E2E S/A')
    expect(html).toContain('Serviço E2E de preview')
  })

  test('preview PDF retorna pdfBytes ou falha com erro de Puppeteer (não de template)', async () => {
    const danfe = new DanfeService()
    try {
      const result = await danfe.previewFromDps(DPS_PREVIEW_E2E, { format: DanfePreviewFormat.Pdf })
      expect(result.pdfBytes).toBeDefined()
      expect(result.pdfBytes!.length).toBeGreaterThan(0)
      expect(result.html).toContain('PRÉVIA')
    } catch (err) {
      const error = err as Error
      expect(error.message).not.toContain('danfe.html')
      expect(error.message).not.toContain('ENOENT')
      expect(error.message).not.toContain('buildPreviewSchema')
    }
  }, 30_000)
})
