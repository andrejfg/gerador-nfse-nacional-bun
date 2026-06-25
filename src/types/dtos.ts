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
  TipoEvento,
  MotivoEventoCancelamento,
} from './enums.js'

// ---------------------------------------------------------------------------
// Endereço
// ---------------------------------------------------------------------------

/**
 * Endereço no exterior (elemento `endExt` no XML, dentro de `<end>`).
 * Usado quando o prestador, tomador ou intermediário não tem endereço nacional.
 * Mutuamente exclusivo com `cMun` (XSD TCEndereco: choice entre `endNac` e `endExt`).
 */
export interface EnderecoExteriorData {
  /**
   * Código do país conforme tabela de países do exterior da NFS-e (`cPais`).
   * Ex.: `SA` (Arábia Saudita), `US` (Estados Unidos), `PT` (Portugal).
   */
  cPais: string
  /** Código de endereçamento postal estrangeiro (`cEndPost`). Ex.: `13332-7663`. */
  cEndPost?: string
  /** Nome da cidade no exterior (`xCidade`). Ex.: `RIYADH`. */
  xCidade: string
  /** Estado, província ou região no exterior (`xEstProvReg`). Ex.: `ARABIA SAUDITA`. */
  xEstProvReg?: string
}

/**
 * Endereço do prestador, tomador ou intermediário (elemento `end`/`enderNac` no XML).
 *
 * Por padrão representa um endereço **nacional** (`endNac`, com `cMun`). Para
 * endereços no **exterior**, preencha `exterior` (`endExt`) e omita `cMun` — os
 * dois são mutuamente exclusivos conforme o XSD (TCEndereco: choice endNac|endExt).
 */
export interface EnderecoData {
  /** Logradouro — nome da rua, avenida, travessa etc. (`xLgr`). */
  xLgr?: string
  /** Número do imóvel (`nro`). */
  nro?: string
  /** Complemento do endereço (`xCpl`). */
  xCpl?: string
  /** Nome do bairro (`xBairro`). */
  xBairro?: string
  /**
   * Código IBGE do município com 7 dígitos (`cMun`). Ex.: `3106200` para Belo Horizonte/MG.
   * Obrigatório para endereço nacional; omita quando `exterior` for informado.
   */
  cMun?: string
  /** Sigla da UF. Ex.: `MG`. */
  uf?: string
  /** CEP com 8 dígitos, sem hífen (`CEP`). Ex.: `30100000`. */
  cep?: string
  /** Código do país conforme tabela BACEN (`cPais`). Padrão: `1058` (Brasil). */
  cPais?: string
  /** Nome do município por extenso (`xMun`). */
  xMun?: string
  /**
   * Endereço no exterior (`endExt`). Quando informado, o builder emite `<endExt>`
   * no lugar de `<endNac>` e `cMun` deve ser omitido.
   */
  exterior?: EnderecoExteriorData
}

// ---------------------------------------------------------------------------
// Prestador
// ---------------------------------------------------------------------------

/**
 * Regime tributário do prestador (`regTrib` no XML).
 * Obrigatório quando o prestador é optante do Simples Nacional.
 */
export interface RegimeTributarioData {
  /** Opção pelo Simples Nacional (`opSimpNac`): `1` = Não optante, `2` = Optante. */
  opSimpNac: OpcaoSimplesNacional
  /** Regime de apuração no Simples Nacional (XML: `regApTribSN`): `1` = Competência, `2` = Caixa. */
  regApurSN?: number
  /** Regime especial de tributação municipal (`regEspTrib`). */
  regEspTrib?: RegimeEspecialTributacao
}

/**
 * Identificação e dados do prestador de serviços (`prest` no XML do DPS).
 * Deve conter pelo menos um dos identificadores: `cnpj`, `cpf` ou `nif`.
 */
export interface PrestadorData {
  /** CNPJ do prestador, somente dígitos, 14 caracteres. */
  cnpj?: string
  /** CPF do prestador, somente dígitos, 11 caracteres. */
  cpf?: string
  /** NIF — Número de Identificação Fiscal para prestador estrangeiro. */
  nif?: string
  /** Código para prestador estrangeiro sem NIF (`cNaoNIF`). Ex.: `1` = Dispensado de NIF. */
  codigoNaoNif?: string
  /** CAEPF — Cadastro de Atividade Econômica da Pessoa Física (`CAEPF`), 14 dígitos. */
  caepf?: string
  /** Inscrição Municipal do prestador no município (`IM`). */
  inscricaoMunicipal?: string
  /** Razão social ou nome do prestador (`xNome`). */
  nome?: string
  /** Endereço do prestador (`enderNac`). */
  endereco?: EnderecoData
  /** Telefone de contato somente dígitos (`fone`). */
  telefone?: string
  /** E-mail de contato (`email`). */
  email?: string
  /** Regime tributário do prestador (`regTrib`). */
  regimeTributario?: RegimeTributarioData
}

// ---------------------------------------------------------------------------
// Tomador
// ---------------------------------------------------------------------------

/**
 * Identificação e dados do tomador de serviços (`toma` no XML do DPS).
 * Quando o serviço for isento, imune ou exportação, o preenchimento do tomador
 * pode ser dispensado conforme regras da Receita Federal e do município.
 */
export interface TomadorData {
  /** CNPJ do tomador, somente dígitos, 14 caracteres. */
  cnpj?: string
  /** CPF do tomador, somente dígitos, 11 caracteres. */
  cpf?: string
  /** NIF — Número de Identificação Fiscal para tomador estrangeiro. */
  nif?: string
  /** Código para tomador estrangeiro sem NIF (`cNaoNIF`). */
  codigoNaoNif?: string
  /** Inscrição Municipal do tomador (`IM`). */
  inscricaoMunicipal?: string
  /** Razão social ou nome do tomador (`xNome`). Obrigatório pelo XSD (TCInfoPessoa). */
  nome: string
  /** Endereço do tomador (`enderNac`). */
  endereco?: EnderecoData
  /** Telefone somente dígitos (`fone`). */
  telefone?: string
  /** E-mail de contato (`email`). */
  email?: string
}

// ---------------------------------------------------------------------------
// Intermediário
// ---------------------------------------------------------------------------

/**
 * Intermediário do serviço (`interm` no XML do DPS).
 * Pessoa que intermedeia a prestação de serviços entre prestador e tomador.
 * Preenchido quando `tipoEmitente` for `Intermediario` ou quando houver
 * retenção de ISSQN pelo intermediário.
 */
export interface IntermediarioData {
  /** CNPJ do intermediário, somente dígitos, 14 caracteres. */
  cnpj?: string
  /** CPF do intermediário, somente dígitos, 11 caracteres. */
  cpf?: string
  /** Inscrição Municipal do intermediário (`IM`). */
  inscricaoMunicipal?: string
  /** Razão social ou nome do intermediário (`xNome`). Obrigatório pelo XSD (TCInfoPessoa). */
  nome: string
}

// ---------------------------------------------------------------------------
// Serviço
// ---------------------------------------------------------------------------

/**
 * Local de prestação do serviço (`locPrest` no XML).
 * Define o município onde o serviço foi executado, determinando qual
 * ente tributante é competente para cobrar o ISSQN.
 */
export interface LocalPrestacaoData {
  /**
   * Código IBGE do município de prestação com 7 dígitos (`cLocPrestacao`).
   * Determina o município competente para tributar o ISSQN.
   * Ex.: `3106200` (Belo Horizonte/MG), `3550308` (São Paulo/SP).
   */
  cLocPrestacao: string
  /**
   * Código do país de prestação conforme tabela BACEN (`cPaisPrestacao`).
   * Informar somente quando o serviço for prestado no exterior.
   * Padrão: `1058` (Brasil).
   */
  cPaisPrestacao?: string
}

/**
 * Classificação fiscal do serviço (`cServ` no XML).
 * O código de serviço nacional (`cServTribNac`) é definido pela Receita Federal
 * na tabela de serviços da NFS-e Nacional e segue o padrão `XXXXXXXXX`.
 */
export interface CodigoServicoData {
  /**
   * Código de serviço da tributação nacional (`cServTribNac`), formato `XXXXXXXXX`.
   * Tabela: https://www.gov.br/nfse/pt-br/mei-e-demais-empresas/codigos-de-tributacao-nacional-nbs
   * Ex.: `010100163` = Desenvolvimento e licenciamento de programas de computador.
   */
  cServTribNac: string
  /**
   * Código de tributação municipal (`cServMun` → `cTribMun`).
   * Conforme XSD v1.01 (TCCodTribMun): exatamente **3 dígitos numéricos**.
   * Obtido via `ConsultarDadosCadastrais` → `Atividades[].cTribMun`.
   * Ex.: `'109'`, `'142'`.
   */
  cServMun?: string
  /**
   * Código NBS principal (`cNBSPrinc`) — Nomenclatura Brasileira de Serviços.
   * Formato: `X.XXXX.XX.XX`. Tabela NBS disponível em portais do MDIC.
   */
  cNBSPrinc?: string
  /** Código interno do contribuinte para o serviço (`cIntContrib`). Uso facultativo. */
  cIntContrib?: string
}

/** Informações complementares do serviço prestado. */
export interface InformacaoComplementarData {
  /** Identificador de Documento de Responsabilidade Técnica: ART, RRT, DRT (`idDocTec`). */
  idDocTec?: string
  /** Número de documento de referência emitido pelo prestador (`docRef`). */
  docRef?: string
  /** Número do pedido/ordem de compra/ordem de serviço (`xPed`). */
  xPed?: string
  /** Descrição complementar livre (`xInfComp`), até 2.000 caracteres. */
  xInfComp?: string
}

/**
 * Dados de obra de construção civil (`obra` no XML).
 * Obrigatório para serviços de construção civil com código de serviço que exija ART.
 * Para informar o número da ART/RRT/DRT, use `informacaoComplemento.idDocTec`.
 */
export interface ObraData {
  /** Inscrição imobiliária fiscal do imóvel (`inscImobFisc`). */
  inscImobFisc?: string
  /** Código da obra (`cObra`), conforme cadastro municipal (CNO ou CEI). */
  cObra?: string
}

/**
 * Comércio exterior do serviço (`comExt` no XML, dentro de `<serv>`).
 * Preenchido quando o serviço envolve operação de comércio exterior — tipicamente
 * exportação/importação de serviços, com tomador ou prestador no exterior.
 * Ref XSD: `TCInfoComExt`.
 */
export interface ComercioExteriorData {
  /**
   * Modo de prestação do serviço no comércio exterior (`mdPrestacao`).
   * Ex.: `1` = Transfronteiriço.
   */
  mdPrestacao: string
  /** Vínculo entre as partes da prestação (`vincPrest`). Ex.: `0` = Sem vínculo. */
  vincPrest: string
  /** Código da moeda da transação (`tpMoeda`), conforme tabela ISO 4217 numérica. */
  tpMoeda: string
  /** Valor do serviço na moeda estrangeira informada em `tpMoeda` (`vServMoeda`). */
  vServMoeda: number
  /** Mecanismo de apoio/fomento ao comércio exterior do prestador (`mecAFComexP`). */
  mecAFComexP?: string
  /** Mecanismo de apoio/fomento ao comércio exterior do tomador (`mecAFComexT`). */
  mecAFComexT?: string
  /** Movimentação temporária de bens (`movTempBens`). Ex.: `1` = Não. */
  movTempBens?: string
  /** Número do Registro de Operações Financeiras / declaração MDIC (`mdic`). */
  mdic?: string
}

/**
 * Dados do serviço prestado (`serv` no XML do DPS).
 * Agrupa localização, classificação fiscal e descrição do serviço.
 */
export interface ServicoData {
  /** Local onde o serviço foi executado — define o município competente para o ISSQN. */
  localPrestacao: LocalPrestacaoData
  /** Classificação fiscal: código nacional, municipal e NBS. */
  codigoServico: CodigoServicoData
  /**
   * Descrição do serviço prestado (`xDescServ`), até 2.000 caracteres.
   * Deve descrever de forma clara e objetiva a natureza do serviço.
   */
  xDescServ: string
  /**
   * Comércio exterior (`comExt`) — informar quando o serviço envolve operação
   * internacional (tomador/prestador no exterior).
   */
  comercioExterior?: ComercioExteriorData
  /** Dados de obra de construção civil, quando aplicável. */
  obra?: ObraData
  /** Informações complementares ao serviço. */
  informacaoComplemento?: InformacaoComplementarData
}

// ---------------------------------------------------------------------------
// Tributação e valores
// ---------------------------------------------------------------------------

/**
 * Tributação do ISSQN — Imposto Sobre Serviços de Qualquer Natureza (`tribISSQN` no XML).
 * Define a situação tributária do serviço e os parâmetros para cálculo do imposto.
 */
export interface IssqnData {
  /**
   * Situação tributária do ISSQN (`tribISSQN`), conforme XSD `TSTribISSQN` v1.01:
   * `1` Operação tributável, `2` Imunidade,
   * `3` Exportação de serviço, `4` Não Incidência.
   * Não existe valor para "isento": a isenção coloquial de ISS é modelada
   * como Imunidade (`2`) + `tipoImunidade`.
   */
  tributacaoIssqn?: TributacaoIssqn
  /** Tipo de imunidade do ISSQN (`tpImunidade`), obrigatório quando `tributacaoIssqn = 2` (Imunidade). */
  tipoImunidade?: TipoImunidade
  /** Tipo de suspensão da exigibilidade do ISSQN (`tpSuspensao`). */
  tipoSuspensao?: TipoSuspensao
  /** Número do processo judicial ou administrativo de suspensão (`nProcessoSuspensao`). */
  numeroProcessoSuspensao?: string
  /**
   * Responsável pela retenção do ISSQN (`tpRetISSQN`):
   * `1` Não retido, `2` Retido pelo tomador, `3` Retido pelo intermediário.
   */
  tipoRetencaoIssqn?: TipoRetencaoIssqn
  /**
   * Alíquota do ISSQN como decimal (`pAliq`). Ex.: `0.05` = 5%.
   * Mínimo legal: 2% (LC 116/2003, art. 8º, § 1º).
   * Máximo legal: 5% (LC 116/2003, art. 8º, § 1º).
   */
  aliquota?: number
  /** Exigibilidade do ISS conforme LC 116/2003 (`exigISSQN`). */
  exigibilidadeISS?: number
  /**
   * Código IBGE do município do fato gerador do ISSQN (`cMunFG`), 7 dígitos.
   * Preenchido quando diferente do município de prestação.
   */
  cMunFG?: string
}

/**
 * Valores monetários do serviço e do ISSQN (`valores` no XML do DPS).
 * Todos os valores devem ser informados em reais (BRL) com até 2 casas decimais.
 */
export interface ValoresServicoData {
  /** Valor bruto total do serviço prestado (`vServico`). */
  vServico: number
  /**
   * Valor recebido pelo **intermediário** do serviço (`vReceb`).
   * Só deve ser informado quando `tipoEmitente = 3` (Intermediário).
   * Proibido para prestador (1) e tomador (2) — erro E0424 da API.
   */
  vReceb?: number
  /** Valor do desconto condicionado (`vDescCondicionado`). */
  vDescCondicionado?: number
  /** Valor do desconto incondicionado (`vDescIncondicionado`). */
  vDescIncondicionado?: number
  /** Base de cálculo do ISSQN (`vBC`). Normalmente igual a `vServico` menos deduções. */
  vBC?: number
  /** Valor do ISSQN calculado (`vISSQN`). Resultado de `vBC × pAliq`. */
  vISSQN?: number
  /** Valor líquido do serviço após deduções e retenções (`vLiq`). */
  vLiq?: number
  /** Percentual de alíquota do ISSQN aplicada (`pAliq`), em decimal. Ex.: `0.05`. */
  pAliq?: number
  /** Valor total das retenções (ISSQN + federais) (`vTotalRet`). */
  vTotalRet?: number
}

/**
 * Retenções de tributos federais sobre o serviço (`tribFed` no XML).
 * Aplicável quando o tomador é obrigado a reter na fonte: IRRF, CSLL, PIS, COFINS.
 */
export interface TributacaoFederalData {
  /** Valor retido da CP — Contribuição Previdenciária (`vRetCP`). */
  valorRetidoCp?: number
  /** Valor retido do IRRF — Imposto de Renda Retido na Fonte (`vRetIRRF`). */
  valorRetidoIrrf?: number
  /** Valor retido da CSLL — Contribuição Social sobre o Lucro Líquido (`vRetCSLL`). */
  valorRetidoCsll?: number
  /** CST — Código de Situação Tributária do PIS/COFINS (`cstPisCofins`). */
  cstPisCofins?: string
  /** Base de cálculo do PIS e COFINS (`vBCPisCofins`). */
  baseCalculoPisCofins?: number
  /** Alíquota do PIS em decimal (`pAliqPis`). Ex.: `0.0065` = 0,65%. */
  aliquotaPis?: number
  /** Alíquota do COFINS em decimal (`pAliqCofins`). Ex.: `0.03` = 3%. */
  aliquotaCofins?: number
  /** Valor do PIS calculado (`vPis`). */
  valorPis?: number
  /** Valor do COFINS calculado (`vCofins`). */
  valorCofins?: number
  /** Indica se o PIS/COFINS é retido na fonte pelo tomador. */
  tipoRetencaoPisCofins?: TipoRetencaoPisCofins
}

/**
 * Tributação completa do DPS — ISSQN e tributos federais (`trib` no XML).
 * Agrupa todas as informações fiscais necessárias para emissão da NFS-e.
 */
export interface TributacaoData {
  /** Tributação do ISSQN (imposto municipal sobre serviços). */
  issqn?: IssqnData
  /** Retenções de tributos federais (IRRF, CSLL, PIS, COFINS). */
  federal?: TributacaoFederalData
  /**
   * Percentual total de tributos para contribuintes do Simples Nacional (`pTotTribSN`).
   * Conforme faixa de receita bruta da tabela do Simples.
   */
  percentualTotalTributosSN?: number
  /** Valor total dos tributos federais incidentes sobre o serviço (`vTotTribFed`). */
  valorTotalTributosFederais?: number
  /** Valor total dos tributos estaduais incidentes sobre o serviço (`vTotTribEst`). */
  valorTotalTributosEstaduais?: number
  /** Valor total dos tributos municipais, inclui ISSQN (`vTotTribMun`). */
  valorTotalTributosMunicipais?: number
  /**
   * Percentual total aproximado dos tributos federais (`pTotTribFed`).
   * Usar para Não Optante quando município está ativo no SNNFSe (E0713).
   * Ex.: `11.33` para 11,33%.
   */
  percentualTotalTributosFederais?: number
  /**
   * Percentual total aproximado dos tributos estaduais (`pTotTribEst`).
   * Ex.: `0.00`.
   */
  percentualTotalTributosEstaduais?: number
  /**
   * Percentual total aproximado dos tributos municipais (`pTotTribMun`).
   * Ex.: `2.00` para 2%.
   */
  percentualTotalTributosMunicipais?: number
  /**
   * Indica se o valor total de tributos foi informado (`indTotTrib`).
   * **Proibido para Não Optante (opSimpNac=1)** — use percentual* ou valorTotal* — E0713.
   */
  indicadorTotalTributos?: IndicadorTotalTributos
}

// ---------------------------------------------------------------------------
// IBS/CBS (v1.01 — Reforma Tributária)
// ---------------------------------------------------------------------------

/**
 * Classificação tributária IBS/CBS (`gIBSCBS` no XML).
 * Ref XSD: `TCRTCInfoTributosSitClas`
 */
export interface IbsCbsGIbsCbsData {
  /** CST — Código de Situação Tributária IBS/CBS (3 dígitos, ex: `"000"` = tributação plena). */
  CST: string
  /** cClassTrib — Código de Classificação Tributária (6 dígitos). */
  cClassTrib: string
  /** cCredPres — Código de Crédito Presumido (opcional). */
  cCredPres?: string
}

/**
 * Valores tributários IBS/CBS.
 * Ref XSD: `TCRTCInfoValoresIBSCBS`
 */
export interface IbsCbsValoresData {
  trib: {
    gIBSCBS: IbsCbsGIbsCbsData
  }
}

/**
 * Grupo IBS/CBS — **obrigatório** na DPS versão 1.01 (Reforma Tributária).
 * Ref XSD: `TCRTCInfoIBSCBS`
 *
 * @example
 * ```ts
 * ibsCbs: {
 *   finNFSe: '0',
 *   cIndOp: '100000', // consultar tabela oficial
 *   indDest: '0',
 *   valores: { trib: { gIBSCBS: { CST: '000', cClassTrib: '010100' } } },
 * }
 * ```
 */
export interface IbsCbsData {
  /** finNFSe — Finalidade da emissão: `'0'` = NFS-e regular. */
  finNFSe: '0'
  /**
   * cIndOp — Código indicador da operação de fornecimento (6 dígitos).
   * Consulte a tabela "código indicador de operação" do Manual NFS-e Nacional.
   */
  cIndOp: string
  /**
   * indDest — Indicador de destinatário:
   * `'0'` = destinatário é o próprio tomador,
   * `'1'` = destinatário é diferente do tomador.
   */
  indDest: '0' | '1'
  /** indFinal — Operação de uso/consumo pessoal (art. 57): `'0'` = Não, `'1'` = Sim. */
  indFinal?: '0' | '1'
  /**
   * tpOper — Tipo de operação com entes governamentais:
   * `'1'` Fornecimento com pagamento posterior,
   * `'2'` Recebimento do pagamento com fornecimento já realizado,
   * `'3'` Fornecimento com pagamento já realizado,
   * `'4'` Recebimento do pagamento com fornecimento posterior,
   * `'5'` Fornecimento e recebimento concomitantes.
   */
  tpOper?: '1' | '2' | '3' | '4' | '5'
  /** valores — Informações de tributação IBS/CBS para o serviço. */
  valores: IbsCbsValoresData
}

// ---------------------------------------------------------------------------
// DPS
// ---------------------------------------------------------------------------

/**
 * Informações do Documento Preliminar de Serviço (`infDPS` no XML).
 *
 * O DPS é o documento eletrônico estruturado emitido pelo contribuinte contendo
 * todas as informações necessárias para a geração da NFS-e pelo sistema SEFIN Nacional.
 *
 * **Referência:** API SEFIN Nacional — elemento `infDPS`
 * https://sefin.nfse.gov.br/SefinNacional/docs/index
 */
export interface InfDpsData {
  /**
   * Identificador único do DPS (`Id`), atributo XML.
   * Gerado pela função `generateDpsId()` no formato:
   * `DPS` + CodMun(7) + TipoInscrição(1) + CNPJ/CPF(14) + Série(5) + Número(15) = 45 chars.
   */
  id: string
  /**
   * Ambiente de destino (`tpAmb`):
   * `1` = Produção (SEFIN Nacional),
   * `2` = Homologação (ambiente de testes).
   */
  tipoAmbiente: TipoAmbiente
  /**
   * Data e hora de emissão do DPS no formato ISO 8601 com offset BRT (`dhEmi`).
   * Ex.: `2024-03-15T12:00:00-03:00`. Use `formatDhEmissao()` para gerar.
   */
  dataEmissao: string
  /** Identificação da versão do aplicativo emissor (`verAplic`). Uso facultativo. */
  versaoAplicativo?: string
  /**
   * Série do DPS (`serie`), até 5 caracteres alfanuméricos.
   * Padrão recomendado: `001`. Permite segregar emissões por estabelecimento ou sistema.
   */
  serie?: string
  /**
   * Número sequencial do DPS (`nDPS`), até 15 dígitos.
   * Deve ser único por série e CNPJ/CPF do prestador.
   * Use `generateNumDps()` para geração automática.
   */
  numeroDps: string
  /**
   * Competência tributária do serviço no formato `YYYY-MM-DD` (`dCompet`).
   * Define o mês/ano de referência para apuração e recolhimento do ISSQN.
   * Ex.: `2024-03` para serviços prestados em março de 2024.
   */
  dataCompetencia: string
  /**
   * Tipo do emitente do DPS (`tpEmit`):
   * `1` = Prestador (padrão), `2` = Tomador,
   * `3` = Intermediário, `4` = Não aplicável.
   * Tomador e intermediário só emitem em casos previstos na legislação.
   */
  tipoEmitente: EmitenteDPS
  /**
   * Código IBGE do município onde o DPS foi emitido, 7 dígitos (`cLocEmi`).
   * Corresponde ao município do domicílio fiscal do emitente.
   */
  codigoLocalEmissao: string
  /**
   * Motivo da emissão pelo tomador ou intermediário (`motEmissao`).
   * Informar quando `tipoEmitente ≠ Prestador` (força maior, determinação legal, etc.).
   */
  motivoEmissao?: MotivoEmissaoTomadorIntermediario
  /**
   * Chave de acesso da NFS-e rejeitada que originou esta reemissão (`chNFSeRej`).
   * Usar apenas em casos de substituição por rejeição da NFS-e anterior.
   */
  chaveNfseRejeitada?: string
  /** Dados do prestador de serviços (`prest`). */
  prestador: PrestadorData
  /** Dados do tomador de serviços (`toma`). Obrigatório na maioria dos casos. */
  tomador?: TomadorData
  /** Dados do intermediário, quando houver (`interm`). */
  intermediario?: IntermediarioData
  /** Dados do serviço prestado (`serv`). */
  servico: ServicoData
  /** Valores monetários do serviço e do ISSQN (`valores`). */
  valores: ValoresServicoData
  /** Tributação completa — ISSQN e tributos federais (`trib`). */
  tributacao?: TributacaoData
  /**
   * Grupo IBS/CBS — **opcional** durante o período de transição da Reforma Tributária.
   * O Comitê Gestor do IBS dispensou penalidades pelo não preenchimento enquanto
   * os regulamentos do IBS/CBS não forem publicados. Omita para replicar o comportamento
   * do EmissorWeb (que não inclui o bloco). Quando informado, use `finNFSe: '0'`,
   * `cIndOp` (6 dígitos — consulte Anexo VII), `indDest` e `valores.trib.gIBSCBS`.
   */
  ibsCbs?: IbsCbsData
}

/**
 * Documento Preliminar de Serviço — DPS.
 *
 * Estrutura raiz do documento eletrônico enviado à API SEFIN Nacional para
 * geração da NFS-e. Após autorização, o sistema retorna a NFS-e assinada
 * com chave de acesso de 43 dígitos.
 *
 * **Fluxo:** DPS (emitente) → SEFIN Nacional → NFS-e (autorizada)
 *
 * **Referência:** API SEFIN Nacional (Swagger)
 * Produção: https://sefin.nfse.gov.br/SefinNacional/docs/index
 * Homologação: https://sefin.producaorestrita.nfse.gov.br/API/SefinNacional/docs/index
 *
 * @example
 * ```ts
 * const dps: DpsData = {
 *   infDps: {
 *     id: generateDpsId(cnpj, codIbge, '001', '1'),
 *     tipoAmbiente: TipoAmbiente.Homologacao,
 *     dataEmissao: formatDhEmissao(new Date()),
 *     numeroDps: generateNumDps(),
 *     dataCompetencia: formatDataCompetencia(new Date()),
 *     tipoEmitente: EmitenteDPS.Prestador,
 *     codigoLocalEmissao: '3106200',
 *     prestador: { cnpj: '12345678000195', inscricaoMunicipal: '12345' },
 *     servico: {
 *       localPrestacao: { cLocPrestacao: '3106200' },
 *       codigoServico: { cServTribNac: '01.01.00163', cServMun: '14.01' },
 *       xDescServ: 'Desenvolvimento de software sob encomenda',
 *     },
 *     valores: { vServico: 1000.00, vBC: 1000.00, pAliq: 0.05, vISSQN: 50.00 },
 *   },
 * }
 * ```
 */
export interface DpsData {
  /** Versão do esquema XML do DPS (`versao`). Padrão: `1.00`. */
  versao?: string
  /** Informações do DPS (`infDPS`). */
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
  /** Chave de acesso da NFS-e emitida — use para consultar, cancelar ou baixar a DANF-Se. */
  chaveAcesso?: string
  /** ID da NFS-e gerada pela SEFIN (`idDps` no JSON de resposta). */
  idNfse?: string
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
  /**
   * Chave de acesso da NFS-e correspondente à DPS consultada.
   * Retornada apenas se o certificado do solicitante corresponder a um ator da NFS-e
   * (Prestador, Tomador ou Intermediário).
   */
  chaveAcesso?: string
  /** Campos de erro quando a DPS não é localizada ou o acesso é negado. */
  cStat?: string
  xMotivo?: string
}

export interface RegistroEventoResponse {
  /** Código de status do processamento (extraído do XML do evento retornado). */
  cStat: string
  /** Descrição do status. */
  xMotivo: string
  /** Base64+GZip do XML de retorno do evento, se disponível. */
  eventoXmlGZipB64?: string
}

// ---------------------------------------------------------------------------
// Evento (cancelamento, etc.)
// ---------------------------------------------------------------------------
export interface PedRegEventoData {
  /** Chave de acesso da NFS-e a ser cancelada (50 dígitos). */
  chNFSe: string
  /**
   * Tipo do evento. Use o enum `TipoEvento`.
   */
  tipoEvento: TipoEvento | number
  /** Ambiente (`tpAmb`): `1` = Produção, `2` = Homologação. Padrão: `1`. */
  tipoAmbiente?: number
  /** Data/hora do evento ISO 8601 (padrão: agora com offset BRT -03:00). */
  dhEvento?: string
  /**
   * CNPJ do autor do evento (prestador ou intermediário).
   * Obrigatório quando o autor usa CNPJ (use `cpfAutor` para CPF).
   */
  cnpjAutor?: string
  /** CPF do autor do evento. Use quando o prestador é Pessoa Física. */
  cpfAutor?: string
  /** Código do motivo (`cMotivo`). Obrigatório para `TipoEvento.Cancelamento` (e101101). */
  cMotivo?: MotivoEventoCancelamento
  /** Descrição estendida do motivo (`xMotivo`). */
  xMotivo?: string
}
