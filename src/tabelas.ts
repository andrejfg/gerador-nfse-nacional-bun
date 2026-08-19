/**
 * Ponto de entrada `nfse-nacional/tabelas` — tabelas oficiais de consulta.
 *
 * Fica fora do barrel principal de propósito: a correlação do Anexo VIII tem
 * ~1.300 linhas e triplicaria o tamanho do pacote para quem só emite nota. A
 * tabela `CST × cClassTrib`, essa, é pequena e o `validateDps` depende dela, então
 * continua exportada pelo `nfse-nacional`.
 *
 * ```ts
 * import { sugerirIbsCbs } from 'nfse-nacional/tabelas'
 * ```
 */

export { sugerirIbsCbs, classificacoesDoCst } from './data/ibs-cbs-lookup.js'
export type { SugestaoIbsCbs } from './data/ibs-cbs-lookup.js'
export { IBS_CBS_ANEXO_VIII, IBS_CBS_ANEXO_VIII_ATUALIZADO_EM } from './data/ibs-cbs-anexo-viii.js'
export type { AnexoViiiRow } from './data/ibs-cbs-anexo-viii.js'
export { IBS_CBS_CST_TABLE, IBS_CBS_CST_INDEX, IBS_CBS_CST_TABLE_ATUALIZADA_EM } from './data/ibs-cbs-class-trib.js'
export type { CstInfo, ClassTribInfo } from './data/ibs-cbs-class-trib.js'
