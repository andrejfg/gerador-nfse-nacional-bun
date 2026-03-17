/**
 * Gerador de ID para o DPS
 * Migrado de nfse-php/src/Support/IdGenerator.php
 *
 * Formato: DPS + CodMun(7) + TipoInscrição(1) + CPF/CNPJ(14) + Série(5) + Número(15) = 45 chars
 */

import { onlyDigits } from './cpf-cnpj.js'

export type TipoInscricao = 1 | 2 | 3

export function generateDpsId(
  cpfCnpj: string,
  codIbge: string,
  serieDps: string,
  numDps: string | number
): string {
  const digits = onlyDigits(cpfCnpj)
  const tipoInscricao: TipoInscricao = digits.length === 14 ? 1 : 2

  const munCode = codIbge.padStart(7, '0').slice(0, 7)
  const inscricao = digits.padStart(14, '0').slice(0, 14)
  const serie = String(serieDps).padStart(5, '0').slice(0, 5)
  const numero = String(numDps).padStart(15, '0').slice(0, 15)

  return `DPS${munCode}${tipoInscricao}${inscricao}${serie}${numero}`
}

export function generateNumDps(): string {
  return Date.now().toString().slice(-15).padStart(15, '0')
}

export function formatDataCompetencia(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function formatDhEmissao(date: Date = new Date(), offsetHours = -3): string {
  const sign = offsetHours < 0 ? '-' : '+'
  const absH = Math.abs(offsetHours)
  const offset = `${sign}${String(absH).padStart(2, '0')}:00`
  const adjusted = new Date(date.getTime() + offsetHours * 3600000)
  const iso = adjusted.toISOString().replace('Z', '').split('.')[0]
  return `${iso}${offset}`
}
