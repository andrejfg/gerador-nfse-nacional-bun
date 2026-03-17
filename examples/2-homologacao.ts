/**
 * Exemplo 2 — Emissão em homologação com dados gerados automaticamente
 *
 * Usa generateCpf / generateCnpj para montar tomador e prestador sem
 * precisar de documentos reais — ideal para baterias de testes manuais
 * no ambiente de homologação da SEFIN.
 *
 * Uso:
 *   bun run examples/2-homologacao.ts
 */

import {
  ContribuinteService,
  validateDps,
  generateCpf,
  generateCnpj,
  calculateTax,
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  generateDpsId,
  generateNumDps,
  formatDhEmissao,
  formatDataCompetencia,
  type DpsData,
  type NfseContext,
} from 'nfse-nacional'

// ---------------------------------------------------------------------------
// Dados gerados para teste
// ---------------------------------------------------------------------------

const cnpjPrestador = generateCnpj()    // ex: '12345678000195'
const cpfTomador    = generateCpf(true) // ex: '066.729.923-83' (formatado)

const valorServico  = 1000.00
const aliquotaISS   = 5         // 5% — alíquota ISSQN em %
const valorISS      = calculateTax(valorServico, aliquotaISS) // 50.00

console.log('🔧 Dados gerados para o teste:')
console.log('  CNPJ Prestador :', cnpjPrestador)
console.log('  CPF Tomador    :', cpfTomador)
console.log('  Valor serviço  : R$', valorServico.toFixed(2))
console.log('  Alíquota ISS   :', aliquotaISS + '%')
console.log('  Valor ISS      : R$', valorISS.toFixed(2))
console.log()

// ---------------------------------------------------------------------------
// Contexto de homologação
// ---------------------------------------------------------------------------

const context: NfseContext = {
  ambiente: TipoAmbiente.Homologacao,
  certificatePath: './certificado.pfx',
  certificatePassword: process.env.CERT_PASSWORD ?? '',
  codigoMunicipio: '3106200',
}

// ---------------------------------------------------------------------------
// Montagem do DPS
// ---------------------------------------------------------------------------

const numeroDps = generateNumDps()

const dps: DpsData = {
  infDps: {
    id: generateDpsId(cnpjPrestador, '3106200', '001', numeroDps),
    tipoAmbiente: TipoAmbiente.Homologacao,
    dataEmissao: formatDhEmissao(new Date(), -3),
    numeroDps,
    serie: '001',
    dataCompetencia: formatDataCompetencia(),
    tipoEmitente: EmitenteDPS.Prestador,
    codigoLocalEmissao: '3106200',

    prestador: {
      cnpj: cnpjPrestador,
      nome: 'Empresa Teste Homologacao LTDA',
      endereco: {
        cMun: '3106200',
        cep: '30130170',
        xLgr: 'Rua Teste',
        nro: '1',
        xBairro: 'Centro',
      },
    },

    tomador: {
      cpf: cpfTomador.replace(/\D/g, ''), // remove formatação
      nome: 'Tomador Teste Homologacao',
      endereco: {
        cMun: '3106200',
        cep: '30130170',
        xLgr: 'Rua Tomador',
        nro: '42',
        xBairro: 'Centro',
      },
    },

    servico: {
      localPrestacao: { cLocPrestacao: '3106200' },
      codigoServico: { cServTribNac: '01.01.00163' },
      xDescServ: 'Serviço de teste em homologação',
    },

    valores: {
      vServico: valorServico,
      vBC: valorServico,
      vISSQN: valorISS,
      vLiq: valorServico - valorISS,
    },

    tributacao: {
      issqn: {
        tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
        aliquota: aliquotaISS / 100, // a API espera decimal: 0.05
        tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
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
// Emissão
// ---------------------------------------------------------------------------

const service = new ContribuinteService(context)
const response = await service.emitir(dps)

console.log('📨 Resposta da SEFIN:')
console.log('  cStat   :', response.cStat)
console.log('  xMotivo :', response.xMotivo)
