/**
 * Exemplo 2 — Emissão em homologação com certificado carregado em memória
 *
 * Variante do exemplo 1 que usa `certificateData` (ArrayBuffer) ao invés de
 * `certificatePath` — útil quando o .pfx vem de uma API, banco de dados,
 * variável de ambiente em base64, ou qualquer fonte que não seja disco local.
 *
 * Lê os dados do prestador/tomador/serviço de variáveis de ambiente
 * definidas em examples/.env (veja examples/.env.example).
 *
 * Uso:
 *   cp examples/.env.example examples/.env   # preencha com seus dados
 *   bun run example 2
 */

import { readFile } from 'node:fs/promises'
import { env } from './env.ts'
import {
  ContribuinteService,
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

console.log('🔧 Dados do teste (lidos de examples/.env):')
console.log('  CNPJ Prestador :', env.cnpjPrestador)
console.log('  CNPJ Tomador PJ:', env.cnpjTomadorPj)
console.log('  Valor serviço  : R$', env.valorServico.toFixed(2))
console.log()

// ---------------------------------------------------------------------------
// Carrega o .pfx em memória (simula recebimento via API, DB, env base64, etc.)
// ---------------------------------------------------------------------------

// Opção A: lendo do disco para Buffer (substitua por fetch/db/etc. no seu caso)
const certificateData: ArrayBuffer = (await readFile(env.certPath)).buffer

// Opção B: recebendo base64 de uma variável de ambiente
// const certificateData = Buffer.from(process.env.CERT_BASE64 ?? '', 'base64').buffer

// ---------------------------------------------------------------------------
// Contexto de homologação — sem certificatePath
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
      // IM, nome e endereço são opcionais no DPS para prestadores PJ
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
        cServTribNac: '100102',       // ajuste conforme o serviço prestado
        cNBSPrinc: '109102000',       // código NBS — consulte tabela oficial
      },
      xDescServ: env.descricaoServico,
    },

    valores: {
      vServico: env.valorServico,
      // vBC e vISSQN calculados pelo sistema quando município está ativo no SNNFSe
    },

    tributacao: {
      issqn: {
        tributacaoIssqn: TributacaoIssqn.OperacaoTributavel,
        // aliquota omitida: município ativo no SNNFSe com opSimpNac=1 — sistema parametriza (E0617)
        tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      },
      // CST 00 = tributação normal PIS/COFINS (obrigatório)
      federal: {
        cstPisCofins: '00',
      },
      // pTotTrib obrigatório para não-optante (indTotTrib proibido — E0713)
      percentualTotalTributosFederais: 11.33,
      percentualTotalTributosEstaduais: 0.00,
      percentualTotalTributosMunicipais: 2.00,
    },

    // ibsCbs omitido: facultativo durante o período de transição da Reforma Tributária.
    // O Comitê Gestor do IBS dispensou penalidades até publicação dos regulamentos
    // do IBS/CBS. O EmissorWeb (portal oficial) também não inclui este bloco por padrão.
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
console.log('  cStat       :', response.cStat)
console.log('  xMotivo     :', response.xMotivo)
console.log('  chaveAcesso :', response.chaveAcesso ?? '-')
console.log('  nNFSe       :', response.nfse?.infNfse?.nNFSe ?? '-')
