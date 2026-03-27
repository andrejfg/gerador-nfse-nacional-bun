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

export enum ProcessoEmissao {
  Normal = 1,
  SubstituicaoNFSe = 2,
}

export enum CodigoStatus {
  Ativo = 1,
  Cancelado = 2,
  Substituido = 3,
}

export enum TributacaoIssqn {
  TributadaMunicipioPrestador = 1,
  TributadaMunicipioTomador = 2,
  Isenta = 3,
  NaoIncidente = 4,
  Imune = 5,
  Exportacao = 6,
  NaoTributadaSimplesNacional = 7,
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

/** Formato de saída do preview da DANF-Se. */
export enum DanfePreviewFormat {
  /** HTML puro — rápido, sem Puppeteer. Abra no browser para visualizar. */
  Html = 'html',
  /** PDF gerado via Puppeteer — requer `bun add puppeteer`. */
  Pdf = 'pdf',
}
