/**
 * Validador de DPS — estrutura (Zod/XSD v1.01) + regras de negócio (SEFIN)
 *
 * 1ª camada: schema Zod derivado do XSD v1.01 (campos obrigatórios, padrões, formatos)
 * 2ª camada: regras de negócio E0128/E0129 e regras 260, 276, 303, 307, 309
 */

import { z } from 'zod'
import { DpsSchema } from './dps-schema.js'
import { EmitenteDPS } from '../types/enums.js'
import type { DpsData, InfDpsData, ValoresServicoData, ServicoData, TomadorData } from '../types/dtos.js'

/** Resultado da validação de um DPS. */
export interface ValidationResult {
  /** `true` se o DPS passou em todas as validações. */
  isValid: boolean
  /** Mensagens de erro em português. Vazia quando `isValid = true`. */
  errors: string[]
}

/**
 * Converte erros do Zod em mensagens de erro legíveis em português,
 * incluindo o caminho do campo para facilitar a depuração.
 */
function zodErrorsToMessages(error: z.ZodError): string[] {
  return error.issues.map(issue => {
    const path = issue.path.length > 0 ? `[${issue.path.join('.')}] ` : ''
    return `${path}${issue.message}`
  })
}

/**
 * Códigos de serviço de construção civil que exigem o grupo `obra`
 * conforme Regra 260 do Manual de Integração NFS-e Nacional.
 */
const CONSTRUCTION_CODES = new Set([
  '070201', '070202', '070401', '070501', '070502',
  '070601', '070602', '070701', '070801', '071701', '071901',
])

/**
 * Valida um {@link DpsData} em duas camadas:
 * 1. Schema Zod (XSD v1.01): campos obrigatórios, formatos e padrões
 * 2. Regras de negócio: E0128/E0129, Regras 260, 276, 303, 307, 309
 *
 * @example
 * ```ts
 * const result = validateDps(dps)
 * if (!result.isValid) {
 *   console.error('DPS inválido:', result.errors)
 * }
 * ```
 */
export function validateDps(dps: DpsData): ValidationResult {
  // 1ª camada: validação estrutural via Zod (XSD v1.01)
  const parsed = DpsSchema.safeParse(dps)
  if (!parsed.success) {
    return { isValid: false, errors: zodErrorsToMessages(parsed.error) }
  }

  // 2ª camada: regras de negócio
  const errors: string[] = []
  const infDps = dps.infDps

  validatePrestador(infDps, errors)
  validateTomador(infDps.tomador, errors)
  validateValores(infDps.valores, errors)
  validateServico(infDps.servico, errors)

  return errors.length > 0
    ? { isValid: false, errors }
    : { isValid: true, errors: [] }
}

// ---------------------------------------------------------------------------
// Regras de negócio
// ---------------------------------------------------------------------------

function validatePrestador(infDps: InfDpsData, errors: string[]): void {
  const prestador = infDps.prestador
  const tpEmit = infDps.tipoEmitente

  if (!prestador) {
    errors.push('Prestador é obrigatório.')
    return
  }

  // E0129: quando o prestador NÃO é o emitente, endereço é obrigatório
  if (tpEmit !== EmitenteDPS.Prestador && !prestador.endereco) {
    errors.push('E0129: Endereço do prestador é obrigatório quando o prestador não for o emitente.')
  }
}

function validateTomador(tomador: TomadorData | undefined, errors: string[]): void {
  if (!tomador) return

  const isIdentified = Boolean(tomador.cpf || tomador.cnpj || tomador.nif)
  if (!isIdentified) return

  if (!tomador.endereco) {
    errors.push('Endereço do tomador é obrigatório quando o tomador é identificado.')
    return
  }

  if (!tomador.nif && !tomador.endereco.cMun) {
    errors.push('Código do município do tomador (endereco.cMun) é obrigatório para tomador nacional.')
  }
}

function validateValores(valores: ValoresServicoData, errors: string[]): void {
  const vServ = valores.vServico ?? 0
  const vDescIncond = valores.vDescIncondicionado ?? 0
  const vDescCond = valores.vDescCondicionado ?? 0

  // Regra 307
  if (vDescIncond > 0 && vDescIncond >= vServ) {
    errors.push('Regra 307: O desconto incondicionado deve ser menor que o valor do serviço.')
  }

  // Regra 309
  if (vDescCond > 0 && vDescCond >= vServ) {
    errors.push('Regra 309: O desconto condicionado deve ser menor que o valor do serviço.')
  }

  // Regra 303
  if (vServ < vDescIncond + vDescCond) {
    errors.push(
      'Regra 303: O valor do serviço deve ser maior ou igual ao somatório dos descontos incondicionado e condicionado.',
    )
  }
}

function validateServico(servico: ServicoData | undefined, errors: string[]): void {
  if (!servico) return

  const cTribNac = (servico.codigoServico?.cServTribNac ?? '').replace(/\D/g, '')

  // Regra 260: serviços de construção civil exigem dados de obra
  if (CONSTRUCTION_CODES.has(cTribNac) && !servico.obra) {
    errors.push('Regra 260: O grupo de informações de obra é obrigatório para o serviço informado.')
  }

  // Regra 276: serviços do item 12 exigem atividade/evento
  if (cTribNac.startsWith('12')) {
    const hasAtividadeEvento =
      'atividadeEvento' in servico && Boolean((servico as Record<string, unknown>)['atividadeEvento'])
    if (!hasAtividadeEvento) {
      errors.push('Regra 276: O grupo de informações de Atividade/Evento é obrigatório para o serviço informado.')
    }
  }
}
