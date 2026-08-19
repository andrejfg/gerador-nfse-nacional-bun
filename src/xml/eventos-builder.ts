/**
 * Construtor do XML de eventos (cancelamento, etc.)
 * Referência: nfse-php/src/Xml/EventosXmlBuilder.php
 *
 * Formato do Id (TSIdPedRegEvt, desde jan/2026):
 *   PRE + chNFSe(50) + tipoEvento(6) = PRE[0-9]{56} = 59 chars
 *   (nPedRegEvento foi removido do Id)
 */

import type { PedRegEventoData } from '../types/dtos.js'
import { formatDhEmissao } from '../utils/id-generator.js'
import { escapeXml } from './escape.js'

const NAMESPACE = 'http://www.sped.fazenda.gov.br/nfse'
const VERSAO    = '1.01'
const VER_APLIC = 'nfse-nacional-1.0'

function tag(name: string, value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return ''
  return `<${name}>${escapeXml(value)}</${name}>`
}

/**
 * Descrição fixa (enumerada no XSD tiposEventos_v1.01.xsd) para cada tipo de evento.
 * O campo `xDesc` deve conter exatamente o valor definido no XSD.
 */
const XDESC: Record<number, string> = {
  // Cancelamento
  101101: 'Cancelamento de NFS-e',
  105102: 'Cancelamento de NFS-e por Substituição',
  101103: 'Solicitação de Análise Fiscal para Cancelamento de NFS-e',
  105104: 'Cancelamento de NFS-e Deferido por Análise Fiscal',
  105105: 'Cancelamento de NFS-e Indeferido por Análise Fiscal',
  // Manifestação
  202201: 'Confirmação do Prestador',
  203202: 'Confirmação do Tomador',
  204203: 'Confirmação do Intermediário',
  205204: 'Confirmação Tácita',
  202205: 'Rejeição do Prestador',
  203206: 'Rejeição do Tomador',
  204207: 'Rejeição do Intermediário',
  205208: 'Anulação da Rejeição',
  // Ofício
  305101: 'Cancelamento de NFS-e por Ofício',
  305102: 'Bloqueio de NFS-e por Ofício',
  305103: 'Desbloqueio de NFS-e por Ofício',
}

/**
 * Tipos de evento suportados — use o enum `TipoEvento` (ou `TipoEventoCancelamento`).
 */
export function buildPedRegEventoXml(data: PedRegEventoData): string {
  const dhEvento = data.dhEvento ?? formatDhEmissao(new Date(), -3)
  const tpAmb    = data.tipoAmbiente ?? 1

  // Desde jan/2026: Id = PRE + chNFSe(50) + tipoEvento(6) — sem nSeqEvento
  const idPedReg  = `PRE${data.chNFSe}${data.tipoEvento}`
  const eventoTag = `e${data.tipoEvento}`
  const xDesc     = XDESC[data.tipoEvento] ?? 'Cancelamento de NFS-e'

  return `<?xml version="1.0" encoding="UTF-8"?><pedRegEvento xmlns="${NAMESPACE}" versao="${VERSAO}"><infPedReg Id="${idPedReg}">${
    tag('tpAmb', tpAmb)
  }${tag('verAplic', VER_APLIC)
  }${tag('dhEvento', dhEvento)
  }${tag('CNPJAutor', data.cnpjAutor)
  }${tag('CPFAutor', data.cpfAutor)
  }${tag('chNFSe', data.chNFSe)
  }<${eventoTag}>${tag('xDesc', xDesc)}${tag('cMotivo', data.cMotivo)}${tag('xMotivo', data.xMotivo)}</${eventoTag}></infPedReg></pedRegEvento>`
}
