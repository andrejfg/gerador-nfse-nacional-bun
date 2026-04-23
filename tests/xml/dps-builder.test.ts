import { describe, test, expect } from 'bun:test'
import { buildDpsXml } from '../../src/xml/dps-builder.js'
import {
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  OpcaoSimplesNacional,
} from '../../src/types/enums.js'
import type { DpsData } from '../../src/types/dtos.js'

function makeDps(overrides: Partial<DpsData['infDps']> = {}): DpsData {
  return {
    versao: '1.00',
    infDps: {
      id: 'DPS31062001123456780001950010100000000000001',
      tipoAmbiente: TipoAmbiente.Homologacao,
      dataEmissao: '2024-03-15T12:00:00-03:00',
      versaoAplicativo: '1.00',
      serie: '001',
      numeroDps: '000000000000001',
      dataCompetencia: '2024-03',
      tipoEmitente: EmitenteDPS.Prestador,
      codigoLocalEmissao: '3106200',
      prestador: {
        cnpj: '12345678000195',
        inscricaoMunicipal: '12345678',
        nome: 'Empresa Teste LTDA',
        regimeTributario: { opSimpNac: OpcaoSimplesNacional.Optante },
        endereco: { xLgr: 'Rua Teste', nro: '100', xBairro: 'Centro', cMun: '3106200', uf: 'MG', cep: '30100000' },
      },
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '01.01.00163' },
        xDescServ: 'Desenvolvimento de software sob encomenda',
      },
      valores: { vServico: 1000.00, vBC: 1000.00, vISSQN: 50.00, vLiq: 950.00 },
      tributacao: {
        issqn: {
          tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
          aliquota: 0.05,
          tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
          cMunFG: '3106200',
        },
      },
      ...overrides,
    },
  }
}

describe('buildDpsXml', () => {
  test('retorna string não vazia', () => {
    const xml = buildDpsXml(makeDps())
    expect(typeof xml).toBe('string')
    expect(xml.length).toBeGreaterThan(100)
  })

  test('começa com declaração XML UTF-8', () => {
    expect(buildDpsXml(makeDps()).startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
  })

  test('inclui namespace do SPED Fazenda', () => {
    expect(buildDpsXml(makeDps())).toContain('xmlns="http://www.sped.fazenda.gov.br/nfse"')
  })

  test('inclui versão do schema', () => {
    expect(buildDpsXml(makeDps())).toContain('versao="1.00"')
  })

  test('inclui Id do infDPS', () => {
    expect(buildDpsXml(makeDps())).toContain('Id="DPS31062001123456780001950010100000000000001"')
  })

  test('inclui CNPJ sem formatação', () => {
    expect(buildDpsXml(makeDps())).toContain('<CNPJ>12345678000195</CNPJ>')
  })

  test('remove pontuação do CNPJ automaticamente', () => {
    const dps = makeDps()
    dps.infDps.prestador.cnpj = '12.345.678/0001-95'
    const xml = buildDpsXml(dps)
    expect(xml).toContain('<CNPJ>12345678000195</CNPJ>')
    expect(xml).not.toContain('12.345.678/0001-95')
  })

  test('tpAmb=2 para homologação', () => {
    expect(buildDpsXml(makeDps())).toContain('<tpAmb>2</tpAmb>')
  })

  test('tpAmb=1 para produção', () => {
    expect(buildDpsXml(makeDps({ tipoAmbiente: TipoAmbiente.Producao }))).toContain('<tpAmb>1</tpAmb>')
  })

  test('valor do serviço com 2 casas decimais', () => {
    expect(buildDpsXml(makeDps())).toContain('<vServ>1000.00</vServ>')
  })

  test('inclui descrição do serviço', () => {
    expect(buildDpsXml(makeDps())).toContain('<xDescServ>Desenvolvimento de software sob encomenda</xDescServ>')
  })

  test('inclui código de tributação nacional do serviço', () => {
    // builder remove pontuação: '01.01.00163' → '010100163'; tag é <cTribNac>
    expect(buildDpsXml(makeDps())).toContain('<cTribNac>010100163</cTribNac>')
  })

  test('alíquota convertida de decimal para percentual (0.05 → 5.00)', () => {
    expect(buildDpsXml(makeDps())).toContain('<pAliq>5.00</pAliq>')
  })

  test('alíquotas PIS/COFINS convertidas de decimal para percentual', () => {
    const dps = makeDps({
      tributacao: {
        issqn: {
          tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
          aliquota: 0.05,
          tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
        },
        federal: {
          cstPisCofins: '00',
          baseCalculoPisCofins: 918.99,
          aliquotaPis: 0.0065,
          aliquotaCofins: 0.03,
          valorPis: 5.97,
          valorCofins: 27.57,
        },
      },
    })
    const xml = buildDpsXml(dps)
    expect(xml).toContain('<pAliqPis>0.65</pAliqPis>')
    expect(xml).toContain('<pAliqCofins>3.00</pAliqCofins>')
  })

  test('inclui <toma> quando tomador é fornecido', () => {
    const dps = makeDps({ tomador: { cnpj: '00000000000191', nome: 'Banco do Brasil' } })
    const xml = buildDpsXml(dps)
    expect(xml).toContain('<toma>')
    expect(xml).toContain('<xNome>Banco do Brasil</xNome>')
  })

  test('omite <toma> quando tomador não é fornecido', () => {
    expect(buildDpsXml(makeDps())).not.toContain('<toma>')
  })

  test('inclui informações complementares do serviço', () => {
    const dps = makeDps({
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '01.01.00163' },
        xDescServ: 'Serviço',
        informacaoComplemento: { xInfComp: 'Contrato 2024-001' },
      },
    })
    expect(buildDpsXml(dps)).toContain('<xInfComp>Contrato 2024-001</xInfComp>')
  })

  test('CEP sem traço no XML', () => {
    expect(buildDpsXml(makeDps())).toContain('<CEP>30100000</CEP>')
  })

  test('inclui <regTrib> com opção do Simples Nacional', () => {
    // OpcaoSimplesNacional.Optante = 2
    expect(buildDpsXml(makeDps())).toContain('<opSimpNac>2</opSimpNac>')
  })

  test('versão customizada do DPS', () => {
    const dps = makeDps()
    dps.versao = '2.00'
    expect(buildDpsXml(dps)).toContain('versao="2.00"')
  })

  test('inclui <interm> quando intermediário é fornecido', () => {
    const dps = makeDps({
      intermediario: {
        cnpj: '11222333000181',
        nome: 'Intermediário LTDA',
        inscricaoMunicipal: '99887',
      },
    })
    const xml = buildDpsXml(dps)
    expect(xml).toContain('<interm>')
    expect(xml).toContain('<CNPJ>11222333000181</CNPJ>')
    expect(xml).toContain('<xNome>Intermediário LTDA</xNome>')
    expect(xml).toContain('<IM>99887</IM>')
  })

  test('omite <interm> quando intermediário não é fornecido', () => {
    expect(buildDpsXml(makeDps())).not.toContain('<interm>')
  })
})
