/**
 * DTOs para o sistema NFS-e Nacional
 * Migrado de nfse-php/src/Dto/Nfse/ e direction-nfse-danfe/src/Danfe/Schemas/
 */

import type {
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  TipoRetencaoPisCofins,
  TipoImunidade,
  TipoSuspensao,
  OpcaoSimplesNacional,
  RegimeEspecialTributacao,
  MotivoEmissaoTomadorIntermediario,
  IndicadorTotalTributos,
} from './enums.js'

// ---------------------------------------------------------------------------
// Endereço
// ---------------------------------------------------------------------------
export interface EnderecoData {
  xLgr?: string
  nro?: string
  xCpl?: string
  xBairro?: string
  cMun: string        // Código IBGE do município (7 dígitos)
  uf?: string
  cep?: string
  cPais?: string      // Código do país (1058 = Brasil)
  xMun?: string
}

// ---------------------------------------------------------------------------
// Prestador
// ---------------------------------------------------------------------------
export interface RegimeTributarioData {
  opSimpNac: OpcaoSimplesNacional
  regApurSN?: number
  regEspTrib?: RegimeEspecialTributacao
}

export interface PrestadorData {
  cnpj?: string
  cpf?: string
  nif?: string
  codigoNaoNif?: string
  caepf?: string
  inscricaoMunicipal?: string
  nome?: string
  endereco?: EnderecoData
  telefone?: string
  email?: string
  regimeTributario?: RegimeTributarioData
}

// ---------------------------------------------------------------------------
// Tomador
// ---------------------------------------------------------------------------
export interface TomadorData {
  cnpj?: string
  cpf?: string
  nif?: string
  codigoNaoNif?: string
  inscricaoMunicipal?: string
  nome?: string
  endereco?: EnderecoData
  telefone?: string
  email?: string
}

// ---------------------------------------------------------------------------
// Intermediário
// ---------------------------------------------------------------------------
export interface IntermediarioData {
  cnpj?: string
  cpf?: string
  inscricaoMunicipal?: string
  nome?: string
}

// ---------------------------------------------------------------------------
// Serviço
// ---------------------------------------------------------------------------
export interface LocalPrestacaoData {
  cLocPrestacao: string
  cPaisPrestacao?: string
}

export interface CodigoServicoData {
  cServTribNac: string
  cServMun?: string
  cNBSPrinc?: string
  cIntContrib?: string
}

export interface InformacaoComplementarData {
  xInfComp?: string
}

export interface ObraData {
  cObra?: string
  inscImobFisc?: string
  art?: string
}

export interface ServicoData {
  localPrestacao: LocalPrestacaoData
  codigoServico: CodigoServicoData
  xDescServ: string
  obra?: ObraData
  informacaoComplemento?: InformacaoComplementarData
}

// ---------------------------------------------------------------------------
// Tributação e valores
// ---------------------------------------------------------------------------
export interface IssqnData {
  tributacaoIssqn?: TributacaoIssqn
  tipoImunidade?: TipoImunidade
  tipoSuspensao?: TipoSuspensao
  numeroProcessoSuspensao?: string
  tipoRetencaoIssqn?: TipoRetencaoIssqn
  aliquota?: number               // Ex: 0.05 = 5%
  exigibilidadeISS?: number
  cMunFG?: string
}

export interface ValoresServicoData {
  vServico: number
  vDescCondicionado?: number
  vDescIncondicionado?: number
  vBC?: number
  vISSQN?: number
  vLiq?: number
  pAliq?: number
  vTotalRet?: number
}

export interface TributacaoFederalData {
  valorRetidoIrrf?: number
  valorRetidoCsll?: number
  cstPisCofins?: string
  baseCalculoPisCofins?: number
  aliquotaPis?: number
  aliquotaCofins?: number
  valorPis?: number
  valorCofins?: number
  tipoRetencaoPisCofins?: TipoRetencaoPisCofins
}

export interface TributacaoData {
  issqn?: IssqnData
  federal?: TributacaoFederalData
  percentualTotalTributosSN?: number
  valorTotalTributosFederais?: number
  valorTotalTributosEstaduais?: number
  valorTotalTributosMunicipais?: number
  indicadorTotalTributos?: IndicadorTotalTributos
}

// ---------------------------------------------------------------------------
// DPS
// ---------------------------------------------------------------------------
export interface InfDpsData {
  id: string
  tipoAmbiente: TipoAmbiente
  dataEmissao: string             // ISO 8601
  versaoAplicativo?: string
  serie?: string
  numeroDps: string
  dataCompetencia: string         // YYYY-MM
  tipoEmitente: EmitenteDPS
  codigoLocalEmissao: string
  motivoEmissao?: MotivoEmissaoTomadorIntermediario
  chaveNfseRejeitada?: string
  prestador: PrestadorData
  tomador?: TomadorData
  intermediario?: IntermediarioData
  servico: ServicoData
  valores: ValoresServicoData
  tributacao?: TributacaoData
}

export interface DpsData {
  versao?: string
  infDps: InfDpsData
}

// ---------------------------------------------------------------------------
// NFS-e
// ---------------------------------------------------------------------------
export interface InfNfseData {
  id?: string
  cStat?: string
  xMotivo?: string
  chNFSe?: string
  nNFSe?: string
  dhProc?: string
  xLocEmi?: string
  xLocPrestacao?: string
  nNfse?: string
  cLocIncid?: string
  xTribNac?: string
  xTribMun?: string
  verAplic?: string
  ambGer?: number
  tpEmis?: number
  procEmi?: number
  cRegTrib?: string
  xRegTrib?: string
  nfseXmlGZipB64?: string
}

export interface NfseData {
  infNfse?: InfNfseData
  originalXml?: string
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------
export interface EmissaoNfseResponse {
  cStat: string
  xMotivo: string
  nfse?: NfseData
  dps?: DpsData
  nfseXmlGZipB64?: string
}

export interface ConsultaNfseResponse {
  cStat: string
  xMotivo: string
  nfse?: NfseData
}

export interface ConsultaDpsResponse {
  cStat: string
  xMotivo: string
  situacao?: string
}

export interface RegistroEventoResponse {
  cStat: string
  xMotivo: string
  xml?: string
}

// ---------------------------------------------------------------------------
// Evento (cancelamento, etc.)
// ---------------------------------------------------------------------------
export interface PedRegEventoData {
  chNFSe: string
  tipoEvento: number              // Ex: 101101 = Cancelamento
  numSeqEvento?: number
  dhEvento?: string
  descricao: string
  motivo?: string
  motivoDescricao?: string
}
