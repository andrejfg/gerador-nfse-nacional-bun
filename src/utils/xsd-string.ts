/**
 * Regras de texto dos tipos simples do XSD da NFS-e nacional
 * (`PL_NFSE_NT04_RTCv101/tiposSimples_v1.01.xsd`).
 *
 * Existem dois regimes de texto no schema e confundi-los custa caro:
 *
 * - **`TSString`** (logradouro, número, complemento, bairro, e-mail) restringe o
 *   charset a `[!-ÿ]` — U+0021..U+00FF, o Latin-1 imprimível, com espaço
 *   permitido só no meio. Acento latino passa; cirílico e CJK, não.
 * - **`xs:string`** (cidade, estado/província, código postal, nome/razão social,
 *   NIF) não restringe charset nenhum: cidade chinesa e nome cirílico são
 *   válidos, só o `maxLength` vale.
 *
 * `validateDps` **rejeita** o que estiver fora da regra, com o campo apontado.
 * Normalizar é decisão de quem chama — estes helpers existem para isso, para o
 * caso comum de dado vindo de cadastro (colado de e-mail, PDF ou planilha).
 */

/** Comprimento máximo por tipo do XSD. */
export const TS_LOGRADOURO_MAX = 255
export const TS_NUMERO_ENDERECO_MAX = 60
export const TS_COMPLEMENTO_ENDERECO_MAX = 156
export const TS_BAIRRO_MAX = 60
export const TS_EMAIL_MAX = 80
export const TS_CIDADE_MAX = 60
export const TS_ESTADO_PROV_REGIAO_MAX = 60
export const TS_CODIGO_END_POSTAL_MAX = 11
export const TS_NOME_RAZAO_SOCIAL_MAX = 300
export const TS_NIF_MAX = 40
export const TS_INSC_MUN_MAX = 15
export const TS_DESC_INF_COMPL_MAX = 2000
export const TS_DESC_255_MAX = 255
export const TS_IDE_EVENTO_MAX = 30

/** Charset do `TSString`: U+0021..U+00FF (Latin-1 imprimível) e espaço. */
const TS_STRING_ALLOWED_CHAR = /[!-ÿ ]/

/** `TSCEP` — exatamente 8 dígitos. */
const TS_CEP_PATTERN = /^[0-9]{8}$/

/** `TSCodPaisISO` — exatamente 2 letras maiúsculas. */
const TS_COD_PAIS_ISO_PATTERN = /^[A-Z]{2}$/

/**
 * Pontuação tipográfica comum em cadastro estrangeiro que o `TSString` não
 * aceita e que o Unicode não decompõe — mapeada à mão para o equivalente ASCII
 * em vez de ser descartada.
 */
const TYPOGRAPHIC_FALLBACK: Record<string, string> = {
  '‘': "'", '’': "'", '‚': "'",
  '“': '"', '”': '"', '„': '"',
  '–': '-', '—': '-', '−': '-',
  '…': '...',
  // Letras latinas fora do Latin-1 que o Unicode não decompõe (o traço/gancho
  // faz parte do glifo). Sem isto, `Łódź` viraria `ódz` — pior que traduzir a
  // letra, porque ela desaparece no meio da palavra sem ninguém notar.
  'Ł': 'L', 'ł': 'l',
  'Đ': 'D', 'đ': 'd',
  'Œ': 'OE', 'œ': 'oe',
  'ı': 'i',
  ' ': ' ', ' ': ' ', ' ': ' ',
}

/**
 * Normaliza um valor para o charset do `TSString` e corta em `maxLength`.
 *
 * Três passos por caractere: (1) dentro de U+0021..U+00FF ou espaço → mantém,
 * então `é`, `Ã` e `ç` sobrevivem; (2) fora → tenta o mapa tipográfico e a
 * decomposição NFKD (`ł`→`l`, `ﬁ`→`fi`); (3) sem equivalente (cirílico, CJK) →
 * descarta. Quebra de linha e tab viram espaço — não passam no charset, mas
 * separam palavras, e colar os termos vizinhos seria pior.
 *
 * @returns `undefined` quando não sobra nada de aproveitável — caso em que o
 * chamador deve tratar o campo como ausente, não como string vazia.
 */
export function normalizeTsString(
  value: string | null | undefined,
  maxLength: number,
): string | undefined {
  if (!value) return undefined

  let out = ''
  for (const char of value.replace(/[\r\n\t]/g, ' ')) {
    if (TS_STRING_ALLOWED_CHAR.test(char)) {
      out += char
      continue
    }
    const fallback = TYPOGRAPHIC_FALLBACK[char]
    if (fallback) {
      out += fallback
      continue
    }
    // NFKD separa o diacrítico da letra base; mantemos o que couber no charset.
    for (const decomposed of char.normalize('NFKD')) {
      if (TS_STRING_ALLOWED_CHAR.test(decomposed)) out += decomposed
    }
  }

  const normalized = out.replace(/\s+/g, ' ').trim().slice(0, maxLength).trim()
  return normalized || undefined
}

/**
 * Normaliza um valor de tipo com base `xs:string` (sem restrição de charset,
 * como `TSCidade`, `TSCodigoEndPostal` e `TSNIF`): só trim e corte no
 * `maxLength`.
 */
export function normalizeXsString(
  value: string | null | undefined,
  maxLength: number,
): string | undefined {
  if (!value) return undefined
  const normalized = value.trim().slice(0, maxLength).trim()
  return normalized || undefined
}

/** `TSString`: todos os caracteres cabem no charset Latin-1 imprimível? */
export function isTsString(value: string): boolean {
  return [...value].every(char => TS_STRING_ALLOWED_CHAR.test(char))
}

/** `TSCEP`: exatamente 8 dígitos — não há como normalizar o que falta. */
export function isTsCep(value: string | undefined): boolean {
  return typeof value === 'string' && TS_CEP_PATTERN.test(value)
}

/** `TSCodPaisISO`: exatamente 2 letras maiúsculas (`BR`, `VG`, `PT`). */
export function isTsCodPaisIso(value: string | undefined): boolean {
  return typeof value === 'string' && TS_COD_PAIS_ISO_PATTERN.test(value)
}

/**
 * Lista os campos ausentes/inválidos numa mensagem só, para o usuário corrigir
 * tudo de uma vez em vez de descobrir um por requisição.
 *
 * @param fields Rótulo → valor (ou `true`/`false` para checagens já resolvidas).
 */
export function missingFieldsMessage(
  prefix: string,
  fields: Record<string, unknown>,
): string {
  const missing = Object.entries(fields)
    .filter(([, value]) => !value)
    .map(([label]) => label)
  return missing.length > 0 ? `${prefix}. Faltando: ${missing.join(', ')}.` : prefix
}
