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
export { formatCpf, formatCnpj, formatCep, formatTelefone, onlyDigits } from './utils/cpf-cnpj.js'
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
