/**
 * Contexto de configuração para o cliente NFS-e
 * Equivalente a NfseContext.php
 */

import type { TipoAmbiente } from './enums.js'

export interface Endpoint {
  producao: string
  homologacao: string
}

export interface NfseContext {
  /** Ambiente de emissão (produção ou homologação) */
  ambiente: TipoAmbiente

  /** Caminho para o arquivo .pfx do certificado digital */
  certificatePath: string

  /** Senha do certificado .pfx */
  certificatePassword: string

  /** Código IBGE do município (7 dígitos) - opcional para alguns endpoints */
  codigoMunicipio?: string

  /** Endpoint customizado (sobrescreve o padrão do SEFIN) */
  endpoint?: Endpoint
}
