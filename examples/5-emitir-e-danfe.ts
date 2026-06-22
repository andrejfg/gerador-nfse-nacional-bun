/**
 * Exemplo 5 — Emissão em homologação + geração da DANF-Se em PDF
 *
 * Fluxo completo em um único script:
 *   1. Monta e valida o DPS
 *   2. Envia para a SEFIN (homologação)
 *   3. Se aprovado (cStat 100), gera a DANF-Se em PDF
 *
 * Lê os dados do prestador/tomador/serviço de variáveis de ambiente
 * definidas em examples/.env (veja examples/.env.example).
 *
 * Requer puppeteer instalado:
 *   bun add puppeteer
 *
 * Uso:
 *   cp examples/.env.example examples/.env   # preencha com seus dados
 *   bun run example 5
 */

import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from './env.ts'
import {
  ContribuinteService,
  DanfeService,
  parseNfseXml,
  validateDps,
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  OpcaoSimplesNacional,
  RegimeEspecialTributacao,
  generateDpsId,
  generateNumDps,
  formatDhEmissao,
  formatDataCompetencia,
  type DpsData,
  type NfseContext,
} from 'nfse-nacional'

const __dirname = dirname(fileURLToPath(import.meta.url))

console.log('🔧 Dados do teste (lidos de examples/.env):')
console.log('  CNPJ Prestador :', env.cnpjPrestador)
console.log('  CNPJ Tomador   :', env.cnpjTomadorPj)
console.log('  Valor serviço  : R$', env.valorServico.toFixed(2))
console.log()

// ---------------------------------------------------------------------------
// Carrega certificado em memória
// ---------------------------------------------------------------------------

const certificateData: ArrayBuffer = (await readFile(env.certPath)).buffer

// ---------------------------------------------------------------------------
// Contexto de homologação
// ---------------------------------------------------------------------------

const context: NfseContext = {
  ambiente: TipoAmbiente.Homologacao,
  certificateData,
  certificatePassword: env.certPassword,
  codigoMunicipio: env.codIbgePrestador,
  debug: true,
}

// ---------------------------------------------------------------------------
// Montagem do DPS
// ---------------------------------------------------------------------------

const numeroDps = generateNumDps()

const dps: DpsData = {
  infDps: {
    id: generateDpsId(env.cnpjPrestador, env.codIbgePrestador, '001', numeroDps),
    tipoAmbiente: TipoAmbiente.Homologacao,
    dataEmissao: formatDhEmissao(new Date(), -3),
    numeroDps,
    serie: '001',
    dataCompetencia: formatDataCompetencia(),
    tipoEmitente: EmitenteDPS.Prestador,
    codigoLocalEmissao: env.codIbgePrestador,

    prestador: {
      cnpj: env.cnpjPrestador,
      telefone: env.prestadorTelefone || undefined,
      email: env.prestadorEmail || undefined,
      regimeTributario: {
        opSimpNac: OpcaoSimplesNacional.NaoOptante,
        regEspTrib: RegimeEspecialTributacao.Nenhum,
      },
    },

    tomador: {
      cnpj: env.cnpjTomadorPj,
      nome: env.nomeTomadorPj,
      endereco: {
        cMun: env.codIbgeTomadorPj,
        cep: env.cepTomadorPj,
        xLgr: env.logradouroTomadorPj,
        nro: env.numeroTomadorPj,
        xCpl: env.complementoTomadorPj || undefined,
        xBairro: env.bairroTomadorPj,
      },
    },

    servico: {
      localPrestacao: { cLocPrestacao: env.codIbgePrestador },
      codigoServico: {
        cServTribNac: '100102',
        cNBSPrinc: '109102000',
      },
      xDescServ: env.descricaoServico,
    },

    valores: {
      vServico: env.valorServico,
    },

    tributacao: {
      issqn: {
        tributacaoIssqn: TributacaoIssqn.OperacaoTributavel,
        tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      },
      federal: {
        cstPisCofins: '00',
      },
      percentualTotalTributosFederais: 11.33,
      percentualTotalTributosEstaduais: 0.00,
      percentualTotalTributosMunicipais: 2.00,
    },
  },
}

// ---------------------------------------------------------------------------
// Validação
// ---------------------------------------------------------------------------

const validation = validateDps(dps)

if (!validation.isValid) {
  console.error('❌ DPS inválido:')
  validation.errors.forEach(e => console.error('  •', e))
  process.exit(1)
}

console.log('✅ DPS válido. Enviando para homologação...\n')

// ---------------------------------------------------------------------------
// Emissão
// ---------------------------------------------------------------------------

const service = new ContribuinteService(context)
const response = await service.emitir(dps)

console.log('📨 Resposta da SEFIN:')
console.log('  cStat   :', response.cStat)
console.log('  xMotivo :', response.xMotivo)

if (response.cStat !== '100') {
  console.error('\n❌ NFS-e não aprovada — DANF-Se não será gerada.')
  process.exit(1)
}

const xmlNfse = response.nfse?.originalXml

if (!xmlNfse) {
  console.error('\n❌ XML da NFS-e não retornado — DANF-Se não pode ser gerada.')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Geração da DANF-Se
// ---------------------------------------------------------------------------

console.log('\n🖨️  Gerando DANF-Se em PDF...')

const danfe = new DanfeService()
const result = await danfe.generateFromXml(xmlNfse, { chaveAcesso: response.chaveAcesso })

const nfse    = parseNfseXml(xmlNfse)
const nNumero = nfse.infNFSe?.nNFSe ?? numeroDps
const outPath = join(__dirname, `danfe-${nNumero}.pdf`)

await writeFile(outPath, result.pdfBytes)

console.log('✅ DANF-Se gerada:', outPath)
console.log('\n📄 Dados da NFS-e:')
console.log('  Número     :', nfse.infNFSe?.nNFSe)
console.log('  Chave      :', response.chaveAcesso ?? nfse.infNFSe?.chNFSe)
console.log('  Emitente   :', nfse.infNFSe?.emit?.xNome)
console.log('  Valor      :', nfse.infNFSe?.valores?.vServico)
console.log('  Emitido em :', nfse.infNFSe?.dhProc)

if (result.warnings.length > 0) {
  console.warn('\n⚠️  Avisos da DANF-Se:')
  result.warnings.forEach(w => console.warn('  •', w.field, '—', w.message))
}
