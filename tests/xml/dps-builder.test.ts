import { describe, test, expect } from 'bun:test'
import { buildDpsXml } from '../../src/xml/dps-builder.js'
import { XMLParser } from 'fast-xml-parser'
import {
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoImunidade,
  TipoRetencaoIssqn,
  OpcaoSimplesNacional,
  ModoPrestacaoComExt,
  VinculoPrestacao,
  CodigoMoeda,
  MecAFComexPrestador,
  MecAFComexTomador,
  MovimentacaoTemporariaBens,
  EnvioMDIC,
  MotivoNaoNif,
  FinalidadeNFSe,
  IndicadorConsumidorFinal,
  IndicadorDestinatario,
  TipoOperacaoEnteGov,
  CstIbsCbs,
  ClassTribIbsCbs,
  CodigoIndOp,
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
          tributacaoIssqn: TributacaoIssqn.OperacaoTributavel,
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

  test('serviço imune: tribISSQN=2 e tpImunidade na ordem do XSD', () => {
    const xml = buildDpsXml(makeDps({
      tributacao: {
        issqn: {
          tributacaoIssqn: TributacaoIssqn.Imunidade,
          tipoImunidade: TipoImunidade.EntidadesAssistenciais,
          tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
        },
      },
    }))
    expect(xml).toContain('<tribISSQN>2</tribISSQN>')
    expect(xml).toContain('<tpImunidade>5</tpImunidade>')
    // ordem TCTribMunicipal: tribISSQN → tpImunidade → tpRetISSQN
    expect(xml).toMatch(/<tribISSQN>2<\/tribISSQN><tpImunidade>5<\/tpImunidade><tpRetISSQN>1<\/tpRetISSQN>/)
    // operação imune não apura ISS
    expect(xml).not.toContain('<pAliq>')
  })

  test('alíquotas PIS/COFINS convertidas de decimal para percentual', () => {
    const dps = makeDps({
      tributacao: {
        issqn: {
          tributacaoIssqn: TributacaoIssqn.OperacaoTributavel,
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

describe('buildDpsXml — exterior (endExt + comExt)', () => {
  function makeDpsExterior(): DpsData {
    return makeDps({
      tomador: {
        nif: '2553340916',
        nome: 'MALCOM FILIPE SILVA DE OLIVEIRA',
        endereco: {
          exterior: {
            cPais: 'SA',
            cEndPost: '13332-7663',
            xCidade: 'RIYADH',
            xEstProvReg: 'ARABIA SAUDITA',
          },
          xLgr: 'VILLA',
          nro: '124',
          xCpl: 'AL BUSTAN VILLAGE 3010 - 13332',
          xBairro: 'AL ARID UNIT 2',
        },
      },
      servico: {
        localPrestacao: { cLocPrestacao: '3144805' },
        codigoServico: { cServTribNac: '171201', cNBSPrinc: '109054000' },
        xDescServ: 'Gestão de patrimônio',
        comercioExterior: {
          mdPrestacao: ModoPrestacaoComExt.Transfronteirico,
          vincPrest: VinculoPrestacao.SemVinculo,
          tpMoeda: CodigoMoeda.Real,
          vServMoeda: 44628.38,
          mecAFComexP: MecAFComexPrestador.Nenhum,
          mecAFComexT: MecAFComexTomador.Nenhum,
          movTempBens: MovimentacaoTemporariaBens.Nao,
          mdic: EnvioMDIC.NaoEnviar,
        },
      },
    })
  }

  test('emite <endExt> em vez de <endNac> para tomador estrangeiro', () => {
    const xml = buildDpsXml(makeDpsExterior())
    expect(xml).toContain('<endExt><cPais>SA</cPais><cEndPost>13332-7663</cEndPost><xCidade>RIYADH</xCidade><xEstProvReg>ARABIA SAUDITA</xEstProvReg></endExt>')
    // o tomador não tem <endNac>; o prestador (nacional) ainda tem
    expect(xml).toContain('<toma>')
    const tomaBloco = xml.slice(xml.indexOf('<toma>'), xml.indexOf('</toma>'))
    expect(tomaBloco).not.toContain('<endNac>')
  })

  test('endExt vem antes de xLgr/nro/xCpl/xBairro', () => {
    const xml = buildDpsXml(makeDpsExterior())
    expect(xml).toContain('</endExt><xLgr>VILLA</xLgr><nro>124</nro>')
  })

  test('inclui o NIF do tomador estrangeiro', () => {
    expect(buildDpsXml(makeDpsExterior())).toContain('<NIF>2553340916</NIF>')
  })

  test('emite <comExt> logo após </cServ> na ordem do XSD', () => {
    const xml = buildDpsXml(makeDpsExterior())
    expect(xml).toContain('</cServ><comExt><mdPrestacao>1</mdPrestacao><vincPrest>0</vincPrest><tpMoeda>790</tpMoeda><vServMoeda>44628.38</vServMoeda><mecAFComexP>01</mecAFComexP><mecAFComexT>01</mecAFComexT><movTempBens>1</movTempBens><mdic>0</mdic></comExt>')
  })

  test('omite <comExt> quando comercioExterior não é fornecido', () => {
    expect(buildDpsXml(makeDps())).not.toContain('<comExt>')
  })

  test('preserva zero à esquerda dos códigos de mecanismo (enum string)', () => {
    const dps = makeDpsExterior()
    dps.infDps.servico.comercioExterior!.mecAFComexP = MecAFComexPrestador.Nenhum // '01'
    dps.infDps.servico.comercioExterior!.mecAFComexT = MecAFComexTomador.Desconhecido // '00'
    const xml = buildDpsXml(dps)
    expect(xml).toContain('<mecAFComexP>01</mecAFComexP>')
    expect(xml).toContain('<mecAFComexT>00</mecAFComexT>')
    // dígito único também sai como string, sem perder o zero
    expect(xml).toContain('<mdic>0</mdic>')
  })

  test('serializa código de mecanismo de dois dígitos alto (sem zero à esquerda)', () => {
    const dps = makeDpsExterior()
    dps.infDps.servico.comercioExterior!.mecAFComexT = MecAFComexTomador.ZPE // '26'
    expect(buildDpsXml(dps)).toContain('<mecAFComexT>26</mecAFComexT>')
  })

  test('emite <cNaoNIF> em vez de <NIF> para tomador estrangeiro sem NIF', () => {
    const dps = makeDpsExterior()
    dps.infDps.tomador = {
      codigoNaoNif: MotivoNaoNif.NaoExigenciaDoNif,
      nome: 'OFFSHORE HOLDINGS LTD',
      endereco: dps.infDps.tomador!.endereco,
    }
    const xml = buildDpsXml(dps)
    expect(xml).toContain('<cNaoNIF>2</cNaoNIF>')
    const tomaBloco = xml.slice(xml.indexOf('<toma>'), xml.indexOf('</toma>'))
    expect(tomaBloco).not.toContain('<NIF>')
  })
})

describe('buildDpsXml — IBS/CBS (Reforma Tributária)', () => {
  const IBSCBS_NACIONAL =
    '<IBSCBS>' +
    '<finNFSe>0</finNFSe>' +
    '<indFinal>0</indFinal>' +
    '<cIndOp>100301</cIndOp>' +
    '<indDest>0</indDest>' +
    '<valores><trib><gIBSCBS>' +
    '<CST>000</CST>' +
    '<cClassTrib>000001</cClassTrib>' +
    '</gIBSCBS></trib></valores>' +
    '</IBSCBS>'

  const IBSCBS_EXPORTACAO =
    '<IBSCBS>' +
    '<finNFSe>0</finNFSe>' +
    '<indFinal>0</indFinal>' +
    '<cIndOp>100302</cIndOp>' +
    '<indDest>0</indDest>' +
    '<valores><trib><gIBSCBS>' +
    '<CST>410</CST>' +
    '<cClassTrib>410004</cClassTrib>' +
    '</gIBSCBS></trib></valores>' +
    '</IBSCBS>'

  test('emite o bloco na ordem do XSD para operação interna', () => {
    const xml = buildDpsXml(makeDps({
      ibsCbs: {
        finNFSe: FinalidadeNFSe.Normal,
        indFinal: IndicadorConsumidorFinal.Nao,
        cIndOp: CodigoIndOp.DemaisServicosAdquirenteNoPais,
        indDest: IndicadorDestinatario.TomadorEhDestinatario,
        valores: {
          trib: {
            gIBSCBS: {
              CST: CstIbsCbs.TributacaoIntegral,
              cClassTrib: ClassTribIbsCbs.TributacaoIntegral,
            },
          },
        },
      },
    }))
    expect(xml).toContain(IBSCBS_NACIONAL)
  })

  test('emite CST 410 / cClassTrib 410004 na exportação de serviço', () => {
    const xml = buildDpsXml(makeDps({
      ibsCbs: {
        finNFSe: FinalidadeNFSe.Normal,
        indFinal: IndicadorConsumidorFinal.Nao,
        cIndOp: CodigoIndOp.DemaisServicosAdquirenteExterior,
        indDest: IndicadorDestinatario.TomadorEhDestinatario,
        valores: {
          trib: {
            gIBSCBS: {
              CST: CstIbsCbs.ImunidadeNaoIncidencia,
              cClassTrib: ClassTribIbsCbs.ExportacaoBensServicos,
            },
          },
        },
      },
    }))
    expect(xml).toContain(IBSCBS_EXPORTACAO)
  })

  test('preserva os zeros à esquerda dos códigos (enums string)', () => {
    const xml = buildDpsXml(makeDps({
      ibsCbs: {
        finNFSe: FinalidadeNFSe.Normal,
        indFinal: IndicadorConsumidorFinal.Nao,
        cIndOp: CodigoIndOp.DemaisServicosAdquirenteNoPais,
        indDest: IndicadorDestinatario.TomadorEhDestinatario,
        valores: {
          trib: {
            gIBSCBS: {
              CST: CstIbsCbs.TributacaoIntegral,
              cClassTrib: ClassTribIbsCbs.TributacaoIntegral,
            },
          },
        },
      },
    }))
    expect(xml).toContain('<CST>000</CST>')
    expect(xml).toContain('<cClassTrib>000001</cClassTrib>')
    // indFinal é obrigatório no XSD (TCRTCInfoIBSCBS, sem minOccurs="0")
    expect(xml).toContain('<indFinal>0</indFinal>')
  })

  test('omite o bloco inteiro quando ibsCbs não é informado', () => {
    expect(buildDpsXml(makeDps())).not.toContain('<IBSCBS>')
  })

  test('emite tpOper entre cIndOp e indDest quando informado', () => {
    const xml = buildDpsXml(makeDps({
      ibsCbs: {
        finNFSe: FinalidadeNFSe.Normal,
        indFinal: IndicadorConsumidorFinal.Nao,
        cIndOp: CodigoIndOp.DemaisServicosAdquirenteNoPais,
        tpOper: TipoOperacaoEnteGov.FornecimentoERecebimentoConcomitantes,
        indDest: IndicadorDestinatario.TomadorEhDestinatario,
        valores: {
          trib: {
            gIBSCBS: {
              CST: CstIbsCbs.TributacaoIntegral,
              cClassTrib: ClassTribIbsCbs.TributacaoIntegral,
            },
          },
        },
      },
    }))
    expect(xml).toContain('<cIndOp>100301</cIndOp><tpOper>5</tpOper><indDest>0</indDest>')
  })
})

describe('buildDpsXml — escape de XML', () => {
  test('escapa & e <> no texto livre — razão social com "&" é caso real', () => {
    const dps = makeDps({
      tomador: { cnpj: '00000000000191', nome: 'A & B <Consultoria> LTDA' },
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '01.01.00163' },
        xDescServ: 'Consultoria A & B <urgente>',
      },
    })
    const xml = buildDpsXml(dps)
    expect(xml).toContain('<xNome>A &amp; B &lt;Consultoria&gt; LTDA</xNome>')
    expect(xml).toContain('<xDescServ>Consultoria A &amp; B &lt;urgente&gt;</xDescServ>')
    // nenhum "&" solto sobrou: todo & no XML abre uma entidade
    expect(/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(xml)).toBe(false)
  })

  test('round-trip: o parser devolve o texto original', () => {
    const original = 'Serviço "A" & <B>'
    const xml = buildDpsXml(makeDps({
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '01.01.00163' },
        xDescServ: original,
      },
    }))
    const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false })
    const parsed = parser.parse(xml) as { DPS: { infDPS: { serv: { cServ: { xDescServ: string } } } } }
    expect(parsed.DPS.infDPS.serv.cServ.xDescServ).toBe(original)
  })
})

describe('buildDpsXml — atvEvento (item 12)', () => {
  const atvBase = { xNome: 'Show de Rock', dtIni: '2026-03-01', dtFim: '2026-03-02' }

  test('emite o grupo com idAtvEvt na ordem do XSD', () => {
    const xml = buildDpsXml(makeDps({
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '120101' },
        xDescServ: 'Evento',
        atvEvento: { ...atvBase, idAtvEvt: 'EVT-2026-001' },
      },
    }))
    expect(xml).toContain(
      '<atvEvento><xNome>Show de Rock</xNome><dtIni>2026-03-01</dtIni><dtFim>2026-03-02</dtFim><idAtvEvt>EVT-2026-001</idAtvEvt></atvEvento>',
    )
  })

  test('emite <end> com CEP quando o evento tem endereço nacional', () => {
    const xml = buildDpsXml(makeDps({
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '120101' },
        xDescServ: 'Evento',
        atvEvento: {
          ...atvBase,
          endereco: { cep: '30100000', xLgr: 'Av. Afonso Pena', nro: '1000', xBairro: 'Centro' },
        },
      },
    }))
    // TCEnderecoSimples: choice(CEP|endExt) e depois xLgr, nro, xCpl?, xBairro
    expect(xml).toContain(
      '<end><CEP>30100000</CEP><xLgr>Av. Afonso Pena</xLgr><nro>1000</nro><xBairro>Centro</xBairro></end>',
    )
  })

  test('atvEvento vem depois de obra e antes de infoCompl (xs:sequence do TCServ)', () => {
    const xml = buildDpsXml(makeDps({
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '120101' },
        xDescServ: 'Evento',
        obra: { cObra: '12345' },
        atvEvento: { ...atvBase, idAtvEvt: 'EVT-1' },
        informacaoComplemento: { xInfComp: 'Contrato 1' },
      },
    }))
    expect(xml.indexOf('<obra>')).toBeLessThan(xml.indexOf('<atvEvento>'))
    expect(xml.indexOf('<atvEvento>')).toBeLessThan(xml.indexOf('<infoCompl>'))
  })

  test('omite o grupo quando não informado', () => {
    expect(buildDpsXml(makeDps())).not.toContain('<atvEvento>')
  })
})
