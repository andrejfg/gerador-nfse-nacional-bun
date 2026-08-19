import { describe, test, expect } from 'bun:test'
import {
  onlyDigits,
  formatCpf,
  formatCnpj,
  formatCep,
  formatTelefone,
  unformat,
  isCnpj,
  isValidCpf,
  isValidCnpj,
} from '../../src/utils/cpf-cnpj.js'
import { generateCpf, generateCnpj } from '../../src/utils/cpf-cnpj-generator.js'

describe('onlyDigits', () => {
  test('remove pontos, barras e traços', () => {
    expect(onlyDigits('12.345.678/0001-95')).toBe('12345678000195')
  })

  test('remove parênteses e espaços', () => {
    expect(onlyDigits('(31) 99999-8888')).toBe('31999998888')
  })

  test('mantém string já com apenas dígitos', () => {
    expect(onlyDigits('12345678901')).toBe('12345678901')
  })

  test('string vazia retorna vazia', () => {
    expect(onlyDigits('')).toBe('')
  })
})

describe('formatCpf', () => {
  test('formata CPF corretamente', () => {
    expect(formatCpf('12345678901')).toBe('123.456.789-01')
  })

  test('aceita CPF já formatado', () => {
    expect(formatCpf('123.456.789-01')).toBe('123.456.789-01')
  })

  test('completa CPF curto com zeros à esquerda', () => {
    expect(formatCpf('1234567')).toBe('000.012.345-67')
  })
})

describe('formatCnpj', () => {
  test('formata CNPJ corretamente', () => {
    expect(formatCnpj('12345678000195')).toBe('12.345.678/0001-95')
  })

  test('aceita CNPJ já formatado', () => {
    expect(formatCnpj('12.345.678/0001-95')).toBe('12.345.678/0001-95')
  })

  test('CNPJ do Banco do Brasil', () => {
    expect(formatCnpj('00000000000191')).toBe('00.000.000/0001-91')
  })
})

describe('formatCep', () => {
  test('formata CEP com 8 dígitos', () => {
    expect(formatCep('30100000')).toBe('30100-000')
  })

  test('aceita CEP já formatado', () => {
    expect(formatCep('30100-000')).toBe('30100-000')
  })
})

describe('formatTelefone', () => {
  test('formata celular com 11 dígitos', () => {
    expect(formatTelefone('31999998888')).toBe('(31) 99999-8888')
  })

  test('formata fixo com 10 dígitos', () => {
    expect(formatTelefone('3133334444')).toBe('(31) 3333-4444')
  })

  test('retorna dígitos sem formatação para tamanhos inesperados', () => {
    expect(formatTelefone('12345')).toBe('12345')
  })
})

describe('unformat', () => {
  test('remove formatação de CNPJ', () => {
    expect(unformat('12.345.678/0001-95')).toBe('12345678000195')
  })
})

describe('isCnpj', () => {
  test('retorna true para CNPJ (14 dígitos)', () => {
    expect(isCnpj('12.345.678/0001-95')).toBe(true)
  })

  test('retorna false para CPF (11 dígitos)', () => {
    expect(isCnpj('123.456.789-01')).toBe(false)
  })
})

describe('isValidCpf / isValidCnpj — dígitos verificadores', () => {
  test('aceita CPF e CNPJ válidos, com ou sem formatação', () => {
    expect(isValidCpf('13789037737')).toBe(true)
    expect(isValidCpf('137.890.377-37')).toBe(true)
    expect(isValidCnpj('12345678000195')).toBe(true)
    expect(isValidCnpj('12.345.678/0001-95')).toBe(true)
  })

  test('rejeita dígito verificador errado', () => {
    expect(isValidCpf('13789037738')).toBe(false)
    expect(isValidCnpj('12345678000199')).toBe(false)
  })

  test('rejeita sequência de caractere repetido — passa no Mod 11 mas não é documento', () => {
    expect(isValidCpf('11111111111')).toBe(false)
    expect(isValidCnpj('00000000000000')).toBe(false)
  })

  test('rejeita tamanho errado', () => {
    expect(isValidCpf('1378903773')).toBe(false)
    expect(isValidCnpj('1234567800019')).toBe(false)
  })

  test('aceita CNPJ alfanumérico (IN RFB 2.229/2024)', () => {
    // Exemplo oficial da Receita Federal.
    expect(isValidCnpj('12ABC34501DE35')).toBe(true)
    expect(isValidCnpj('12.ABC.345/01DE-35')).toBe(true)
    // DV errado no mesmo CNPJ alfanumérico
    expect(isValidCnpj('12ABC34501DE36')).toBe(false)
  })

  test('valida o que o gerador produz', () => {
    for (let i = 0; i < 50; i++) {
      expect(isValidCpf(generateCpf())).toBe(true)
      expect(isValidCnpj(generateCnpj())).toBe(true)
    }
  })
})
