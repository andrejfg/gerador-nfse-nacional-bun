/**
 * Testes do DpsValidator
 * Espelhado de nfse-php/tests/Unit/Validator/DpsValidatorTest.php
 */
import { describe, test, expect } from 'bun:test'
import { validateDps } from '../../src/validator/dps-validator.js'
import { TipoAmbiente, EmitenteDPS } from '../../src/types/enums.js'
import type { DpsData } from '../../src/types/dtos.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeDps(overrides: Partial<DpsData['infDps']> = {}): DpsData {
  return {
    infDps: {
      id: 'DPS31062001531936080001460010100000000000001',
      tipoAmbiente: TipoAmbiente.Homologacao,
      dataEmissao: '2023-01-01T00:00:00-03:00',
      numeroDps: '100',
      dataCompetencia: '2023-01',
      tipoEmitente: EmitenteDPS.Prestador,
      codigoLocalEmissao: '3106200',
      prestador: {
        cnpj: '12345678000199',
        inscricaoMunicipal: '12345',
        nome: 'Prestador Teste',
        endereco: { cMun: '3106200', cep: '30100000', xLgr: 'Rua Teste', nro: '100', xBairro: 'Centro' },
      },
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '01.01.00163' },
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
    expect(result.errors).toContain('Prestador data is required.')
  })

  test('falha quando prestador não é emitente e não tem endereço', () => {
    const result = validateDps(makeDps({
      tipoEmitente: EmitenteDPS.Tomador, // tpEmit = 2
      prestador: {
        cnpj: '12345678000199',
        nome: 'Prestador Teste',
        // sem endereco
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'Endereço do prestador é obrigatório quando o prestador não for o emitente.',
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
        cpf: '12345678901',
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
        cpf: '12345678901',
        nome: 'Tomador Nacional',
        endereco: { cMun: '' }, // cMun vazio
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'Código do município do tomador é obrigatório para endereço nacional.',
    )
  })

  test('tomador sem identificação não gera erros de endereço', () => {
    const result = validateDps(makeDps({
      tomador: {
        nome: 'Tomador Anônimo',
        // sem cpf, cnpj ou nif
      },
    }))
    expect(result.isValid).toBe(true)
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
      'O valor do desconto incondicionado deve ser menor que o valor do serviço.',
    )
  })

  test('Regra 309: falha quando desconto condicionado > valor do serviço', () => {
    const result = validateDps(makeDps({
      valores: { vServico: 1000, vDescCondicionado: 1500 }, // maior — inválido
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'O valor do desconto condicionado deve ser menor que o valor do serviço.',
    )
  })

  test('Regra 303: falha quando soma dos descontos supera valor do serviço', () => {
    const result = validateDps(makeDps({
      valores: { vServico: 1000, vDescIncondicionado: 600, vDescCondicionado: 500 }, // 1100 > 1000
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'O valor do serviço deve ser maior ou igual ao somatório dos valores informados para Desconto Incondicionado e Desconto Condicionado.',
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
        'O grupo de informações de obra é obrigatório para o serviço informado.',
      )
    },
  )

  test('Regra 276: código 120101 (item 12) sem atividadeEvento falha', () => {
    const result = validateDps(makeDps({
      servico: {
        localPrestacao: { cLocPrestacao: '3106200' },
        codigoServico: { cServTribNac: '120101' },
        xDescServ: 'Evento',
        // atividadeEvento ausente
      },
    }))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'O grupo de informações de Atividade/Evento é obrigatório para o serviço informado.',
    )
  })
})
