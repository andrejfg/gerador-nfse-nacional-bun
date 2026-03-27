/**
 * Constrói um NfseSchema de prévia a partir de dados DPS (antes da emissão).
 * Os campos exclusivos da NFS-e (chave, número, dhProc) recebem marcadores
 * de prévia — o documento gerado não tem valor fiscal.
 */

import type { InfDpsData, EnderecoData } from '../types/dtos.js'
import type { NfseSchema, EnderNacSchema } from '../xml/nfse-parser.js'

function mapEndereco(e?: EnderecoData): EnderNacSchema | undefined {
  if (!e) return undefined
  return {
    xLgr:    e.xLgr    ?? '',
    nro:     e.nro     ?? '',
    xCpl:    e.xCpl    ?? '',
    xBairro: e.xBairro ?? '',
    cMun:    e.cMun,
    UF:      e.uf      ?? '',
    CEP:     e.cep     ?? '',
    cPais:   e.cPais   ?? '1058',
  }
}

export function buildPreviewSchema(dps: InfDpsData): NfseSchema {
  const prest = dps.prestador
  const toma  = dps.tomador
  const serv  = dps.servico
  const vals  = dps.valores
  const trib  = dps.tributacao

  return {
    versao: '1.00',
    infNFSe: {
      id:            undefined,
      cStat:         '000',
      xMotivo:       'PRÉVIA — documento sem valor fiscal',
      chNFSe:        '',
      nNFSe:         'PRÉVIA',
      nDFSe:         '',
      dhProc:        new Date().toISOString(),
      xLocEmi:       '',
      xLocPrestacao: '',
      cLocIncid:     serv.localPrestacao.cLocPrestacao,
      xLocIncid:     '',
      xTribNac:      '',
      xTribMun:      '',
      xNBS:          serv.codigoServico.cNBSPrinc ?? '',
      verAplic:      dps.versaoAplicativo ?? '',
      ambGer:        dps.tipoAmbiente,
      tpEmis:        1,
      procEmi:       1,
      emit: {
        CNPJ:    prest.cnpj  ?? '',
        CPF:     prest.cpf   ?? '',
        IM:      prest.inscricaoMunicipal ?? '',
        xNome:   prest.nome  ?? '',
        xFant:   '',
        enderNac: mapEndereco(prest.endereco),
        fone:    prest.telefone ?? '',
        email:   prest.email    ?? '',
        regTrib: prest.regimeTributario ? {
          opSimpNac:  prest.regimeTributario.opSimpNac,
          regApurSN:  prest.regimeTributario.regApurSN  ?? 1,
          regEspTrib: prest.regimeTributario.regEspTrib ?? 0,
        } : undefined,
      },
      DPS: {
        infDPS: {
          tpAmb:    dps.tipoAmbiente,
          verAplic: dps.versaoAplicativo ?? '',
          serie:    dps.serie            ?? '001',
          nDPS:     dps.numeroDps,
          dhEmi:    dps.dataEmissao,
          dCompet:  dps.dataCompetencia,
          tpEmit:   dps.tipoEmitente,
          cLocEmi:  dps.codigoLocalEmissao,
          toma: toma ? {
            CNPJ:     toma.cnpj   ?? '',
            CPF:      toma.cpf    ?? '',
            IM:       toma.inscricaoMunicipal ?? '',
            xNome:    toma.nome   ?? '',
            enderNac: mapEndereco(toma.endereco),
            fone:     toma.telefone ?? '',
            email:    toma.email    ?? '',
          } : undefined,
          interm: dps.intermediario ? {
            CNPJ:     dps.intermediario.cnpj ?? '',
            CPF:      dps.intermediario.cpf  ?? '',
            IM:       dps.intermediario.inscricaoMunicipal ?? '',
            xNome:    dps.intermediario.nome ?? '',
            enderNac: undefined,
            fone:     '',
            email:    '',
          } : undefined,
          serv: {
            xDescServ:     serv.xDescServ,
            cTribNac:      serv.codigoServico.cServTribNac,
            cServMun:      serv.codigoServico.cServMun     ?? '',
            cNBS:          serv.codigoServico.cNBSPrinc    ?? '',
            cIntContrib:   serv.codigoServico.cIntContrib  ?? '',
            cLocPrestacao: serv.localPrestacao.cLocPrestacao,
            xInfComp:      serv.informacaoComplemento?.xInfComp ?? '',
          },
          valores: {
            vServ:       vals.vServico,
            tribISSQN:   String(trib?.issqn?.tributacaoIssqn   ?? ''),
            tpRetISSQN:  String(trib?.issqn?.tipoRetencaoIssqn ?? ''),
            pTotTribFed: trib?.percentualTotalTributosFederais   ?? 0,
            pTotTribEst: trib?.percentualTotalTributosEstaduais  ?? 0,
            pTotTribMun: trib?.percentualTotalTributosMunicipais ?? 0,
          },
        },
      },
      valores: {
        vServico:            vals.vServico,
        vBC:                 vals.vBC       ?? vals.vServico,
        pAliqAplic:          trib?.issqn?.aliquota != null ? trib.issqn.aliquota * 100 : 0,
        vISSQN:              vals.vISSQN    ?? 0,
        vLiq:                vals.vServico  - (vals.vISSQN ?? 0),
        vCalcBM:             0,
        vCalcDR:             0,
        vTotalRet:           vals.vTotalRet ?? 0,
        vDescCondicionado:   vals.vDescCondicionado   ?? 0,
        vDescIncondicionado: vals.vDescIncondicionado ?? 0,
        IRRF:                trib?.federal?.valorRetidoIrrf  ?? 0,
        CP:                  0,
        CSLL:                trib?.federal?.valorRetidoCsll  ?? 0,
        PIS:                 trib?.federal?.valorPis         ?? 0,
        COFINS:              trib?.federal?.valorCofins      ?? 0,
      },
    },
  }
}
