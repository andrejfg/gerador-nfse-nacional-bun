/**
 * Testes do CpfCnpjGenerator
 * Espelhado de nfse-php/tests/Unit/Support/CpfCnpjGeneratorTest.php
 */
import { describe, test, expect } from 'bun:test'
import { generateCpf, generateCnpj } from '../../src/utils/cpf-cnpj-generator.js'

describe('generateCpf', () => {
  test('gera CPF com 11 dígitos', () => {
    const cpf = generateCpf()
    expect(cpf).toHaveLength(11)
    expect(cpf).toMatch(/^\d{11}$/)
  })

  test('gera CPF formatado no padrão XXX.XXX.XXX-XX', () => {
    const cpf = generateCpf(true)
    expect(cpf).toHaveLength(14)
    expect(cpf).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
  })

  test('CPF gerado tem dígitos verificadores válidos (Mod11)', () => {
    for (let i = 0; i < 10; i++) {
      const cpf = generateCpf()
      expect(isValidCpf(cpf)).toBe(true)
    }
  })

  test('CPFs gerados são diferentes a cada chamada', () => {
    const results = new Set(Array.from({ length: 20 }, () => generateCpf()))
    expect(results.size).toBeGreaterThan(1)
  })
})

describe('generateCnpj', () => {
  test('gera CNPJ com 14 dígitos', () => {
    const cnpj = generateCnpj()
    expect(cnpj).toHaveLength(14)
    expect(cnpj).toMatch(/^\d{14}$/)
  })

  test('gera CNPJ formatado no padrão XX.XXX.XXX/XXXX-XX', () => {
    const cnpj = generateCnpj(true)
    expect(cnpj).toHaveLength(18)
    expect(cnpj).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  })

  test('CNPJ gerado tem dígitos verificadores válidos (Mod11)', () => {
    for (let i = 0; i < 10; i++) {
      const cnpj = generateCnpj()
      expect(isValidCnpj(cnpj)).toBe(true)
    }
  })

  test('sufixo de filial é sempre 0001 (matriz)', () => {
    for (let i = 0; i < 5; i++) {
      const cnpj = generateCnpj()
      expect(cnpj.slice(8, 12)).toBe('0001')
    }
  })
})

// ---------------------------------------------------------------------------
// Helpers de validação (Mod11)
// ---------------------------------------------------------------------------

function isValidCpf(cpf: string): boolean {
  const d = cpf.split('').map(Number)
  const v1 = 11 - (d.slice(0, 9).reduce((acc, n, i) => acc + n * (10 - i), 0) % 11)
  const d1 = v1 >= 10 ? 0 : v1
  const v2 = 11 - (d.slice(0, 10).reduce((acc, n, i) => acc + n * (11 - i), 0) % 11)
  const d2 = v2 >= 10 ? 0 : v2
  return d[9] === d1 && d[10] === d2
}

function isValidCnpj(cnpj: string): boolean {
  const d = cnpj.split('').map(Number)
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const s1 = d.slice(0, 12).reduce((acc, n, i) => acc + n * w1[i], 0)
  const r1 = s1 % 11; const d1 = r1 < 2 ? 0 : 11 - r1
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const s2 = d.slice(0, 13).reduce((acc, n, i) => acc + n * w2[i], 0)
  const r2 = s2 % 11; const d2 = r2 < 2 ? 0 : 11 - r2
  return d[12] === d1 && d[13] === d2
}
