import { describe, test, expect } from 'bun:test'
import {
  onlyDigits,
  formatCpf,
  formatCnpj,
  formatCep,
  formatTelefone,
  unformat,
  isCnpj,
} from '../../src/utils/cpf-cnpj.js'

describe('onlyDigits', () => {
  test('remove pontos, barras e traços', () => {
    expect(onlyDigits('53.193.608/0001-46')).toBe('53193608000146')
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
    expect(formatCpf('1234567')).toBe('000.123.456-70')
  })
})

describe('formatCnpj', () => {
  test('formata CNPJ corretamente', () => {
    expect(formatCnpj('53193608000146')).toBe('53.193.608/0001-46')
  })

  test('aceita CNPJ já formatado', () => {
    expect(formatCnpj('53.193.608/0001-46')).toBe('53.193.608/0001-46')
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
    expect(unformat('53.193.608/0001-46')).toBe('53193608000146')
  })
})

describe('isCnpj', () => {
  test('retorna true para CNPJ (14 dígitos)', () => {
    expect(isCnpj('53.193.608/0001-46')).toBe(true)
  })

  test('retorna false para CPF (11 dígitos)', () => {
    expect(isCnpj('123.456.789-01')).toBe(false)
  })
})
