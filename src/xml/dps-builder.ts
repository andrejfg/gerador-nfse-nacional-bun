/**
 * Construtor do XML do DPS (Declaração de Prestação de Serviços)
 * Migrado de nfse-php/src/Xml/DpsXmlBuilder.php
 *
 * Namespace: http://www.sped.fazenda.gov.br/nfse
 */

import type {
  DpsData,
  PrestadorData,
  TomadorData,
  IntermediarioData,
  ServicoData,
  ValoresServicoData,
  TributacaoData,
  EnderecoData,
  IbsCbsData,
} from '../types/dtos.js'
import { escapeXml } from './escape.js'

const NAMESPACE = 'http://www.sped.fazenda.gov.br/nfse'
const VERSAO = '1.01'

function fmt(value: number, decimals = 2): string {
  return value.toFixed(decimals)
}

function tag(name: string, value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return ''
  return `<${name}>${escapeXml(value)}</${name}>`
}

function buildEndereco(end: EnderecoData): string {
  // TCEndereco (XSD): choice(endNac | endExt), seguido de xLgr, nro, xCpl, xBairro.
  const ext = end.exterior
  const endChoice = ext
    ? `<endExt>${
      tag('cPais', ext.cPais)
    }${tag('cEndPost', ext.cEndPost)
    }${tag('xCidade', ext.xCidade)
    }${tag('xEstProvReg', ext.xEstProvReg)
    }</endExt>`
    : `<endNac>${tag('cMun', end.cMun)}${tag('CEP', end.cep?.replace(/\D/g, ''))}</endNac>`
  return endChoice
    + tag('xLgr', end.xLgr)
    + tag('nro', end.nro)
    + tag('xCpl', end.xCpl)
    + tag('xBairro', end.xBairro)
}

function buildPrestador(prest: PrestadorData): string {
  const rt = prest.regimeTributario
  // regTrib é obrigatório em TCInfoPrestador; opSimpNac e regEspTrib são filhos
  // obrigatórios. Usamos defaults (1=Não Optante, 0=Nenhum) quando omitidos.
  const regTribXml = `<regTrib>${
    tag('opSimpNac', rt?.opSimpNac ?? 1)
  }${tag('regApTribSN', rt?.regApurSN)
  }${tag('regEspTrib', rt?.regEspTrib ?? 0)
  }</regTrib>`
  return `<prest>${
    tag('CNPJ', prest.cnpj?.replace(/\D/g, ''))
  }${tag('CPF', prest.cpf?.replace(/\D/g, ''))
  }${tag('NIF', prest.nif)
  }${tag('cNaoNIF', prest.codigoNaoNif)
  }${tag('CAEPF', prest.caepf)
  }${tag('IM', prest.inscricaoMunicipal)
  }${tag('xNome', prest.nome)
  }${prest.endereco ? `<end>${buildEndereco(prest.endereco)}</end>` : ''
  }${tag('fone', prest.telefone)
  }${tag('email', prest.email)
  }${regTribXml
  }</prest>`
}

function buildTomador(toma: TomadorData): string {
  return `<toma>${
    tag('CNPJ', toma.cnpj?.replace(/\D/g, ''))
  }${tag('CPF', toma.cpf?.replace(/\D/g, ''))
  }${tag('NIF', toma.nif)
  }${tag('cNaoNIF', toma.codigoNaoNif)
  }${tag('IM', toma.inscricaoMunicipal)
  }${tag('xNome', toma.nome)
  }${toma.endereco ? `<end>${buildEndereco(toma.endereco)}</end>` : ''
  }${tag('fone', toma.telefone)
  }${tag('email', toma.email)
  }</toma>`
}

function buildIntermediario(interm: IntermediarioData): string {
  return `<interm>${
    tag('CNPJ', interm.cnpj?.replace(/\D/g, ''))
  }${tag('CPF', interm.cpf?.replace(/\D/g, ''))
  }${tag('NIF', interm.nif)
  }${tag('cNaoNIF', interm.codigoNaoNif)
  }${tag('IM', interm.inscricaoMunicipal)
  }${tag('xNome', interm.nome)
  }</interm>`
}

function buildServico(serv: ServicoData): string {
  // TCInfoObra (XSD): inscImobFisc?, then choice(cObra | cCIB | end).
  // O elemento <art> não existe no schema — identificação de ART/RRT/DRT vai em <infoCompl><idDocTec>.
  const obraXml = serv.obra && (serv.obra.inscImobFisc || serv.obra.cObra)
    ? `<obra>${tag('inscImobFisc', serv.obra.inscImobFisc)}${tag('cObra', serv.obra.cObra)}</obra>`
    : ''

  // TCAtvEvento (XSD): xNome, dtIni, dtFim, choice(idAtvEvt | end).
  // O <end> aqui é TCEnderecoSimples — choice(CEP | endExt) e o endExt sem cPais.
  const atv = serv.atvEvento
  const atvEventoXml = atv
    ? `<atvEvento>${
      tag('xNome', atv.xNome)
    }${tag('dtIni', atv.dtIni)
    }${tag('dtFim', atv.dtFim)
    }${atv.idAtvEvt
      ? tag('idAtvEvt', atv.idAtvEvt)
      : atv.endereco
        ? `<end>${
          atv.endereco.exterior
            ? `<endExt>${
              tag('cEndPost', atv.endereco.exterior.cEndPost)
            }${tag('xCidade', atv.endereco.exterior.xCidade)
            }${tag('xEstProvReg', atv.endereco.exterior.xEstProvReg)
            }</endExt>`
            : tag('CEP', atv.endereco.cep?.replace(/\D/g, ''))
        }${tag('xLgr', atv.endereco.xLgr)
        }${tag('nro', atv.endereco.nro)
        }${tag('xCpl', atv.endereco.xCpl)
        }${tag('xBairro', atv.endereco.xBairro)
        }</end>`
        : ''
    }</atvEvento>`
    : ''

  // TCInfoCompl (XSD): idDocTec?, docRef?, xPed?, gItemPed?, xInfComp?
  const info = serv.informacaoComplemento
  const infoComplXml = info && (info.idDocTec || info.docRef || info.xPed || info.xInfComp)
    ? `<infoCompl>${
      tag('idDocTec', info.idDocTec)
    }${tag('docRef', info.docRef)
    }${tag('xPed', info.xPed)
    }${tag('xInfComp', info.xInfComp)
    }</infoCompl>`
    : ''

  // TCInfoComExt (XSD): mdPrestacao, vincPrest, tpMoeda, vServMoeda, mecAFComexP?,
  // mecAFComexT?, movTempBens?, mdic? — emitido após <cServ>.
  const ce = serv.comercioExterior
  const comExtXml = ce
    ? `<comExt>${
      tag('mdPrestacao', ce.mdPrestacao)
    }${tag('vincPrest', ce.vincPrest)
    }${tag('tpMoeda', ce.tpMoeda)
    }${tag('vServMoeda', fmt(ce.vServMoeda))
    }${tag('mecAFComexP', ce.mecAFComexP)
    }${tag('mecAFComexT', ce.mecAFComexT)
    }${tag('movTempBens', ce.movTempBens)
    }${tag('mdic', ce.mdic)
    }</comExt>`
    : ''

  return `<serv><locPrest>${
    tag('cLocPrestacao', serv.localPrestacao.cLocPrestacao)
  }${tag('cPaisPrestacao', serv.localPrestacao.cPaisPrestacao)
  }</locPrest><cServ>${
    tag('cTribNac', serv.codigoServico.cServTribNac?.replace(/\D/g, ''))
  }${tag('cTribMun', serv.codigoServico.cServMun?.replace(/\D/g, ''))
  }${tag('xDescServ', serv.xDescServ)
  }${tag('cNBS', serv.codigoServico.cNBSPrinc)
  }${tag('cIntContrib', serv.codigoServico.cIntContrib)
  }</cServ>${comExtXml}${obraXml}${atvEventoXml}${infoComplXml}</serv>`
}

function buildValores(val: ValoresServicoData, trib?: TributacaoData): string {
  const issqn = trib?.issqn
  const fed = trib?.federal

  // vDescCondIncond
  const descXml = (val.vDescIncondicionado !== undefined || val.vDescCondicionado !== undefined)
    ? `<vDescCondIncond>${tag('vDescIncond', val.vDescIncondicionado !== undefined ? fmt(val.vDescIncondicionado) : undefined)}${tag('vDescCond', val.vDescCondicionado !== undefined ? fmt(val.vDescCondicionado) : undefined)}</vDescCondIncond>`
    : ''

  // tribMun — obrigatório dentro de <trib>. tribISSQN e tpRetISSQN são obrigatórios;
  // usamos 1 (Operação tributável / Não retido) como fallback quando não informados.
  const exigSuspXml = issqn?.tipoSuspensao !== undefined
    ? `<exigSusp>${tag('tpSusp', issqn.tipoSuspensao)}${tag('nProcesso', issqn.numeroProcessoSuspensao)}</exigSusp>`
    : ''
  const tribMunXml = `<tribMun>${
    tag('tribISSQN', issqn?.tributacaoIssqn ?? 1)
  }${tag('tpImunidade', issqn?.tipoImunidade)
  }${exigSuspXml
  }${tag('tpRetISSQN', issqn?.tipoRetencaoIssqn ?? 1)
  }${issqn?.aliquota !== undefined ? tag('pAliq', fmt(issqn.aliquota * 100)) : ''
  }</tribMun>`

  // tribFed — opcional
  const tribFedXml = fed ? (() => {
    const piscofinXml = fed.cstPisCofins
      ? `<piscofins>${tag('CST', fed.cstPisCofins)}${fed.baseCalculoPisCofins !== undefined ? tag('vBCPisCofins', fmt(fed.baseCalculoPisCofins)) : ''}${fed.aliquotaPis !== undefined ? tag('pAliqPis', fmt(fed.aliquotaPis * 100)) : ''}${fed.aliquotaCofins !== undefined ? tag('pAliqCofins', fmt(fed.aliquotaCofins * 100)) : ''}${fed.valorPis !== undefined ? tag('vPis', fmt(fed.valorPis)) : ''}${fed.valorCofins !== undefined ? tag('vCofins', fmt(fed.valorCofins)) : ''}${tag('tpRetPisCofins', fed.tipoRetencaoPisCofins)}</piscofins>`
      : ''
    return `<tribFed>${piscofinXml}${fed.valorRetidoIrrf !== undefined ? tag('vRetIRRF', fmt(fed.valorRetidoIrrf)) : ''}${fed.valorRetidoCsll !== undefined ? tag('vRetCSLL', fmt(fed.valorRetidoCsll)) : ''}</tribFed>`
  })() : ''

  // totTrib — obrigatório dentro de <trib>. XSD define choice entre 4 variantes;
  // quando nenhum dado é fornecido, cai no indTotTrib=0 (fixo por regra do schema).
  let totTribXml: string
  if (trib?.percentualTotalTributosSN !== undefined) {
    totTribXml = `<totTrib>${tag('pTotTribSN', fmt(trib.percentualTotalTributosSN))}</totTrib>`
  } else if (trib?.valorTotalTributosFederais !== undefined || trib?.valorTotalTributosEstaduais !== undefined || trib?.valorTotalTributosMunicipais !== undefined) {
    totTribXml = `<totTrib><vTotTrib>${tag('vTotTribFed', trib.valorTotalTributosFederais !== undefined ? fmt(trib.valorTotalTributosFederais) : undefined)}${tag('vTotTribEst', trib.valorTotalTributosEstaduais !== undefined ? fmt(trib.valorTotalTributosEstaduais) : undefined)}${tag('vTotTribMun', trib.valorTotalTributosMunicipais !== undefined ? fmt(trib.valorTotalTributosMunicipais) : undefined)}</vTotTrib></totTrib>`
  } else if (trib?.percentualTotalTributosFederais !== undefined || trib?.percentualTotalTributosEstaduais !== undefined || trib?.percentualTotalTributosMunicipais !== undefined) {
    totTribXml = `<totTrib><pTotTrib>${tag('pTotTribFed', fmt(trib.percentualTotalTributosFederais ?? 0))}${tag('pTotTribEst', fmt(trib.percentualTotalTributosEstaduais ?? 0))}${tag('pTotTribMun', fmt(trib.percentualTotalTributosMunicipais ?? 0))}</pTotTrib></totTrib>`
  } else {
    totTribXml = `<totTrib>${tag('indTotTrib', trib?.indicadorTotalTributos ?? 0)}</totTrib>`
  }

  const tribXml = `<trib>${tribMunXml}${tribFedXml}${totTribXml}</trib>`

  return `<valores><vServPrest>${val.vReceb !== undefined ? tag('vReceb', fmt(val.vReceb)) : ''}${tag('vServ', fmt(val.vServico))}</vServPrest>${descXml}${tribXml}</valores>`
}

function buildIbsCbs(ibs: IbsCbsData): string {
  const gi = ibs.valores.trib.gIBSCBS
  const gIbsCbsXml = `<gIBSCBS>${tag('CST', gi.CST)}${tag('cClassTrib', gi.cClassTrib)}${tag('cCredPres', gi.cCredPres)}</gIBSCBS>`
  const tribXml = `<trib>${gIbsCbsXml}</trib>`
  const valoresXml = `<valores>${tribXml}</valores>`
  // Ordem conforme TCRTCInfoIBSCBS no XSD v1.01:
  // finNFSe, indFinal?, cIndOp, tpOper?, gRefNFSe?, tpEnteGov?, indDest, dest?, imovel?, valores
  return `<IBSCBS>${
    tag('finNFSe', ibs.finNFSe)
  }${tag('indFinal', ibs.indFinal)
  }${tag('cIndOp', ibs.cIndOp)
  }${tag('tpOper', ibs.tpOper)
  }${tag('indDest', ibs.indDest)
  }${valoresXml}</IBSCBS>`
}

/**
 * Constrói o XML do DPS (sem assinatura) conforme XSD v1.01.
 * O resultado deve ser assinado pelo XmlSigner antes de ser enviado.
 */
export function buildDpsXml(dps: DpsData): string {
  const inf = dps.infDps
  const versao = dps.versao ?? VERSAO

  // Ordem dos elementos conforme TCInfDPS no XSD v1.01:
  // tpAmb, dhEmi, verAplic, serie, nDPS, dCompet, tpEmit,
  // cMotivoEmisTI?, chNFSeRej?, cLocEmi, subst?, prest, toma?, interm?,
  // serv, valores, IBSCBS, pag?
  return `<?xml version="1.0" encoding="UTF-8"?><DPS xmlns="${NAMESPACE}" versao="${versao}"><infDPS Id="${inf.id}">${
    tag('tpAmb', inf.tipoAmbiente)
  }${tag('dhEmi', inf.dataEmissao)
  }${tag('verAplic', inf.versaoAplicativo ?? '1.01')
  }${tag('serie', inf.serie)
  }${tag('nDPS', inf.numeroDps)
  }${tag('dCompet', inf.dataCompetencia)
  }${tag('tpEmit', inf.tipoEmitente)
  }${inf.motivoEmissao !== undefined ? tag('cMotivoEmisTI', inf.motivoEmissao) : ''
  }${inf.chaveNfseRejeitada ? tag('chNFSeRej', inf.chaveNfseRejeitada) : ''
  }${tag('cLocEmi', inf.codigoLocalEmissao)
  }${buildPrestador(inf.prestador)
  }${inf.tomador ? buildTomador(inf.tomador) : ''
  }${inf.intermediario ? buildIntermediario(inf.intermediario) : ''
  }${buildServico(inf.servico)
  }${buildValores(inf.valores, inf.tributacao)
  }${inf.ibsCbs ? buildIbsCbs(inf.ibsCbs) : ''
  }</infDPS></DPS>`
}
