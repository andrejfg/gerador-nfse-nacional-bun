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

const NAMESPACE = 'http://www.sped.fazenda.gov.br/nfse'
const VERSAO = '1.01'

function fmt(value: number, decimals = 2): string {
  return value.toFixed(decimals)
}

function tag(name: string, value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return ''
  return `<${name}>${value}</${name}>`
}

function buildEndereco(end: EnderecoData): string {
  const endNac = `<endNac>${tag('cMun', end.cMun)}${tag('CEP', end.cep?.replace(/\D/g, ''))}</endNac>`
  return endNac
    + tag('xLgr', end.xLgr)
    + tag('nro', end.nro)
    + tag('xCpl', end.xCpl)
    + tag('xBairro', end.xBairro)
}

function buildPrestador(prest: PrestadorData): string {
  const rt = prest.regimeTributario
  return `<prest>${
    tag('CNPJ', prest.cnpj?.replace(/\D/g, ''))
  }${tag('CPF', prest.cpf?.replace(/\D/g, ''))
  }${tag('NIF', prest.nif)
  }${tag('cNoNIF', prest.codigoNaoNif)
  }${tag('CAEPF', prest.caepf)
  }${tag('IM', prest.inscricaoMunicipal)
  }${tag('xNome', prest.nome)
  }${prest.endereco ? `<end>${buildEndereco(prest.endereco)}</end>` : ''
  }${tag('fone', prest.telefone)
  }${tag('email', prest.email)
  }${rt ? `<regTrib>${tag('opSimpNac', rt.opSimpNac)}${tag('regApurSN', rt.regApurSN)}${tag('regEspTrib', rt.regEspTrib)}</regTrib>` : ''
  }</prest>`
}

function buildTomador(toma: TomadorData): string {
  return `<toma>${
    tag('CNPJ', toma.cnpj?.replace(/\D/g, ''))
  }${tag('CPF', toma.cpf?.replace(/\D/g, ''))
  }${tag('NIF', toma.nif)
  }${tag('cNoNIF', toma.codigoNaoNif)
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
  }${tag('IM', interm.inscricaoMunicipal)
  }${tag('xNome', interm.nome)
  }</interm>`
}

function buildServico(serv: ServicoData): string {
  return `<serv><locPrest>${
    tag('cLocPrestacao', serv.localPrestacao.cLocPrestacao)
  }${tag('cPaisPrestacao', serv.localPrestacao.cPaisPrestacao)
  }</locPrest><cServ>${
    tag('cTribNac', serv.codigoServico.cServTribNac?.replace(/\D/g, ''))
  }${tag('cTribMun', serv.codigoServico.cServMun?.replace(/\D/g, ''))
  }${tag('xDescServ', serv.xDescServ)
  }${tag('cNBS', serv.codigoServico.cNBSPrinc)
  }${tag('cIntContrib', serv.codigoServico.cIntContrib)
  }</cServ>${''
  }${serv.obra ? `<obra>${tag('cObra', serv.obra.cObra)}${tag('inscImobFisc', serv.obra.inscImobFisc)}${tag('art', serv.obra.art)}</obra>` : ''
  }${serv.informacaoComplemento?.xInfComp ? tag('xInfComp', serv.informacaoComplemento.xInfComp) : ''
  }</serv>`
}

function buildValores(val: ValoresServicoData, trib?: TributacaoData): string {
  const issqn = trib?.issqn
  const fed = trib?.federal

  // vDescCondIncond
  const descXml = (val.vDescIncondicionado !== undefined || val.vDescCondicionado !== undefined)
    ? `<vDescCondIncond>${tag('vDescIncond', val.vDescIncondicionado !== undefined ? fmt(val.vDescIncondicionado) : undefined)}${tag('vDescCond', val.vDescCondicionado !== undefined ? fmt(val.vDescCondicionado) : undefined)}</vDescCondIncond>`
    : ''

  // tribMun
  const tribMunXml = issqn ? (() => {
    const exigSuspXml = issqn.tipoSuspensao !== undefined
      ? `<exigSusp>${tag('tpSusp', issqn.tipoSuspensao)}${tag('nProcesso', issqn.numeroProcessoSuspensao)}</exigSusp>`
      : ''
    return `<tribMun>${
      tag('tribISSQN', issqn.tributacaoIssqn)
    }${tag('tpImunidade', issqn.tipoImunidade)
    }${exigSuspXml
    }${tag('tpRetISSQN', issqn.tipoRetencaoIssqn)
    }${issqn.aliquota !== undefined ? tag('pAliq', fmt(issqn.aliquota * 100)) : ''
    }</tribMun>`
  })() : ''

  // tribFed
  const tribFedXml = fed ? (() => {
    const piscofinXml = fed.cstPisCofins
      ? `<piscofins>${tag('CST', fed.cstPisCofins)}${fed.baseCalculoPisCofins !== undefined ? tag('vBCPisCofins', fmt(fed.baseCalculoPisCofins)) : ''}${fed.aliquotaPis !== undefined ? tag('pAliqPis', fmt(fed.aliquotaPis)) : ''}${fed.aliquotaCofins !== undefined ? tag('pAliqCofins', fmt(fed.aliquotaCofins)) : ''}${fed.valorPis !== undefined ? tag('vPis', fmt(fed.valorPis)) : ''}${fed.valorCofins !== undefined ? tag('vCofins', fmt(fed.valorCofins)) : ''}${tag('tpRetPisCofins', fed.tipoRetencaoPisCofins)}</piscofins>`
      : ''
    return `<tribFed>${piscofinXml}${fed.valorRetidoIrrf !== undefined ? tag('vRetIRRF', fmt(fed.valorRetidoIrrf)) : ''}${fed.valorRetidoCsll !== undefined ? tag('vRetCSLL', fmt(fed.valorRetidoCsll)) : ''}</tribFed>`
  })() : ''

  // totTrib (obrigatório dentro de <trib>)
  let totTribXml = ''
  if (trib?.percentualTotalTributosSN !== undefined) {
    totTribXml = `<totTrib>${tag('pTotTribSN', fmt(trib.percentualTotalTributosSN))}</totTrib>`
  } else if (trib?.valorTotalTributosFederais !== undefined || trib?.valorTotalTributosEstaduais !== undefined || trib?.valorTotalTributosMunicipais !== undefined) {
    totTribXml = `<totTrib><vTotTrib>${tag('vTotTribFed', trib.valorTotalTributosFederais !== undefined ? fmt(trib.valorTotalTributosFederais) : undefined)}${tag('vTotTribEst', trib.valorTotalTributosEstaduais !== undefined ? fmt(trib.valorTotalTributosEstaduais) : undefined)}${tag('vTotTribMun', trib.valorTotalTributosMunicipais !== undefined ? fmt(trib.valorTotalTributosMunicipais) : undefined)}</vTotTrib></totTrib>`
  } else if (trib?.percentualTotalTributosFederais !== undefined || trib?.percentualTotalTributosEstaduais !== undefined || trib?.percentualTotalTributosMunicipais !== undefined) {
    totTribXml = `<totTrib><pTotTrib>${tag('pTotTribFed', fmt(trib.percentualTotalTributosFederais ?? 0))}${tag('pTotTribEst', fmt(trib.percentualTotalTributosEstaduais ?? 0))}${tag('pTotTribMun', fmt(trib.percentualTotalTributosMunicipais ?? 0))}</pTotTrib></totTrib>`
  } else if (trib?.indicadorTotalTributos !== undefined) {
    totTribXml = `<totTrib>${tag('indTotTrib', trib.indicadorTotalTributos)}</totTrib>`
  }

  const tribXml = (tribMunXml || tribFedXml || totTribXml)
    ? `<trib>${tribMunXml}${tribFedXml}${totTribXml}</trib>`
    : ''

  return `<valores><vServPrest>${val.vReceb !== undefined ? tag('vReceb', fmt(val.vReceb)) : ''}${tag('vServ', fmt(val.vServico))}</vServPrest>${descXml}${tribXml}</valores>`
}

function buildIbsCbs(ibs: IbsCbsData): string {
  const gi = ibs.valores.trib.gIBSCBS
  const gIbsCbsXml = `<gIBSCBS>${tag('CST', gi.CST)}${tag('cClassTrib', gi.cClassTrib)}${tag('cCredPres', gi.cCredPres)}</gIBSCBS>`
  const tribXml = `<trib>${gIbsCbsXml}</trib>`
  const valoresXml = `<valores>${tribXml}</valores>`
  return `<IBSCBS>${tag('finNFSe', ibs.finNFSe)}${tag('cIndOp', ibs.cIndOp)}${tag('indDest', ibs.indDest)}${tag('indFinal', ibs.indFinal)}${tag('tpOper', ibs.tpOper)}${valoresXml}</IBSCBS>`
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
  }${inf.motivoEmissao !== undefined ? tag('cMotEmisTI', inf.motivoEmissao) : ''
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
