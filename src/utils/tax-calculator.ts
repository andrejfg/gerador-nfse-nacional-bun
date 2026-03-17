/**
 * Calculadora de tributos para NFS-e Nacional
 * Portado de nfse-php/src/Support/TaxCalculator.php
 */

/**
 * Calcula o valor do tributo dado a base de cálculo e a alíquota.
 *
 * @param baseCalculation Base de cálculo em reais (BRL).
 * @param aliquot Alíquota em **porcentagem** (ex.: `5` para 5%, `2.5` para 2,5%).
 * @returns Valor do tributo arredondado para 2 casas decimais.
 *
 * @example
 * ```ts
 * calculateTax(1000, 5)   // 50.00
 * calculateTax(1500, 2.5) // 37.50
 * calculateTax(750, 3)    // 22.50
 * ```
 */
export function calculateTax(baseCalculation: number, aliquot: number): number {
  return Math.round(baseCalculation * (aliquot / 100) * 100) / 100
}
