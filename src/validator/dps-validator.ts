/**
 * Validador de DPS — regras de negócio antes do envio à API SEFIN
 * Portado de nfse-php/src/Validator/DpsValidator.php
 *
 * Referência das regras:
 * - E0128/E0129: Endereço do prestador conforme tipo de emitente
 * - Regra 303: vServ >= vDescIncond + vDescCond
 * - Regra 307: vDescIncond < vServ
 * - Regra 309: vDescCond < vServ
 * - Regra 260: Serviços de construção civil exigem dados de obra
 * - Regra 276: Serviços do item 12 exigem dados de atividade/evento
 */

import { EmitenteDPS } from '../types/enums.js'
import type { DpsData, InfDpsData, ValoresServicoData, ServicoData, TomadorData } from '../types/dtos.js'

/** Resultado da validação de um DPS. */
export interface ValidationResult {
  /** `true` se o DPS passou em todas as regras de validação. */
  isValid: boolean
  /** Lista de mensagens de erro. Vazia quando `isValid = true`. */
  errors: string[]
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
 * Valida um {@link DpsData} contra as regras de negócio da SEFIN Nacional
 * antes do envio para emissão.
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
// Prestador
// ---------------------------------------------------------------------------

function validatePrestador(infDps: InfDpsData, errors: string[]): void {
  const prestador = infDps.prestador
  const tpEmit = infDps.tipoEmitente

  if (!prestador) {
    errors.push('Prestador data is required.')
    return
  }

  // Schema Rule E0129: quando o prestador NÃO é o emitente, endereço é obrigatório
  if (tpEmit !== EmitenteDPS.Prestador && !prestador.endereco) {
    errors.push('Endereço do prestador é obrigatório quando o prestador não for o emitente.')
  }
}

// ---------------------------------------------------------------------------
// Tomador
// ---------------------------------------------------------------------------

function validateTomador(tomador: TomadorData | undefined, errors: string[]): void {
  if (!tomador) return

  const isIdentified = Boolean(tomador.cpf || tomador.cnpj || tomador.nif)
  if (!isIdentified) return

  if (!tomador.endereco) {
    errors.push('Endereço do tomador é obrigatório quando o tomador é identificado.')
    return
  }

  if (tomador.nif) {
    // Tomador estrangeiro: deve informar endereço exterior (cPais diferente de 1058 ou ausência de cMun)
    const hasNationalAddress = tomador.endereco.cMun && tomador.endereco.cMun !== '0000000'
    if (hasNationalAddress) {
      // Tem endereço nacional mas deveria ter endereço exterior
      // Não bloqueamos se cMun está preenchido — pode ser um estrangeiro com presença local
    } else {
      // Sem município preenchido: ok para estrangeiro (endereço exterior implícito)
    }
    // Regra simplificada: se NIF, validamos que pelo menos o endereço existe (já verificado acima)
    // A checagem de enderecoExterior específico não existe nos tipos TS atuais
  } else {
    // Tomador nacional (CPF ou CNPJ): cMun é obrigatório
    if (!tomador.endereco.cMun) {
      errors.push('Código do município do tomador é obrigatório para endereço nacional.')
    }
  }
}

// ---------------------------------------------------------------------------
// Valores — Regras 303, 307, 309
// ---------------------------------------------------------------------------

function validateValores(valores: ValoresServicoData, errors: string[]): void {
  const vServ = valores.vServico ?? 0
  const vDescIncond = valores.vDescIncondicionado ?? 0
  const vDescCond = valores.vDescCondicionado ?? 0

  // Regra 307: desconto incondicionado deve ser MENOR que o valor do serviço
  if (vDescIncond > 0 && vDescIncond >= vServ) {
    errors.push('O valor do desconto incondicionado deve ser menor que o valor do serviço.')
  }

  // Regra 309: desconto condicionado deve ser MENOR que o valor do serviço
  if (vDescCond > 0 && vDescCond >= vServ) {
    errors.push('O valor do desconto condicionado deve ser menor que o valor do serviço.')
  }

  // Regra 303: vServ >= soma dos descontos
  // (versão simplificada — PHP também inclui vDedRed e vRedBCBM que não existem nos tipos TS atuais)
  if (vServ < vDescIncond + vDescCond) {
    errors.push(
      'O valor do serviço deve ser maior ou igual ao somatório dos valores informados para Desconto Incondicionado e Desconto Condicionado.',
    )
  }
}

// ---------------------------------------------------------------------------
// Serviço — Regras 260, 276
// ---------------------------------------------------------------------------

function validateServico(servico: ServicoData | undefined, errors: string[]): void {
  if (!servico) return

  const cTribNac = servico.codigoServico?.cServTribNac ?? ''

  // Regra 260: serviços de construção civil exigem dados de obra
  if (CONSTRUCTION_CODES.has(cTribNac) && !servico.obra) {
    errors.push('O grupo de informações de obra é obrigatório para o serviço informado.')
  }

  // Regra 276: serviços do item 12 exigem dados de atividade/evento
  // Nota: o campo atividadeEvento não existe nos tipos TS atuais (ServicoData),
  // mas a validação é mantida para documentar a regra.
  if (cTribNac.startsWith('12')) {
    const hasAtividadeEvento = 'atividadeEvento' in servico && Boolean((servico as Record<string, unknown>)['atividadeEvento'])
    if (!hasAtividadeEvento) {
      errors.push('O grupo de informações de Atividade/Evento é obrigatório para o serviço informado.')
    }
  }
}
