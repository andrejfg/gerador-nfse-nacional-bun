/**
 * Enumerações para o sistema NFS-e Nacional
 * Migrado de nfse-php/src/Enums/
 */

export enum TipoAmbiente {
  Producao = 1,
  Homologacao = 2,
}

export enum TipoPessoa {
  PessoaFisica = 1,
  PessoaJuridica = 2,
  Estrangeiro = 3,
}

export enum EmitenteDPS {
  Prestador = 1,
  Tomador = 2,
  Intermediario = 3,
  NaoAplicavel = 4,
}

export enum ModoPrestacao {
  Presencial = 1,
  PorMeioDeTelecomunicacoes = 2,
  Online = 3,
  NaoAplicavel = 4,
}

/**
 * Motivo para não informação do NIF (`cNaoNIF`) — XSD `TSCodNaoNIF`.
 */
export enum MotivoNaoNif {
  /**
   * Não informado na nota de origem.
   *
   * ⚠️ **Não serve para emitir.** A SEFIN rejeita com **E0226** — este motivo
   * só existe para representar notas de origem/substituição em que o dado não
   * veio preenchido. `validateDps` rejeita antes do envio. Para emissão use
   * {@link MotivoNaoNif.DispensadoDoNif} ou
   * {@link MotivoNaoNif.NaoExigenciaDoNif}.
   */
  NaoInformadoNaOrigem = '0',
  /** Tomador dispensado do NIF. */
  DispensadoDoNif = '1',
  /** País do tomador não exige NIF. */
  NaoExigenciaDoNif = '2',
}

export enum ProcessoEmissao {
  Normal = 1,
  SubstituicaoNFSe = 2,
}

export enum CodigoStatus {
  Ativo = 1,
  Cancelado = 2,
  Substituido = 3,
}

/**
 * Situação tributária do ISSQN (`tribISSQN`) — XSD `TSTribISSQN` v1.01.
 *
 * O XSD aceita SOMENTE 1..4. Não existe "Isento" nem "Não Tributada SN":
 * o que coloquialmente se chama de "isenção" de ISS é, no modelo da NFS-e
 * nacional, uma **Imunidade** (`Imunidade = 2`), detalhada por `tpImunidade`.
 */
export enum TributacaoIssqn {
  OperacaoTributavel = 1,
  Imunidade = 2,
  ExportacaoServico = 3,
  NaoIncidencia = 4,
}

export enum TipoRetencaoIssqn {
  NaoRetido = 1,
  RetidoTomador = 2,
  RetidoIntermediario = 3,
}

export enum TipoRetencaoPisCofins {
  NaoRetido = 0,
  Retido = 1,
}

export enum TipoImunidade {
  SemImunidade = 0,
  PatrimonioRendaServicos = 1,
  Templos = 2,
  PartidosPoliticos = 3,
  EntidadesEducacionais = 4,
  EntidadesAssistenciais = 5,
}

export enum TipoDeducaoReducao {
  Deducao = 1,
  Reducao = 2,
}

export enum TipoSuspensao {
  SemSuspensao = 0,
  SuspensaoJudicial = 1,
  SuspensaoAdministrativa = 2,
}

export enum OpcaoSimplesNacional {
  NaoOptante = 1,
  Optante = 2,
}

export enum RegimeApuracaoSN {
  Competencia = 1,
  Caixa = 2,
}

export enum RegimeEspecialTributacao {
  Nenhum = 0,
  MicroEmpresaMunicipal = 1,
  Estimativa = 2,
  SociedadeProfissionais = 3,
  Cooperativa = 4,
  MicroEmpresarioIndividual = 5,
  MicroEmpresarioEmpresaPequenoPorte = 6,
}

export enum MotivoEmissaoTomadorIntermediario {
  NaoAplicavel = 0,
  ForcaMaior = 1,
  PorDeterminacaoLegal = 2,
  PrestadorNaoEmitiu = 3,
}

export enum AmbienteGerador {
  NacionalSefinNacional = 1,
  MunicipalSefimMunicipal = 2,
}

export enum IndicadorTotalTributos {
  NaoInformado = 0,
  Informado = 1,
}

export enum DanfeEnvironment {
  Production = 1,
  Restricted = 2,
}

/**
 * Todos os tipos de evento previstos no XSD `tiposEventos_v1.01.xsd`.
 *
 * Use este enum no campo `tipoEvento` de `PedRegEventoData`.
 *
 * Grupos:
 *  - 1xxxxx  Cancelamento (iniciado pelo contribuinte ou autoridade fiscal)
 *  - 2xxxxx  Manifestação (confirmação / rejeição do serviço)
 *  - 3xxxxx  Atos de ofício (bloqueio / desbloqueio pela SEFIN)
 */
export enum TipoEvento {
  // ── Cancelamento ────────────────────────────────────────────────────────────
  /** e101101 — Cancelamento de NFS-e (uso mais comum; requer cMotivo). */
  Cancelamento                         = 101101,
  /** e105102 — Cancelamento de NFS-e por Substituição. */
  CancelamentoPorSubstituicao          = 105102,
  /** e101103 — Solicitação de Análise Fiscal para Cancelamento de NFS-e. */
  SolicitacaoAnaliseFiscal             = 101103,
  /** e105104 — Cancelamento de NFS-e Deferido por Análise Fiscal. */
  CancelamentoDeferidoAnaliseFiscal    = 105104,
  /** e105105 — Cancelamento de NFS-e Indeferido por Análise Fiscal. */
  CancelamentoIndeferidoAnaliseFiscal  = 105105,

  // ── Manifestação ────────────────────────────────────────────────────────────
  /** e202201 — Confirmação do Prestador. */
  ConfirmacaoPrestador    = 202201,
  /** e203202 — Confirmação do Tomador. */
  ConfirmacaoTomador      = 203202,
  /** e204203 — Confirmação do Intermediário. */
  ConfirmacaoIntermediario = 204203,
  /** e205204 — Confirmação Tácita. */
  ConfirmacaoTacita       = 205204,
  /** e202205 — Rejeição do Prestador. */
  RejeicaoPrestador       = 202205,
  /** e203206 — Rejeição do Tomador. */
  RejeicaoTomador         = 203206,
  /** e204207 — Rejeição do Intermediário. */
  RejeicaoIntermediario   = 204207,
  /** e205208 — Anulação da Rejeição. */
  AnulacaoRejeicao        = 205208,

  // ── Ofício ──────────────────────────────────────────────────────────────────
  /** e305101 — Cancelamento de NFS-e por Ofício. */
  CancelamentoPorOficio   = 305101,
  /** e305102 — Bloqueio de NFS-e por Ofício. */
  BloqueioPorOficio       = 305102,
  /** e305103 — Desbloqueio de NFS-e por Ofício. */
  DesbloqueioDeOficio     = 305103,
}

/**
 * Código de justificativa de cancelamento (TSCodJustCanc).
 *
 * Obrigatório apenas para o evento `TipoEvento.Cancelamento` (e101101).
 * Enviado no campo `cMotivo` de `PedRegEventoData`.
 */
export enum MotivoEventoCancelamento {
  /** Erro ocorrido durante a emissão da nota. */
  ErroNaEmissao      = 1,
  /** Serviço descrito na nota não foi efetivamente prestado. */
  ServicoNaoPrestado = 2,
  /** Outros motivos não enquadrados nas opções anteriores. */
  Outros             = 9,
}

/**
 * Atalho semântico — subconjunto de `TipoEvento` para cancelamentos
 * iniciados diretamente pelo contribuinte.
 *
 * @deprecated Prefira `TipoEvento` para maior clareza.
 */
export enum TipoEventoCancelamento {
  /** `TipoEvento.Cancelamento` — cancelamento direto (requer cMotivo). */
  Cancelamento                = TipoEvento.Cancelamento,
  /** `TipoEvento.CancelamentoPorSubstituicao` — substituição por nova nota. */
  PorSubstituicao             = TipoEvento.CancelamentoPorSubstituicao,
  /** `TipoEvento.SolicitacaoAnaliseFiscal` — pedido de análise fiscal. */
  SolicitacaoAnaliseFiscal    = TipoEvento.SolicitacaoAnaliseFiscal,
}

// ─────────────────────────────────────────────────────────────────────────────
// Comércio Exterior (bloco <comExt> / XSD TCInfoComExt)
//
// Estes enums são STRING (não numéricos): vários códigos têm zero à esquerda
// (`'00'`..`'26'`) que um enum numérico do TS converteria para `1`, quebrando o
// XML. Para uniformidade, os de dígito único também são string — o tipo XSD é
// `xs:string`. Fonte: tiposSimples_v1.01.xsd.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Modo de prestação no comércio exterior (`mdPrestacao`) — XSD `TSModoPrestacao`.
 */
export enum ModoPrestacaoComExt {
  /** Desconhecido (tipo não informado na nota de origem). */
  Desconhecido = '0',
  Transfronteirico = '1',
  ConsumoNoBrasil = '2',
  PresencaComercialExterior = '3',
  MovimentoTemporarioPessoasFisicas = '4',
}

/**
 * Vínculo entre as partes no negócio (`vincPrest`) — XSD `TSVincPrest`.
 */
export enum VinculoPrestacao {
  SemVinculo = '0',
  Controlada = '1',
  Controladora = '2',
  Coligada = '3',
  Matriz = '4',
  FilialOuSucursal = '5',
  OutroVinculo = '6',
}

/**
 * Mecanismo de apoio/fomento ao Comércio Exterior do **prestador**
 * (`mecAFComexP`) — XSD `TSMecAFComExPrest`.
 */
export enum MecAFComexPrestador {
  /** Desconhecido (tipo não informado na nota de origem). */
  Desconhecido = '00',
  Nenhum = '01',
  /** ACC — Adiantamento sobre Contrato de Câmbio (redução a zero do IR e IOF). */
  ACC = '02',
  /** ACE — Adiantamento sobre Cambiais Entregues (redução a zero do IR e IOF). */
  ACE = '03',
  BNDESEximPosEmbarque = '04',
  BNDESEximPreEmbarque = '05',
  /** FGE — Fundo de Garantia à Exportação. */
  FGE = '06',
  ProexEqualizacao = '07',
  ProexFinanciamento = '08',
}

/**
 * Mecanismo de apoio/fomento ao Comércio Exterior do **tomador**
 * (`mecAFComexT`) — XSD `TSMecAFComExToma`.
 */
export enum MecAFComexTomador {
  /** Desconhecido (tipo não informado na nota de origem). */
  Desconhecido = '00',
  Nenhum = '01',
  AdmPublicaRepInternacional = '02',
  AlugueisArrendMaquinasEmbarcAeronaves = '03',
  ArrendAeronaveTransporteAereoPublico = '04',
  ComissaoAgentesExternosExportacao = '05',
  DespesasArmazenagemMovTransporteExterior = '06',
  EventosFifaSubsidiaria = '07',
  EventosFifa = '08',
  FretesArrendEmbarcacoesAeronaves = '09',
  MaterialAeronautico = '10',
  PromocaoBensExterior = '11',
  PromocaoDestinosTuristicosBrasileiros = '12',
  PromocaoBrasilExterior = '13',
  PromocaoServicosExterior = '14',
  Recine = '15',
  Recopa = '16',
  RegistroManutencaoMarcasPatentesCultivares = '17',
  Reicomp = '18',
  Reidi = '19',
  Repenec = '20',
  Repes = '21',
  Retaero = '22',
  Retid = '23',
  RoyaltiesAssistenciaTecnicaCientifica = '24',
  ServicosAvaliacaoConformidadeOMC = '25',
  /** ZPE — Zona de Processamento de Exportação. */
  ZPE = '26',
}

/**
 * Vínculo da operação à movimentação temporária de bens (`movTempBens`) —
 * XSD `TSMovTempBens`.
 */
export enum MovimentacaoTemporariaBens {
  /** Desconhecido (tipo não informado na nota de origem). */
  Desconhecido = '0',
  Nao = '1',
  VinculadaImportacao = '2',
  VinculadaExportacao = '3',
}

/**
 * Compartilhamento das informações da NFS-e com a Secretaria de Comércio
 * Exterior (`mdic`) — XSD `TSEnvMDIC`.
 */
export enum EnvioMDIC {
  NaoEnviar = '0',
  Enviar = '1',
}

/**
 * Código de moeda da transação (`tpMoeda`) — XSD `TSCodMoeda` (`[0-9]{3}`).
 *
 * **Não é um enum fechado:** o XSD aceita qualquer código de 3 dígitos da
 * tabela de moedas do BACEN. Os membros abaixo são atalhos para as moedas mais
 * comuns; outros códigos podem ser informados como string crua de 3 dígitos.
 *
 * Códigos conforme a Tabela de Moedas do BACEN (≠ ISO 4217 numérico).
 */
export enum CodigoMoeda {
  /** Real brasileiro. */
  Real = '790',
  /** Dólar dos Estados Unidos. */
  DolarEUA = '220',
  /** Euro. */
  Euro = '978',
  /** Libra esterlina. */
  LibraEsterlina = '540',
  /** Iene japonês. */
  Iene = '470',
  /** Franco suíço. */
  FrancoSuico = '425',
}

/** Formato de saída do preview da DANF-Se. */
export enum DanfePreviewFormat {
  /** HTML puro — rápido, sem Puppeteer. Abra no browser para visualizar. */
  Html = 'html',
  /** PDF gerado via Puppeteer — requer `bun add puppeteer`. */
  Pdf = 'pdf',
}

// ─────────────────────────────────────────────────────────────────────────────
// IBS/CBS — Reforma Tributária (bloco <IBSCBS> / XSD TCRTCInfoIBSCBS)
//
// Também STRING enums: `CST` e `cClassTrib` têm zeros à esquerda (`'000'`,
// `'000001'`) que um enum numérico do TS destruiria. Fontes: tabelas oficiais
// do Portal Nacional (Anexo VIII — correlação item LC 116/2003 × NBS × indOp ×
// cClassTrib) e tiposSimples_v1.01.xsd.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Finalidade da emissão da NFS-e (`finNFSe`) — XSD `TSRTCFinNFSe`.
 */
export enum FinalidadeNFSe {
  /** NFS-e regular (único valor aceito hoje pelo XSD v1.01). */
  Normal = '0',
}

/**
 * Indicador de destinatário (`indDest`) — XSD `TSRTCIndDest`.
 */
export enum IndicadorDestinatario {
  /** `0` — tomador = adquirente = destinatário (identificado na própria NFS-e). */
  TomadorEhDestinatario = '0',
  /**
   * `1` — tomador = adquirente ≠ destinatário: outra pessoa física/jurídica (ou
   * equiparada), ou estabelecimento diferente do indicado como tomador. Exige o
   * grupo `dest`, **ainda não implementado neste builder**.
   */
  DestinatarioDiferente = '1',
}

/**
 * Operação de uso ou consumo pessoal — art. 57 (`indFinal`) — XSD `TSRTCIndFinal`.
 *
 * **Obrigatório** dentro do grupo `IBSCBS` (o XSD não marca `minOccurs="0"`).
 */
export enum IndicadorConsumidorFinal {
  Nao = '0',
  Sim = '1',
}

/**
 * Tipo de operação com entes governamentais **ou outros serviços sobre bens
 * imóveis** (`tpOper`) — XSD `TSRTCTpOper`.
 */
export enum TipoOperacaoEnteGov {
  /** `1` — Fornecimento com pagamento posterior. */
  FornecimentoComPagamentoPosterior = '1',
  /** `2` — Recebimento do pagamento com fornecimento já realizado. */
  RecebimentoComFornecimentoRealizado = '2',
  /** `3` — Fornecimento com pagamento já realizado. */
  FornecimentoComPagamentoRealizado = '3',
  /** `4` — Recebimento do pagamento com fornecimento posterior. */
  RecebimentoComFornecimentoPosterior = '4',
  /** `5` — Fornecimento e recebimento do pagamento concomitantes. */
  FornecimentoERecebimentoConcomitantes = '5',
}

/**
 * Tipo de ente governamental (`tpEnteGov`) — XSD `TSRTCTpEnteGov`.
 * Vale para a administração pública direta e suas autarquias e fundações.
 *
 * O campo `tpEnteGov` **ainda não é emitido** pelo builder — o enum existe para
 * quando for.
 */
export enum TipoEnteGovernamental {
  Uniao = '1',
  Estado = '2',
  DistritoFederal = '3',
  Municipio = '4',
}

/**
 * CST — Código de Situação Tributária do IBS/CBS (`CST`, 3 dígitos).
 *
 * **Não é um enum fechado:** a tabela oficial de CST do IBS/CBS é extensa. Os
 * membros abaixo são atalhos para os casos mais comuns na prestação de
 * serviços; qualquer outro código pode ser informado como string de 3 dígitos.
 */
export enum CstIbsCbs {
  /** `000` — Tributação integral pelo IBS e CBS. */
  TributacaoIntegral = '000',
  /** `410` — Imunidade e não incidência (inclui exportação de serviço). */
  ImunidadeNaoIncidencia = '410',
}

/**
 * cClassTrib — Código de Classificação Tributária do IBS/CBS (6 dígitos).
 *
 * **Não é um enum fechado:** vale o mesmo aviso de {@link CstIbsCbs}. Cada
 * `cClassTrib` pertence a um `CST`; use a combinação prevista na tabela
 * oficial (os dois primeiros dígitos repetem o CST).
 */
export enum ClassTribIbsCbs {
  /** `000001` — Situações tributadas integralmente pelo IBS e CBS (CST `000`). */
  TributacaoIntegral = '000001',
  /** `410004` — Exportações de bens e serviços (CST `410`). */
  ExportacaoBensServicos = '410004',
}

/**
 * cIndOp — Código indicador da operação de fornecimento (6 dígitos).
 *
 * **Não é um enum fechado:** o Anexo VIII do Portal Nacional traz a tabela
 * completa, correlacionada com o item da LC 116/2003 e com o `cClassTrib`. Os
 * membros abaixo cobrem os "demais serviços em operações onerosas".
 */
export enum CodigoIndOp {
  /**
   * `100301` — Demais serviços, em operações onerosas. Local do domicílio
   * principal do adquirente residente ou domiciliado no País.
   */
  DemaisServicosAdquirenteNoPais = '100301',
  /**
   * `100302` — Demais serviços, em operações onerosas, quando o adquirente
   * **não** é residente nem domiciliado no País (exportação de serviço).
   */
  DemaisServicosAdquirenteExterior = '100302',
}
