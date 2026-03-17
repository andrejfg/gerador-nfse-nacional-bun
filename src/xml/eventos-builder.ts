/**
 * Construtor do XML de eventos (cancelamento, etc.)
 * Migrado de nfse-php/src/Xml/EventosXmlBuilder.php
 */

import type { PedRegEventoData } from '../types/dtos.js'
import { formatDhEmissao } from '../utils/id-generator.js'

const NAMESPACE = 'http://www.sped.fazenda.gov.br/nfse'
const VERSAO = '1.00'

function tag(name: string, value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return ''
  return `<${name}>${value}</${name}>`
}

/**
 * Tipos de evento:
 * 101101 = Cancelamento por erro de emissão
 * 101102 = Cancelamento a pedido do tomador
 * 101103 = Cancelamento por determinação judicial
 */
export function buildPedRegEventoXml(data: PedRegEventoData): string {
  const dhEvento = data.dhEvento ?? formatDhEmissao(new Date(), -3)
  const idPedReg = `PRE${data.chNFSe}${data.tipoEvento}${data.numSeqEvento ?? 1}`
  const eventoTag = `e${data.tipoEvento}`

  return `<?xml version="1.0" encoding="UTF-8"?><pedRegEvento xmlns="${NAMESPACE}" versao="${VERSAO}"><infPedReg Id="${idPedReg}">${
    tag('tpAmb', 1)
  }${tag('verAplic', '1.00')
  }${tag('dhEvento', dhEvento)
  }${tag('chNFSe', data.chNFSe)
  }<${eventoTag}>${tag('xDesc', data.descricao)}${tag('cMotivo', data.motivo)}${tag('xMotivo', data.motivoDescricao)}</${eventoTag}></infPedReg></pedRegEvento>`
}
