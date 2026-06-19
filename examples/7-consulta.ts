/**
 * Exemplo 7 — Consulta de NFS-e
 *
 * Demonstra dois modos de uso:
 *
 * Modo A — chave já conhecida (mais comum no dia-a-dia):
 *   Defina `CHAVE_NFSE_EXISTENTE` no .env e a nota será consultada diretamente,
 *   sem necessidade de emitir uma nova.
 *
 * Modo B — emissão + consulta em sequência:
 *   Se `CHAVE_NFSE_EXISTENTE` não estiver definido, uma nova NFS-e é emitida em
 *   homologação e em seguida consultada pela chave de acesso retornada.
 *
 * O script também consulta a situação do DPS pelo ID quando disponível.
 *
 * Uso:
 *   cp examples/.env.example examples/.env   # preencha com seus dados
 *   bun run example 7
 *
 * Para consultar uma nota já existente sem emitir:
 *   Defina CHAVE_NFSE_EXISTENTE=<chave44digitos> no .env
 */

import { readFile } from 'node:fs/promises'
import { env } from './env.ts'
import {
  ContribuinteService,
  validateDps,
  parseNfseXml,
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
let idDps: string | undefined   // ID completo (com prefixo DPS) — consultarDps remove o prefixo

if (chaveExistente) {
  console.log('ℹ️  Usando chave de acesso do .env (modo consulta direta).')
  console.log('   CHAVE_NFSE_EXISTENTE:', chaveExistente)
  chaveAcesso = chaveExistente
} else {
  // ---------------------------------------------------------------------------
  // Modo B: emite uma NFS-e nova antes de consultar
  // ---------------------------------------------------------------------------

  console.log('ℹ️  CHAVE_NFSE_EXISTENTE não definido — emitindo nova NFS-e em homologação...\n')

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
  console.log('  idNfse     :', emissao.idNfse ?? '-')
  console.log()

  if (emissao.cStat !== '100' || !emissao.chaveAcesso) {
    console.error('❌ NFS-e não aprovada — não é possível consultar.')
    process.exit(1)
  }

  chaveAcesso = emissao.chaveAcesso
  // Usa o ID gerado (confiável) em vez do retornado pela API; consultarDps remove o prefixo DPS
  idDps = dps.infDps.id
}

// ---------------------------------------------------------------------------
// Consulta da NFS-e pela chave de acesso
// ---------------------------------------------------------------------------

console.log('\n🔍 Consultando NFS-e pela chave de acesso...')
console.log('   Chave:', chaveAcesso)
console.log()

const consulta = await service.consultar(chaveAcesso)

console.log('📋 Resultado da consulta:')
console.log('  cStat  :', consulta.cStat)
console.log('  xMotivo:', consulta.xMotivo)

if (consulta.nfse?.originalXml) {
  const nfse = parseNfseXml(consulta.nfse.originalXml)
  console.log('\n📄 Dados da NFS-e consultada:')
  console.log('  Número     :', nfse.infNFSe?.nNFSe)
  console.log('  Competência:', nfse.infNFSe?.DPS?.infDPS.dCompet)
  console.log('  Emitente   :', nfse.infNFSe?.emit?.xNome)
  console.log('  Tomador    :', nfse.infNFSe?.DPS?.infDPS.toma?.xNome)
  console.log('  Serviço    :', nfse.infNFSe?.DPS?.infDPS.serv?.xDescServ)
  console.log('  Valor      :', nfse.infNFSe?.DPS?.infDPS.valores?.vServ)
  console.log('  Processada :', nfse.infNFSe?.dhProc)
}

// ---------------------------------------------------------------------------
// Consulta do DPS pelo ID (quando disponível)
// ---------------------------------------------------------------------------

if (idDps) {
  console.log('\n🔍 Recuperando chave de acesso pelo ID da DPS...')
  const consultaDps = await service.consultarDps(idDps)
  console.log('  chaveAcesso:', consultaDps.chaveAcesso ?? '(sem permissão ou não encontrada)')
  if (consultaDps.cStat)   console.log('  cStat      :', consultaDps.cStat)
  if (consultaDps.xMotivo) console.log('  xMotivo    :', consultaDps.xMotivo)
}

console.log('\n✅ Consulta concluída.')
console.log('   Dica: defina CHAVE_NFSE_EXISTENTE no .env para consultar sem reemitir.')
