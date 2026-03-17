/**
 * Exemplo de uso completo do gerador-nfse-nacional-bun
 *
 * Pré-requisitos:
 * - Arquivo certificado.pfx no diretório raiz
 * - Acesso à API SEFIN Nacional (homologação)
 */

import {
  ContribuinteService,
  DanfeService,
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  OpcaoSimplesNacional,
  type DpsData,
  type NfseContext,
  generateDpsId,
  generateNumDps,
  formatDhEmissao,
  formatDataCompetencia,
} from './index.js'
import { writeFileSync } from 'node:fs'

const CONTEXT: NfseContext = {
  ambiente: TipoAmbiente.Homologacao,
  certificatePath: './certificado.pfx',
  certificatePassword: 'senha_do_pfx',
  codigoMunicipio: '3106200',           // Belo Horizonte/MG
}

const CNPJ_PRESTADOR = '12345678000195'
const COD_IBGE = '3106200'             // Belo Horizonte/MG

async function emitirNota() {
  const serie = '001'
  const numero = generateNumDps()

  const dps: DpsData = {
    versao: '1.00',
    infDps: {
      id: generateDpsId(CNPJ_PRESTADOR, COD_IBGE, serie, numero),
      tipoAmbiente: TipoAmbiente.Homologacao,
      dataEmissao: formatDhEmissao(new Date(), -3),
      versaoAplicativo: '1.00',
      serie,
      numeroDps: numero,
      dataCompetencia: formatDataCompetencia(),
      tipoEmitente: EmitenteDPS.Prestador,
      codigoLocalEmissao: COD_IBGE,

      prestador: {
        cnpj: CNPJ_PRESTADOR,
        inscricaoMunicipal: '12345678',
        nome: 'Empresa Exemplo LTDA',
        regimeTributario: { opSimpNac: OpcaoSimplesNacional.Optante },
        endereco: {
          xLgr: 'Rua Exemplo', nro: '100', xBairro: 'Centro',
          cMun: COD_IBGE, uf: 'MG', cep: '30100000', cPais: '1058',
        },
      },

      tomador: {
        cnpj: '00000000000191',
        nome: 'Empresa Tomadora S/A',
        endereco: {
          xLgr: 'Rua do Tomador', nro: '200', xBairro: 'Savassi',
          cMun: COD_IBGE, uf: 'MG', cep: '30130010', cPais: '1058',
        },
      },

      servico: {
        localPrestacao: { cLocPrestacao: COD_IBGE },
        codigoServico: { cServTribNac: '01.01.00163', cServMun: '14.01' },
        xDescServ: 'Desenvolvimento de software sob encomenda',
        informacaoComplemento: { xInfComp: 'Referente ao projeto XYZ. Contrato: 2024-001' },
      },

      valores: {
        vServico: 5000.00,
        vBC: 5000.00,
        vISSQN: 250.00,
        vLiq: 4750.00,
      },

      tributacao: {
        issqn: {
          tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
          aliquota: 0.05,
          tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
          cMunFG: COD_IBGE,
        },
      },
    },
  }

  console.log('📄 Emitindo NFS-e...')
  const service = new ContribuinteService(CONTEXT)
  const response = await service.emitir(dps)

  console.log(`✅ Status: ${response.cStat} — ${response.xMotivo}`)

  if (response.nfse?.infNfse?.chNFSe) {
    console.log(`   Chave: ${response.nfse.infNfse.chNFSe}`)
    console.log(`   Número: ${response.nfse.infNfse.nNFSe}`)

    if (response.nfse.originalXml) {
      await gerarPdf(response.nfse.originalXml, response.nfse.infNfse.chNFSe)
    }
  }

  return response
}

async function gerarPdf(xml: string, chave: string) {
  console.log('\n📑 Gerando DANF-Se...')
  const danfe = new DanfeService()
  const result = await danfe.generateFromXml(xml)
  const path = `./danfse_${chave.slice(0, 10)}.pdf`
  writeFileSync(path, result.pdfBytes)
  console.log(`✅ PDF salvo: ${path} (${result.pdfBytes.length} bytes)`)
}

async function cancelarNota(chave: string) {
  const service = new ContribuinteService(CONTEXT)
  console.log(`\n🚫 Cancelando ${chave.slice(0, 15)}...`)
  const response = await service.cancelar({
    chNFSe: chave,
    tipoEvento: 101101,
    descricao: 'Cancelamento de NFS-e',
    motivo: '01',
    motivoDescricao: 'Erro de emissão',
  })
  console.log(`   ${response.cStat} — ${response.xMotivo}`)
}

console.log('🇧🇷 gerador-nfse-nacional-bun\n')
console.log('Descomente as linhas abaixo para executar:\n')
console.log('// await emitirNota()')
console.log('// await cancelarNota("CHAVE_AQUI")')

// await emitirNota()
