/**
 * Schema Zod do DPS — baseado no XSD v1.01 da NFS-e Nacional
 * https://www.notacontrol.com.br/download/nfse/schema_v101.xsd
 *
 * Cada campo inclui mensagem de erro em português descrevendo o motivo da falha.
 * Compatível com Zod v4.
 */

import { z } from 'zod'
import {
  ModoPrestacaoComExt,
  VinculoPrestacao,
  MecAFComexPrestador,
  MecAFComexTomador,
  MovimentacaoTemporariaBens,
  EnvioMDIC,
} from '../types/enums.js'

// ---------------------------------------------------------------------------
// Padrões de regex do XSD
// ---------------------------------------------------------------------------

const RE_ID_DPS = /^DPS[0-9]{42}$/
const RE_NUM_DPS = /^[1-9][0-9]{0,14}$/
const RE_SERIE_DPS = /^0{0,4}\d{1,5}$/
const RE_CNPJ = /^[0-9]{14}$/
const RE_CPF = /^[0-9]{11}$/
const RE_CEP = /^[0-9]{8}$/
const RE_COD_MUN = /^[0-9]{7}$/
const RE_COD_TRIB_NAC = /^[0-9]{6}$/
const RE_FONE = /^[0-9]{6,20}$/
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

export const CnpjSchema = z
  .string()
  .regex(RE_CNPJ, 'CNPJ deve ter exatamente 14 dígitos numéricos sem formatação')

export const CpfSchema = z
  .string()
  .regex(RE_CPF, 'CPF deve ter exatamente 11 dígitos numéricos sem formatação')

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

export const DataCompetenciaSchema = z
  .string()
  .regex(RE_DATA, 'Data de competência inválida — use formato YYYY-MM-DD (ex: "2024-03-15")')

export const DhEmissaoSchema = z
  .string()
  .regex(RE_DATETIME_UTC, 'Data/hora de emissão inválida — use formato ISO 8601 com offset UTC (ex: "2024-03-15T10:00:00-03:00"); use formatDhEmissao()')

// ---------------------------------------------------------------------------
// Endereço
// ---------------------------------------------------------------------------

export const EnderecoExteriorSchema = z.object({
  cPais: z.string().min(1, 'endereco.exterior.cPais (código do país) é obrigatório no endereço estrangeiro'),
  cEndPost: z.string().optional(),
  xCidade: z.string().min(1, 'endereco.exterior.xCidade (cidade) é obrigatória no endereço estrangeiro'),
  xEstProvReg: z.string().optional(),
})

export const EnderecoSchema = z
  .object({
    cMun: CodMunIBGESchema.optional(),
    cep: CepSchema.optional(),
    xLgr: z.string().optional(),
    nro: z.string().optional(),
    xCpl: z.string().optional(),
    xBairro: z.string().optional(),
    exterior: EnderecoExteriorSchema.optional(),
  })
  .refine(e => Boolean(e.cMun) !== Boolean(e.exterior), {
    message:
      'Endereço deve ter exatamente um entre cMun (endereço nacional) e exterior (endExt) — ' +
      'são mutuamente exclusivos (XSD TCEndereco: choice endNac|endExt)',
    path: ['cMun'],
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

export const PrestadorSchema = z
  .object({
    cnpj: CnpjSchema.optional(),
    cpf: CpfSchema.optional(),
    nif: z.string().optional(),
    codigoNaoNif: z.enum(['0', '1', '2']).optional(),
    caepf: z.string().regex(/^[0-9]{14}$/, 'CAEPF deve ter 14 dígitos').optional(),
    inscricaoMunicipal: z.string().optional(),
    nome: z.string().optional(),
    endereco: EnderecoSchema.optional(),
    telefone: z.string().regex(RE_FONE, 'Telefone deve ter entre 6 e 20 dígitos').optional(),
    email: z.string().optional(),
    regimeTributario: RegimeTributarioSchema,
  })
  .refine(p => p.cnpj || p.cpf || p.nif || p.codigoNaoNif, {
    message: 'Prestador deve ter pelo menos um identificador: cnpj, cpf, nif ou codigoNaoNif',
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
    nif: z.string().optional(),
    codigoNaoNif: z.enum(['0', '1', '2']).optional(),
    inscricaoMunicipal: z.string().optional(),
    nome: z
      .string()
      .min(1, 'Tomador.nome (xNome) é obrigatório')
      .max(300, 'Tomador.nome (xNome) deve ter no máximo 300 caracteres'),
    endereco: EnderecoSchema.optional(),
    telefone: z.string().regex(RE_FONE, 'Telefone deve ter entre 6 e 20 dígitos').optional(),
    email: z.string().optional(),
  })
  .refine(t => t.cnpj || t.cpf || t.nif || t.codigoNaoNif, {
    message: 'Tomador deve ter pelo menos um identificador: cnpj, cpf, nif ou codigoNaoNif',
    path: ['cnpj'],
  })

export const IntermediarioSchema = z.object({
  cnpj: CnpjSchema.optional(),
  cpf: CpfSchema.optional(),
  inscricaoMunicipal: z.string().optional(),
  nome: z
    .string()
    .min(1, 'Intermediario.nome (xNome) é obrigatório')
    .max(300, 'Intermediario.nome (xNome) deve ter no máximo 300 caracteres'),
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
  cNBSPrinc: z.string().optional(),
  cIntContrib: z.string().optional(),
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
    .min(1, 'Descrição do serviço (xDescServ) não pode ser vazia'),
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
    .optional(),
  informacaoComplemento: z
    .object({
      idDocTec: z.string().optional(),
      docRef: z.string().optional(),
      xPed: z.string().optional(),
      xInfComp: z.string().optional(),
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
        cMunFG: z.string().optional(),
      })
      .optional(),
    federal: z
      .object({
        valorRetidoIrrf: z.number().optional(),
        valorRetidoCsll: z.number().optional(),
        cstPisCofins: z.string().optional(),
        baseCalculoPisCofins: z.number().optional(),
        aliquotaPis: z.number().optional(),
        aliquotaCofins: z.number().optional(),
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
  indFinal: z.enum(['0', '1']).optional(),
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
