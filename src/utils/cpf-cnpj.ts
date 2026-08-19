/**
 * Utilitários para formatação de CPF/CNPJ
 * Migrado de nfse-php/src/Support/CpfCnpjFormatter.php
 */

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatCpf(cpf: string): string {
  const d = onlyDigits(cpf).padStart(11, '0')
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`
}

export function formatCnpj(cnpj: string): string {
  const d = onlyDigits(cnpj).padStart(14, '0')
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`
}

export function formatCep(cep: string): string {
  const d = onlyDigits(cep).padStart(8, '0')
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

export function formatTelefone(tel: string): string {
  const d = onlyDigits(tel)
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return d
}

export function unformat(value: string): string {
  return onlyDigits(value)
}

export function isCnpj(value: string): boolean {
  return onlyDigits(value).length === 14
}

// ---------------------------------------------------------------------------
// Dígitos verificadores (Mod 11)
// ---------------------------------------------------------------------------

/** Peso decrescente a partir de `start`, ciclando de 9 para 2 (regra do CNPJ). */
function mod11Dv(values: number[], startWeight: number): number {
  let weight = startWeight
  let sum = 0
  for (const value of values) {
    sum += value * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  const rest = sum % 11
  return rest < 2 ? 0 : 11 - rest
}

/**
 * Valida um CPF pelos dígitos verificadores (Mod 11).
 *
 * Aceita com ou sem formatação. Sequências de dígito repetido
 * (`111.111.111-11`) passam na aritmética do Mod 11 e são rejeitadas à parte.
 */
export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value)
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  const nums = [...digits].map(Number)
  const dv1 = mod11Dv(nums.slice(0, 9), 10)
  const dv2 = mod11Dv(nums.slice(0, 10), 11)
  return dv1 === nums[9] && dv2 === nums[10]
}

/**
 * Valida um CNPJ pelos dígitos verificadores (Mod 11), **numérico ou
 * alfanumérico**.
 *
 * O CNPJ alfanumérico (IN RFB 2.229/2024) mantém 14 posições: 12 alfanuméricas
 * (`0-9`, `A-Z`) + 2 dígitos verificadores numéricos. O valor de cada posição no
 * cálculo é `código ASCII − 48`, o que faz `'0'` valer 0 e `'A'` valer 17 — a
 * mesma conta serve para os dois formatos.
 *
 * ⚠️ O XSD v1.01 da NFS-e ainda restringe `TSCNPJ` a `[0-9]{14}`: um CNPJ
 * alfanumérico é legalmente válido e **recusado pelo schema vigente** até a
 * SEFIN publicar a atualização.
 *
 * Aceita com ou sem formatação. Caracteres repetidos em todas as posições são
 * rejeitados.
 */
export function isValidCnpj(value: string): boolean {
  const clean = value.replace(/[^0-9A-Za-z]/g, '').toUpperCase()
  if (clean.length !== 14) return false
  if (/^(.)\1{13}$/.test(clean)) return false
  // Os dois dígitos verificadores são sempre numéricos.
  if (!/^[0-9A-Z]{12}[0-9]{2}$/.test(clean)) return false

  const values = [...clean].map(char => char.charCodeAt(0) - 48)
  const dv1 = mod11Dv(values.slice(0, 12), 5)
  const dv2 = mod11Dv(values.slice(0, 13), 6)
  return dv1 === values[12] && dv2 === values[13]
}
