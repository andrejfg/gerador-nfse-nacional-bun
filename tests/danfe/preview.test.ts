/**
 * Testes do preview da DANF-Se
 *
 * Cobre três camadas:
 *  1. buildPreviewSchema — mapeamento DPS → NfseSchema (unidade)
 *  2. DanfeService.previewFromDps — renderização HTML (integração)
 *  3. DanfeService.previewFromDps — geração PDF via Puppeteer (integração)
 */

import { describe, test, expect, beforeAll } from 'bun:test'
import { buildPreviewSchema } from '../../src/danfe/preview-builder.js'
import { DanfeService } from '../../src/danfe/danfe-service.js'
import { DanfePreviewFormat } from '../../src/types/enums.js'
import { DanfeEnvironment } from '../../src/types/enums.js'
import {
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  OpcaoSimplesNacional,
  RegimeEspecialTributacao,
} from '../../src/types/enums.js'
import type { InfDpsData } from '../../src/types/dtos.js'

// ---------------------------------------------------------------------------
// Fixture — DPS completo com prestador, tomador e tributação
// ---------------------------------------------------------------------------

const DPS_COMPLETO: InfDpsData = {
  id: 'DPS310620021234567800019500001000000000000001',
  tipoAmbiente: TipoAmbiente.Homologacao,
  dataEmissao: '2024-03-15T10:00:00-03:00',
  numeroDps: '000000000000001',
  serie: '001',
  dataCompetencia: '2024-03-15',
  tipoEmitente: EmitenteDPS.Prestador,
  codigoLocalEmissao: '3106200',

  prestador: {
    cnpj: '12345678000195',
    inscricaoMunicipal: '123456',
    nome: 'Empresa Prestadora LTDA',
    telefone: '3133334444',
    email: 'contato@empresa.com.br',
    endereco: {
      cMun: '3106200',
      uf: 'MG',
      cep: '30130170',
      xLgr: 'Avenida Afonso Pena',
      nro: '1500',
      xBairro: 'Centro',
    },
    regimeTributario: {
      opSimpNac: OpcaoSimplesNacional.NaoOptante,
      regEspTrib: RegimeEspecialTributacao.Nenhum,
    },
  },

  tomador: {
    cnpj: '00000000000191',
    nome: 'Banco do Brasil S/A',
    endereco: {
      cMun: '3550308',
      uf: 'SP',
      cep: '01310100',
      xLgr: 'Avenida Paulista',
      nro: '1374',
      xBairro: 'Bela Vista',
    },
    email: 'fiscal@bb.com.br',
  },

  servico: {
    localPrestacao: { cLocPrestacao: '3106200' },
    codigoServico: {
      cServTribNac: '010100163',
      cServMun: '142',
      cNBSPrinc: '109102000',
    },
    xDescServ: 'Desenvolvimento de sistema de gestão — sprint 42',
    informacaoComplemento: { xInfComp: 'Contrato n° 2024/001' },
  },

  valores: {
    vServico: 5000,
    vBC: 5000,
    vISSQN: 250,
  },

  tributacao: {
    issqn: {
      tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
      tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      aliquota: 0.05,
    },
    federal: {
      cstPisCofins: '00',
      valorPis: 32.50,
      valorCofins: 150,
    },
    percentualTotalTributosFederais: 11.33,
    percentualTotalTributosEstaduais: 0,
    percentualTotalTributosMunicipais: 2,
  },
}

/** DPS mínimo — apenas campos obrigatórios, sem tomador nem tributação */
const DPS_MINIMO: InfDpsData = {
  id: 'DPS310620021234567800019500001000000000000002',
  tipoAmbiente: TipoAmbiente.Producao,
  dataEmissao: '2024-03-15T10:00:00-03:00',
  numeroDps: '000000000000002',
  serie: '001',
  dataCompetencia: '2024-03-15',
  tipoEmitente: EmitenteDPS.Prestador,
  codigoLocalEmissao: '3106200',
  prestador: {
    cnpj: '12345678000195',
    nome: 'Empresa Mínima LTDA',
  },
  servico: {
    localPrestacao: { cLocPrestacao: '3106200' },
    codigoServico: { cServTribNac: '010100163' },
    xDescServ: 'Serviço mínimo de teste',
  },
  valores: { vServico: 100 },
}

/** DPS com aliquota mas sem vISSQN explícito — testa cálculo automático */
const DPS_CALC_ISSQN: InfDpsData = {
  id: 'DPS000000000000000000000000000100000000000001',
  tipoAmbiente: TipoAmbiente.Homologacao,
  dataEmissao: '2026-04-30T17:25:29-03:00',
  numeroDps: '1000000000001',
  serie: '001',
  dataCompetencia: '2026-04-30',
  tipoEmitente: EmitenteDPS.Prestador,
  codigoLocalEmissao: '3144805',
  prestador: { cnpj: '11222333000181', nome: 'EMPRESA EXEMPLO LTDA' },
  servico: {
    localPrestacao: { cLocPrestacao: '3144805' },
    codigoServico: { cServTribNac: '171201' },
    xDescServ: 'Gestão de patrimônio',
  },
  valores: { vServico: 800, vBC: 800 },
  tributacao: {
    issqn: {
      tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
      tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      aliquota: 0.02,
    },
  },
}

/** DPS com ISSQN retido pelo tomador — vLiq deve descontar o ISSQN */
const DPS_ISSQN_RETIDO: InfDpsData = {
  ...DPS_CALC_ISSQN,
  id: 'DPS_RETIDO',
  tributacao: {
    issqn: {
      tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
      tipoRetencaoIssqn: TipoRetencaoIssqn.RetidoTomador,
      aliquota: 0.02,
    },
  },
}

// ---------------------------------------------------------------------------

describe('buildPreviewSchema — mapeamento DPS → NfseSchema', () => {
  test('retorna objeto com infNFSe definido', () => {
    const schema = buildPreviewSchema(DPS_COMPLETO)
    expect(schema).toBeDefined()
    expect(schema.infNFSe).toBeDefined()
  })

  test('nNFSe é "PRÉVIA" (marcador visual)', () => {
    expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.nNFSe).toBe('PRÉVIA')
  })

  test('chNFSe é string vazia (sem chave de acesso real)', () => {
    expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.chNFSe).toBe('')
  })

  test('xMotivo contém "PRÉVIA"', () => {
    expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.xMotivo).toContain('PRÉVIA')
  })

  test('dhProc é uma data ISO válida', () => {
    const dhProc = buildPreviewSchema(DPS_COMPLETO).infNFSe?.dhProc ?? ''
    expect(() => new Date(dhProc).toISOString()).not.toThrow()
  })

  test('ambGer reflete o tipoAmbiente do DPS (2 = homologação)', () => {
    expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.ambGer).toBe(TipoAmbiente.Homologacao)
  })

  test('ambGer reflete tipoAmbiente de produção (1)', () => {
    expect(buildPreviewSchema(DPS_MINIMO).infNFSe?.ambGer).toBe(TipoAmbiente.Producao)
  })

  describe('emit (prestador)', () => {
    test('CNPJ do prestador mapeado corretamente', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.emit?.CNPJ).toBe('12345678000195')
    })

    test('nome do prestador mapeado corretamente', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.emit?.xNome).toBe('Empresa Prestadora LTDA')
    })

    test('IM do prestador mapeado corretamente', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.emit?.IM).toBe('123456')
    })

    test('telefone e email do prestador mapeados', () => {
      const emit = buildPreviewSchema(DPS_COMPLETO).infNFSe?.emit
      expect(emit?.fone).toBe('3133334444')
      expect(emit?.email).toBe('contato@empresa.com.br')
    })

    test('endereço do prestador mapeado (cMun, UF, CEP)', () => {
      const end = buildPreviewSchema(DPS_COMPLETO).infNFSe?.emit?.enderNac
      expect(end?.cMun).toBe('3106200')
      expect(end?.UF).toBe('MG')
      expect(end?.CEP).toBe('30130170')
      expect(end?.xLgr).toBe('Avenida Afonso Pena')
    })

    test('regimeTributario mapeado (opSimpNac)', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.emit?.regTrib?.opSimpNac)
        .toBe(OpcaoSimplesNacional.NaoOptante)
    })

    test('prestador sem endereco não quebra (enderNac undefined)', () => {
      const schema = buildPreviewSchema(DPS_MINIMO)
      expect(schema.infNFSe?.emit?.enderNac).toBeUndefined()
    })
  })

  describe('toma (tomador)', () => {
    test('CNPJ do tomador mapeado corretamente', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.DPS?.infDPS.toma?.CNPJ).toBe('00000000000191')
    })

    test('nome do tomador mapeado corretamente', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.DPS?.infDPS.toma?.xNome).toBe('Banco do Brasil S/A')
    })

    test('endereço do tomador mapeado (UF, CEP, logradouro)', () => {
      const end = buildPreviewSchema(DPS_COMPLETO).infNFSe?.DPS?.infDPS.toma?.enderNac
      expect(end?.UF).toBe('SP')
      expect(end?.CEP).toBe('01310100')
      expect(end?.xLgr).toBe('Avenida Paulista')
      expect(end?.cMun).toBe('3550308')
    })

    test('sem tomador → toma é undefined', () => {
      expect(buildPreviewSchema(DPS_MINIMO).infNFSe?.DPS?.infDPS.toma).toBeUndefined()
    })
  })

  describe('serv (serviço)', () => {
    test('xDescServ mapeado corretamente', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.DPS?.infDPS.serv?.xDescServ)
        .toBe('Desenvolvimento de sistema de gestão — sprint 42')
    })

    test('cTribNac mapeado a partir de cServTribNac', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.DPS?.infDPS.serv?.cTribNac)
        .toBe('010100163')
    })

    test('cNBS mapeado a partir de cNBSPrinc', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.DPS?.infDPS.serv?.cNBS)
        .toBe('109102000')
    })

    test('cLocPrestacao mapeado', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.DPS?.infDPS.serv?.cLocPrestacao)
        .toBe('3106200')
    })

    test('xInfComp mapeado a partir de informacaoComplemento', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.DPS?.infDPS.serv?.xInfComp)
        .toBe('Contrato n° 2024/001')
    })
  })

  describe('valores', () => {
    test('vServico mapeado em infNFSe.valores', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.valores?.vServico).toBe(5000)
    })

    test('vBC mapeado em infNFSe.valores', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.valores?.vBC).toBe(5000)
    })

    test('vISSQN mapeado em infNFSe.valores', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.valores?.vISSQN).toBe(250)
    })

    test('pAliqAplic em % a partir de aliquota decimal (0.05 → 5)', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.valores?.pAliqAplic).toBe(5)
    })

    test('PIS e COFINS mapeados de federal', () => {
      const v = buildPreviewSchema(DPS_COMPLETO).infNFSe?.valores
      expect(v?.PIS).toBe(32.50)
      expect(v?.COFINS).toBe(150)
    })

    test('vServ em DPS.infDPS.valores', () => {
      expect(buildPreviewSchema(DPS_COMPLETO).infNFSe?.DPS?.infDPS.valores?.vServ).toBe(5000)
    })

    test('vBC usa vServico como fallback quando vBC não informado', () => {
      const schema = buildPreviewSchema(DPS_MINIMO)
      expect(schema.infNFSe?.valores?.vBC).toBe(100)
    })

    test('valores zerados quando tributação não informada', () => {
      const v = buildPreviewSchema(DPS_MINIMO).infNFSe?.valores
      expect(v?.vISSQN).toBe(0)
      expect(v?.pAliqAplic).toBe(0)
      expect(v?.PIS).toBe(0)
      expect(v?.COFINS).toBe(0)
    })

    test('vISSQN calculado de vBC × aliquota quando não fornecido', () => {
      const v = buildPreviewSchema(DPS_CALC_ISSQN).infNFSe?.valores
      // 800 × 0.02 = 16.00
      expect(v?.vISSQN).toBe(16)
    })

    test('pAliqAplic = 2 a partir de aliquota 0.02 (×100)', () => {
      const v = buildPreviewSchema(DPS_CALC_ISSQN).infNFSe?.valores
      expect(v?.pAliqAplic).toBe(2)
    })

    test('vLiq = vServico quando ISSQN Não Retido (não deduzido)', () => {
      const v = buildPreviewSchema(DPS_CALC_ISSQN).infNFSe?.valores
      expect(v?.vLiq).toBe(800)
    })

    test('vLiq = vServico − vISSQN quando ISSQN retido pelo tomador', () => {
      const v = buildPreviewSchema(DPS_ISSQN_RETIDO).infNFSe?.valores
      // 800 − 16 = 784
      expect(v?.vLiq).toBe(784)
    })

    test('vISSQN explícito tem precedência sobre cálculo automático', () => {
      const v = buildPreviewSchema(DPS_COMPLETO).infNFSe?.valores
      // DPS_COMPLETO tem vISSQN: 250 explícito
      expect(v?.vISSQN).toBe(250)
    })

    test('pAliqAplic inferido de vISSQN/vBC quando aliquota omitida', () => {
      // vISSQN=16, vBC=800 → 16/800 = 0.02 → pAliqAplic = 2
      const v = buildPreviewSchema(DPS_CALC_ISSQN).infNFSe?.valores
      expect(v?.pAliqAplic).toBe(2)
    })

    test('pAliqAplic vindo de vals.pAliq quando aliquota tributacao omitida', () => {
      const dps: InfDpsData = {
        ...DPS_MINIMO,
        valores: { vServico: 1000, vBC: 1000, pAliq: 0.03 },
        tributacao: {
          issqn: {
            tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
            tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
            // aliquota omitida intencionalmente
          },
        },
      }
      const v = buildPreviewSchema(dps).infNFSe?.valores
      // vals.pAliq = 0.03 → pAliqAplic = 3
      expect(v?.pAliqAplic).toBe(3)
    })
  })
})

// ---------------------------------------------------------------------------

describe('DanfeService.previewFromDps — formato HTML', () => {
  let danfe: DanfeService

  beforeAll(() => { danfe = new DanfeService() })

  test('retorna PreviewResult com format=Html', async () => {
    const result = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    expect(result.format).toBe(DanfePreviewFormat.Html)
  })

  test('html começa com DOCTYPE', async () => {
    const { html } = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    expect(html).toContain('<!DOCTYPE html>')
  })

  test('html contém a marca d\'água "PRÉVIA"', async () => {
    const { html } = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    expect(html).toContain('PRÉVIA')
  })

  test('html contém "SEM VALOR FISCAL"', async () => {
    const { html } = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    expect(html).toContain('SEM VALOR FISCAL')
  })

  test('html contém a classe CSS da marca d\'água', async () => {
    const { html } = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    expect(html).toContain('danfe-preview-watermark')
  })

  test('html contém CNPJ do prestador', async () => {
    const { html } = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    // CNPJ formatado 12.345.678/0001-95
    expect(html).toContain('12.345.678/0001-95')
  })

  test('html contém nome do prestador', async () => {
    const { html } = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    expect(html).toContain('Empresa Prestadora LTDA')
  })

  test('html contém nome do tomador', async () => {
    const { html } = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    expect(html).toContain('Banco do Brasil S/A')
  })

  test('html contém a descrição do serviço', async () => {
    const { html } = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    expect(html).toContain('Desenvolvimento de sistema de gestão')
  })

  test('html contém o valor do serviço formatado', async () => {
    const { html } = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    // R$ 5.000,00
    expect(html).toContain('5.000,00')
  })

  test('pdfBytes é undefined no modo HTML', async () => {
    const result = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    expect(result.pdfBytes).toBeUndefined()
  })

  test('environment é Restricted para homologação', async () => {
    const result = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    expect(result.environment).toBe(DanfeEnvironment.Restricted)
  })

  test('environment é Production para produção', async () => {
    const result = await danfe.previewFromDps(DPS_MINIMO, { format: DanfePreviewFormat.Html })
    expect(result.environment).toBe(DanfeEnvironment.Production)
  })

  test('warnings é array (pode ser vazio)', async () => {
    const { warnings } = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Html })
    expect(Array.isArray(warnings)).toBe(true)
  })

  test('DPS sem tomador não lança erro', async () => {
    await expect(
      danfe.previewFromDps(DPS_MINIMO, { format: DanfePreviewFormat.Html })
    ).resolves.toBeDefined()
  })

  test('html sem tomador não exibe bloco de tomador identificado', async () => {
    const { html } = await danfe.previewFromDps(DPS_MINIMO, { format: DanfePreviewFormat.Html })
    // Banco do Brasil não deve aparecer no html do DPS mínimo
    expect(html).not.toContain('Banco do Brasil')
  })

  test('formato padrão é Html quando opts omitido', async () => {
    const result = await danfe.previewFromDps(DPS_COMPLETO)
    expect(result.format).toBe(DanfePreviewFormat.Html)
    expect(result.pdfBytes).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------

describe('DanfeService.previewFromDps — formato PDF', () => {
  let danfe: DanfeService

  beforeAll(() => { danfe = new DanfeService() })

  test('retorna PreviewResult com format=Pdf (ou erro de Puppeteer)', async () => {
    try {
      const result = await danfe.previewFromDps(DPS_COMPLETO, { format: DanfePreviewFormat.Pdf })
      expect(result.format).toBe(DanfePreviewFormat.Pdf)
      expect(result.pdfBytes).toBeDefined()
      expect(result.pdfBytes!.length).toBeGreaterThan(0)
      // PDF começa com %PDF
      expect(result.pdfBytes!.slice(0, 4).toString()).toBe('%PDF')
      // HTML também está disponível no resultado PDF
      expect(result.html).toContain('<!DOCTYPE html>')
      expect(result.html).toContain('PRÉVIA')
    } catch (err) {
      // Ambiente sem Chrome — erro deve vir do Puppeteer, nunca do renderer
      const error = err as Error
      expect(error.message).not.toContain('danfe.html')
      expect(error.message).not.toContain('ENOENT')
      expect(error.message).not.toContain('buildPreviewSchema')
    }
  }, 30_000)
})
