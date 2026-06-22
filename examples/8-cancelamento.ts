/**
 * Exemplo 8 — Cancelamento de NFS-e
 *
 * Demonstra dois modos de uso:
 *
 * Modo A — chave já conhecida (mais comum):
 *   Defina `CHAVE_NFSE_EXISTENTE` no .env e a nota será cancelada diretamente.
 *
 * Modo B — emissão + cancelamento em sequência:
 *   Se `CHAVE_NFSE_EXISTENTE` não estiver definido, uma nova NFS-e é emitida em
 *   homologação e em seguida cancelada — útil para testar o fluxo completo.
 *
 * Tipos de evento de cancelamento:
 *   101101 — Cancelamento por erro de emissão (mais comum)
 *   101102 — Cancelamento a pedido do tomador
 *   101103 — Cancelamento por determinação judicial
 *
 * Uso:
 *   cp examples/.env.example examples/.env   # preencha com seus dados
 *   bun run example 8
 *
 * Para cancelar uma nota já existente sem emitir:
 *   Defina CHAVE_NFSE_EXISTENTE=<chave44digitos> no .env
 */

import { readFile } from 'node:fs/promises'
import { env } from './env.ts'
import {
  ContribuinteService,
  NfseNaoEncontradaError,
  NfseJaCanceladaError,
  validateDps,
  TipoAmbiente,
  TipoEvento,
  MotivoEventoCancelamento,
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
  type PedRegEventoData,
} from 'nfse-nacional'

// ---------------------------------------------------------------------------
// Contexto
// ---------------------------------------------------------------------------

const certificateData: ArrayBuffer = (await readFile(env.certPath)).buffer

const context: NfseContext = {
  ambiente: TipoAmbiente.Homologacao,
  certificateData,
  certificatePassword: env.certPassword,
  codigoMunicipio: env.codIbgePrestador,
  debug: false,
}

const service = new ContribuinteService(context)

// ---------------------------------------------------------------------------
// Modo A: usar chave já existente no .env
// ---------------------------------------------------------------------------

const chaveExistente = process.env['CHAVE_NFSE_EXISTENTE']?.trim() || undefined
let chaveAcesso: string

if (chaveExistente) {
  console.log('ℹ️  Usando chave de acesso do .env (modo cancelamento direto).')
  console.log('   CHAVE_NFSE_EXISTENTE:', chaveExistente)
  chaveAcesso = chaveExistente
} else {
  // ---------------------------------------------------------------------------
  // Modo B: emite uma NFS-e nova e depois a cancela
  // ---------------------------------------------------------------------------

  console.log('ℹ️  CHAVE_NFSE_EXISTENTE não definido — emitindo nova NFS-e para cancelar...\n')

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

      valores: { vServico: env.valorServico },

      tributacao: {
        issqn: {
          tributacaoIssqn: TributacaoIssqn.OperacaoTributavel,
          tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
        },
        federal: { cstPisCofins: '00' },
        percentualTotalTributosFederais: 11.33,
        percentualTotalTributosEstaduais: 0.00,
        percentualTotalTributosMunicipais: 2.00,
      },
    },
  }

  const validation = validateDps(dps)
  if (!validation.isValid) {
    console.error('❌ DPS inválido:')
    validation.errors.forEach(e => console.error('  •', e))
    process.exit(1)
  }

  const emissao = await service.emitir(dps)

  console.log('📨 Emissão:')
  console.log('  cStat      :', emissao.cStat)
  console.log('  xMotivo    :', emissao.xMotivo)
  console.log('  chaveAcesso:', emissao.chaveAcesso ?? '-')
  console.log()

  if (emissao.cStat !== '100' || !emissao.chaveAcesso) {
    console.error('❌ NFS-e não aprovada — cancelamento não será realizado.')
    process.exit(1)
  }

  chaveAcesso = emissao.chaveAcesso
}

// ---------------------------------------------------------------------------
// Cancelamento
// ---------------------------------------------------------------------------

console.log('\n🗑️  Cancelando NFS-e...')
console.log('   Chave:', chaveAcesso)
console.log()

const evento: PedRegEventoData = {
  chNFSe: chaveAcesso,
  tipoEvento: TipoEvento.Cancelamento,
  tipoAmbiente: TipoAmbiente.Homologacao,
  cnpjAutor: env.cnpjPrestador,
  cMotivo: MotivoEventoCancelamento.ErroNaEmissao,
  xMotivo: 'Nota emitida para fins de teste - cancelamento solicitado pelo prestador.',
}

let cancelamento
try {
  cancelamento = await service.cancelar(evento)
} catch (err) {
  if (err instanceof NfseNaoEncontradaError) {
    console.error('❌ NFS-e não encontrada na SEFIN - cancelamento abortado.')
    console.error('   Chave  :', err.chaveAcesso)
    console.error('   cStat  :', err.cStat)
    console.error('   Motivo :', err.xMotivo)
    process.exit(1)
  }
  if (err instanceof NfseJaCanceladaError) {
    console.warn('⚠️  NFS-e já está cancelada - nenhuma ação necessária.')
    console.warn('   Chave  :', err.chaveAcesso)
    process.exit(0)
  }
  throw err
}

console.log('📋 Resultado do cancelamento:')
console.log('  cStat  :', cancelamento.cStat)
console.log('  xMotivo:', cancelamento.xMotivo)

// ---------------------------------------------------------------------------
// Confirmação via consulta
// ---------------------------------------------------------------------------

if (cancelamento.cStat === '100' || cancelamento.cStat === '135') {
  console.log('\n🔍 Confirmando cancelamento via consulta...')
  const consulta = await service.consultar(chaveAcesso)
  console.log('  cStat  :', consulta.cStat)
  console.log('  xMotivo:', consulta.xMotivo)
}

console.log('\n✅ Fluxo de cancelamento concluído.')
console.log('   Dica: defina CHAVE_NFSE_EXISTENTE no .env para cancelar sem reemitir.')
