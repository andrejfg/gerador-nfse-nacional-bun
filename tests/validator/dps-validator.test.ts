/**
 * Testes do DpsValidator
 * Espelhado de nfse-php/tests/Unit/Validator/DpsValidatorTest.php
 * Atualizado para schema Zod v1.01 (IBSCBS obrigatório, regimeTributario obrigatório, etc.)
 */
import { describe, test, expect } from 'bun:test'
import { validateDps } from '../../src/validator/dps-validator.js'
import {
  TipoAmbiente,
  EmitenteDPS,
  ModoPrestacaoComExt,
  VinculoPrestacao,
  MecAFComexPrestador,
  MecAFComexTomador,
  MovimentacaoTemporariaBens,
  EnvioMDIC,
  MotivoNaoNif,
} from '../../src/types/enums.js'
import type { DpsData } from '../../src/types/dtos.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const IBSCBS_BASE = {
  finNFSe: '0' as const,
  cIndOp: '100301',
  indDest: '0' as const,
  indFinal: '0' as const,
  valores: { trib: { gIBSCBS: { CST: '000', cClassTrib: '000001' } } },
} satisfies DpsData['infDps']['ibsCbs']

function makeDps(overrides: Partial<DpsData['infDps']> = {}): DpsData {
  return {
    infDps: {
      // DPS + 3106200(7) + 2(CNPJ) + 12345678000195(14) + 00001(5) + 000000000000100(15) = 45 chars
      id: 'DPS310620021234567800019500001000000000000100',
      tipoAmbiente: TipoAmbiente.Homologacao,
      dataEmissao: '2023-01-01T00:00:00-03:00',
      numeroDps: '100',
      dataCompetencia: '2023-01-01',
      tipoEmitente: EmitenteDPS.Prestador,
      codigoLocalEmissao: '3106200',
      prestador: {
        cnpj: '12345678000195',
        nome: 'Prestador Teste',
        endereco: { cMun: '3106200', cep: '30100000', xLgr: 'Rua Teste', nro: '100', xBairro: 'Centro' },
        regimeTributario: { opSimpNac: 1, regEspTrib: 0 },
      },
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '010100' },
        xDescServ: 'Desenvolvimento de software',
      },
      valores: { vServico: 1000 },
      ...overrides,
    },
  }
}

// ---------------------------------------------------------------------------
// Cenários válidos
// ---------------------------------------------------------------------------

describe('DpsValidator — válido', () => {
  test('DPS básico é válido', () => {
    const result = validateDps(makeDps())
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('DPS com descontos válidos (todos abaixo do valor do serviço)', () => {
    const result = validateDps(makeDps({
      valores: {
        vServico: 1000,
        vDescIncondicionado: 100,   // < 1000 ✓
        vDescCondicionado: 50,       // < 1000 ✓  soma 150 < 1000 ✓
      },
    }))
    expect(result.isValid).toBe(true)
  })

  test('DPS com serviço de construção civil e dados de obra', () => {
    const result = validateDps(makeDps({
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '070501' },
        xDescServ: 'Construção civil',
        obra: { cObra: '12345' },
      },
    }))
    expect(result.isValid).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Prestador
// ---------------------------------------------------------------------------

describe('DpsValidator — prestador', () => {
  test('falha quando prestador está ausente', () => {
    const dps: DpsData = {
      infDps: {
        ...makeDps().infDps,
        prestador: undefined as unknown as DpsData['infDps']['prestador'],
      },
    }
    const result = validateDps(dps)
    expect(result.isValid).toBe(false)
    // Zod captura a ausência do objeto prestador
    expect(result.errors.some(e => e.includes('prestador'))).toBe(true)
  })

  test('falha quando prestador não é emitente e não tem endereço', () => {
    const result = validateDps(makeDps({
      tipoEmitente: EmitenteDPS.Tomador, // tpEmit = 2
      prestador: {
        cnpj: '12345678000195',
        inscricaoMunicipal: '12345',
        nome: 'Prestador Teste',
        regimeTributario: { opSimpNac: 1, regEspTrib: 0 },
        // sem endereco
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'E0129: Endereço do prestador é obrigatório quando o prestador não for o emitente.',
    )
  })
})

// ---------------------------------------------------------------------------
// Tomador
// ---------------------------------------------------------------------------

describe('DpsValidator — tomador', () => {
  test('falha quando tomador identificado por CPF não tem endereço', () => {
    const result = validateDps(makeDps({
      tomador: {
        cpf: '13789037737',
        nome: 'Tomador Teste',
        // sem endereco
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'Endereço do tomador é obrigatório quando o tomador é identificado.',
    )
  })

  test('falha quando tomador com CPF tem endereço mas sem cMun', () => {
    const result = validateDps(makeDps({
      tomador: {
        cpf: '13789037737',
        nome: 'Tomador Nacional',
        endereco: { cMun: '' }, // cMun vazio — falha Zod (7 dígitos obrigatórios)
      },
    }))
    expect(result.isValid).toBe(false)
    // Zod captura via padrão [0-9]{7} ou business rule captura string vazia
    expect(result.errors.some(e => e.includes('cMun') || e.includes('município'))).toBe(true)
  })

  test('tomador sem identificação falha — XSD exige um de cnpj/cpf/nif/codigoNaoNif', () => {
    const result = validateDps(makeDps({
      tomador: {
        nome: 'Tomador Anônimo',
        // sem cpf, cnpj, nif ou codigoNaoNif — viola o <xs:choice> de TCInfoPessoa
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('identificador') || e.toLowerCase().includes('cnpj'))).toBe(true)
  })

  test('tomador estrangeiro com NIF e cMun preenchido é válido', () => {
    const result = validateDps(makeDps({
      tomador: {
        nif: 'US123456789',
        nome: 'Foreign Corp',
        endereco: { cMun: '3106200', cep: '30100000', xLgr: 'Rua Teste', nro: '100', xBairro: 'Centro' },
      },
    }))
    expect(result.isValid).toBe(true)
  })

  test('tomador estrangeiro com NIF sem cMun é válido', () => {
    const result = validateDps(makeDps({
      tomador: {
        nif: 'US123456789',
        nome: 'Foreign Corp',
        endereco: { cMun: '0000000', cep: '30100000', xLgr: 'Rua Teste', nro: '100', xBairro: 'Centro' }, // zeros aceitos pelo regex
      },
    }))
    expect(result.isValid).toBe(true)
  })

  test('tomador identificado só por codigoNaoNif sem endereço falha', () => {
    const result = validateDps(makeDps({
      tomador: {
        codigoNaoNif: MotivoNaoNif.NaoExigenciaDoNif,
        nome: 'Foreign Corp Without NIF',
        // sem endereco — deve falhar (regressão do bug em isIdentified)
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'Endereço do tomador é obrigatório quando o tomador é identificado.',
    )
  })

  test('tomador estrangeiro com codigoNaoNif e endExt (sem cMun) é válido', () => {
    const result = validateDps(makeDps({
      tomador: {
        codigoNaoNif: MotivoNaoNif.NaoExigenciaDoNif,
        nome: 'Foreign Corp Without NIF',
        endereco: {
          exterior: { cPais: 'VG', cEndPost: 'VG1110', xCidade: 'Road Town', xEstProvReg: 'Tortola' },
          xLgr: 'Wickhams Cay II',
          nro: 'S/N',
          xBairro: 'N/A',
        },
      },
    }))
    expect(result.isValid).toBe(true)
  })

  test('E0226: codigoNaoNif = 0 (não informado na origem) é rejeitado na emissão', () => {
    const result = validateDps(makeDps({
      tomador: {
        codigoNaoNif: MotivoNaoNif.NaoInformadoNaOrigem,
        nome: 'Foreign Corp Without NIF',
        endereco: {
          exterior: { cPais: 'VG', cEndPost: 'VG1110', xCidade: 'Road Town', xEstProvReg: 'Tortola' },
          xLgr: 'Wickhams Cay II',
          nro: 'S/N',
          xBairro: 'N/A',
        },
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.startsWith('E0226:'))).toBe(true)
  })

  test('E0226 não dispara para os demais motivos de ausência de NIF', () => {
    for (const motivo of [MotivoNaoNif.DispensadoDoNif, MotivoNaoNif.NaoExigenciaDoNif]) {
      const result = validateDps(makeDps({
        tomador: {
          codigoNaoNif: motivo,
          nome: 'Foreign Corp Without NIF',
          endereco: {
            exterior: { cPais: 'VG', xCidade: 'Road Town', xEstProvReg: 'Tortola' },
          },
        },
      }))
      expect(result.errors.some(e => e.startsWith('E0226:'))).toBe(false)
    }
  })
})

// ---------------------------------------------------------------------------
// Valores — Regras 307, 309, 303
// ---------------------------------------------------------------------------

describe('DpsValidator — valores', () => {
  test('Regra 307: falha quando desconto incondicionado = valor do serviço', () => {
    const result = validateDps(makeDps({
      valores: { vServico: 1000, vDescIncondicionado: 1000 }, // igual — inválido
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'Regra 307: O desconto incondicionado deve ser menor que o valor do serviço.',
    )
  })

  test('Regra 309: falha quando desconto condicionado > valor do serviço', () => {
    const result = validateDps(makeDps({
      valores: { vServico: 1000, vDescCondicionado: 1500 }, // maior — inválido
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'Regra 309: O desconto condicionado deve ser menor que o valor do serviço.',
    )
  })

  test('Regra 303: falha quando soma dos descontos supera valor do serviço', () => {
    const result = validateDps(makeDps({
      valores: { vServico: 1000, vDescIncondicionado: 600, vDescCondicionado: 500 }, // 1100 > 1000
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'Regra 303: O valor do serviço deve ser maior ou igual ao somatório dos descontos incondicionado e condicionado.',
    )
  })
})

// ---------------------------------------------------------------------------
// Serviço — Regras 260, 276
// ---------------------------------------------------------------------------

describe('DpsValidator — serviço', () => {
  const CONSTRUCTION_CODES = ['070201', '070202', '070401', '070501', '070502',
    '070601', '070602', '070701', '070801', '071701', '071901']

  test.each(CONSTRUCTION_CODES)(
    'Regra 260: código %s sem obra falha',
    (code) => {
      const result = validateDps(makeDps({
        servico: {
          localPrestacao: { cLocPrestacao: '3106200' },
          codigoServico: { cServTribNac: code },
          xDescServ: 'Construção civil',
          // obra ausente
        },
      }))
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        'Regra 260: O grupo de informações de obra é obrigatório para o serviço informado.',
      )
    },
  )

  test('Regra 276: código 120101 (item 12) sem atvEvento falha', () => {
    const result = validateDps(makeDps({
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '120101' },
        xDescServ: 'Evento',
        // atvEvento ausente
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'Regra 276: O grupo de informações de Atividade/Evento (servico.atvEvento) é obrigatório para o serviço informado.',
    )
  })
})

// ---------------------------------------------------------------------------
// Tributação ISSQN — Imunidade
// ---------------------------------------------------------------------------

describe('DpsValidator — ISSQN imunidade', () => {
  test('Imunidade (tribISSQN=2) sem tipoImunidade falha', () => {
    const result = validateDps(makeDps({
      tributacao: {
        issqn: {
          tributacaoIssqn: 2, // Imunidade
          tipoRetencaoIssqn: 1,
        },
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('tipoImunidade'))).toBe(true)
  })

  test('Imunidade (tribISSQN=2) com tipoImunidade é válida', () => {
    const result = validateDps(makeDps({
      tributacao: {
        issqn: {
          tributacaoIssqn: 2,
          tipoImunidade: 5, // EntidadesAssistenciais
          tipoRetencaoIssqn: 1,
        },
      },
    }))
    expect(result.isValid).toBe(true)
  })

  test('Operação tributável (tribISSQN=1) sem tipoImunidade é válida', () => {
    const result = validateDps(makeDps({
      tributacao: {
        issqn: { tributacaoIssqn: 1, tipoRetencaoIssqn: 1 },
      },
    }))
    expect(result.isValid).toBe(true)
  })

  test('Exportação de serviço (tribISSQN=3) é rejeitada (cPaisResult não suportado)', () => {
    const result = validateDps(makeDps({
      tributacao: {
        issqn: { tributacaoIssqn: 3, tipoRetencaoIssqn: 1 },
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('cPaisResult'))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Zod schema — validação estrutural
// ---------------------------------------------------------------------------

describe('DpsValidator — validação Zod (XSD v1.01)', () => {
  test('ibsCbs ausente é válido (campo opcional durante transição IBS/CBS)', () => {
    const dps: DpsData = { infDps: { ...makeDps().infDps, ibsCbs: undefined } }
    const result = validateDps(dps)
    expect(result.isValid).toBe(true)
  })

  test('falha quando ibsCbs.cIndOp tem formato errado', () => {
    const result = validateDps(makeDps({
      ibsCbs: { ...IBSCBS_BASE, cIndOp: '123' }, // deve ter 6 dígitos
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('cIndOp'))).toBe(true)
  })

  test('inscricaoMunicipal ausente é válido (campo opcional)', () => {
    const result = validateDps(makeDps({
      prestador: {
        cnpj: '12345678000195',
        // inscricaoMunicipal omitida — agora opcional
        regimeTributario: { opSimpNac: 1, regEspTrib: 0 },
      },
    }))
    expect(result.isValid).toBe(true)
  })

  test('falha quando regimeTributario do prestador está ausente', () => {
    const result = validateDps(makeDps({
      prestador: {
        cnpj: '12345678000195',
        inscricaoMunicipal: '12345',
        regimeTributario: undefined as unknown as DpsData['infDps']['prestador']['regimeTributario'],
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('regimeTributario'))).toBe(true)
  })

  test('cServMun ausente é válido (campo opcional)', () => {
    const result = validateDps(makeDps({
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '010100' },
        xDescServ: 'Serviço',
      },
    }))
    expect(result.isValid).toBe(true)
  })

  test('falha quando cServMun tem formato inválido (não são 3 dígitos)', () => {
    const result = validateDps(makeDps({
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '010100', cServMun: '10' }, // só 2 dígitos — inválido
        xDescServ: 'Serviço',
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('cServMun'))).toBe(true)
  })

  test('falha quando numeroDps começa com zero', () => {
    const result = validateDps(makeDps({ numeroDps: '001' }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('numeroDps') || e.includes('Número do DPS'))).toBe(true)
  })

  test('falha quando dataCompetencia tem formato inválido', () => {
    const result = validateDps(makeDps({ dataCompetencia: '2023-01' })) // YYYY-MM sem dia
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('dataCompetencia') || e.includes('competência'))).toBe(true)
  })
})

describe('DpsValidator — exterior (NIF + endExt + comExt)', () => {
  const tomadorExterior: DpsData['infDps']['tomador'] = {
    nif: '2553340916',
    nome: 'MALCOM FILIPE SILVA DE OLIVEIRA',
    endereco: {
      exterior: { cPais: 'SA', cEndPost: '13332-7663', xCidade: 'RIYADH', xEstProvReg: 'ARABIA SAUDITA' },
      xLgr: 'VILLA', nro: '124', xBairro: 'AL ARID UNIT 2',
    },
  }

  test('tomador estrangeiro (NIF + endExt, sem cMun) é válido', () => {
    const result = validateDps(makeDps({
      tomador: tomadorExterior,
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '171201' },
        xDescServ: 'Gestão de patrimônio',
        comercioExterior: {
          mdPrestacao: ModoPrestacaoComExt.Transfronteirico,
          vincPrest: VinculoPrestacao.SemVinculo,
          tpMoeda: '790',
          vServMoeda: 1000,
          mecAFComexP: MecAFComexPrestador.Nenhum,
          mecAFComexT: MecAFComexTomador.Nenhum,
          movTempBens: MovimentacaoTemporariaBens.Nao,
          mdic: EnvioMDIC.NaoEnviar,
        },
      },
    }))
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('comExt com mdPrestacao fora do enum é rejeitado', () => {
    const result = validateDps(makeDps({
      tomador: tomadorExterior,
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '171201' },
        xDescServ: 'Gestão de patrimônio',
        comercioExterior: {
          // valor inválido forçado por cast — simula entrada crua incorreta
          mdPrestacao: '9' as unknown as ModoPrestacaoComExt,
          vincPrest: VinculoPrestacao.SemVinculo,
          tpMoeda: '790',
          vServMoeda: 1000,
        },
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('mdPrestacao'))).toBe(true)
  })

  test('comExt com tpMoeda fora do formato [0-9]{3} é rejeitado', () => {
    const result = validateDps(makeDps({
      tomador: tomadorExterior,
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '171201' },
        xDescServ: 'Gestão de patrimônio',
        comercioExterior: {
          mdPrestacao: ModoPrestacaoComExt.Transfronteirico,
          vincPrest: VinculoPrestacao.SemVinculo,
          tpMoeda: '79', // 2 dígitos — inválido
          vServMoeda: 1000,
        },
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('tpMoeda'))).toBe(true)
  })

  test('endereço com cMun E exterior ao mesmo tempo é rejeitado', () => {
    const result = validateDps(makeDps({
      tomador: {
        nif: '2553340916',
        nome: 'Teste',
        endereco: { cMun: '3106200', exterior: { cPais: 'SA', xCidade: 'RIYADH' } },
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('mutuamente exclusivos') || e.includes('exterior'))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Endereço completo — regressão do E1235
// ---------------------------------------------------------------------------

describe('DpsValidator — endereço (E1235)', () => {
  const ENDERECO_NACIONAL = { cMun: '3106200', cep: '30100000', xLgr: 'Rua Teste', nro: '100', xBairro: 'Centro' }

  test('regressão: tomador estrangeiro sem bairro falha aqui, não na SEFIN', () => {
    // Incidente real: tomador na França sem bairro cadastrado gerava
    // "E1235 — o elemento 'end' tem conteúdo incompleto", 400 traduzido em 500,
    // e o job era retentado centenas de vezes sem informação útil.
    const result = validateDps(makeDps({
      tomador: {
        nif: 'FR123456789',
        nome: 'Societe Francaise',
        endereco: {
          exterior: { cPais: 'FR', cEndPost: '75008', xCidade: 'Paris', xEstProvReg: 'Ile-de-France' },
          xLgr: 'Rue de Rivoli',
          nro: '10',
          // xBairro ausente — obrigatório em TCEndereco
        } as unknown as NonNullable<DpsData['infDps']['tomador']>['endereco'],
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('xBairro'))).toBe(true)
  })

  test('endereço nacional sem CEP falha (TCEnderNac exige cMun e CEP)', () => {
    const { cep: _cep, ...semCep } = ENDERECO_NACIONAL
    const result = validateDps(makeDps({
      tomador: { cpf: '13789037737', nome: 'Tomador', endereco: semCep },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('cep'))).toBe(true)
  })

  test('endExt sem cEndPost falha (TCEnderExt exige os quatro campos)', () => {
    const result = validateDps(makeDps({
      tomador: {
        nif: 'PT123456789',
        nome: 'Empresa Portuguesa',
        endereco: {
          exterior: { cPais: 'PT', xCidade: 'Lisboa', xEstProvReg: 'Lisboa' },
          xLgr: 'Rua Augusta', nro: '1', xBairro: 'Baixa',
        } as unknown as NonNullable<DpsData['infDps']['tomador']>['endereco'],
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('cEndPost'))).toBe(true)
  })

  test('cPais fora do formato ISO de 2 letras maiúsculas falha', () => {
    const result = validateDps(makeDps({
      tomador: {
        nif: 'FR123456789',
        nome: 'Societe',
        endereco: {
          exterior: { cPais: 'FRA', cEndPost: '75008', xCidade: 'Paris', xEstProvReg: 'IDF' },
          xLgr: 'Rue', nro: '1', xBairro: 'Centre',
        },
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('cPais'))).toBe(true)
  })

  test('logradouro acima de 255 caracteres falha', () => {
    const result = validateDps(makeDps({
      tomador: {
        cpf: '13789037737',
        nome: 'Tomador',
        endereco: { ...ENDERECO_NACIONAL, xLgr: 'x'.repeat(256) },
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('xLgr'))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Identificador de pessoa — xs:choice
// ---------------------------------------------------------------------------

describe('DpsValidator — identificador de pessoa', () => {
  const ENDERECO_NACIONAL = { cMun: '3106200', cep: '30100000', xLgr: 'Rua Teste', nro: '100', xBairro: 'Centro' }

  test('CNPJ e CPF juntos falham (TCInfoPessoa é choice)', () => {
    const result = validateDps(makeDps({
      tomador: {
        cnpj: '00000000000191',
        cpf: '13789037737',
        nome: 'Tomador Ambiguo',
        endereco: ENDERECO_NACIONAL,
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('exatamente um identificador'))).toBe(true)
  })

  test('NIF e codigoNaoNif juntos falham', () => {
    const result = validateDps(makeDps({
      tomador: {
        nif: 'PT123456789',
        codigoNaoNif: MotivoNaoNif.DispensadoDoNif,
        nome: 'Tomador Ambiguo',
        endereco: {
          exterior: { cPais: 'PT', cEndPost: '1100-001', xCidade: 'Lisboa', xEstProvReg: 'Lisboa' },
          xLgr: 'Rua Augusta', nro: '1', xBairro: 'Baixa',
        },
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('exatamente um identificador'))).toBe(true)
  })

  test('CPF com dígito verificador errado falha', () => {
    const result = validateDps(makeDps({
      tomador: { cpf: '13789037738', nome: 'Tomador', endereco: ENDERECO_NACIONAL },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('dígitos verificadores'))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// IBS/CBS — pareamento CST × cClassTrib contra a tabela oficial
// ---------------------------------------------------------------------------

describe('DpsValidator — IBS/CBS contra a tabela oficial', () => {
  test('CST 000 com cClassTrib de outro CST falha', () => {
    const result = validateDps(makeDps({
      ibsCbs: { ...IBSCBS_BASE, valores: { trib: { gIBSCBS: { CST: '000', cClassTrib: '410004' } } } },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('não pertence ao CST 000'))).toBe(true)
  })

  test('CST inexistente na tabela falha', () => {
    const result = validateDps(makeDps({
      ibsCbs: { ...IBSCBS_BASE, valores: { trib: { gIBSCBS: { CST: '999', cClassTrib: '000001' } } } },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('não consta na tabela oficial'))).toBe(true)
  })

  test('cClassTrib que existe mas não vale para NFS-e falha', () => {
    // 000002 existe sob o CST 000, mas com IndNFSE = false (vale p/ NF-e etc).
    const result = validateDps(makeDps({
      ibsCbs: { ...IBSCBS_BASE, valores: { trib: { gIBSCBS: { CST: '000', cClassTrib: '000002' } } } },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('não vale para NFS-e'))).toBe(true)
  })

  test('exportação de serviço (410 / 410004) é combinação válida', () => {
    const result = validateDps(makeDps({
      ibsCbs: { ...IBSCBS_BASE, valores: { trib: { gIBSCBS: { CST: '410', cClassTrib: '410004' } } } },
    }))
    expect(result.isValid).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// atvEvento (Regra 276) e exigibilidade suspensa
// ---------------------------------------------------------------------------

describe('DpsValidator — atvEvento e exigibilidade suspensa', () => {
  const servicoEvento = {
    localPrestacao: { cLocPrestacao: '3106200' },
    codigoServico: { cServTribNac: '120101' },
    xDescServ: 'Show',
  }

  test('serviço do item 12 com atvEvento é válido', () => {
    const result = validateDps(makeDps({
      servico: {
        ...servicoEvento,
        atvEvento: { xNome: 'Show de Rock', dtIni: '2026-03-01', dtFim: '2026-03-02', idAtvEvt: 'EVT-1' },
      },
    }))
    expect(result.isValid).toBe(true)
  })

  test('atvEvento com idAtvEvt e endereco ao mesmo tempo falha (choice)', () => {
    const result = validateDps(makeDps({
      servico: {
        ...servicoEvento,
        atvEvento: {
          xNome: 'Show', dtIni: '2026-03-01', dtFim: '2026-03-02',
          idAtvEvt: 'EVT-1',
          endereco: { cep: '30100000', xLgr: 'Av. Afonso Pena', nro: '1000', xBairro: 'Centro' },
        },
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('exatamente um entre idAtvEvt e endereco'))).toBe(true)
  })

  test('atvEvento com dtFim anterior a dtIni falha', () => {
    const result = validateDps(makeDps({
      servico: {
        ...servicoEvento,
        atvEvento: { xNome: 'Show', dtIni: '2026-03-05', dtFim: '2026-03-01', idAtvEvt: 'EVT-1' },
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('dtFim'))).toBe(true)
  })

  test('tipoSuspensao sem numeroProcessoSuspensao falha (grupo exigSusp incompleto)', () => {
    const result = validateDps(makeDps({
      tributacao: { issqn: { tributacaoIssqn: 1, tipoSuspensao: 1 } },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('numeroProcessoSuspensao'))).toBe(true)
  })

  test('data de competência inexistente no calendário falha', () => {
    const result = validateDps(makeDps({ dataCompetencia: '2026-02-30' }))
    expect(result.isValid).toBe(false)
    expect(result.errors.some(e => e.includes('calendário'))).toBe(true)
  })
})
