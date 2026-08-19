/**
 * gerador-nfse-nacional-bun
 * Gerador de NFS-e Nacional em TypeScript/Bun
 *
 * Migrado de:
 * - nfse-php (https://github.com/nfse-nacional/nfse-php)
 * - direction-nfse-danfe (https://github.com/JairoMarques/direction-nfse-danfe)
 */

// Types
export * from './types/index.js'

// Services
export { ContribuinteService, DpsValidationError, NfseNaoEncontradaError, NfseJaCanceladaError } from './service/contribuinte-service.js'
export { DanfeService } from './danfe/danfe-service.js'
export type { DanfeResult, DanfeGenerateOptions, PreviewOptions, PreviewResult } from './danfe/danfe-service.js'
export { DanfePreviewFormat } from './danfe/danfe-service.js'
export { renderDanfseHtml, buildQrUrl } from './danfe/html-renderer.js'
export type { DanfeWarning, DanfeRenderResult, DanfeOptions } from './danfe/html-renderer.js'
export { buildPreviewSchema } from './danfe/preview-builder.js'

// XML builders
export { buildDpsXml } from './xml/dps-builder.js'
export { buildPedRegEventoXml } from './xml/eventos-builder.js'
export { parseNfseXml } from './xml/nfse-parser.js'
export type { NfseSchema, InfNFSeSchema } from './xml/nfse-parser.js'

// Crypto
export { loadCertificate, signWithKey } from './crypto/certificate.js'
export type { CertificateInfo } from './crypto/certificate.js'
export { signXml, compressXml, decompressXml } from './crypto/xml-signer.js'

// Utils
export { formatCpf, formatCnpj, formatCep, formatTelefone, onlyDigits, isValidCpf, isValidCnpj } from './utils/cpf-cnpj.js'
export {
  normalizeTsString,
  normalizeXsString,
  isTsString,
  isTsCep,
  isTsCodPaisIso,
  missingFieldsMessage,
  TS_LOGRADOURO_MAX,
  TS_NUMERO_ENDERECO_MAX,
  TS_COMPLEMENTO_ENDERECO_MAX,
  TS_BAIRRO_MAX,
  TS_EMAIL_MAX,
  TS_CIDADE_MAX,
  TS_ESTADO_PROV_REGIAO_MAX,
  TS_CODIGO_END_POSTAL_MAX,
  TS_NOME_RAZAO_SOCIAL_MAX,
  TS_NIF_MAX,
  TS_INSC_MUN_MAX,
  TS_DESC_INF_COMPL_MAX,
  TS_DESC_255_MAX,
  TS_IDE_EVENTO_MAX,
} from './utils/xsd-string.js'

// Tabela oficial CST × cClassTrib (usada pelo validateDps).
// A correlação do Anexo VIII e o sugerirIbsCbs vivem em 'nfse-nacional/tabelas'.
export { IBS_CBS_CST_TABLE, IBS_CBS_CST_INDEX, IBS_CBS_CST_TABLE_ATUALIZADA_EM } from './data/ibs-cbs-class-trib.js'
export type { CstInfo, ClassTribInfo } from './data/ibs-cbs-class-trib.js'
export { generateDpsId, generateNumDps, formatDataCompetencia, formatDhEmissao } from './utils/id-generator.js'
export { generateCpf, generateCnpj } from './utils/cpf-cnpj-generator.js'
export { calculateTax } from './utils/tax-calculator.js'

// Validator
export { validateDps } from './validator/dps-validator.js'
export type { ValidationResult } from './validator/dps-validator.js'
export {
  DpsSchema,
  InfDpsSchema,
  PrestadorSchema,
  TomadorSchema,
  ServicoSchema,
  ValoresSchema,
  TributacaoSchema,
  IbsCbsSchema,
} from './validator/dps-schema.js'
export type { DpsSchemaInput, DpsSchemaOutput } from './validator/dps-schema.js'

// HTTP client (baixo nível)
export { SefinClient, NfseApiError } from './http/sefin-client.js'
