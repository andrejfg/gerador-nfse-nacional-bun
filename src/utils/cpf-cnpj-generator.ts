/**
 * Gerador de CPF e CNPJ válidos com dígitos verificadores (algoritmo Mod11)
 * Portado de nfse-php/src/Support/CpfCnpjGenerator.php
 *
 * Útil para gerar dados de teste em ambiente de homologação.
 */

import { formatCpf, formatCnpj } from './cpf-cnpj.js'

/**
 * Gera um CPF válido com dígitos verificadores calculados pelo algoritmo Mod11.
 *
 * @param formatted Se `true`, retorna no formato `XXX.XXX.XXX-XX`.
 *
 * @example
 * ```ts
 * generateCpf()        // '06672992383'
 * generateCpf(true)    // '066.729.923-83'
 * ```
 */
export function generateCpf(formatted = false): string {
  const d = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))

  const sum1 = d[8] * 2 + d[7] * 3 + d[6] * 4 + d[5] * 5 +
               d[4] * 6 + d[3] * 7 + d[2] * 8 + d[1] * 9 + d[0] * 10
  let v1 = 11 - mod(sum1, 11)
  if (v1 >= 10) v1 = 0

  const sum2 = v1 * 2 + d[8] * 3 + d[7] * 4 + d[6] * 5 + d[5] * 6 +
               d[4] * 7 + d[3] * 8 + d[2] * 9 + d[1] * 10 + d[0] * 11
  let v2 = 11 - mod(sum2, 11)
  if (v2 >= 10) v2 = 0

  const cpf = d.join('') + v1 + v2
  return formatted ? formatCpf(cpf) : cpf
}

/**
 * Gera um CNPJ válido com dígitos verificadores calculados pelo algoritmo Mod11.
 * O sufixo de filial é sempre `0001` (matriz).
 *
 * @param formatted Se `true`, retorna no formato `XX.XXX.XXX/XXXX-XX`.
 *
 * @example
 * ```ts
 * generateCnpj()       // '12345678000195'
 * generateCnpj(true)   // '12.345.678/0001-95'
 * ```
 */
export function generateCnpj(formatted = false): string {
  // 8 dígitos aleatórios + filial fixa 0001
  const d = [...Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)), 0, 0, 0, 1]

  const sum1 = d[11] * 2 + d[10] * 3 + d[9] * 4 + d[8] * 5 + d[7] * 6 + d[6] * 7 +
               d[5] * 8 + d[4] * 9 + d[3] * 2 + d[2] * 3 + d[1] * 4 + d[0] * 5
  let v1 = 11 - mod(sum1, 11)
  if (v1 >= 10) v1 = 0

  const sum2 = v1 * 2 + d[11] * 3 + d[10] * 4 + d[9] * 5 + d[8] * 6 + d[7] * 7 + d[6] * 8 +
               d[5] * 9 + d[4] * 2 + d[3] * 3 + d[2] * 4 + d[1] * 5 + d[0] * 6
  let v2 = 11 - mod(sum2, 11)
  if (v2 >= 10) v2 = 0

  const cnpj = d.join('') + v1 + v2
  return formatted ? formatCnpj(cnpj) : cnpj
}

/** Resto da divisão com arredondamento (equivalente ao `mod()` do PHP). */
function mod(dividend: number, divisor: number): number {
  return Math.round(dividend - Math.floor(dividend / divisor) * divisor)
}
