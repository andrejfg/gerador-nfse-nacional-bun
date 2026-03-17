import { describe, test, expect } from 'bun:test'
import {
  generateDpsId,
  generateNumDps,
  formatDataCompetencia,
  formatDhEmissao,
} from '../../src/utils/id-generator.js'

const CNPJ    = '12345678000195'
const IBGE    = '3106200'
const SERIE   = '001'
const NUMERO  = '000000000000001'

describe('generateDpsId', () => {
  test('gera ID com exatamente 45 caracteres', () => {
    expect(generateDpsId(CNPJ, IBGE, SERIE, NUMERO)).toHaveLength(45)
  })

  test('começa com "DPS"', () => {
    expect(generateDpsId(CNPJ, IBGE, SERIE, NUMERO).startsWith('DPS')).toBe(true)
  })

  test('usa tipo 1 (CNPJ) para 14 dígitos', () => {
    // posição 10 = DPS(3) + CodMun(7)
    expect(generateDpsId(CNPJ, IBGE, SERIE, NUMERO)[10]).toBe('1')
  })

  test('usa tipo 2 (CPF) para 11 dígitos', () => {
    expect(generateDpsId('12345678901', IBGE, SERIE, NUMERO)[10]).toBe('2')
  })

  test('aceita CNPJ com pontuação', () => {
    const a = generateDpsId('12.345.678/0001-95', IBGE, SERIE, NUMERO)
    const b = generateDpsId(CNPJ, IBGE, SERIE, NUMERO)
    expect(a).toBe(b)
  })

  test('código IBGE é sempre 7 dígitos no ID', () => {
    const id = generateDpsId(CNPJ, IBGE, SERIE, NUMERO)
    expect(id.slice(3, 10)).toBe('3106200')
  })

  test('completa IBGE curto com zero à esquerda', () => {
    const id = generateDpsId(CNPJ, '310620', SERIE, NUMERO)
    expect(id.slice(3, 10)).toBe('0310620')
  })

  test('aceita número como inteiro', () => {
    const id = generateDpsId(CNPJ, IBGE, SERIE, 1)
    expect(id).toHaveLength(45)
    expect(id.slice(-15)).toBe('000000000000001')
  })
})

describe('generateNumDps', () => {
  test('retorna string numérica com até 15 dígitos', () => {
    const num = generateNumDps()
    expect(num).toMatch(/^\d{1,15}$/)
  })
})

describe('formatDataCompetencia', () => {
  test('formata no padrão YYYY-MM', () => {
    expect(formatDataCompetencia(new Date('2024-03-15'))).toBe('2024-03')
  })

  test('usa data atual quando não informada', () => {
    expect(formatDataCompetencia()).toMatch(/^\d{4}-\d{2}$/)
  })

  test('mês de janeiro com zero à esquerda', () => {
    expect(formatDataCompetencia(new Date(2024, 0, 15))).toBe('2024-01')
  })
})

describe('formatDhEmissao', () => {
  test('retorna ISO 8601 com offset BRT (-03:00)', () => {
    const d = new Date('2024-03-15T15:30:00Z')
    expect(formatDhEmissao(d, -3)).toBe('2024-03-15T12:30:00-03:00')
  })

  test('suporta offset positivo (UTC+1)', () => {
    const d = new Date('2024-01-15T10:00:00Z')
    expect(formatDhEmissao(d, 1)).toBe('2024-01-15T11:00:00+01:00')
  })

  test('não inclui milissegundos', () => {
    expect(formatDhEmissao(new Date(), -3)).not.toContain('.')
  })

  test('usa data atual quando não informada', () => {
    const result = formatDhEmissao()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-03:00$/)
  })
})
