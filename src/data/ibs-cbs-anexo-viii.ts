/**
 * Correlação oficial do Anexo VIII: item LC 116 × NBS × cIndOp × cClassTrib.
 */

/** Data da última atualização desta tabela contra a publicação oficial. */
export const IBS_CBS_ANEXO_VIII_ATUALIZADO_EM = '2026-08-19'

/** Uma linha da correlação do Anexo VIII. */
export interface AnexoViiiRow {
  /** Item da LC 116/2003, só dígitos (`15.01` → `1501`). */
  item: string
  /** Código NBS, só dígitos. */
  nbs: string
  /** Prestação de serviço onerosa. */
  onerosa: boolean
  /** Código indicador da operação para adquirente **no País**. */
  cIndOp: string
  /** Classificação tributária correspondente. */
  cClassTrib: string
}

/**
 * Correlação item LC 116 × NBS × cIndOp × cClassTrib (Anexo VIII).
 *
 * O `cIndOp` aqui é o da operação com adquirente **no País**; para adquirente
 * no exterior a tabela de regras soma 1 ao último dígito (`100301` → `100302`).
 */
export const IBS_CBS_ANEXO_VIII: readonly AnexoViiiRow[] = [
  {
    "item": "0101",
    "nbs": "115021000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0101",
    "nbs": "115022000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0101",
    "nbs": "115024000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0101",
    "nbs": "115025000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0101",
    "nbs": "115029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0101",
    "nbs": "115029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200043"
  },
  {
    "item": "0101",
    "nbs": "115029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200044"
  },
  {
    "item": "0101",
    "nbs": "115030000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0101",
    "nbs": "115040000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0101",
    "nbs": "115050000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0101",
    "nbs": "115071000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0101",
    "nbs": "115072000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0101",
    "nbs": "115079000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0102",
    "nbs": "115021000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0102",
    "nbs": "115022000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0102",
    "nbs": "115029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0102",
    "nbs": "115029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200043"
  },
  {
    "item": "0102",
    "nbs": "115029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200044"
  },
  {
    "item": "0103",
    "nbs": "115061000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0103",
    "nbs": "115062100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0103",
    "nbs": "115062200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0103",
    "nbs": "115062300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0103",
    "nbs": "115062900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0103",
    "nbs": "115069000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0103",
    "nbs": "115090000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0104",
    "nbs": "115021000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0104",
    "nbs": "115022000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0104",
    "nbs": "115029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0104",
    "nbs": "115029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200043"
  },
  {
    "item": "0104",
    "nbs": "115029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200044"
  },
  {
    "item": "0105",
    "nbs": "111032100",
    "onerosa": true,
    "cIndOp": "100501",
    "cClassTrib": "000001"
  },
  {
    "item": "0105",
    "nbs": "111032200",
    "onerosa": true,
    "cIndOp": "100501",
    "cClassTrib": "000001"
  },
  {
    "item": "0105",
    "nbs": "111032300",
    "onerosa": true,
    "cIndOp": "100501",
    "cClassTrib": "000001"
  },
  {
    "item": "0105",
    "nbs": "111032900",
    "onerosa": true,
    "cIndOp": "100501",
    "cClassTrib": "000001"
  },
  {
    "item": "0105",
    "nbs": "111062000",
    "onerosa": true,
    "cIndOp": "100501",
    "cClassTrib": "000001"
  },
  {
    "item": "0105",
    "nbs": "111072000",
    "onerosa": true,
    "cIndOp": "100501",
    "cClassTrib": "000001"
  },
  {
    "item": "0106",
    "nbs": "115011000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0106",
    "nbs": "115012000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0106",
    "nbs": "115012000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200043"
  },
  {
    "item": "0106",
    "nbs": "115012000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200044"
  },
  {
    "item": "0106",
    "nbs": "115071000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0106",
    "nbs": "115072000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0106",
    "nbs": "115079000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0106",
    "nbs": "115100000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0106",
    "nbs": "115100000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200043"
  },
  {
    "item": "0106",
    "nbs": "115100000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200044"
  },
  {
    "item": "0107",
    "nbs": "115013000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0107",
    "nbs": "115013000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0107",
    "nbs": "115013000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0107",
    "nbs": "115013000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0107",
    "nbs": "115013000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0107",
    "nbs": "115080000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0107",
    "nbs": "115021000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0107",
    "nbs": "115022000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0108",
    "nbs": "115023000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0108",
    "nbs": "115023000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200040"
  },
  {
    "item": "0109",
    "nbs": "117031000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0109",
    "nbs": "117032100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0109",
    "nbs": "117032200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0109",
    "nbs": "117033100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0109",
    "nbs": "117033200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0109",
    "nbs": "117039100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0109",
    "nbs": "117039200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0109",
    "nbs": "117039900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112011100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112011100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112011200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112011200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112011900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112011900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112012000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112012000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112013100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112013100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112013200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112013200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112013300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112013300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112013400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112013400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112013900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112013900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112014000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112014000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112015000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112015000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112021000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112021000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112022000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112022000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112023000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112023000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112024000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112024000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0201",
    "nbs": "112030000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0201",
    "nbs": "112030000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200016"
  },
  {
    "item": "0302",
    "nbs": "111033300",
    "onerosa": true,
    "cIndOp": "100501",
    "cClassTrib": "000001"
  },
  {
    "item": "0302",
    "nbs": "111042000",
    "onerosa": true,
    "cIndOp": "100501",
    "cClassTrib": "000001"
  },
  {
    "item": "0302",
    "nbs": "111063300",
    "onerosa": true,
    "cIndOp": "100501",
    "cClassTrib": "000001"
  },
  {
    "item": "0302",
    "nbs": "111073300",
    "onerosa": true,
    "cIndOp": "100501",
    "cClassTrib": "000001"
  },
  {
    "item": "0302",
    "nbs": "111082000",
    "onerosa": true,
    "cIndOp": "100501",
    "cClassTrib": "000001"
  },
  {
    "item": "0305",
    "nbs": "101057000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0305",
    "nbs": "101057000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0305",
    "nbs": "101057000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0305",
    "nbs": "101057000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0305",
    "nbs": "101055000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0305",
    "nbs": "101055000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0305",
    "nbs": "101055000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0305",
    "nbs": "101055000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0305",
    "nbs": "101055000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "200039"
  },
  {
    "item": "0305",
    "nbs": "101055000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "200039"
  },
  {
    "item": "0305",
    "nbs": "101055000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "200039"
  },
  {
    "item": "0305",
    "nbs": "101055000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "200039"
  },
  {
    "item": "0401",
    "nbs": "123012200",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0401",
    "nbs": "123012200",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0401",
    "nbs": "123012200",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0401",
    "nbs": "123012200",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0401",
    "nbs": "123012200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200029"
  },
  {
    "item": "0402",
    "nbs": "123019300",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0402",
    "nbs": "123019300",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0402",
    "nbs": "123019300",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0402",
    "nbs": "123019300",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0402",
    "nbs": "123019300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200029"
  },
  {
    "item": "0402",
    "nbs": "123019400",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0402",
    "nbs": "123019400",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0402",
    "nbs": "123019400",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0402",
    "nbs": "123019400",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0402",
    "nbs": "123019400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011100",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011100",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011100",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011100",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011200",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011200",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011200",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011200",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011300",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011300",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011300",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011300",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011400",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011400",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011400",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011400",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011500",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011500",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011500",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011500",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011900",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011900",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011900",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123011900",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123012100",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123012100",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123012100",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123012100",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123019300",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123019300",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123019300",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0403",
    "nbs": "123019300",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0404",
    "nbs": "123011100",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0404",
    "nbs": "123011100",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0404",
    "nbs": "123011100",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0404",
    "nbs": "123011100",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0405",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0405",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0405",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0405",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0406",
    "nbs": "123019100",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0406",
    "nbs": "123019100",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0406",
    "nbs": "123019100",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0406",
    "nbs": "123019100",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0406",
    "nbs": "123019700",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0406",
    "nbs": "123019700",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0406",
    "nbs": "123019700",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0406",
    "nbs": "123019700",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0407",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0407",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0407",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0407",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0407",
    "nbs": "123019900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200029"
  },
  {
    "item": "0408",
    "nbs": "123019200",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0408",
    "nbs": "123019200",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0408",
    "nbs": "123019200",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0408",
    "nbs": "123019200",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0408",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0408",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0408",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0408",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0409",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0409",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0409",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0409",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0410",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0410",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0410",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0410",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0410",
    "nbs": "123019900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200029"
  },
  {
    "item": "0411",
    "nbs": "123011200",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0411",
    "nbs": "123011200",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0411",
    "nbs": "123011200",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0411",
    "nbs": "123011200",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0411",
    "nbs": "123019700",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0411",
    "nbs": "123019700",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0411",
    "nbs": "123019700",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0411",
    "nbs": "123019700",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0412",
    "nbs": "123012300",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0412",
    "nbs": "123012300",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0412",
    "nbs": "123012300",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0412",
    "nbs": "123012300",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0413",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0413",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0413",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0413",
    "nbs": "123019900",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0414",
    "nbs": "123019900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200029"
  },
  {
    "item": "0415",
    "nbs": "123012200",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0415",
    "nbs": "123012200",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0415",
    "nbs": "123012200",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0415",
    "nbs": "123012200",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0416",
    "nbs": "123019800",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0416",
    "nbs": "123019800",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0416",
    "nbs": "123019800",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0416",
    "nbs": "123019800",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0416",
    "nbs": "123019800",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200029"
  },
  {
    "item": "0418",
    "nbs": "123012100",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0418",
    "nbs": "123012100",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0418",
    "nbs": "123012100",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0418",
    "nbs": "123012100",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0419",
    "nbs": "123019500",
    "onerosa": false,
    "cIndOp": "301001",
    "cClassTrib": "200029"
  },
  {
    "item": "0420",
    "nbs": "123019500",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0420",
    "nbs": "123019500",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0420",
    "nbs": "123019500",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0420",
    "nbs": "123019500",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0421",
    "nbs": "123019600",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200029"
  },
  {
    "item": "0421",
    "nbs": "123019600",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200029"
  },
  {
    "item": "0421",
    "nbs": "123019600",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200029"
  },
  {
    "item": "0421",
    "nbs": "123019600",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200029"
  },
  {
    "item": "0422",
    "nbs": "109101000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "011002"
  },
  {
    "item": "0422",
    "nbs": "109109000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "011002"
  },
  {
    "item": "0423",
    "nbs": "109101000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "011002"
  },
  {
    "item": "0423",
    "nbs": "109109000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "011002"
  },
  {
    "item": "0501",
    "nbs": "114051200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "200052"
  },
  {
    "item": "0501",
    "nbs": "114051200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "200052"
  },
  {
    "item": "0501",
    "nbs": "114051200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "200052"
  },
  {
    "item": "0501",
    "nbs": "114051200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "200052"
  },
  {
    "item": "0501",
    "nbs": "114052200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "200038"
  },
  {
    "item": "0501",
    "nbs": "114052200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "200038"
  },
  {
    "item": "0501",
    "nbs": "114052200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "200038"
  },
  {
    "item": "0501",
    "nbs": "114052200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "200038"
  },
  {
    "item": "0501",
    "nbs": "114059000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "200052"
  },
  {
    "item": "0501",
    "nbs": "114059000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "200052"
  },
  {
    "item": "0501",
    "nbs": "114059000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "200052"
  },
  {
    "item": "0501",
    "nbs": "114059000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "200052"
  },
  {
    "item": "0502",
    "nbs": "114051100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0502",
    "nbs": "114051200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0502",
    "nbs": "114052100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "200038"
  },
  {
    "item": "0502",
    "nbs": "114052200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "200038"
  },
  {
    "item": "0504",
    "nbs": "114059000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0504",
    "nbs": "114059000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0504",
    "nbs": "114059000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0504",
    "nbs": "114059000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0506",
    "nbs": "114054000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0506",
    "nbs": "114054000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0506",
    "nbs": "114054000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0506",
    "nbs": "114054000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0507",
    "nbs": "114051200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0507",
    "nbs": "114051200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0507",
    "nbs": "114051200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0507",
    "nbs": "114051200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0507",
    "nbs": "114052200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "200038"
  },
  {
    "item": "0507",
    "nbs": "114052200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "200038"
  },
  {
    "item": "0507",
    "nbs": "114052200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "200038"
  },
  {
    "item": "0507",
    "nbs": "114052200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "200038"
  },
  {
    "item": "0508",
    "nbs": "114056000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0508",
    "nbs": "114056000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0508",
    "nbs": "114056000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0508",
    "nbs": "114056000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0509",
    "nbs": "114055000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "011005"
  },
  {
    "item": "0601",
    "nbs": "126021000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0601",
    "nbs": "126021000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "0601",
    "nbs": "126021000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "0601",
    "nbs": "126021000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "0601",
    "nbs": "126022000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126022000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126022000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126022000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126022000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "0602",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "0603",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0603",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "0603",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "0603",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "0604",
    "nbs": "122051200",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200041"
  },
  {
    "item": "0604",
    "nbs": "122051200",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": ""
  },
  {
    "item": "0604",
    "nbs": "122051200",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": ""
  },
  {
    "item": "0604",
    "nbs": "122051200",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": ""
  },
  {
    "item": "0604",
    "nbs": "125059000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0604",
    "nbs": "125059000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "0604",
    "nbs": "125059000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "0604",
    "nbs": "125059000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "0604",
    "nbs": "125059000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0605",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0605",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "0605",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "0605",
    "nbs": "126023000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "0605",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0605",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": ""
  },
  {
    "item": "0605",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": ""
  },
  {
    "item": "0605",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": ""
  },
  {
    "item": "0606",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0606",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": ""
  },
  {
    "item": "0606",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": ""
  },
  {
    "item": "0606",
    "nbs": "126029000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": ""
  },
  {
    "item": "0701",
    "nbs": "114021100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114021200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114021300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114021400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114022100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114022200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114023100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0701",
    "nbs": "114023200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0701",
    "nbs": "114029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114031000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200038"
  },
  {
    "item": "0701",
    "nbs": "114032110",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032120",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032211",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032212",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032213",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032214",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032221",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032222",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032223",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032290",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032500",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032600",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032700",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114032900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200038"
  },
  {
    "item": "0701",
    "nbs": "114033000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114039000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "0701",
    "nbs": "114041100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0701",
    "nbs": "114041200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0701",
    "nbs": "114041300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0701",
    "nbs": "114041400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0701",
    "nbs": "114041900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0703",
    "nbs": "114021100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0703",
    "nbs": "114021100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200045"
  },
  {
    "item": "0703",
    "nbs": "114031000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0703",
    "nbs": "114031000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200045"
  },
  {
    "item": "0703",
    "nbs": "114022100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0703",
    "nbs": "114022100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200045"
  },
  {
    "item": "0703",
    "nbs": "114022200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031100",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031100",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031100",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031900",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031900",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031900",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124031900",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124032100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124032100",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124032100",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124032100",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124032200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124032200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124032200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124032200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124033100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124033100",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124033100",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124033100",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124033200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124033200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124033200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124033200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041100",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041100",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041100",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041300",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041300",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041300",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041300",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041900",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041900",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041900",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124041900",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124043300",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124043300",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124043300",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0709",
    "nbs": "124043300",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0711",
    "nbs": "114091100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0711",
    "nbs": "114091200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0711",
    "nbs": "118067000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0712",
    "nbs": "124042100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0712",
    "nbs": "124042200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0712",
    "nbs": "124043100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0712",
    "nbs": "124043200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0712",
    "nbs": "124043900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0712",
    "nbs": "124051100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0712",
    "nbs": "124051200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0712",
    "nbs": "124051300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0712",
    "nbs": "124052000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0712",
    "nbs": "124059000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0716",
    "nbs": "119011000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0716",
    "nbs": "106023100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "0716",
    "nbs": "106023100",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "0716",
    "nbs": "106023100",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "0716",
    "nbs": "106023100",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "0720",
    "nbs": "114042100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0720",
    "nbs": "114042100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200045"
  },
  {
    "item": "0720",
    "nbs": "114042200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0720",
    "nbs": "114042200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200045"
  },
  {
    "item": "0720",
    "nbs": "114041900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0720",
    "nbs": "114041900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200045"
  },
  {
    "item": "0722",
    "nbs": "119011000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0801",
    "nbs": "122011100",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122011100",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122011100",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122011100",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122011200",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122011200",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122011200",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122011200",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122011900",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122011900",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122011900",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122011900",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122012000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122012000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122012000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122012000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122013000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122013000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122013000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122013000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122020000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122020000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122020000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122020000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122020000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122031000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122031000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122031000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122031000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122031000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122032000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122032000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122032000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122032000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122032000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122041000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122041000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122041000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122041000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122041000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122041000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200025"
  },
  {
    "item": "0801",
    "nbs": "122041000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200025"
  },
  {
    "item": "0801",
    "nbs": "122041000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200025"
  },
  {
    "item": "0801",
    "nbs": "122041000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200025"
  },
  {
    "item": "0801",
    "nbs": "122041000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200025"
  },
  {
    "item": "0801",
    "nbs": "122042000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122042000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122042000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122042000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122042000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122043000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122043000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122043000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122043000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122043000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122044000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122044000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122044000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122044000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122044000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200028"
  },
  {
    "item": "0801",
    "nbs": "122044000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200025"
  },
  {
    "item": "0801",
    "nbs": "122044000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200025"
  },
  {
    "item": "0801",
    "nbs": "122044000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200025"
  },
  {
    "item": "0801",
    "nbs": "122044000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200025"
  },
  {
    "item": "0801",
    "nbs": "122044000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200025"
  },
  {
    "item": "0802",
    "nbs": "122051100",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051100",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051100",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051100",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051300",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200028"
  },
  {
    "item": "0802",
    "nbs": "122051300",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200028"
  },
  {
    "item": "0802",
    "nbs": "122051300",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200028"
  },
  {
    "item": "0802",
    "nbs": "122051300",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200028"
  },
  {
    "item": "0802",
    "nbs": "122051300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200028"
  },
  {
    "item": "0802",
    "nbs": "122051300",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051300",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051300",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051300",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051900",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051900",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051900",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051900",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122051900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122052000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122052000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122052000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122052000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "0802",
    "nbs": "122052000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0902",
    "nbs": "118054000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "0902",
    "nbs": "118051100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "0902",
    "nbs": "118051200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "0902",
    "nbs": "118051300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "0902",
    "nbs": "118051400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "0902",
    "nbs": "118051900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "0902",
    "nbs": "118052100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "0902",
    "nbs": "118052200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "0902",
    "nbs": "118052300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "0902",
    "nbs": "118052400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "0902",
    "nbs": "118053100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0902",
    "nbs": "118053200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0902",
    "nbs": "118053900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0902",
    "nbs": "118056100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "0902",
    "nbs": "118056200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "0903",
    "nbs": "118055000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200051"
  },
  {
    "item": "0903",
    "nbs": "118055000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200051"
  },
  {
    "item": "0903",
    "nbs": "118055000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200051"
  },
  {
    "item": "0903",
    "nbs": "118055000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200051"
  },
  {
    "item": "0903",
    "nbs": "118055000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200051"
  },
  {
    "item": "1001",
    "nbs": "109061100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1001",
    "nbs": "109061200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "011003"
  },
  {
    "item": "1001",
    "nbs": "109102000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "011003"
  },
  {
    "item": "1001",
    "nbs": "109059000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1002",
    "nbs": "106070000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1002",
    "nbs": "109051100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1002",
    "nbs": "109051200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1003",
    "nbs": "125014000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1003",
    "nbs": "109051100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1004",
    "nbs": "109059000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1005",
    "nbs": "102010000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1005",
    "nbs": "102050000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1005",
    "nbs": "109051200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1006",
    "nbs": "105022900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1006",
    "nbs": "106070000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1007",
    "nbs": "117041000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1007",
    "nbs": "117042000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1008",
    "nbs": "114062000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1009",
    "nbs": "102010000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1010",
    "nbs": "102010000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1101",
    "nbs": "106043000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1101",
    "nbs": "106059000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1101",
    "nbs": "106061900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1102",
    "nbs": "118025000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1102",
    "nbs": "118025000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1102",
    "nbs": "118025000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1102",
    "nbs": "118025000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1102",
    "nbs": "118025000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1102",
    "nbs": "118022000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1102",
    "nbs": "118023000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1102",
    "nbs": "118029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1103",
    "nbs": "118025000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1103",
    "nbs": "118025000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1103",
    "nbs": "118025000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1103",
    "nbs": "118025000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1103",
    "nbs": "118025000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106011000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106011000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106011000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106011000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106019000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106019000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106019000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106019000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106021000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106021000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106021000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106021000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022100",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022100",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022100",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022300",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022300",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022300",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022300",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022900",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022900",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022900",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106022900",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023100",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023100",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023100",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023300",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023300",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023300",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106023300",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106029000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106029000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106029000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106029000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106082000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106082000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106082000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106082000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106083000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1104",
    "nbs": "106083000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": ""
  },
  {
    "item": "1104",
    "nbs": "106083000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": ""
  },
  {
    "item": "1104",
    "nbs": "106083000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": ""
  },
  {
    "item": "1105",
    "nbs": "118023000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1202",
    "nbs": "125015000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200039"
  },
  {
    "item": "1202",
    "nbs": "125015000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200039"
  },
  {
    "item": "1202",
    "nbs": "125015000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200039"
  },
  {
    "item": "1202",
    "nbs": "125015000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1202",
    "nbs": "125015000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1202",
    "nbs": "125015000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1206",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1206",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1206",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1206",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1209",
    "nbs": "125059000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1209",
    "nbs": "125059000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1209",
    "nbs": "125059000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1209",
    "nbs": "125059000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1209",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1209",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1209",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1209",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1210",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1210",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1210",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1210",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1210",
    "nbs": "125051000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1210",
    "nbs": "125051000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1210",
    "nbs": "125051000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1210",
    "nbs": "125051000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1211",
    "nbs": "",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200042"
  },
  {
    "item": "1211",
    "nbs": "",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200042"
  },
  {
    "item": "1211",
    "nbs": "",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200042"
  },
  {
    "item": "1211",
    "nbs": "",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200042"
  },
  {
    "item": "1211",
    "nbs": "125052000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200042"
  },
  {
    "item": "1211",
    "nbs": "125052000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200042"
  },
  {
    "item": "1211",
    "nbs": "125052000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200042"
  },
  {
    "item": "1211",
    "nbs": "125052000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1211",
    "nbs": "125052000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1211",
    "nbs": "125052000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1211",
    "nbs": "125059000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1211",
    "nbs": "125059000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1211",
    "nbs": "125059000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1211",
    "nbs": "125051000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1211",
    "nbs": "125051000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1211",
    "nbs": "125051000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1212",
    "nbs": "125031000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200039"
  },
  {
    "item": "1212",
    "nbs": "125031000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200039"
  },
  {
    "item": "1212",
    "nbs": "125031000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200039"
  },
  {
    "item": "1212",
    "nbs": "125031000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200039"
  },
  {
    "item": "1212",
    "nbs": "125031000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1212",
    "nbs": "125031000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1212",
    "nbs": "125031000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1212",
    "nbs": "125031000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1212",
    "nbs": "125031000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1212",
    "nbs": "125031000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1214",
    "nbs": "125029000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200039"
  },
  {
    "item": "1214",
    "nbs": "125029000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200039"
  },
  {
    "item": "1214",
    "nbs": "125029000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200039"
  },
  {
    "item": "1214",
    "nbs": "125029000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200039"
  },
  {
    "item": "1214",
    "nbs": "125029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1214",
    "nbs": "125029000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1214",
    "nbs": "125029000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1214",
    "nbs": "125029000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1214",
    "nbs": "125029000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1214",
    "nbs": "125029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1216",
    "nbs": "125015000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1216",
    "nbs": "125015000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1216",
    "nbs": "125029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1216",
    "nbs": "125029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1216",
    "nbs": "125051000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1217",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1217",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1217",
    "nbs": "125080000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1302",
    "nbs": "125011100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1302",
    "nbs": "125011100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1302",
    "nbs": "125011200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1302",
    "nbs": "125011200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1302",
    "nbs": "125013600",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1302",
    "nbs": "125013600",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1302",
    "nbs": "125013700",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1302",
    "nbs": "125013700",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1302",
    "nbs": "125013900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "114081100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "114081200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "114081300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "114081400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "114081500",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "114081900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "114082000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "121012300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "125013100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1303",
    "nbs": "125013100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "125013200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1303",
    "nbs": "125013200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "125013300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1303",
    "nbs": "125013300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "125013400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1303",
    "nbs": "125013400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "125013500",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1303",
    "nbs": "125013500",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "125013600",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1303",
    "nbs": "125013600",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "125013900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1303",
    "nbs": "125019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "1303",
    "nbs": "125019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1304",
    "nbs": "118065100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1305",
    "nbs": "121011000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1305",
    "nbs": "121012100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1305",
    "nbs": "121012200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120011000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120011000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120011000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120011000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120012000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120012000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120012000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120012000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013120",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013120",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013120",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013120",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013300",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013300",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013300",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013300",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013410",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013410",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013410",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013410",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013420",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013420",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013420",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013420",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013430",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013430",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013430",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013430",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013500",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "200044"
  },
  {
    "item": "1401",
    "nbs": "120013500",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "200044"
  },
  {
    "item": "1401",
    "nbs": "120013500",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "200044"
  },
  {
    "item": "1401",
    "nbs": "120013500",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "200044"
  },
  {
    "item": "1401",
    "nbs": "120013900",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013900",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013900",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120013900",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120014000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120014000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120014000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120014000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120015000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120015000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120015000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120015000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120016000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120016000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120016000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120016000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120017000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120017000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120017000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120017000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018100",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018100",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018100",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018300",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "200044"
  },
  {
    "item": "1401",
    "nbs": "120018300",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "200044"
  },
  {
    "item": "1401",
    "nbs": "120018300",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "200044"
  },
  {
    "item": "1401",
    "nbs": "120018300",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "200044"
  },
  {
    "item": "1401",
    "nbs": "120018900",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018900",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018900",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120018900",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120021000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120021000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120021000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120021000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120023000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120023000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120023000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120023000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "118032900",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "118032900",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "118032900",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1401",
    "nbs": "118032900",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120011000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120011000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120011000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120011000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120012000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120012000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120012000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120012000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013120",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013120",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013120",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013120",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013300",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013300",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013300",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013300",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013410",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013410",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013410",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013410",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013420",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013420",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013420",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013420",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013430",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013430",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013430",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013430",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013500",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "200044"
  },
  {
    "item": "1402",
    "nbs": "120013500",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "200044"
  },
  {
    "item": "1402",
    "nbs": "120013500",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "200044"
  },
  {
    "item": "1402",
    "nbs": "120013500",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "200044"
  },
  {
    "item": "1402",
    "nbs": "120013900",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013900",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013900",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120013900",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120014000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120014000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120014000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120014000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120015000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120015000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120015000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120015000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120016000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120016000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120016000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120016000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120017000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120017000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120017000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120017000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018100",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018100",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018100",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018300",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "200044"
  },
  {
    "item": "1402",
    "nbs": "120018300",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "200044"
  },
  {
    "item": "1402",
    "nbs": "120018300",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "200044"
  },
  {
    "item": "1402",
    "nbs": "120018300",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "200044"
  },
  {
    "item": "1402",
    "nbs": "120018900",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018900",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018900",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120018900",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120021000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120021000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120021000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120021000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120023000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120023000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120023000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120023000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1402",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1403",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1403",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1403",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1403",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1404",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1404",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1404",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1404",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1405",
    "nbs": "118040000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1405",
    "nbs": "118040000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1405",
    "nbs": "118040000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1405",
    "nbs": "118040000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1405",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1405",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1405",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1405",
    "nbs": "120029000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061300",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061300",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061300",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061300",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061400",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061400",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061400",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061400",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101063100",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101063100",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101063100",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101063100",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101063200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101063200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101063200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101063200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101064000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101064000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101064000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101064000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101069000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101069000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101069000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101069000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101076000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101076000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101076000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101076000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120031000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120031000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120031000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120031000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032110",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032110",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032110",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032110",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032190",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032190",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032190",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032190",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032300",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032300",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032300",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032300",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032400",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032400",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032400",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032400",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032510",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032510",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032510",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032510",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032520",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032520",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032520",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032520",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032610",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032610",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032610",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032610",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032690",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032690",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032690",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032690",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032900",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032900",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032900",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "120032900",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061900",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061900",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061900",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101061900",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101066000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101066000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101066000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1406",
    "nbs": "101066000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1407",
    "nbs": "126060000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1407",
    "nbs": "126060000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1407",
    "nbs": "126060000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1407",
    "nbs": "126060000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1408",
    "nbs": "121012200",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1408",
    "nbs": "121012200",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1408",
    "nbs": "121012200",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1408",
    "nbs": "121012200",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1409",
    "nbs": "126040000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1409",
    "nbs": "126040000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1409",
    "nbs": "126040000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1409",
    "nbs": "126040000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1409",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1409",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1409",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1409",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126011000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126011000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126011000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126011000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126012000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126012000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126012000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126012000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126013000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126013000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126013000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126013000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126014000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126014000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126014000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126014000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126019000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126019000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126019000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1410",
    "nbs": "126019000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1411",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1411",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1411",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1411",
    "nbs": "120024000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1412",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1412",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1412",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1412",
    "nbs": "120013110",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1413",
    "nbs": "101075000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1413",
    "nbs": "101075000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1413",
    "nbs": "101075000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1413",
    "nbs": "101075000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1414",
    "nbs": "106044000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1414",
    "nbs": "106044000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1414",
    "nbs": "106044000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1414",
    "nbs": "106044000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1414",
    "nbs": "106019000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "1414",
    "nbs": "106019000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "1414",
    "nbs": "106019000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "1414",
    "nbs": "106019000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "1501",
    "nbs": "109014000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1501",
    "nbs": "109052100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1501",
    "nbs": "109052200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1501",
    "nbs": "109052300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1501",
    "nbs": "109054000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1501",
    "nbs": "109064000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1502",
    "nbs": "109012100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1502",
    "nbs": "109012200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1502",
    "nbs": "109012900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1504",
    "nbs": "113013000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1504",
    "nbs": "118061000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1505",
    "nbs": "118061000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1506",
    "nbs": "113013000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1506",
    "nbs": "107020000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1507",
    "nbs": "109019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1507",
    "nbs": "118063100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1508",
    "nbs": "109013300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1508",
    "nbs": "109013400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1508",
    "nbs": "109013500",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1508",
    "nbs": "109013600",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1508",
    "nbs": "109013900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1508",
    "nbs": "109055000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1509",
    "nbs": "109015111",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015112",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015113",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015114",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015115",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015116",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015117",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015121",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015122",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015123",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015124",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015125",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015129",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015210",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015220",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015230",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015240",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015250",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "109015290",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111011100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111011200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111011300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111011400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111011500",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111011600",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111011700",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111012000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111013000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111014000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111015000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111016000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111021000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111022000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111023000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111024000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111025000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111026000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1509",
    "nbs": "111029000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "010002"
  },
  {
    "item": "1510",
    "nbs": "118062000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1510",
    "nbs": "109019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1511",
    "nbs": "109019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1512",
    "nbs": "109053000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1513",
    "nbs": "109056000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1514",
    "nbs": "109014000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1514",
    "nbs": "109019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1515",
    "nbs": "109012100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1515",
    "nbs": "109012200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1515",
    "nbs": "109012900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1515",
    "nbs": "109051300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1516",
    "nbs": "109019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1517",
    "nbs": "109019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1518",
    "nbs": "109013100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1518",
    "nbs": "109013200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1518",
    "nbs": "110013000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "106084000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "110014000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "110015000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "110019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "113013000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "113031000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "113032000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114011100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114011300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114011400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114011500",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114011600",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114011700",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114011800",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114011900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114013900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114101000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114109000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114120000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114130000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114140000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "114070000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1701",
    "nbs": "118061000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1702",
    "nbs": "114110000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1702",
    "nbs": "118063100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1702",
    "nbs": "118063900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1702",
    "nbs": "118064000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1702",
    "nbs": "118065200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1702",
    "nbs": "118065300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1702",
    "nbs": "118065900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1703",
    "nbs": "114012900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1703",
    "nbs": "114013900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1704",
    "nbs": "118011100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1704",
    "nbs": "118011200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1705",
    "nbs": "118012100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1705",
    "nbs": "118012200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1705",
    "nbs": "118012900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1706",
    "nbs": "114061100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1706",
    "nbs": "114061200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1706",
    "nbs": "114061900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1706",
    "nbs": "114070000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1708",
    "nbs": "111100000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1709",
    "nbs": "114044100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200038"
  },
  {
    "item": "1709",
    "nbs": "114044100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1709",
    "nbs": "114044200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1709",
    "nbs": "114044300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1709",
    "nbs": "114044400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1709",
    "nbs": "114044900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "118066300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103011000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103011000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103011000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103011000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103013100",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103013100",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103013100",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103013100",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103013900",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103013900",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103013900",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1711",
    "nbs": "103013900",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1712",
    "nbs": "114012100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1712",
    "nbs": "114012200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1713",
    "nbs": "118069000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1714",
    "nbs": "113011000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1714",
    "nbs": "113012000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1714",
    "nbs": "113019000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1715",
    "nbs": "113014000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1716",
    "nbs": "113021100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1716",
    "nbs": "113021900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1717",
    "nbs": "118069000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1718",
    "nbs": "109063000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1719",
    "nbs": "113022100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1719",
    "nbs": "113022200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1719",
    "nbs": "113022300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1720",
    "nbs": "109055000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1720",
    "nbs": "109057000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1720",
    "nbs": "109058000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1720",
    "nbs": "114011200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1721",
    "nbs": "114150000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "1722",
    "nbs": "118062000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1723",
    "nbs": "109080000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1724",
    "nbs": "122051400",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "000001"
  },
  {
    "item": "1724",
    "nbs": "122051400",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "000001"
  },
  {
    "item": "1724",
    "nbs": "122051400",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "000001"
  },
  {
    "item": "1724",
    "nbs": "122051400",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "000001"
  },
  {
    "item": "1724",
    "nbs": "122051400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1725",
    "nbs": "114063300",
    "onerosa": true,
    "cIndOp": "100101",
    "cClassTrib": "000001"
  },
  {
    "item": "1725",
    "nbs": "114063400",
    "onerosa": true,
    "cIndOp": "100101",
    "cClassTrib": "000001"
  },
  {
    "item": "1725",
    "nbs": "114063900",
    "onerosa": true,
    "cIndOp": "100101",
    "cClassTrib": "000001"
  },
  {
    "item": "1801",
    "nbs": "109062000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "1901",
    "nbs": "109051100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2002",
    "nbs": "106061100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2002",
    "nbs": "106061200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2002",
    "nbs": "106061900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2002",
    "nbs": "106062000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2003",
    "nbs": "106030000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2003",
    "nbs": "106041000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2003",
    "nbs": "106049000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2101",
    "nbs": "113040000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2301",
    "nbs": "114092100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2301",
    "nbs": "114092200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2301",
    "nbs": "114092300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2301",
    "nbs": "114092400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2301",
    "nbs": "114092500",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2301",
    "nbs": "114092900",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2301",
    "nbs": "114093000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2301",
    "nbs": "114099000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2401",
    "nbs": "126060000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "2401",
    "nbs": "126060000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "2401",
    "nbs": "126060000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "2401",
    "nbs": "126060000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "2401",
    "nbs": "126060000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2501",
    "nbs": "114053000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2501",
    "nbs": "126030000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200029"
  },
  {
    "item": "2502",
    "nbs": "114053000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2502",
    "nbs": "126030000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200029"
  },
  {
    "item": "2503",
    "nbs": "126030000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "011001"
  },
  {
    "item": "2701",
    "nbs": "123041100",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123041100",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123041100",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123041100",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123041200",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123041200",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123041200",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123041200",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123041900",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123041900",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123041900",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123041900",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123042000",
    "onerosa": false,
    "cIndOp": "030101",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123042000",
    "onerosa": false,
    "cIndOp": "030102",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123042000",
    "onerosa": false,
    "cIndOp": "030103",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123042000",
    "onerosa": false,
    "cIndOp": "030104",
    "cClassTrib": "200052"
  },
  {
    "item": "2701",
    "nbs": "123049000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "2801",
    "nbs": "114041400",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2801",
    "nbs": "110013000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2801",
    "nbs": "109021000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "2901",
    "nbs": "117051000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "2901",
    "nbs": "117052000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "3001",
    "nbs": "114150000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "3101",
    "nbs": "114150000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "3201",
    "nbs": "114099000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3301",
    "nbs": "102040000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3301",
    "nbs": "126060000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3401",
    "nbs": "118021000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3501",
    "nbs": "114013100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3501",
    "nbs": "114013100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200040"
  },
  {
    "item": "3501",
    "nbs": "114013200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200052"
  },
  {
    "item": "3501",
    "nbs": "114013200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200040"
  },
  {
    "item": "3501",
    "nbs": "117041000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3501",
    "nbs": "117042000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3601",
    "nbs": "114043000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3701",
    "nbs": "118068100",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3701",
    "nbs": "118068200",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3701",
    "nbs": "118068300",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3701",
    "nbs": "125060000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3701",
    "nbs": "125031000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "3701",
    "nbs": "125031000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "200039"
  },
  {
    "item": "3901",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050101",
    "cClassTrib": "000001"
  },
  {
    "item": "3901",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050102",
    "cClassTrib": "000001"
  },
  {
    "item": "3901",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050103",
    "cClassTrib": "000001"
  },
  {
    "item": "3901",
    "nbs": "120022000",
    "onerosa": false,
    "cIndOp": "050104",
    "cClassTrib": "000001"
  },
  {
    "item": "4001",
    "nbs": "111099000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  },
  {
    "item": "4001",
    "nbs": "125032000",
    "onerosa": true,
    "cIndOp": "100301",
    "cClassTrib": "000001"
  }
] as const
