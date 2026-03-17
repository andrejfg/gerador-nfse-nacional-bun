/**
 * Testes do TaxCalculator
 * Portado de nfse-php/src/Support/TaxCalculator.php
 */
import { describe, test, expect } from 'bun:test'
import { calculateTax } from '../../src/utils/tax-calculator.js'

describe('calculateTax', () => {
  test('calcula ISSQN 5% sobre R$ 1.000,00', () => {
    expect(calculateTax(1000, 5)).toBe(50)
  })

  test('calcula ISSQN 2% sobre R$ 1.500,00', () => {
    expect(calculateTax(1500, 2)).toBe(30)
  })

  test('arredonda para 2 casas decimais', () => {
    expect(calculateTax(1000, 3)).toBe(30)
    expect(calculateTax(333.33, 5)).toBe(16.67)
  })

  test('alíquota mínima 2% (limite legal LC 116/2003)', () => {
    expect(calculateTax(1000, 2)).toBe(20)
  })

  test('alíquota máxima 5% (limite legal LC 116/2003)', () => {
    expect(calculateTax(1000, 5)).toBe(50)
  })

  test('base de cálculo zero retorna zero', () => {
    expect(calculateTax(0, 5)).toBe(0)
  })

  test('alíquota fracionada 2,5%', () => {
    expect(calculateTax(1000, 2.5)).toBe(25)
  })

  test('alíquota 0,65% para PIS', () => {
    expect(calculateTax(1000, 0.65)).toBe(6.5)
  })

  test('alíquota 3% para COFINS', () => {
    expect(calculateTax(1000, 3)).toBe(30)
  })
})
