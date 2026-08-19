/**
 * Exemplo 14 — Emissão com IBS/CBS (Reforma Tributária) — tomador no EXTERIOR
 *
 * Variante do exemplo 13 para exportação de serviço. O tomador estrangeiro
 * (aqui sem NIF, via `cNaoNIF`) muda toda a tributação a jusante:
 *
 *   cIndOp     100302 — adquirente NÃO residente/domiciliado no País
 *   CST 410 / cClassTrib 410004 — imunidade/não incidência: exportação
 *   PIS/COFINS CST 08 — operação sem incidência da contribuição (sem valores)
 *
 * Códigos de serviço (fonte: Anexo VIII do Portal Nacional):
 *
 *   cTribNac 150101    — item LC 116/2003 15.01
 *   cNBS     109052100 — NBS 1.0905.21.00
 *
 * Ajuste os códigos para a sua atividade — eles NÃO são genéricos.
 *
 * Na resposta da SEFIN o `<IBSCBS>` volta com `cLocalidadeIncid 9999999`
 * ("Exterior"), sem alíquotas e com `totCIBS` zerado — o exemplo imprime esses
 * valores no final para evidenciar a não incidência. O ISSQN, esse, continua
 * sendo apurado pela regra municipal.
 *
 * Fluxo:
 *   1. Monta e valida o DPS (tomador sem NIF + endExt + comExt + ibsCbs)
 *   2. Envia para a SEFIN (SOMENTE homologação)
 *   3. Se aprovado (cStat 100), gera a DANF-Se em PDF
 *   4. Imprime o `<IBSCBS>` calculado que a SEFIN devolveu
 *
 * O prestador e o certificado vêm de examples/.env. O tomador estrangeiro é
 * FICTÍCIO e está embutido neste arquivo (anonimizado). Para emitir com dados
 * reais, crie um examples/14-emitir-exterior-ibs-cbs.local.ts (gitignored).
 *
 * ⚠️  SOMENTE HOMOLOGAÇÃO — este exemplo nunca emite em produção.
 *
 * Requer puppeteer instalado para o PDF:
 *   bun add puppeteer
 *
 * Uso:
 *   cp examples/.env.example examples/.env   # preencha com seus dados
 *   bun run example 14
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
  TipoRetencaoPisCofins,
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
  FinalidadeNFSe,
  IndicadorConsumidorFinal,
  IndicadorDestinatario,
  CodigoIndOp,
  CstIbsCbs,
  ClassTribIbsCbs,
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

/** Valor do serviço na moeda estrangeira — ajuste conforme o câmbio da fatura. */
const vServMoeda = env.valorServico

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
      // O serviço é prestado a partir do município do prestador.
      localPrestacao: { cLocPrestacao: env.codIbgePrestador },
      codigoServico: {
        cServTribNac: '150101',     // item LC 116/2003 15.01 — ajuste p/ sua atividade
        cNBSPrinc: '109052100',     // NBS 1.0905.21.00 — obrigatório sob a Reforma
      },
      xDescServ: env.descricaoServico,
      // Bloco de comércio exterior — obrigatório para tomador no exterior.
      comercioExterior: {
        mdPrestacao: ModoPrestacaoComExt.Transfronteirico,
        vincPrest: VinculoPrestacao.SemVinculo,
        tpMoeda: CodigoMoeda.DolarEUA,         // código da moeda (tabela BACEN)
        vServMoeda,                            // valor na moeda estrangeira
        mecAFComexP: MecAFComexPrestador.Nenhum,
        mecAFComexT: MecAFComexTomador.Nenhum,
        movTempBens: MovimentacaoTemporariaBens.Nao,
        mdic: EnvioMDIC.NaoEnviar,
      },
    },

    valores: {
      vServico: env.valorServico,   // sempre em BRL, mesmo com comExt
    },

    tributacao: {
      issqn: {
        tributacaoIssqn: TributacaoIssqn.OperacaoTributavel,
        tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      },
      federal: {
        // CST 08 — sem incidência da contribuição: nenhuma base, alíquota ou
        // valor de PIS/COFINS é enviada.
        cstPisCofins: '08',
        tipoRetencaoPisCofins: TipoRetencaoPisCofins.NaoRetido,
      },
      percentualTotalTributosFederais: 11.33,
      percentualTotalTributosEstaduais: 0.00,
      percentualTotalTributosMunicipais: 2.00,
    },

    // Bloco da Reforma Tributária — exportação de serviço.
    ibsCbs: {
      finNFSe: FinalidadeNFSe.Normal,
      indFinal: IndicadorConsumidorFinal.Nao,
      cIndOp: CodigoIndOp.DemaisServicosAdquirenteExterior,      // 100302
      indDest: IndicadorDestinatario.TomadorEhDestinatario,
      valores: {
        trib: {
          gIBSCBS: {
            CST: CstIbsCbs.ImunidadeNaoIncidencia,               // 410
            cClassTrib: ClassTribIbsCbs.ExportacaoBensServicos,  // 410004
          },
        },
      },
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
const outPath = join(__dirname, `danfe-exterior-ibs-cbs-${nNumero}.pdf`)

await writeFile(outPath, result.pdfBytes)

console.log('✅ DANF-Se gerada:', outPath)
console.log('\n📄 Dados da NFS-e:')
console.log('  Número          :', nfse.infNFSe?.nNFSe)
console.log('  Chave           :', response.chaveAcesso ?? nfse.infNFSe?.chNFSe)
console.log('  Emitente        :', nfse.infNFSe?.emit?.xNome)
console.log('  Tomador cNaoNIF :', nfse.infNFSe?.DPS?.infDPS.toma?.cNaoNIF)
console.log('  Emitido em      :', nfse.infNFSe?.dhProc)

// ---------------------------------------------------------------------------
// IBS/CBS devolvido pela SEFIN — nada disso foi enviado no DPS
// ---------------------------------------------------------------------------

const ibs = nfse.infNFSe?.IBSCBS

if (!ibs) {
  console.warn('\n⚠️  A NFS-e retornada não trouxe o bloco <IBSCBS>.')
} else {
  console.log('\n🧾 IBS/CBS calculado pela SEFIN (exportação → sem incidência):')
  console.log('  Localidade de incidência :', ibs.cLocalidadeIncid, '-', ibs.xLocalidadeIncid)
  console.log('  Base de cálculo (vBC)    : R$', ibs.vBC)
  console.log('  Total IBS                : R$', ibs.vIBSTot)
  console.log('  CBS                      : R$', ibs.vCBS)
  console.log('  Total da NFS-e (vTotNF)  : R$', ibs.vTotNF)
}

if (result.warnings.length > 0) {
  console.warn('\n⚠️  Avisos da DANF-Se:')
  result.warnings.forEach(w => console.warn('  •', w.field, '—', w.message))
}
