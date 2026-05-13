/**
 * Constrói um NfseSchema de prévia a partir de dados DPS (antes da emissão).
 * Os campos exclusivos da NFS-e (chave, número, dhProc) recebem marcadores
 * de prévia — o documento gerado não tem valor fiscal.
 */

import type { InfDpsData, EnderecoData } from '../types/dtos.js'
import type { NfseSchema, EnderNacSchema } from '../xml/nfse-parser.js'
import { TipoRetencaoIssqn } from '../types/enums.js'

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
      xOutInf:       '',
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
            idDocTec:      serv.informacaoComplemento?.idDocTec ?? '',
            docRef:        serv.informacaoComplemento?.docRef ?? '',
            xPed:          serv.informacaoComplemento?.xPed ?? '',
          },
          valores: {
            vReceb:      0,
            vServ:       vals.vServico,
            vDescIncond: vals.vDescIncondicionado ?? 0,
            vDescCond:   vals.vDescCondicionado   ?? 0,
            pDR:         0,
            vDR:         0,
            tribISSQN:   String(trib?.issqn?.tributacaoIssqn   ?? ''),
            cPaisResult: '',
            tpImunidade: String(trib?.issqn?.tipoImunidade ?? ''),
            tpSusp:      String(trib?.issqn?.tipoSuspensao ?? ''),
            nProcesso:   String(trib?.issqn?.numeroProcessoSuspensao ?? ''),
            nBM:         '',
            vRedBCBM:    0,
            pRedBCBM:    0,
            tpRetISSQN:  String(trib?.issqn?.tipoRetencaoIssqn ?? ''),
            pAliq:       trib?.issqn?.aliquota != null ? String(trib.issqn.aliquota * 100) : '',
            vRetCP:      trib?.federal?.valorRetidoCp    ?? 0,
            vRetIRRF:    trib?.federal?.valorRetidoIrrf  ?? 0,
            vRetCSLL:    trib?.federal?.valorRetidoCsll  ?? 0,
            cstPisCofins: trib?.federal?.cstPisCofins ?? '',
            vBCPisCofins: trib?.federal?.baseCalculoPisCofins ?? 0,
            pAliqPis:    trib?.federal?.aliquotaPis      ?? 0,
            pAliqCofins: trib?.federal?.aliquotaCofins   ?? 0,
            vPis:        trib?.federal?.valorPis         ?? 0,
            vCofins:     trib?.federal?.valorCofins      ?? 0,
            tpRetPisCofins: String(trib?.federal?.tipoRetencaoPisCofins ?? ''),
            pTotTribFed: trib?.percentualTotalTributosFederais   ?? 0,
            pTotTribEst: trib?.percentualTotalTributosEstaduais  ?? 0,
            pTotTribMun: trib?.percentualTotalTributosMunicipais ?? 0,
          },
        },
      },
      valores: (() => {
        const vBC      = vals.vBC ?? vals.vServico
        const aliquota = trib?.issqn?.aliquota
          ?? vals.pAliq
          ?? ((vals.vISSQN != null && vals.vISSQN > 0 && vBC > 0) ? vals.vISSQN / vBC : 0)
        const vISSQN   = vals.vISSQN ?? Math.round(vBC * aliquota * 100) / 100
        const tpRet        = trib?.issqn?.tipoRetencaoIssqn
        const vRetido      = (tpRet != null && tpRet !== TipoRetencaoIssqn.NaoRetido) ? vISSQN : 0
        const vTotalRetFed = (trib?.federal?.valorRetidoIrrf ?? 0)
                           + (trib?.federal?.valorRetidoCsll  ?? 0)
                           + (trib?.federal?.valorPis          ?? 0)
                           + (trib?.federal?.valorCofins       ?? 0)
        const vTotalRet    = vals.vTotalRet ?? vTotalRetFed
        const vLiq         = vals.vLiq ?? (vals.vServico - vRetido - (vals.vDescIncondicionado ?? 0) - (vals.vDescCondicionado ?? 0) - vTotalRet)
        return {
        vServico:            vals.vServico,
        vBC,
        pAliqAplic:          aliquota * 100,
        vISSQN,
        vLiq,
        vCalcBM:             0,
        vCalcDR:             0,
        vTotalRet,
        vDescCondicionado:   vals.vDescCondicionado   ?? 0,
        vDescIncondicionado: vals.vDescIncondicionado ?? 0,
        IRRF:                trib?.federal?.valorRetidoIrrf  ?? 0,
        CP:                  0,
        CSLL:                trib?.federal?.valorRetidoCsll  ?? 0,
        PIS:                 trib?.federal?.valorPis         ?? 0,
        COFINS:              trib?.federal?.valorCofins      ?? 0,
        }
      })(),
    },
  }
}
