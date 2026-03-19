/**
 * Exemplo 1 — Emissão de NFS-e em produção
 *
 * Pré-requisitos:
 *   bun add nfse-nacional          # instala a lib publicada no npm
 *   # ou, para testar local:
 *   bun add ../gerador-nfse-nacional-bun
 *
 * Uso:
 *   bun run examples/1-emitir-nfse.ts
 */

import {
  ContribuinteService,
  validateDps,
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  OpcaoSimplesNacional,
  generateDpsId,
  generateNumDps,
  formatDhEmissao,
  formatDataCompetencia,
  type DpsData,
  type NfseContext,
} from 'nfse-nacional'

// ---------------------------------------------------------------------------
// Configuração do contexto
// ---------------------------------------------------------------------------

const context: NfseContext = {
  ambiente: TipoAmbiente.Producao,
  certificatePath: './certificado.pfx',
  certificatePassword: process.env.CERT_PASSWORD ?? '',
  codigoMunicipio: '3106200', // Belo Horizonte / MG
}

// ---------------------------------------------------------------------------
// Montagem do DPS
// ---------------------------------------------------------------------------

const numeroDps = generateNumDps()

const dps: DpsData = {
  infDps: {
    id: generateDpsId('12345678000195', '3106200', '001', numeroDps),
    tipoAmbiente: TipoAmbiente.Producao,
    dataEmissao: formatDhEmissao(new Date(), -3),
    numeroDps,
    serie: '001',
    dataCompetencia: formatDataCompetencia(),
    tipoEmitente: EmitenteDPS.Prestador,
    codigoLocalEmissao: '3106200',

    prestador: {
      cnpj: '12345678000195',
      inscricaoMunicipal: '123456',
      nome: 'Empresa Prestadora LTDA',
      endereco: {
        cMun: '3106200',
        cep: '30130170',
        xLgr: 'Avenida Afonso Pena',
        nro: '1500',
        xBairro: 'Centro',
      },
      regimeTributario: {
        opSimpNac: OpcaoSimplesNacional.Optante,
      },
    },

    tomador: {
      cnpj: '00000000000191', // Banco do Brasil (exemplo)
      nome: 'Tomador Exemplo S/A',
      endereco: {
        cMun: '3550308',     // São Paulo / SP
        cep: '01310100',
        xLgr: 'Avenida Paulista',
        nro: '1374',
        xBairro: 'Bela Vista',
      },
    },

    servico: {
      localPrestacao: { cLocPrestacao: '3106200' },
      codigoServico: { cServTribNac: '01.01.00163' }, // Desenvolvimento de software
      xDescServ: 'Desenvolvimento de sistema de gestão — sprint 42',
    },

    valores: {
      vServico: 5000.00,
      vBC: 5000.00,
      vISSQN: 250.00, // 5%
      vLiq: 4750.00,
    },

    tributacao: {
      issqn: {
        tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
        aliquota: 0.05,
        tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      },
    },
  },
}

// ---------------------------------------------------------------------------
// Validação antes do envio
// ---------------------------------------------------------------------------

const validation = validateDps(dps)

if (!validation.isValid) {
  console.error('❌ DPS inválido:')
  validation.errors.forEach(e => console.error('  •', e))
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Emissão
// ---------------------------------------------------------------------------

const service = new ContribuinteService(context)

console.log('📤 Enviando DPS para emissão...')
const response = await service.emitir(dps)

console.log('✅ Resposta da SEFIN:')
console.log('  cStat   :', response.cStat)
console.log('  xMotivo :', response.xMotivo)
