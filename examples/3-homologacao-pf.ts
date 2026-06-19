/**
 * Exemplo 3 — Emissão em homologação com tomador Pessoa Física (CPF)
 *
 * Variante do exemplo 1b com tomador PF (CPF) ao invés de PJ (CNPJ).
 * Útil para testar emissão de NFS-e de corretagem para pessoa física.
 *
 * Lê os dados do prestador/tomador/serviço de variáveis de ambiente
 * definidas em examples/.env (veja examples/.env.example).
 *
 * Uso:
 *   cp examples/.env.example examples/.env   # preencha com seus dados
 *   bun run example 3
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
console.log('  CPF Tomador PF :', env.cpfTomadorPf)
console.log('  Valor serviço  : R$', env.valorServico.toFixed(2))
console.log()

// ---------------------------------------------------------------------------
// Carrega o .pfx em memória
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
      cpf: env.cpfTomadorPf,
      nome: env.nomeTomadorPf,
      endereco: {
        cMun: env.codIbgeTomadorPf,
        cep: env.cepTomadorPf,
        xLgr: env.logradouroTomadorPf,
        nro: env.numeroTomadorPf,
        xCpl: env.complementoTomadorPf || undefined,
        xBairro: env.bairroTomadorPf,
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

    // ibsCbs omitido: facultativo durante o período de transição da Reforma Tributária.
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
