/**
 * Consulta às tabelas oficiais de IBS/CBS publicadas pela RFB / Portal Nacional.
 *
 * A data da última conferência de cada tabela está em
 * `IBS_CBS_CST_TABLE_ATUALIZADA_EM` e `IBS_CBS_ANEXO_VIII_ATUALIZADO_EM`.
 */

import { IBS_CBS_CST_INDEX, type CstInfo } from './ibs-cbs-class-trib.js'
import { IBS_CBS_ANEXO_VIII } from './ibs-cbs-anexo-viii.js'

/** Códigos sugeridos para o bloco `ibsCbs` de um serviço. */
export interface SugestaoIbsCbs {
  /** Código indicador da operação (`cIndOp`). */
  cIndOp: string
  /** Classificação tributária (`cClassTrib`). */
  cClassTrib: string
  /** CST correspondente à classificação (3 primeiros dígitos). */
  CST: string
}

/**
 * Sugere `cIndOp`, `CST` e `cClassTrib` a partir do serviço prestado,
 * consultando a correlação do Anexo VIII.
 *
 * **É sugestão, não regra.** A tabela tem exceções e não substitui a análise
 * fiscal — o `validateDps` não recusa uma nota por divergir dela. Use para
 * conferir o cadastro do serviço, não para decidir tributação.
 *
 * Para adquirente no exterior a tabela de regras soma 1 ao último dígito do
 * `cIndOp` (`100301` → `100302`), o que esta função aplica quando
 * `exterior = true`.
 *
 * @param params.cServTribNac Código de tributação nacional (com ou sem pontos).
 *   Só os 4 primeiros dígitos importam — são o item da LC 116/2003.
 * @param params.cNBS Código NBS (com ou sem pontos). Refina a busca quando o
 *   item tem mais de uma correlação.
 * @param params.exterior Adquirente não residente/domiciliado no País.
 *
 * @returns A sugestão, ou `undefined` quando o item não consta na tabela.
 *
 * @example
 * ```ts
 * sugerirIbsCbs({ cServTribNac: '150101', cNBS: '109052100' })
 * // { cIndOp: '100301', cClassTrib: '010002', CST: '010' }
 * ```
 */
export function sugerirIbsCbs(params: {
  cServTribNac: string
  cNBS?: string
  exterior?: boolean
}): SugestaoIbsCbs | undefined {
  const item = params.cServTribNac.replace(/\D/g, '').slice(0, 4)
  if (!item) return undefined

  const nbs = params.cNBS?.replace(/\D/g, '')
  const candidatos = IBS_CBS_ANEXO_VIII.filter(row => row.item === item)
  const row = (nbs && candidatos.find(c => c.nbs === nbs)) || candidatos[0]
  if (!row) return undefined

  const cIndOp = params.exterior ? incrementarUltimoDigito(row.cIndOp) : row.cIndOp

  return { cIndOp, cClassTrib: row.cClassTrib, CST: row.cClassTrib.slice(0, 3) }
}

/** `100301` → `100302`: variante do cIndOp para adquirente no exterior. */
function incrementarUltimoDigito(cIndOp: string): string {
  const ultimo = Number(cIndOp.slice(-1))
  return cIndOp.slice(0, -1) + String(ultimo + 1)
}

/**
 * Classificações tributárias válidas para NFS-e sob um CST.
 *
 * @returns `undefined` quando o CST não existe ou não tem nenhuma classificação
 * aplicável a NFS-e.
 */
export function classificacoesDoCst(cst: string): CstInfo | undefined {
  return IBS_CBS_CST_INDEX.get(cst)
}
