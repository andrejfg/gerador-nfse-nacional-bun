/**
 * Resolver de endpoints do SEFIN Nacional e municipais
 * Migrado de nfse-php/src/Support/SefinEndpointResolver.php
 */

import { TipoAmbiente } from '../types/enums.js'
import type { NfseContext } from '../types/context.js'

const DEFAULT_ENDPOINTS = {
  producao: 'https://sefin.nfse.gov.br/sefinNacional',
  homologacao: 'https://sefin.producaorestrita.nfse.gov.br/sefinNacional',
}

/**
 * Endpoints específicos por município (código IBGE 7 dígitos)
 */
const MUNICIPALITY_ENDPOINTS: Record<string, { producao: string; homologacao: string }> = {
  '3511102': {
    producao: 'https://164.152.60.237/nota/nacional',
    homologacao: 'https://catanduva.prefeitura.rlz.com.br/nota/nacional',
  },
}

export function resolveBaseUrl(context: NfseContext): string {
  if (context.endpoint) {
    return context.ambiente === TipoAmbiente.Producao
      ? context.endpoint.producao
      : context.endpoint.homologacao
  }

  if (context.codigoMunicipio && MUNICIPALITY_ENDPOINTS[context.codigoMunicipio]) {
    const ep = MUNICIPALITY_ENDPOINTS[context.codigoMunicipio]!
    return context.ambiente === TipoAmbiente.Producao ? ep.producao : ep.homologacao
  }

  return context.ambiente === TipoAmbiente.Producao
    ? DEFAULT_ENDPOINTS.producao
    : DEFAULT_ENDPOINTS.homologacao
}
