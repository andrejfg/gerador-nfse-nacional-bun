/**
 * Carrega e valida as variáveis de ambiente dos exemplos.
 *
 * Procura por um arquivo `.env` na pasta `examples/` (se existir) e
 * valida que todas as variáveis obrigatórias estão definidas.
 *
 * Copie `.env.example` para `.env` e preencha com seus dados:
 *   cp examples/.env.example examples/.env
 */

import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envFile = join(__dirname, '.env')

// Carrega o .env da pasta examples/ se existir (Bun suporta nativamente)
if (existsSync(envFile)) {
  const content = await Bun.file(envFile).text()
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim()
    if (key && !(key in process.env)) {
      process.env[key] = val
    }
  }
}

function requireEnv(name: string): string {
  const val = process.env[name]
  if (!val) {
    console.error(`❌ Variável de ambiente obrigatória não definida: ${name}`)
    console.error(`   Copie examples/.env.example para examples/.env e preencha os valores.`)
    process.exit(1)
  }
  return val
}

function optionalEnv(name: string, fallback = ''): string {
  return process.env[name] ?? fallback
}

// ---------------------------------------------------------------------------
// Variáveis exportadas
// ---------------------------------------------------------------------------

export const env = {
  // Certificado
  certPath:     requireEnv('CERT_PATH'),
  certPassword: requireEnv('CERT_PASSWORD'),

  // Prestador
  cnpjPrestador:      requireEnv('CNPJ_PRESTADOR'),
  codIbgePrestador:   requireEnv('COD_IBGE_PRESTADOR'),
  prestadorTelefone:  optionalEnv('PRESTADOR_TELEFONE'),
  prestadorEmail:     optionalEnv('PRESTADOR_EMAIL'),

  // Tomador PJ (exemplo 1b)
  cnpjTomadorPj:       requireEnv('CNPJ_TOMADOR_PJ'),
  nomeTomadorPj:       requireEnv('NOME_TOMADOR_PJ'),
  codIbgeTomadorPj:    requireEnv('COD_IBGE_TOMADOR_PJ'),
  cepTomadorPj:        requireEnv('CEP_TOMADOR_PJ'),
  logradouroTomadorPj: requireEnv('LOGRADOURO_TOMADOR_PJ'),
  numeroTomadorPj:     requireEnv('NUMERO_TOMADOR_PJ'),
  complementoTomadorPj:optionalEnv('COMPLEMENTO_TOMADOR_PJ'),
  bairroTomadorPj:     requireEnv('BAIRRO_TOMADOR_PJ'),

  // Tomador PF (exemplo 1c)
  cpfTomadorPf:        requireEnv('CPF_TOMADOR_PF'),
  nomeTomadorPf:       requireEnv('NOME_TOMADOR_PF'),
  codIbgeTomadorPf:    requireEnv('COD_IBGE_TOMADOR_PF'),
  cepTomadorPf:        requireEnv('CEP_TOMADOR_PF'),
  logradouroTomadorPf: requireEnv('LOGRADOURO_TOMADOR_PF'),
  numeroTomadorPf:     requireEnv('NUMERO_TOMADOR_PF'),
  complementoTomadorPf:optionalEnv('COMPLEMENTO_TOMADOR_PF'),
  bairroTomadorPf:     requireEnv('BAIRRO_TOMADOR_PF'),

  // Serviço
  valorServico:      parseFloat(requireEnv('VALOR_SERVICO')),
  descricaoServico:  requireEnv('DESCRICAO_SERVICO'),
}
