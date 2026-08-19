# nfse-nacional

> SDK TypeScript para emissão de **NFS-e Nacional** via API SEFIN do governo federal.
> Funciona com **Node.js ≥ 18** e **Bun ≥ 1.0**.

<!--
Badges — descomente após publicar no npm e configurar CI:

[![npm version](https://img.shields.io/npm/v/nfse-nacional.svg)](https://www.npmjs.com/package/nfse-nacional)
[![npm downloads](https://img.shields.io/npm/dm/nfse-nacional.svg)](https://www.npmjs.com/package/nfse-nacional)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build](https://github.com/andrejfg/gerador-nfse-nacional-bun/actions/workflows/ci.yml/badge.svg)](https://github.com/andrejfg/gerador-nfse-nacional-bun/actions)
-->

---

## O que é

O **nfse-nacional** é um SDK TypeScript para integração com a [API SEFIN Nacional](https://www.nfse.gov.br/EmissorNacional/Login) — a plataforma do governo federal para emissão de Nota Fiscal de Serviço eletrônica (NFS-e) pelos municípios aderentes ao programa.

Ele cuida de toda a pipeline técnica:

```
Seus dados  →  DPS (XML)  →  XMLDSig (RSA-SHA256)  →  GZip+Base64  →  API SEFIN  →  NFS-e
```

E também gera a **DANF-Se** (documento auxiliar da NFS-e) em HTML ou PDF, com suporte a prévia antes da emissão.

---

## Funcionalidades

| Área | Recurso |
|---|---|
| **Emissão** | Monta, valida, assina e envia o DPS à API SEFIN |
| **Assinatura digital** | XMLDSig RSA-SHA256 com certificado A1 (.pfx / buffer) |
| **Compressão** | GZip + Base64 (formato obrigatório da API) |
| **mTLS** | Autenticação mútua com certificado digital |
| **Validação** | Schema Zod + regras de negócio antes do envio |
| **Consulta** | NFS-e por chave de acesso, DPS por ID, eventos por tipo |
| **Cancelamento** | Registro de evento com pré-verificação e erros tipados |
| **DANF-Se** | Renderiza HTML e gera PDF via Puppeteer |
| **Preview** | Gera DANF-Se com marca d'água _antes_ da emissão |
| **Parser XML** | Converte XML da NFS-e em objetos TypeScript |
| **Utilitários** | Formatação de CPF/CNPJ, geração de IDs, cálculo de tributos |

---

## Compatibilidade

| Runtime | Versão mínima | Observações |
|---|---|---|
| **Node.js** | 18.0.0 | Testado com 18 LTS e 20 LTS |
| **Bun** | 1.0.0 | Runtime principal de desenvolvimento |

> A build gerada (`dist/`) usa ESM puro e é compatível com qualquer ambiente que suporte `import`.

---

## Instalação

```bash
# npm
npm install nfse-nacional

# yarn
yarn add nfse-nacional

# pnpm
pnpm add nfse-nacional

# bun
bun add nfse-nacional
```

### Geração de DANF-Se em PDF (opcional)

A geração de PDF usa [Puppeteer](https://pptr.dev), que é uma dependência **opcional**.
Instale apenas se precisar de PDF:

```bash
npm install puppeteer
# ou
bun add puppeteer
```

> Sem Puppeteer, a geração de HTML da DANF-Se funciona normalmente.
> Apenas a conversão para PDF requer o Chrome headless.

---

## Início rápido

### 1. Configure o contexto

```typescript
import { ContribuinteService, TipoAmbiente, type NfseContext } from 'nfse-nacional'

const context: NfseContext = {
  ambiente: TipoAmbiente.Homologacao,   // ou TipoAmbiente.Producao
  certificatePath: './certificado.pfx', // caminho para o arquivo .pfx
  certificatePassword: 'senha_cert',
  codigoMunicipio: '3106200',           // código IBGE 7 dígitos (município do prestador)
}
```

Alternativamente, carregue o certificado em memória (ideal para ambientes serverless):

```typescript
import { readFile } from 'node:fs/promises'

const context: NfseContext = {
  ambiente: TipoAmbiente.Homologacao,
  certificateData: await readFile('./certificado.pfx'),  // ArrayBuffer | Buffer
  certificatePassword: 'senha_cert',
  codigoMunicipio: '3106200',
}
```

### 2. Monte e emita o DPS

```typescript
import {
  ContribuinteService,
  validateDps,
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  OpcaoSimplesNacional,
  RegimeEspecialTributacao,
  generateDpsId,
  generateNumDps,
  formatDhEmissao,
  formatDataCompetencia,
  type DpsData,
} from 'nfse-nacional'

const numeroDps = generateNumDps()
const cnpjPrestador = '00000000000000'   // substitua pelo CNPJ real
const codIbge = '3106200'               // código IBGE do município

const dps: DpsData = {
  infDps: {
    id: generateDpsId(cnpjPrestador, codIbge, '001', numeroDps),
    tipoAmbiente: TipoAmbiente.Homologacao,
    dataEmissao: formatDhEmissao(new Date(), -3),
    numeroDps,
    serie: '001',
    dataCompetencia: formatDataCompetencia(),
    tipoEmitente: EmitenteDPS.Prestador,
    codigoLocalEmissao: codIbge,

    prestador: {
      cnpj: cnpjPrestador,
      regimeTributario: {
        opSimpNac: OpcaoSimplesNacional.NaoOptante,
        regEspTrib: RegimeEspecialTributacao.Nenhum,
      },
    },

    tomador: {
      cnpj: '11111111111111',
      nome: 'Empresa Tomadora LTDA',
      endereco: {
        cMun: '3550308',
        cep: '01310100',
        xLgr: 'Avenida Paulista',
        nro: '1000',
        xBairro: 'Bela Vista',
      },
    },

    servico: {
      localPrestacao: { cLocPrestacao: codIbge },
      codigoServico: {
        cServTribNac: '010100163',  // cód. tributação nacional
        cNBSPrinc: '109102000',     // cód. NBS — consulte tabela oficial
      },
      xDescServ: 'Descrição do serviço prestado.',
    },

    valores: { vServico: 1000.00 },

    tributacao: {
      issqn: {
        tributacaoIssqn: TributacaoIssqn.OperacaoTributavel,
        tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      },
      federal: { cstPisCofins: '00' },
      percentualTotalTributosFederais: 11.33,
      percentualTotalTributosEstaduais: 0.00,
      percentualTotalTributosMunicipais: 2.00,
    },
  },
}

// Valida antes de enviar (opcional — emitir() também valida internamente)
const validation = validateDps(dps)
if (!validation.isValid) {
  console.error(validation.errors)
  process.exit(1)
}

const service = new ContribuinteService(context)
const response = await service.emitir(dps)

console.log('cStat      :', response.cStat)       // '100' = aprovado
console.log('xMotivo    :', response.xMotivo)
console.log('chaveAcesso:', response.chaveAcesso)
console.log('nNFSe      :', response.nfse?.infNfse?.nNFSe)
```

---

## Cancelamento de NFS-e

```typescript
import {
  ContribuinteService,
  TipoEvento,
  MotivoEventoCancelamento,
  NfseNaoEncontradaError,
  NfseJaCanceladaError,
} from 'nfse-nacional'

const service = new ContribuinteService(context)

try {
  const resultado = await service.cancelar({
    chNFSe: '<chave-de-acesso-50-digitos>',  // chave de acesso (50 dígitos)
    tipoEvento: TipoEvento.Cancelamento,
    tipoAmbiente: TipoAmbiente.Homologacao,
    cnpjAutor: cnpjPrestador,
    cMotivo: MotivoEventoCancelamento.ErroNaEmissao,
    xMotivo: 'Nota emitida para fins de teste.',
  })

  console.log('cStat  :', resultado.cStat)
  console.log('xMotivo:', resultado.xMotivo)

} catch (err) {
  if (err instanceof NfseNaoEncontradaError) {
    // Nota não existe na SEFIN — cancelamento abortado pelo SDK
    console.error('NFS-e nao encontrada:', err.chaveAcesso)
  } else if (err instanceof NfseJaCanceladaError) {
    // API retornou E0840 — nota ja tem cancelamento vinculado
    console.warn('NFS-e ja esta cancelada:', err.chaveAcesso)
  } else {
    throw err
  }
}
```

O método `cancelar` realiza uma **consulta prévia** antes de enviar o evento.
Se a NFS-e não for encontrada, lança `NfseNaoEncontradaError` sem chamar o endpoint de eventos.
Se já estiver cancelada (E0840), lança `NfseJaCanceladaError`.

---

## Geração da DANF-Se

### A partir do XML da NFS-e (retornado pela API)

```typescript
import { DanfeService } from 'nfse-nacional'
import { writeFileSync } from 'node:fs'

const danfe = new DanfeService()

// PDF
const result = await danfe.generateFromXml(xmlNfse, {
  chaveAcesso: response.chaveAcesso,  // necessário quando o XML não contém <chNFSe>
})
writeFileSync('nota.pdf', result.pdfBytes)

// HTML (sem Puppeteer)
console.log(result.html)
```

### A partir do GZip+Base64 retornado pela API

```typescript
const result = await danfe.generateFromGzipB64(response.nfseXmlGZipB64, {
  chaveAcesso: response.chaveAcesso,
})
writeFileSync('nota.pdf', result.pdfBytes)
```

### Preview antes da emissão (sem certificado, sem API)

Gera uma DANF-Se com **marca d'água "PRÉVIA — SEM VALOR FISCAL"** a partir dos dados
do DPS, sem necessidade de certificado ou conexão com a API.

```typescript
import { DanfeService, DanfePreviewFormat } from 'nfse-nacional'

const danfe = new DanfeService()

// Preview em HTML (sem Puppeteer)
const preview = await danfe.previewFromDps(dps.infDps, {
  format: DanfePreviewFormat.Html,
})
writeFileSync('preview.html', preview.html)

// Preview em PDF (requer Puppeteer)
const preview = await danfe.previewFromDps(dps.infDps, {
  format: DanfePreviewFormat.Pdf,
})
writeFileSync('preview.pdf', preview.pdfBytes!)
```

---

## Referência da API

### `ContribuinteService`

| Método | Descrição |
|---|---|
| `emitir(dps)` | Valida, assina e envia o DPS à API SEFIN. Retorna `EmissaoNfseResponse`. |
| `consultar(chaveAcesso)` | Consulta uma NFS-e pela chave de acesso (50 dígitos). |
| `consultarDps(idDps)` | Consulta a situação de um DPS pelo ID (42 dígitos numéricos). |
| `verificarDps(idDps)` | Verifica se um DPS existe na SEFIN (retorna `boolean`). |
| `cancelar(evento)` | Registra evento de cancelamento com pré-verificação. |
| `consultarEventos(chaveAcesso)` | Lista todos os eventos de uma NFS-e. |
| `consultarEventosPorTipo(chave, tipo)` | Lista eventos de um tipo específico (`TipoEvento`). |
| `consultarEvento(chave, tipo, seq?)` | Consulta um evento específico por tipo e número sequencial. |
| `downloadDanfse(chaveAcesso)` | Baixa a DANF-Se em PDF direto da SEFIN (quando disponível). |
| `consultarAliquota(codMun, codServ)` | Consulta alíquota de ISSQN por município e código de serviço. |
| `consultarConvenio(codMunicipio)` | Consulta parâmetros de convênio do município com a SEFIN. |

### Erros tipados

| Classe | Quando é lançado |
|---|---|
| `DpsValidationError` | DPS inválido (schema/regras de negócio) antes de chamar a API |
| `NfseNaoEncontradaError` | NFS-e não localizada na SEFIN durante pré-verificação do cancelamento |
| `NfseJaCanceladaError` | API retornou E0840 — nota já possui cancelamento vinculado |
| `NfseApiError` | Erro HTTP genérico da API SEFIN (acesse `.statusCode` e `.body`) |

### `DanfeService`

| Método | Descrição |
|---|---|
| `generateFromXml(xml, opts?)` | Gera HTML + PDF a partir do XML da NFS-e. |
| `generateFromGzipB64(b64, opts?)` | Gera HTML + PDF a partir do GZip+Base64 retornado pela API. |
| `generate(schema, opts?)` | Gera HTML + PDF a partir de um `NfseSchema` já parseado. |
| `saveToFile(xml, path, isGzip?, opts?)` | Gera o PDF e salva diretamente em arquivo. |
| `previewFromDps(dps, opts?)` | Gera prévia com marca d'água **antes** da emissão. |

> **Personalização da DANF-Se** (template HTML próprio, placeholders, marca
> d'água): veja [docs/danfe-personalizada.md](docs/danfe-personalizada.md).

**`DanfeGenerateOptions`**

```typescript
{
  chaveAcesso?: string   // injeta <chNFSe> quando ausente no XML
  isCancelled?: boolean  // exibe marca d'água de cancelamento
  danfe?: DanfeOptions   // opções de renderização (fonte, template customizado)
  pdf?: PdfOptions       // opções do Puppeteer (pageSize, etc.)
}
```

### Funções utilitárias

```typescript
// Geração de IDs
generateDpsId(cnpj, codMun, serie, numeroDps)  // ID no formato da SEFIN (45 chars)
generateNumDps()                               // número sequencial único (timestamp)

// Formatação de datas
formatDataCompetencia(date?)                   // 'YYYY-MM-DD'
formatDhEmissao(date, offsetHours)             // ISO 8601 com offset BRT

// Formatação de documentos
formatCpf(cpf)     // '000.000.000-00'
formatCnpj(cnpj)   // '00.000.000/0000-00'
formatCep(cep)     // '00000-000'

// Outros
calculateTax(base, aliquota)   // base × aliquota / 100
validateDps(dps)               // { isValid, errors }
parseNfseXml(xml)              // NfseSchema
```

---

## Validação

`validateDps(dps)` roda duas camadas antes de qualquer chamada de rede: o schema
Zod derivado do XSD v1.01 e as regras de negócio da SEFIN. A ideia é trocar
rejeição opaca da API por erro com o campo apontado.

```ts
import { validateDps } from 'nfse-nacional'

const { isValid, errors } = validateDps(dps)
if (!isValid) console.error(errors)
```

O que é conferido, além de formatos e obrigatoriedade:

| Regra | Por quê |
|---|---|
| Endereço **completo ou ausente**, nunca parcial | `TCEndereco` exige `xLgr`/`nro`/`xBairro`; `TCEnderNac`, `cMun`+`CEP`; `TCEnderExt`, os quatro. Bloco pela metade é a causa do `E1235` |
| Exatamente **um** identificador de pessoa | `TCInfoPessoa` é `xs:choice`: CNPJ, CPF, NIF **ou** `cNaoNIF` |
| Dígitos verificadores de CPF/CNPJ | inclui o **CNPJ alfanumérico** (IN RFB 2.229/2024) |
| Limites de tamanho de todo campo texto | lidos do XSD (`xLgr` 255, `xBairro` 60, `xNome` 300, `xDescServ` 2000, …) |
| `CST` × `cClassTrib` na tabela oficial | só as **71** combinações válidas para NFS-e (das 164 publicadas) |
| `cNaoNIF = 0` recusado na emissão | vale só em nota de origem/substituição — a SEFIN devolve `E0226` |
| Grupos condicionais | `atvEvento` no item 12 (Regra 276), `obra` na construção civil (Regra 260), `nProcesso` com exigibilidade suspensa |

### Normalização de texto

O XSD tem dois regimes: `TSString` (logradouro, número, complemento, bairro,
e-mail) restringe o charset ao Latin-1 imprimível; `xs:string` (cidade,
estado/província, código postal, nome, NIF) aceita qualquer caractere. O SDK
**valida**; normalizar é escolha de quem chama:

```ts
import { normalizeTsString, normalizeXsString, TS_BAIRRO_MAX } from 'nfse-nacional'

normalizeTsString('Rue de l’Église', 255)  // "Rue de l'Église"
normalizeTsString('Łódź', TS_BAIRRO_MAX)   // 'Lódz'
normalizeXsString('東京', 60)               // '東京' — válido em xs:string
```

### Tabelas oficiais de IBS/CBS

A correlação do Anexo VIII fica num subpath, para não pesar no pacote de quem só
emite:

```ts
import { sugerirIbsCbs } from 'nfse-nacional/tabelas'

sugerirIbsCbs({ cServTribNac: '150101', cNBS: '109052100' })
// { cIndOp: '100301', cClassTrib: '010002', CST: '010' }
```

É **sugestão de conferência**, não regra: o `validateDps` não recusa uma nota por
divergir dela.

---

## Enums principais

```typescript
import {
  TipoAmbiente,             // Producao = 1, Homologacao = 2
  EmitenteDPS,              // Prestador = 1, Tomador = 2, Intermediario = 3
  TributacaoIssqn,          // OperacaoTributavel = 1, Imunidade = 2, ExportacaoServico = 3, NaoIncidencia = 4
  TipoRetencaoIssqn,        // NaoRetido = 1, RetidoTomador = 2, RetidoIntermediario = 3
  OpcaoSimplesNacional,     // NaoOptante = 1, Optante = 2
  RegimeEspecialTributacao,
  TipoEvento,               // Todos os 15 tipos do XSD (cancelamento, manifestação, ofício)
  MotivoEventoCancelamento, // ErroNaEmissao = 1, ServicoNaoPrestado = 2, Outros = 9
  DanfePreviewFormat,       // Html = 'html', Pdf = 'pdf'
  DanfeEnvironment,         // Production = 1, Restricted = 2
} from 'nfse-nacional'
```

### `TipoEvento` — tipos de evento do XSD

```typescript
// Cancelamento (iniciado pelo contribuinte)
TipoEvento.Cancelamento                        // e101101 — cancelamento direto (requer cMotivo)
TipoEvento.CancelamentoPorSubstituicao         // e105102 — substituição por nova nota
TipoEvento.SolicitacaoAnaliseFiscal            // e101103 — pedido de análise fiscal
TipoEvento.CancelamentoDeferidoAnaliseFiscal   // e105104
TipoEvento.CancelamentoIndeferidoAnaliseFiscal // e105105
```

---

## Configuração (`NfseContext`)

```typescript
interface NfseContext {
  /** Ambiente de emissão */
  ambiente: TipoAmbiente

  /** Caminho para o .pfx em disco */
  certificatePath?: string

  /** Conteúdo do .pfx em memória (alternativa ao path) */
  certificateData?: ArrayBuffer | Buffer

  /** Senha do certificado .pfx */
  certificatePassword: string

  /** Código IBGE do município (7 dígitos) */
  codigoMunicipio?: string

  /** Endpoint customizado (sobrescreve o padrão da SEFIN) */
  endpoint?: { producao: string; homologacao: string }

  /**
   * Quando true, salva os XMLs gerados (antes e após assinatura)
   * na pasta debug/ antes de enviar à API.
   */
  debug?: boolean
}
```

---

## Exemplos

A pasta [`examples/`](./examples) contém scripts prontos para uso:

| # | Arquivo | Descrição |
|---|---|---|
| 1 | `1-homologacao.ts` | Emissão em homologação — certificado via arquivo |
| 2 | `1b-homologacao-buffer.ts` | Emissão em homologação — certificado em memória (ArrayBuffer) |
| 3 | `3-homologacao-pf.ts` | Emissão com tomador pessoa física (CPF) |
| 4 | `4-danfe.ts` | Geração de DANF-Se a partir de um XML existente |
| 5 | `5-emitir-e-danfe.ts` | Emissão + geração automática da DANF-Se em PDF |
| 6 | `6-preview-danfe.ts` | Preview da DANF-Se antes da emissão (marca d'água) |
| 7 | `7-consulta.ts` | Consulta de NFS-e por chave de acesso ou ID do DPS |
| 8 | `8-cancelamento.ts` | Cancelamento de NFS-e com registro de evento |
| 9 | `9-render-xml.ts` | Renderiza a DANF-Se de qualquer XML (NFS-e ou DPS avulso) |
| 10 | `10-extrair-emitir-comparar.ts` | Round-trip: parse → `DpsData` → `buildDpsXml` → compara com o original |
| 11 | `11-emitir-exterior.ts` | Emissão para o exterior (tomador por NIF + `endExt` + `comExt`) + DANF-Se |
| 12 | `12-emitir-exterior-sem-nif.ts` | Emissão para o exterior com tomador sem NIF (`cNaoNIF` + `endExt` + `comExt`) + DANF-Se |

### Configurar e executar os exemplos

```bash
# 1. Copie o template de variáveis de ambiente
cp examples/.env.example examples/.env

# 2. Preencha examples/.env com seus dados reais:
#    CERT_PATH, CERT_PASSWORD, CNPJ_PRESTADOR, etc.

# 3. Execute um exemplo pelo número
bun run example 1   # ou 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
```

> **Dados sensíveis locais:** Se preferir hardcodar os dados diretamente no código,
> crie um arquivo `*.local.ts` ao lado do exemplo (ex: `1-homologacao.local.ts`).
> Esses arquivos são ignorados pelo git (`.gitignore`) e têm **prioridade automática**
> sobre o arquivo base quando você executa `bun run example <n>`.

---

## Estrutura do projeto

```
nfse-nacional/
├── src/
│   ├── types/          # Enums, DTOs (InfDpsData, PrestadorData, …), NfseContext
│   ├── xml/            # DPS builder, NFS-e parser, builder de eventos
│   ├── crypto/         # Certificado A1 (node-forge), XMLDSig signer, compressão
│   ├── http/           # SefinClient — mTLS + parse de respostas da API
│   ├── service/        # ContribuinteService — orquestração de alto nível
│   ├── danfe/          # HTML renderer, PDF generator (Puppeteer), preview builder
│   ├── validator/      # Zod schema + regras de negócio (DPS validator)
│   ├── utils/          # CPF/CNPJ, ID generator, cálculo de tributos, endpoint resolver
│   └── index.ts        # Exports públicos do pacote
├── assets/
│   ├── templates/
│   │   └── danfe.html  # Template HTML da DANF-Se (customizável)
│   └── municipios.csv  # Tabela IBGE de municípios para lookup no PDF
├── tests/
│   ├── crypto/         # Testes de assinatura e compressão
│   ├── utils/          # Testes de utilitários
│   ├── validator/      # Testes do validador de DPS
│   ├── xml/            # Testes do builder e parser XML
│   ├── danfe/          # Testes do preview e renderização
│   └── e2e/            # Testes end-to-end contra o dist compilado
├── examples/           # Scripts de exemplo (veja acima)
├── dist/               # Build compilada (gerada por `bun run build`)
└── package.json
```

---

## Desenvolvimento e contribuição

### Pré-requisitos

- [Bun](https://bun.sh) >= 1.0

```bash
# Clonar o repositório
git clone https://github.com/andrejfg/gerador-nfse-nacional-bun.git
cd gerador-nfse-nacional-bun

# Instalar dependências
bun install
```

### Scripts disponíveis

```bash
bun run build          # Compila src/ → dist/ (JS + tipos)
bun run test           # Roda a suite de testes unitários e de integração
bun run test:e2e       # Roda os testes e2e contra o dist compilado
bun run test:coverage  # Testes com relatório de cobertura
bun run typecheck      # Verificação de tipos sem emitir arquivos
bun run lint           # Linting com Biome
bun run lint:fix       # Linting com auto-correção
bun run format         # Formatação com Biome
bun run example <n>    # Executa o exemplo de número <n> (1–11)
```

### Rodando os testes

```bash
# Testes unitários (não requerem certificado nem API)
bun run test

# Testes e2e (requerem build prévia)
bun run build && bun run test:e2e
```

### Workflow de contribuição

1. Crie um branch a partir de `main`: `git checkout -b feat/minha-funcionalidade`
2. Implemente as alterações com testes correspondentes
3. Certifique-se que `bun run test` passa sem falhas
4. Garanta que `bun run typecheck` não retorna erros
5. Abra um Pull Request descrevendo o que foi alterado e por quê

### Publicação (mantenedores)

```bash
# O hook prepublishOnly executa typecheck + test + build automaticamente
npm version patch   # ou minor / major
npm publish
```

---

## Limitações conhecidas

- **São Paulo/SP** usa sistema próprio (SOAP) e **não** é compatível com esta biblioteca.
  Consulte [nfe.prefeitura.sp.gov.br](https://nfe.prefeitura.sp.gov.br).
- **DANF-Se em PDF** requer Puppeteer (Chrome headless). Em ambientes sem interface gráfica
  (Docker, CI) instale o Chrome via `apt-get install -y google-chrome-stable` ou utilize
  `puppeteer/chrome` Docker image.
- O bloco **IBS/CBS** (Reforma Tributária — NT 007/2026) é **opcional** durante o período
  de transição e omitido por padrão nos exemplos 1–12. Os exemplos **13** (tomador
  nacional) e **14** (exportação de serviço) mostram como preenchê-lo — só se envia
  `finNFSe`, `indFinal`, `cIndOp`, `indDest` e `gIBSCBS/{CST,cClassTrib}`; alíquotas e
  totais são calculados pela SEFIN e voltam no XML da NFS-e. Os códigos têm enums
  tipados (`CstIbsCbs`, `ClassTribIbsCbs`, `CodigoIndOp`, …).

---

## Referências

- [API SEFIN Nacional — gov.br](https://www.nfse.gov.br/EmissorNacional/Login)
- [Swagger SEFIN Homologação](https://sefin.producaorestrita.nfse.gov.br/API/SefinNacional/docs/index)
- [**Manual dos Contribuintes — Sistema Nacional NFS-e v1.2 (out/2025)**](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual/manual-contribuintes-emissor-publico-api-sistema-nacional-nfs-e-v1-2-out2025.pdf) — documentação oficial das APIs (parâmetros municipais, NFS-e, DPS, eventos)
- [Documentação Técnica — Portal NFS-e](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica)
- [nfse-php](https://github.com/nfse-nacional/nfse-php) — PHP SDK usado como referência de implementação
- [direction-nfse-danfe](https://github.com/JairoMarques/direction-nfse-danfe) — C# DANF-Se usado como referência para o template HTML

---

## Licença

[MIT](LICENSE) © André Guimarães
