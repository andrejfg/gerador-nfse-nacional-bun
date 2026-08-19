/**
 * Schema Zod do DPS — baseado no XSD v1.01 da NFS-e Nacional
 * https://www.notacontrol.com.br/download/nfse/schema_v101.xsd
 *
 * Cada campo inclui mensagem de erro em português descrevendo o motivo da falha.
 * Compatível com Zod v4.
 */

import { z } from 'zod'
import { isValidCpf, isValidCnpj } from '../utils/cpf-cnpj.js'
import {
  TS_LOGRADOURO_MAX,
  TS_NUMERO_ENDERECO_MAX,
  TS_COMPLEMENTO_ENDERECO_MAX,
  TS_BAIRRO_MAX,
  TS_EMAIL_MAX,
  TS_CIDADE_MAX,
  TS_ESTADO_PROV_REGIAO_MAX,
  TS_CODIGO_END_POSTAL_MAX,
  TS_NOME_RAZAO_SOCIAL_MAX,
  TS_NIF_MAX,
  TS_INSC_MUN_MAX,
  TS_DESC_INF_COMPL_MAX,
  TS_DESC_255_MAX,
  TS_IDE_EVENTO_MAX,
} from '../utils/xsd-string.js'
import {
  ModoPrestacaoComExt,
  VinculoPrestacao,
  MecAFComexPrestador,
  MecAFComexTomador,
  MovimentacaoTemporariaBens,
  EnvioMDIC,
  MotivoNaoNif,
} from '../types/enums.js'

// ---------------------------------------------------------------------------
// Padrões de regex do XSD
// ---------------------------------------------------------------------------

const RE_ID_DPS = /^DPS[0-9]{42}$/
const RE_NUM_DPS = /^[1-9][0-9]{0,14}$/
const RE_SERIE_DPS = /^0{0,4}\d{1,5}$/

// CNPJ alfanumérico (IN RFB 2.229/2024): 12 posições alfanuméricas + 2 dígitos verificadores.
const RE_CNPJ_ALFANUM = /^[0-9A-Z]{12}[0-9]{2}$/
const RE_CPF = /^[0-9]{11}$/
const RE_CEP = /^[0-9]{8}$/
const RE_COD_MUN = /^[0-9]{7}$/
const RE_COD_TRIB_NAC = /^[0-9]{6}$/
const RE_FONE = /^[0-9]{6,20}$/
const RE_COD_PAIS_ISO = /^[A-Z]{2}$/
const RE_IBSCBS_IND_OP = /^[0-9]{6}$/
const RE_IBSCBS_CST = /^[0-9]{3}$/
const RE_IBSCBS_CLASS_TRIB = /^[0-9]{6}$/
const RE_IBSCBS_CRED_PRES = /^[0-9]{2}$/

// TSData: YYYY-MM-DD
const RE_DATA = /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

// TSDateTimeUTC: YYYY-MM-DDThh:mm:ss+/-HH:00
const RE_DATETIME_UTC =
  /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d([+-](0\d|1[0-2]):00|\+12:00)$/

// ---------------------------------------------------------------------------
// Tipos simples
// ---------------------------------------------------------------------------

export const IdDPSSchema = z
  .string()
  .regex(RE_ID_DPS, 'Id do DPS inválido — formato: "DPS" + 7 dígitos município + 1 tipo inscrição + 14 CNPJ/CPF + 5 série + 15 número = 45 chars (TSIdDPS: DPS[0-9]{42})')

export const NumeroDpsSchema = z
  .string()
  .regex(RE_NUM_DPS, 'Número do DPS inválido — não pode ter zeros à esquerda; use generateNumDps() (TSNumDPS: [1-9][0-9]{0,14})')

export const SerieDpsSchema = z
  .string()
  .regex(RE_SERIE_DPS, 'Série do DPS inválida — até 5 dígitos com zeros à esquerda opcionais (TSSerieDPS: 0{0,4}\\d{1,5})')

/**
 * CNPJ — 14 posições, com dígitos verificadores conferidos.
 *
 * Aceita também o **CNPJ alfanumérico** (IN RFB 2.229/2024): 12 posições
 * alfanuméricas + 2 dígitos verificadores. ⚠️ O XSD v1.01 ainda restringe
 * `TSCNPJ` a `[0-9]{14}`, então um CNPJ alfanumérico é legalmente válido e
 * recusado pelo schema vigente da SEFIN — o SDK aceita para não bloquear
 * documento legítimo, mas a rejeição virá da API até a SEFIN atualizar o XSD.
 */
export const CnpjSchema = z
  .string()
  .regex(RE_CNPJ_ALFANUM, 'CNPJ deve ter 14 posições sem formatação (14 dígitos, ou 12 alfanuméricas + 2 dígitos no CNPJ alfanumérico)')
  .refine(isValidCnpj, 'CNPJ inválido — dígitos verificadores não conferem')

export const CpfSchema = z
  .string()
  .regex(RE_CPF, 'CPF deve ter exatamente 11 dígitos numéricos sem formatação')
  .refine(isValidCpf, 'CPF inválido — dígitos verificadores não conferem')

export const CepSchema = z
  .string()
  .regex(RE_CEP, 'CEP deve ter 8 dígitos numéricos sem hífen')

export const CodMunIBGESchema = z
  .string()
  .regex(RE_COD_MUN, 'Código IBGE do município deve ter exatamente 7 dígitos')

export const CodTribNacSchema = z
  .string()
  .refine(v => RE_COD_TRIB_NAC.test(v.replace(/\D/g, '')), {
    message: 'Código de tributação nacional (cServTribNac) deve ter 6 dígitos após remover pontos/traços (ex: "100102" ou "10.01.02")',
  })

/** A regex garante o formato; esta função garante que a data existe no calendário. */
function isDataReal(value: string): boolean {
  const [ano, mes, dia] = value.split('-').map(Number) as [number, number, number]
  const date = new Date(Date.UTC(ano, mes - 1, dia))
  return date.getUTCFullYear() === ano && date.getUTCMonth() === mes - 1 && date.getUTCDate() === dia
}

export const DataCompetenciaSchema = z
  .string()
  .regex(RE_DATA, 'Data de competência inválida — use formato YYYY-MM-DD (ex: "2024-03-15")')
  .refine(isDataReal, 'Data de competência inexistente no calendário (ex: 2025-02-30)')

export const DhEmissaoSchema = z
  .string()
  .regex(RE_DATETIME_UTC, 'Data/hora de emissão inválida — use formato ISO 8601 com offset UTC (ex: "2024-03-15T10:00:00-03:00"); use formatDhEmissao()')

// ---------------------------------------------------------------------------
// Endereço
// ---------------------------------------------------------------------------

/**
 * `TCEnderExt` — os quatro campos são obrigatórios no XSD.
 *
 * Bloco incompleto é a causa do `E1235 — Falha no esquema XML do DF-e`, que a
 * SEFIN devolve sem dizer qual campo faltou. `end` inteiro é opcional; **parcial
 * é que é inválido**.
 */
export const EnderecoExteriorSchema = z.object({
  cPais: z
    .string()
    .regex(RE_COD_PAIS_ISO, 'endereco.exterior.cPais deve ser o código ISO de 2 letras maiúsculas (ex: "PT", "VG") — TSCodPaisISO'),
  cEndPost: z
    .string()
    .min(1, 'endereco.exterior.cEndPost (código postal) é obrigatório no endereço estrangeiro')
    .max(TS_CODIGO_END_POSTAL_MAX, `endereco.exterior.cEndPost deve ter no máximo ${TS_CODIGO_END_POSTAL_MAX} caracteres`),
  xCidade: z
    .string()
    .min(1, 'endereco.exterior.xCidade (cidade) é obrigatória no endereço estrangeiro')
    .max(TS_CIDADE_MAX, `endereco.exterior.xCidade deve ter no máximo ${TS_CIDADE_MAX} caracteres`),
  xEstProvReg: z
    .string()
    .min(1, 'endereco.exterior.xEstProvReg (estado/província/região) é obrigatório no endereço estrangeiro')
    .max(TS_ESTADO_PROV_REGIAO_MAX, `endereco.exterior.xEstProvReg deve ter no máximo ${TS_ESTADO_PROV_REGIAO_MAX} caracteres`),
})

/**
 * `TCEndereco` — `choice(endNac | endExt)` seguido de `xLgr`, `nro`, `xCpl?` e
 * `xBairro`. Só `xCpl` é opcional; `endNac` exige `cMun` **e** `CEP`.
 */
export const EnderecoSchema = z
  .object({
    cMun: CodMunIBGESchema.optional(),
    cep: CepSchema.optional(),
    xLgr: z
      .string()
      .min(1, 'endereco.xLgr (logradouro) é obrigatório')
      .max(TS_LOGRADOURO_MAX, `endereco.xLgr deve ter no máximo ${TS_LOGRADOURO_MAX} caracteres`),
    nro: z
      .string()
      .min(1, 'endereco.nro (número) é obrigatório — use "0" para imóvel sem número')
      .max(TS_NUMERO_ENDERECO_MAX, `endereco.nro deve ter no máximo ${TS_NUMERO_ENDERECO_MAX} caracteres`),
    xCpl: z
      .string()
      .max(TS_COMPLEMENTO_ENDERECO_MAX, `endereco.xCpl deve ter no máximo ${TS_COMPLEMENTO_ENDERECO_MAX} caracteres`)
      .optional(),
    xBairro: z
      .string()
      .min(1, 'endereco.xBairro (bairro) é obrigatório')
      .max(TS_BAIRRO_MAX, `endereco.xBairro deve ter no máximo ${TS_BAIRRO_MAX} caracteres`),
    exterior: EnderecoExteriorSchema.optional(),
  })
  .refine(e => Boolean(e.cMun) !== Boolean(e.exterior), {
    message:
      'Endereço deve ter exatamente um entre cMun (endereço nacional) e exterior (endExt) — ' +
      'são mutuamente exclusivos (XSD TCEndereco: choice endNac|endExt)',
    path: ['cMun'],
  })
  .refine(e => Boolean(e.exterior) || Boolean(e.cep), {
    message: 'endereco.cep é obrigatório no endereço nacional (XSD TCEnderNac exige cMun e CEP)',
    path: ['cep'],
  })

// ---------------------------------------------------------------------------
// Regime tributário (obrigatório no prestador)
// ---------------------------------------------------------------------------

// TSRegEspTrib: valores discretos 0,1,2,3,4,5,6,9 (7 e 8 não existem)
const REG_ESP_TRIB_VALUES = new Set([0, 1, 2, 3, 4, 5, 6, 9])

export const RegimeTributarioSchema = z.object({
  // TSOpSimpNac: 1=Não Optante, 2=MEI, 3=ME/EPP
  opSimpNac: z
    .number()
    .int()
    .min(1)
    .max(3, { error: 'opSimpNac inválido: 1=Não Optante, 2=MEI, 3=ME/EPP' }),
  // TSRegimeApuracaoSimpNac: 1,2,3
  regApurSN: z.number().int().min(1).max(3).optional(),
  // TSRegEspTrib: 0,1,2,3,4,5,6,9
  regEspTrib: z
    .number()
    .int()
    .refine(v => REG_ESP_TRIB_VALUES.has(v), {
      message:
        'regEspTrib inválido: 0=Nenhum, 1=Cooperativa, 2=Estimativa, 3=Microempresa Municipal, 4=Notário, 5=Autônomo, 6=Soc. Profissionais, 9=Outros',
    }),
})

// ---------------------------------------------------------------------------
// Prestador (TCInfoPrestador)
// ---------------------------------------------------------------------------

/**
 * Conta quantos identificadores de `TCInfoPessoa` foram preenchidos.
 * O XSD define `choice(CNPJ | CPF | NIF | cNaoNIF)`: exatamente um.
 */
function contarIdentificadores(p: {
  cnpj?: string
  cpf?: string
  nif?: string
  codigoNaoNif?: string
}): number {
  return [p.cnpj, p.cpf, p.nif, p.codigoNaoNif].filter(Boolean).length
}

const MSG_IDENTIFICADOR_UNICO =
  'deve ter exatamente um identificador: cnpj, cpf, nif ou codigoNaoNif — ' +
  'são mutuamente exclusivos (XSD TCInfoPessoa: choice CNPJ|CPF|NIF|cNaoNIF)'

export const PrestadorSchema = z
  .object({
    cnpj: CnpjSchema.optional(),
    cpf: CpfSchema.optional(),
    nif: z.string().max(TS_NIF_MAX, `NIF deve ter no máximo ${TS_NIF_MAX} caracteres`).optional(),
    codigoNaoNif: z.enum(MotivoNaoNif, { error: 'codigoNaoNif inválido (ver MotivoNaoNif)' }).optional(),
    caepf: z.string().regex(/^[0-9]{14}$/, 'CAEPF deve ter 14 dígitos').optional(),
    inscricaoMunicipal: z
      .string()
      .max(TS_INSC_MUN_MAX, `Inscrição municipal deve ter no máximo ${TS_INSC_MUN_MAX} caracteres`)
      .optional(),
    // xNome é obrigatório em TCInfoPessoa, mas o prestador emitente é
    // identificado pelo CNPJ na base da SEFIN — o nome pode ser omitido.
    nome: z
      .string()
      .max(TS_NOME_RAZAO_SOCIAL_MAX, `Prestador.nome (xNome) deve ter no máximo ${TS_NOME_RAZAO_SOCIAL_MAX} caracteres`)
      .optional(),
    endereco: EnderecoSchema.optional(),
    telefone: z.string().regex(RE_FONE, 'Telefone deve ter entre 6 e 20 dígitos').optional(),
    email: z.string().max(TS_EMAIL_MAX, `E-mail deve ter no máximo ${TS_EMAIL_MAX} caracteres`).optional(),
    regimeTributario: RegimeTributarioSchema,
  })
  .refine(p => contarIdentificadores(p) === 1, {
    message: `Prestador ${MSG_IDENTIFICADOR_UNICO}`,
    path: ['cnpj'],
  })

// ---------------------------------------------------------------------------
// Tomador / Intermediário (TCInfoPessoa)
// ---------------------------------------------------------------------------

// TCInfoPessoa: xNome é obrigatório (sem minOccurs=0 no XSD) e deve ter de 1 a 300 caracteres.
export const TomadorSchema = z
  .object({
    cnpj: CnpjSchema.optional(),
    cpf: CpfSchema.optional(),
    nif: z.string().max(TS_NIF_MAX, `NIF deve ter no máximo ${TS_NIF_MAX} caracteres`).optional(),
    codigoNaoNif: z.enum(MotivoNaoNif, { error: 'codigoNaoNif inválido (ver MotivoNaoNif)' }).optional(),
    inscricaoMunicipal: z
      .string()
      .max(TS_INSC_MUN_MAX, `Inscrição municipal deve ter no máximo ${TS_INSC_MUN_MAX} caracteres`)
      .optional(),
    nome: z
      .string()
      .min(1, 'Tomador.nome (xNome) é obrigatório')
      .max(TS_NOME_RAZAO_SOCIAL_MAX, `Tomador.nome (xNome) deve ter no máximo ${TS_NOME_RAZAO_SOCIAL_MAX} caracteres`),
    endereco: EnderecoSchema.optional(),
    telefone: z.string().regex(RE_FONE, 'Telefone deve ter entre 6 e 20 dígitos').optional(),
    email: z.string().max(TS_EMAIL_MAX, `E-mail deve ter no máximo ${TS_EMAIL_MAX} caracteres`).optional(),
  })
  .refine(t => contarIdentificadores(t) === 1, {
    message: `Tomador ${MSG_IDENTIFICADOR_UNICO}`,
    path: ['cnpj'],
  })

export const IntermediarioSchema = z
  .object({
    cnpj: CnpjSchema.optional(),
    cpf: CpfSchema.optional(),
    nif: z.string().max(TS_NIF_MAX, `NIF deve ter no máximo ${TS_NIF_MAX} caracteres`).optional(),
    codigoNaoNif: z.enum(MotivoNaoNif, { error: 'codigoNaoNif inválido (ver MotivoNaoNif)' }).optional(),
    inscricaoMunicipal: z
      .string()
      .max(TS_INSC_MUN_MAX, `Inscrição municipal deve ter no máximo ${TS_INSC_MUN_MAX} caracteres`)
      .optional(),
    nome: z
      .string()
      .min(1, 'Intermediario.nome (xNome) é obrigatório')
      .max(TS_NOME_RAZAO_SOCIAL_MAX, `Intermediario.nome (xNome) deve ter no máximo ${TS_NOME_RAZAO_SOCIAL_MAX} caracteres`),
  })
  .refine(i => contarIdentificadores(i) === 1, {
    message: `Intermediário ${MSG_IDENTIFICADOR_UNICO}`,
    path: ['cnpj'],
  })

// ---------------------------------------------------------------------------
// Serviço (TCCServ / TCServ)
// ---------------------------------------------------------------------------

export const CodigoServicoSchema = z.object({
  cServTribNac: CodTribNacSchema,
  cServMun: z
    .union([z.string(), z.number()])
    .transform(v => String(v).replace(/\D/g, ''))
    .refine(v => /^[0-9]{3}$/.test(v), {
      message: 'Código de tributação municipal (cServMun) deve ter exatamente 3 dígitos numéricos (TCCodTribMun: [0-9]{3})',
    })
    .optional(),
  // TSCodNBS: 9 dígitos. A NBS "1.0905.21.00" vira "109052100".
  cNBSPrinc: z
    .string()
    .refine(v => /^[0-9]{9}$/.test(v.replace(/\D/g, '')), {
      message: 'Código NBS (cNBSPrinc) deve ter 9 dígitos após remover pontos (ex: "109052100" ou "1.0905.21.00")',
    })
    .optional(),
  cIntContrib: z.string().optional(),
})

/**
 * `TCEnderecoSimples` — `choice(CEP | endExt)` + `xLgr`, `nro`, `xCpl?`,
 * `xBairro`. O `endExt` aqui (`TCEnderExtSimples`) **não tem `cPais`**.
 */
const EnderecoAtvEventoSchema = z
  .object({
    cep: CepSchema.optional(),
    exterior: z
      .object({
        cEndPost: z.string().min(1).max(TS_CODIGO_END_POSTAL_MAX),
        xCidade: z.string().min(1).max(TS_CIDADE_MAX),
        xEstProvReg: z.string().min(1).max(TS_ESTADO_PROV_REGIAO_MAX),
      })
      .optional(),
    xLgr: z.string().min(1).max(TS_LOGRADOURO_MAX),
    nro: z.string().min(1).max(TS_NUMERO_ENDERECO_MAX),
    xCpl: z.string().max(TS_COMPLEMENTO_ENDERECO_MAX).optional(),
    xBairro: z.string().min(1).max(TS_BAIRRO_MAX),
  })
  .refine(e => Boolean(e.cep) !== Boolean(e.exterior), {
    message: 'atvEvento.endereco deve ter exatamente um entre cep e exterior (XSD TCEnderecoSimples: choice CEP|endExt)',
    path: ['cep'],
  })

/** `TCAtvEvento` — atividade/evento, exigido nos serviços do item 12. */
export const AtvEventoSchema = z
  .object({
    xNome: z.string().min(1, 'atvEvento.xNome é obrigatório').max(TS_DESC_255_MAX, `atvEvento.xNome deve ter no máximo ${TS_DESC_255_MAX} caracteres`),
    dtIni: z.string().regex(RE_DATA, 'atvEvento.dtIni inválida — use YYYY-MM-DD'),
    dtFim: z.string().regex(RE_DATA, 'atvEvento.dtFim inválida — use YYYY-MM-DD'),
    idAtvEvt: z.string().max(TS_IDE_EVENTO_MAX, `atvEvento.idAtvEvt deve ter no máximo ${TS_IDE_EVENTO_MAX} caracteres`).optional(),
    endereco: EnderecoAtvEventoSchema.optional(),
  })
  .refine(a => Boolean(a.idAtvEvt) !== Boolean(a.endereco), {
    message: 'atvEvento deve ter exatamente um entre idAtvEvt e endereco (XSD TCAtvEvento: choice idAtvEvt|end)',
    path: ['idAtvEvt'],
  })
  .refine(a => a.dtFim >= a.dtIni, {
    message: 'atvEvento.dtFim não pode ser anterior a dtIni',
    path: ['dtFim'],
  })

export const ServicoSchema = z.object({
  localPrestacao: z
    .object({
      cLocPrestacao: CodMunIBGESchema.optional(),
      cPaisPrestacao: z.string().optional(),
    })
    .refine(v => v.cLocPrestacao || v.cPaisPrestacao, {
      message: 'localPrestacao deve ter cLocPrestacao (código IBGE do município) ou cPaisPrestacao (código ISO do país)',
    }),
  codigoServico: CodigoServicoSchema,
  xDescServ: z
    .string()
    .min(1, 'Descrição do serviço (xDescServ) não pode ser vazia')
    .max(TS_DESC_INF_COMPL_MAX, `Descrição do serviço (xDescServ) deve ter no máximo ${TS_DESC_INF_COMPL_MAX} caracteres`),
  comercioExterior: z
    .object({
      mdPrestacao: z.enum(ModoPrestacaoComExt, { error: 'comercioExterior.mdPrestacao inválido (ver ModoPrestacaoComExt)' }),
      vincPrest: z.enum(VinculoPrestacao, { error: 'comercioExterior.vincPrest inválido (ver VinculoPrestacao)' }),
      tpMoeda: z.string().regex(/^[0-9]{3}$/, 'comercioExterior.tpMoeda deve ter 3 dígitos (tabela de moedas do BACEN)'),
      vServMoeda: z.number().positive('comercioExterior.vServMoeda deve ser positivo'),
      mecAFComexP: z.enum(MecAFComexPrestador, { error: 'comercioExterior.mecAFComexP inválido (ver MecAFComexPrestador)' }).optional(),
      mecAFComexT: z.enum(MecAFComexTomador, { error: 'comercioExterior.mecAFComexT inválido (ver MecAFComexTomador)' }).optional(),
      movTempBens: z.enum(MovimentacaoTemporariaBens, { error: 'comercioExterior.movTempBens inválido (ver MovimentacaoTemporariaBens)' }).optional(),
      mdic: z.enum(EnvioMDIC, { error: 'comercioExterior.mdic inválido (ver EnvioMDIC)' }).optional(),
    })
    .optional(),
  obra: z
    .object({
      inscImobFisc: z.string().optional(),
      cObra: z.string().optional(),
    })
    // TCInfoObra: inscImobFisc? seguido de choice(cObra|cCIB|end). Um objeto
    // vazio satisfazia a Regra 260 no validador mas não emitia <obra> nenhum.
    .refine(o => Boolean(o.inscImobFisc || o.cObra), {
      message: 'servico.obra precisa de inscImobFisc ou cObra — um objeto vazio não emite o grupo <obra>',
      path: ['cObra'],
    })
    .optional(),
  atvEvento: AtvEventoSchema.optional(),
  informacaoComplemento: z
    .object({
      idDocTec: z.string().optional(),
      docRef: z.string().optional(),
      xPed: z.string().optional(),
      xInfComp: z
        .string()
        .max(TS_DESC_INF_COMPL_MAX, `informacaoComplemento.xInfComp deve ter no máximo ${TS_DESC_INF_COMPL_MAX} caracteres`)
        .optional(),
    })
    .optional(),
})

// ---------------------------------------------------------------------------
// Valores
// ---------------------------------------------------------------------------

export const ValoresSchema = z.object({
  vServico: z
    .number()
    .positive('Valor do serviço (valores.vServico) deve ser positivo'),
  vReceb: z.number().positive().optional(),
  vLiq: z.number().optional(),
  vDescCondicionado: z.number().optional(),
  vDescIncondicionado: z.number().optional(),
  vBC: z.number().optional(),
  vISSQN: z.number().optional(),
  pAliq: z.number().optional(),
  vTotalRet: z.number().optional(),
})

// ---------------------------------------------------------------------------
// Tributação
// ---------------------------------------------------------------------------

export const TributacaoSchema = z
  .object({
    issqn: z
      .object({
        // TSTribISSQN: 1=Tributável, 2=Imunidade, 3=Exportação, 4=Não Incidência
        tributacaoIssqn: z
          .number()
          .int()
          .min(1)
          .max(4, { error: 'tributacaoIssqn inválido: 1=Tributável, 2=Imunidade, 3=Exportação, 4=Não Incidência' })
          .optional(),
        aliquota: z.number().min(0).max(1, { error: 'Alíquota ISSQN deve ser decimal entre 0 e 1 (ex: 0.05 = 5%)' }).optional(),
        // TSTipoRetISSQN: 1=Não retido, 2=Retido pelo Tomador, 3=Retido pelo Intermediário
        tipoRetencaoIssqn: z.number().int().min(1).max(3).optional(),
        // TSTipoImunidadeISSQN: 0..5
        tipoImunidade: z
          .number()
          .int()
          .min(0)
          .max(5, { error: 'tipoImunidade inválido: 0..5 (ver TSTipoImunidadeISSQN)' })
          .optional(),
        // TSOpExigSuspensa: 1=Judicial, 2=Administrativo
        tipoSuspensao: z.number().int().min(1).max(2).optional(),
        numeroProcessoSuspensao: z.string().optional(),
        exigibilidadeISS: z.number().optional(),
        cMunFG: CodMunIBGESchema.optional(),
      })
      // XSD TCTribMunicipal/exigSusp: tpSusp e nProcesso são irmãos obrigatórios
      // dentro do grupo — o builder emite <exigSusp> assim que tipoSuspensao
      // aparece, então sem o processo o grupo sai incompleto.
      .refine(i => i.tipoSuspensao === undefined || Boolean(i.numeroProcessoSuspensao), {
        message: 'tributacao.issqn.numeroProcessoSuspensao é obrigatório quando tipoSuspensao é informado (grupo exigSusp)',
        path: ['numeroProcessoSuspensao'],
      })
      .optional(),
    federal: z
      .object({
        valorRetidoIrrf: z.number().optional(),
        valorRetidoCsll: z.number().optional(),
        cstPisCofins: z.string().optional(),
        baseCalculoPisCofins: z.number().optional(),
        // Decimais, como a alíquota do ISS: o builder multiplica por 100 ao
        // emitir (0.0065 → <pAliqPis>0.65</pAliqPis>). Sem o teto, passar 5
        // emitiria 500,00%.
        aliquotaPis: z.number().min(0).max(1, { error: 'aliquotaPis deve ser decimal entre 0 e 1 (ex: 0.0065 = 0,65%)' }).optional(),
        aliquotaCofins: z.number().min(0).max(1, { error: 'aliquotaCofins deve ser decimal entre 0 e 1 (ex: 0.03 = 3%)' }).optional(),
        valorPis: z.number().optional(),
        valorCofins: z.number().optional(),
        tipoRetencaoPisCofins: z.number().optional(),
      })
      .optional(),
    percentualTotalTributosSN: z.number().optional(),
    valorTotalTributosFederais: z.number().optional(),
    valorTotalTributosEstaduais: z.number().optional(),
    valorTotalTributosMunicipais: z.number().optional(),
    percentualTotalTributosFederais: z.number().optional(),
    percentualTotalTributosEstaduais: z.number().optional(),
    percentualTotalTributosMunicipais: z.number().optional(),
    indicadorTotalTributos: z.number().optional(),
  })
  .optional()

// ---------------------------------------------------------------------------
// IBSCBS — obrigatório na DPS v1.01
// ---------------------------------------------------------------------------

export const IbsCbsSchema = z.object({
  finNFSe: z.literal('0', {
    error: 'ibsCbs.finNFSe deve ser "0" (NFS-e regular)',
  }),
  cIndOp: z.string().regex(RE_IBSCBS_IND_OP, {
    message: 'ibsCbs.cIndOp deve ter 6 dígitos numéricos (código indicador de operação — consulte tabela oficial)',
  }),
  indDest: z.enum(['0', '1'], {
    error: 'ibsCbs.indDest deve ser "0" (destinatário = tomador) ou "1" (destinatário ≠ tomador)',
  }),
  indFinal: z.enum(['0', '1'], {
    error: 'ibsCbs.indFinal é obrigatório: "0" (não) ou "1" (uso/consumo pessoal — art. 57)',
  }),
  tpOper: z.enum(['1', '2', '3', '4', '5']).optional(),
  valores: z.object({
    trib: z.object({
      gIBSCBS: z.object({
        CST: z.string().regex(RE_IBSCBS_CST, {
          message: 'ibsCbs.valores.trib.gIBSCBS.CST deve ter 3 dígitos (Código de Situação Tributária IBS/CBS)',
        }),
        cClassTrib: z.string().regex(RE_IBSCBS_CLASS_TRIB, {
          message: 'ibsCbs.valores.trib.gIBSCBS.cClassTrib deve ter 6 dígitos (Código de Classificação Tributária)',
        }),
        cCredPres: z
          .string()
          .regex(RE_IBSCBS_CRED_PRES, {
            message: 'ibsCbs.valores.trib.gIBSCBS.cCredPres deve ter 2 dígitos (Código de Crédito Presumido)',
          })
          .optional(),
      }),
    }),
  }),
})

// ---------------------------------------------------------------------------
// infDPS
// ---------------------------------------------------------------------------

export const InfDpsSchema = z.object({
  id: IdDPSSchema,
  tipoAmbiente: z
    .number()
    .int()
    .min(1)
    .max(2, { error: 'tipoAmbiente deve ser 1 (Produção) ou 2 (Homologação)' }),
  dataEmissao: DhEmissaoSchema,
  versaoAplicativo: z.string().optional(),
  serie: SerieDpsSchema.optional(),
  numeroDps: NumeroDpsSchema,
  dataCompetencia: DataCompetenciaSchema,
  tipoEmitente: z
    .number()
    .int()
    .min(1)
    .max(3, { error: 'tipoEmitente deve ser 1=Prestador, 2=Tomador, 3=Intermediário' }),
  codigoLocalEmissao: CodMunIBGESchema,
  motivoEmissao: z.number().int().min(1).max(4).optional(),
  chaveNfseRejeitada: z
    .string()
    .regex(/^[0-9]{50}$/, 'Chave NFS-e rejeitada deve ter 50 dígitos')
    .optional(),
  prestador: PrestadorSchema,
  tomador: TomadorSchema.optional(),
  intermediario: IntermediarioSchema.optional(),
  servico: ServicoSchema,
  valores: ValoresSchema,
  tributacao: TributacaoSchema,
  ibsCbs: IbsCbsSchema.optional(),
})
.refine(
  d => !(d.valores.vReceb !== undefined && d.tipoEmitente !== 3),
  {
    message: 'valores.vReceb só pode ser informado quando o emitente for o Intermediário (tipoEmitente=3) — E0424',
    path: ['valores', 'vReceb'],
  },
)
.refine(
  d => {
    const opSimpNac = d.prestador.regimeTributario?.opSimpNac
    const aliquota  = d.tributacao?.issqn?.aliquota
    return !(opSimpNac === 1 && aliquota !== undefined)
  },
  {
    message:
      'tributacao.issqn.aliquota (pAliq) não deve ser informada quando o prestador não é optante do Simples Nacional ' +
      '(opSimpNac=1) e o município está ativo no Sistema Nacional NFS-e — E0617',
    path: ['tributacao', 'issqn', 'aliquota'],
  },
)
.refine(
  d => {
    const opSimpNac = d.prestador.regimeTributario?.opSimpNac
    if (opSimpNac !== 1) return true
    const trib = d.tributacao
    const temIndTotTrib = trib?.indicadorTotalTributos !== undefined
    const temSN = trib?.percentualTotalTributosSN !== undefined
    return !temIndTotTrib && !temSN
  },
  {
    message:
      'Para Não Optante (opSimpNac=1) não é permitido informar indicadorTotalTributos nem ' +
      'percentualTotalTributosSN — use valorTotal* ou percentualTotal* — E0713',
    path: ['tributacao', 'indicadorTotalTributos'],
  },
)

// ---------------------------------------------------------------------------
// DPS (raiz)
// ---------------------------------------------------------------------------

export const DpsSchema = z.object({
  versao: z.string().optional(),
  infDps: InfDpsSchema,
})

export type DpsSchemaInput = z.input<typeof DpsSchema>
export type DpsSchemaOutput = z.output<typeof DpsSchema>
