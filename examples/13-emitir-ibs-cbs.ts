/**
 * Exemplo 13 — Emissão com IBS/CBS (Reforma Tributária) — tomador NACIONAL
 *
 * Demonstra o bloco `<IBSCBS>` do DPS na versão 1.01 do layout. O que se envia
 * é mínimo — quatro escalares + `CST`/`cClassTrib`:
 *
 *   IBSCBS > finNFSe, indFinal?, cIndOp, indDest, valores > trib > gIBSCBS
 *
 * Todo o resto (`cLocalidadeIncid`, alíquotas `pIBSUF`/`pIBSMun`/`pCBS`,
 * `totCIBS`) é **calculado pela SEFIN** e volta no XML da NFS-e — este exemplo
 * imprime esses valores no final justamente para deixar isso evidente.
 *
 * Códigos usados (fonte: Anexo VIII do Portal Nacional — correlação item
 * LC 116/2003 × NBS × indOp × cClassTrib):
 *
 *   cTribNac   150101    — item LC 15.01 (administração de fundos e congêneres)
 *   cNBS       109052100 — NBS 1.0905.21.00 (gestão/administração de carteiras)
 *   cIndOp     100301    — demais serviços, adquirente domiciliado no País
 *   CST 000 / cClassTrib 000001 — tributação integral pelo IBS e CBS
 *   PIS/COFINS CST 01    — operação tributável com alíquota básica
 *
 * Ajuste os códigos para a sua atividade — eles NÃO são genéricos.
 *
 * Fluxo:
 *   1. Monta e valida o DPS com o bloco `ibsCbs`
 *   2. Envia para a SEFIN (SOMENTE homologação)
 *   3. Se aprovado (cStat 100), gera a DANF-Se em PDF
 *   4. Imprime o `<IBSCBS>` calculado que a SEFIN devolveu
 *
 * O prestador, o tomador e o certificado vêm de examples/.env. Para emitir com
 * dados reais, crie um examples/13-emitir-ibs-cbs.local.ts (gitignored).
 *
 * ⚠️  SOMENTE HOMOLOGAÇÃO — este exemplo nunca emite em produção.
 *
 * Requer puppeteer instalado para o PDF:
 *   bun add puppeteer
 *
 * Uso:
 *   cp examples/.env.example examples/.env   # preencha com seus dados
 *   bun run example 13
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

/** Arredonda para 2 casas — os valores do DPS vão com centavos exatos. */
const round2 = (n: number) => Math.round(n * 100) / 100

const vServico = env.valorServico

console.log('🔧 Dados do teste (lidos de examples/.env):')
console.log('  CNPJ Prestador :', env.cnpjPrestador)
console.log('  CPF Tomador    :', env.cpfTomadorPf)
console.log('  Valor serviço  : R$', vServico.toFixed(2))
console.log()

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
        cServTribNac: '150101',     // item LC 116/2003 15.01 — ajuste p/ sua atividade
        cNBSPrinc: '109052100',     // NBS 1.0905.21.00 — obrigatório sob a Reforma
      },
      xDescServ: env.descricaoServico,
    },

    valores: {
      vServico,
    },

    tributacao: {
      issqn: {
        tributacaoIssqn: TributacaoIssqn.OperacaoTributavel,
        tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      },
      federal: {
        // CST 01 — operação tributável com alíquota básica (regime cumulativo).
        cstPisCofins: '01',
        baseCalculoPisCofins: vServico,
        // Alíquotas em decimal: o builder multiplica por 100 no XML (0,65% e 3%).
        aliquotaPis: 0.0065,
        aliquotaCofins: 0.03,
        valorPis: round2(vServico * 0.0065),
        valorCofins: round2(vServico * 0.03),
        tipoRetencaoPisCofins: TipoRetencaoPisCofins.NaoRetido,
      },
      percentualTotalTributosFederais: 11.33,
      percentualTotalTributosEstaduais: 0.00,
      percentualTotalTributosMunicipais: 2.00,
    },

    // Bloco da Reforma Tributária. Só isto é enviado — o cálculo é da SEFIN.
    ibsCbs: {
      finNFSe: FinalidadeNFSe.Normal,
      indFinal: IndicadorConsumidorFinal.Nao,
      cIndOp: CodigoIndOp.DemaisServicosAdquirenteNoPais,        // 100301
      indDest: IndicadorDestinatario.TomadorEhDestinatario,
      valores: {
        trib: {
          gIBSCBS: {
            CST: CstIbsCbs.TributacaoIntegral,                   // 000
            cClassTrib: ClassTribIbsCbs.TributacaoIntegral,      // 000001
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
const outPath = join(__dirname, `danfe-ibs-cbs-${nNumero}.pdf`)

await writeFile(outPath, result.pdfBytes)

console.log('✅ DANF-Se gerada:', outPath)
console.log('\n📄 Dados da NFS-e:')
console.log('  Número     :', nfse.infNFSe?.nNFSe)
console.log('  Chave      :', response.chaveAcesso ?? nfse.infNFSe?.chNFSe)
console.log('  Emitente   :', nfse.infNFSe?.emit?.xNome)
console.log('  Emitido em :', nfse.infNFSe?.dhProc)

// ---------------------------------------------------------------------------
// IBS/CBS devolvido pela SEFIN — nada disso foi enviado no DPS
// ---------------------------------------------------------------------------

const ibs = nfse.infNFSe?.IBSCBS

if (!ibs) {
  console.warn('\n⚠️  A NFS-e retornada não trouxe o bloco <IBSCBS>.')
} else {
  console.log('\n🧾 IBS/CBS calculado pela SEFIN:')
  console.log('  Localidade de incidência :', ibs.cLocalidadeIncid, '-', ibs.xLocalidadeIncid)
  console.log('  Base de cálculo (vBC)    : R$', ibs.vBC)
  console.log('  IBS UF                   :', ibs.pAliqEfetUF ?? ibs.pIBSUF, '% → R$', ibs.vIBSUF)
  console.log('  IBS Município            :', ibs.pAliqEfetMun ?? ibs.pIBSMun, '% → R$', ibs.vIBSMun)
  console.log('  CBS                      :', ibs.pAliqEfetCBS ?? ibs.pCBS, '% → R$', ibs.vCBS)
  console.log('  Total IBS                : R$', ibs.vIBSTot)
  console.log('  Total da NFS-e (vTotNF)  : R$', ibs.vTotNF)
}

if (result.warnings.length > 0) {
  console.warn('\n⚠️  Avisos da DANF-Se:')
  result.warnings.forEach(w => console.warn('  •', w.field, '—', w.message))
}
