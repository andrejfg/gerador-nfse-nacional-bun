/**
 * Exemplo 6 — Preview da DANF-Se (antes da emissão)
 *
 * Gera uma prévia da DANF-Se a partir dos dados do DPS, SEM enviar à API SEFIN.
 * O documento gerado contém uma marca d'água "PRÉVIA — SEM VALOR FISCAL" e
 * não tem nenhum valor legal — serve apenas para validar layout e dados.
 *
 * O certificado NÃO é necessário para o preview. Os dados do prestador e tomador
 * são lidos de examples/.env (veja examples/.env.example).
 *
 * Formatos de saída suportados:
 *   - HTML: rápido, sem Puppeteer, ideal para visualização no browser
 *   - PDF : requer Puppeteer — bun add puppeteer
 *
 * Uso:
 *   cp examples/.env.example examples/.env   # preencha com seus dados
 *   bun run example 6
 *
 * Para gerar PDF em vez de HTML, altere `format` abaixo para 'pdf'.
 */

import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from './env.ts'
import {
  DanfeService,
  DanfePreviewFormat,
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
} from 'nfse-nacional'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Formato desejado: 'html' (rápido, sem Puppeteer) ou 'pdf'
// ---------------------------------------------------------------------------

const FORMAT = DanfePreviewFormat.Pdf   // ou DanfePreviewFormat.Pdf

// ---------------------------------------------------------------------------
// Montagem do DPS — mesmos dados que seriam enviados à API
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
// Validação local (não envia à API)
// ---------------------------------------------------------------------------

const validation = validateDps(dps)
if (!validation.isValid) {
  console.error('❌ DPS inválido:')
  validation.errors.forEach(e => console.error('  •', e))
  process.exit(1)
}

console.log('✅ DPS válido — gerando preview...\n')

// ---------------------------------------------------------------------------
// Geração do preview (sem certificado, sem API)
// ---------------------------------------------------------------------------

const danfe = new DanfeService()
const preview = await danfe.previewFromDps(dps.infDps, { format: FORMAT })

if (FORMAT === DanfePreviewFormat.Pdf && preview.pdfBytes) {
  const outPath = join(__dirname, 'preview.pdf')
  writeFileSync(outPath, preview.pdfBytes)
  console.log('📄 Preview PDF gerado:', outPath)
} else {
  const outPath = join(__dirname, 'preview.html')
  writeFileSync(outPath, preview.html, 'utf-8')
  console.log('🌐 Preview HTML gerado:', outPath)
  console.log('   Abra no browser para visualizar a marca d\'água.')
}

console.log('\n⚠️  Este documento NÃO tem valor fiscal.')
console.log('   Para emitir a NFS-e, use o Exemplo 1, 2 ou 5.')

if (preview.warnings.length > 0) {
  console.warn('\n⚠️  Avisos do renderer:')
  preview.warnings.forEach(w => console.warn('  •', w.field, '—', w.message))
}
