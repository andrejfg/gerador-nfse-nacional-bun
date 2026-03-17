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
