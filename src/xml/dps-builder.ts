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
} from '../types/dtos.js'

const NAMESPACE = 'http://www.sped.fazenda.gov.br/nfse'
const VERSAO = '1.00'

function fmt(value: number, decimals = 2): string {
  return value.toFixed(decimals)
}

function tag(name: string, value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return ''
  return `<${name}>${value}</${name}>`
}

function buildEndereco(end: EnderecoData): string {
  return [
    tag('xLgr', end.xLgr),
    tag('nro', end.nro),
    tag('xCpl', end.xCpl),
    tag('xBairro', end.xBairro),
    tag('cMun', end.cMun),
    tag('UF', end.uf),
    tag('CEP', end.cep?.replace(/\D/g, '')),
    tag('cPais', end.cPais ?? '1058'),
  ].join('')
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
  }${prest.endereco ? `<endNac>${buildEndereco(prest.endereco)}</endNac>` : ''
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
  }${toma.endereco ? `<endNac>${buildEndereco(toma.endereco)}</endNac>` : ''
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
    tag('cServTribNac', serv.codigoServico.cServTribNac)
  }${tag('cServMun', serv.codigoServico.cServMun)
  }${tag('cNBSPrinc', serv.codigoServico.cNBSPrinc)
  }${tag('cIntContrib', serv.codigoServico.cIntContrib)
  }</cServ>${tag('xDescServ', serv.xDescServ)
  }${serv.obra ? `<obra>${tag('cObra', serv.obra.cObra)}${tag('inscImobFisc', serv.obra.inscImobFisc)}${tag('art', serv.obra.art)}</obra>` : ''
  }${serv.informacaoComplemento?.xInfComp ? tag('xInfComp', serv.informacaoComplemento.xInfComp) : ''
  }</serv>`
}

function buildValores(val: ValoresServicoData, trib?: TributacaoData): string {
  const issqn = trib?.issqn
  const fed = trib?.federal
  return `<valores>${
    tag('vServico', fmt(val.vServico))
  }${val.vDescCondicionado !== undefined ? tag('vDescCondicionado', fmt(val.vDescCondicionado)) : ''
  }${val.vDescIncondicionado !== undefined ? tag('vDescIncondicionado', fmt(val.vDescIncondicionado)) : ''
  }${val.vBC !== undefined ? tag('vBC', fmt(val.vBC)) : ''
  }${issqn ? `${tag('tribMun', issqn.tributacaoIssqn)}${tag('cMunFG', issqn.cMunFG)}${issqn.aliquota !== undefined ? tag('pAliq', fmt(issqn.aliquota * 100)) : ''}${val.vISSQN !== undefined ? tag('vISSQN', fmt(val.vISSQN)) : ''}${tag('tpRetISSQN', issqn.tipoRetencaoIssqn)}${val.vTotalRet !== undefined ? tag('vTotalRet', fmt(val.vTotalRet)) : ''}${tag('exigISSQN', issqn.exigibilidadeISS)}${tag('tpImun', issqn.tipoImunidade)}${tag('tpSusp', issqn.tipoSuspensao)}` : ''
  }${fed ? `${fed.valorRetidoIrrf !== undefined ? tag('vRetIRRF', fmt(fed.valorRetidoIrrf)) : ''}${fed.valorRetidoCsll !== undefined ? tag('vRetCSLL', fmt(fed.valorRetidoCsll)) : ''}${tag('CSTPC', fed.cstPisCofins)}${fed.baseCalculoPisCofins !== undefined ? tag('vBCPisCofins', fmt(fed.baseCalculoPisCofins)) : ''}${fed.aliquotaPis !== undefined ? tag('pAliqPis', fmt(fed.aliquotaPis)) : ''}${fed.aliquotaCofins !== undefined ? tag('pAliqCofins', fmt(fed.aliquotaCofins)) : ''}${fed.valorPis !== undefined ? tag('vPis', fmt(fed.valorPis)) : ''}${fed.valorCofins !== undefined ? tag('vCofins', fmt(fed.valorCofins)) : ''}` : ''
  }${trib?.percentualTotalTributosSN !== undefined ? tag('pTotTribSN', fmt(trib.percentualTotalTributosSN)) : ''
  }${trib?.valorTotalTributosFederais !== undefined ? tag('vTotTribFed', fmt(trib.valorTotalTributosFederais)) : ''
  }${trib?.valorTotalTributosEstaduais !== undefined ? tag('vTotTribEst', fmt(trib.valorTotalTributosEstaduais)) : ''
  }${trib?.valorTotalTributosMunicipais !== undefined ? tag('vTotTribMun', fmt(trib.valorTotalTributosMunicipais)) : ''
  }${trib?.indicadorTotalTributos !== undefined ? tag('indTotTrib', trib.indicadorTotalTributos) : ''
  }</valores>`
}

/**
 * Constrói o XML do DPS (sem assinatura).
 * O resultado deve ser assinado pelo XmlSigner antes de ser enviado.
 */
export function buildDpsXml(dps: DpsData): string {
  const inf = dps.infDps
  const versao = dps.versao ?? VERSAO

  return `<?xml version="1.0" encoding="UTF-8"?><DPS xmlns="${NAMESPACE}" versao="${versao}"><infDPS Id="${inf.id}">${
    tag('tpAmb', inf.tipoAmbiente)
  }${tag('dhEmi', inf.dataEmissao)
  }${tag('verAplic', inf.versaoAplicativo ?? '1.00')
  }${tag('serie', inf.serie)
  }${tag('nDPS', inf.numeroDps)
  }${tag('dCompet', inf.dataCompetencia)
  }${tag('tpEmit', inf.tipoEmitente)
  }${tag('cLocEmi', inf.codigoLocalEmissao)
  }${inf.motivoEmissao !== undefined ? tag('cMotEmisTI', inf.motivoEmissao) : ''
  }${inf.chaveNfseRejeitada ? tag('chNFSeRej', inf.chaveNfseRejeitada) : ''
  }${buildPrestador(inf.prestador)
  }${inf.tomador ? buildTomador(inf.tomador) : ''
  }${inf.intermediario ? buildIntermediario(inf.intermediario) : ''
  }${buildServico(inf.servico)
  }${buildValores(inf.valores, inf.tributacao)
  }</infDPS></DPS>`
}
