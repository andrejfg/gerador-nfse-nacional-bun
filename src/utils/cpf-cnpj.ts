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
