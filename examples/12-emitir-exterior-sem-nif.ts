/**
 * Exemplo 12 — Emissão para o EXTERIOR sem NIF (`cNaoNIF`) + DANF-Se
 *
 * Variante do exemplo 11 para o caso em que o tomador estrangeiro **não
 * possui NIF** (Número de Identificação Fiscal). Nesse cenário o XSD exige
 * o preenchimento de `<cNaoNIF>` (motivo da ausência) em vez de `<NIF>` —
 * são mutuamente exclusivos dentro do `<xs:choice>` de `TCInfoPessoa`.
 *
 * Demonstra:
 *   - Tomador identificado por `codigoNaoNif` (`MotivoNaoNif`) em vez de NIF
 *   - Endereço estrangeiro (endExt: país, cidade, estado/região)
 *   - Bloco de comércio exterior (comExt: modo de prestação, moeda, etc.)
 *
 * Fluxo (espelha o exemplo 11):
 *   1. Monta e valida o DPS com tomador no exterior sem NIF
 *   2. Envia para a SEFIN (SOMENTE homologação)
 *   3. Se aprovado (cStat 100), gera a DANF-Se em PDF — confira que o
 *      campo "CNPJ / CPF / NIF" mostra o motivo de dispensa do NIF.
 *
 * O prestador e o certificado vêm de examples/.env. O tomador estrangeiro é
 * FICTÍCIO e está embutido neste arquivo (anonimizado). Para emitir com dados
 * reais, crie um examples/12-emitir-exterior-sem-nif.local.ts (gitignored).
 *
 * ⚠️  SOMENTE HOMOLOGAÇÃO — este exemplo nunca emite em produção.
 *
 * Requer puppeteer instalado para o PDF:
 *   bun add puppeteer
 *
 * Uso:
 *   cp examples/.env.example examples/.env   # preencha com seus dados
 *   bun run example 12
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
  MotivoNaoNif,
  ModoPrestacaoComExt,
  VinculoPrestacao,
  CodigoMoeda,
  MecAFComexPrestador,
  MecAFComexTomador,
  MovimentacaoTemporariaBens,
  EnvioMDIC,
  generateDpsId,
  generateNumDps,
  formatDhEmissao,
  formatDataCompetencia,
  type DpsData,
  type NfseContext,
} from 'nfse-nacional'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Tomador estrangeiro sem NIF (FICTÍCIO — anonimizado). Substitua via .local.ts.
// ---------------------------------------------------------------------------

const tomadorExterior = {
  codigoNaoNif: MotivoNaoNif.NaoExigenciaDoNif,
  nome: 'OFFSHORE HOLDINGS LTD',
  endereco: {
    // Endereço no exterior — sem cMun (IBGE). País em código alfabético.
    exterior: {
      cPais: 'VG',                 // Ilhas Virgens Britânicas
      cEndPost: 'VG 1110',
      xCidade: 'Road Town',
      xEstProvReg: 'Tortola',
    },
    xLgr: 'Wickhams Cay II',
    nro: 'S/N',
    xCpl: 'Corporate Services Centre',
    xBairro: 'N/A',
  },
}

// ---------------------------------------------------------------------------
// Contexto de homologação — certificado em memória
// ---------------------------------------------------------------------------

const certificateData: ArrayBuffer = (await readFile(env.certPath)).buffer

const context: NfseContext = {
  ambiente: TipoAmbiente.Homologacao,
  certificateData,
  certificatePassword: env.certPassword,
  codigoMunicipio: env.codIbgePrestador,
  debug: true,
}

console.log('🔧 Dados do teste (lidos de examples/.env):')
console.log('  CNPJ Prestador   :', env.cnpjPrestador)
console.log('  Motivo (cNaoNIF) :', tomadorExterior.codigoNaoNif, `(${tomadorExterior.endereco.exterior.xCidade})`)
console.log('  Valor serviço    : R$', env.valorServico.toFixed(2))
console.log()

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
      codigoNaoNif: tomadorExterior.codigoNaoNif,
      nome: tomadorExterior.nome,
      endereco: tomadorExterior.endereco,
    },

    servico: {
      // O serviço é prestado a partir do município do prestador (local de incidência).
      localPrestacao: { cLocPrestacao: env.codIbgePrestador },
      codigoServico: {
        cServTribNac: '171201',       // ajuste conforme o serviço prestado
        cNBSPrinc: '109054000',       // código NBS — consulte tabela oficial
      },
      xDescServ: env.descricaoServico,
      // Bloco de comércio exterior — obrigatório para tomador no exterior.
      comercioExterior: {
        mdPrestacao: ModoPrestacaoComExt.Transfronteirico,
        vincPrest: VinculoPrestacao.SemVinculo,
        tpMoeda: CodigoMoeda.DolarEUA,         // código da moeda (tabela BACEN)
        vServMoeda: env.valorServico,          // valor na moeda estrangeira
        mecAFComexP: MecAFComexPrestador.Nenhum,
        mecAFComexT: MecAFComexTomador.Nenhum,
        movTempBens: MovimentacaoTemporariaBens.Nao,
        mdic: EnvioMDIC.NaoEnviar,
      },
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
// Emissão (homologação)
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
const outPath = join(__dirname, `danfe-exterior-sem-nif-${nNumero}.pdf`)

await writeFile(outPath, result.pdfBytes)

console.log('✅ DANF-Se gerada:', outPath)
console.log('\n📄 Dados da NFS-e:')
console.log('  Número      :', nfse.infNFSe?.nNFSe)
console.log('  Chave       :', response.chaveAcesso ?? nfse.infNFSe?.chNFSe)
console.log('  Emitente    :', nfse.infNFSe?.emit?.xNome)
console.log('  Tomador cNaoNIF :', nfse.infNFSe?.DPS?.infDPS.toma?.cNaoNIF)
console.log('  Tomador cid :', nfse.infNFSe?.DPS?.infDPS.toma?.enderNac?.xCidade)
console.log('  Emitido em  :', nfse.infNFSe?.dhProc)

if (result.warnings.length > 0) {
  console.warn('\n⚠️  Avisos da DANF-Se:')
  result.warnings.forEach(w => console.warn('  •', w.field, '—', w.message))
}
