# CLAUDE.md — nfse-nacional (raiz do projeto)

Guia de contexto para Claude trabalhando neste repositório. O `README.md`
é a fonte da verdade voltada a **usuários da biblioteca**; este arquivo é a
fonte da verdade voltada a **agentes trabalhando no código** — decisões,
armadilhas e pontos de entrada não óbvios.

## O que é o projeto

SDK TypeScript para integração com a **API SEFIN Nacional** (governo federal
brasileiro) de emissão de NFS-e. Cobre o fluxo completo:

```
DpsData → buildDpsXml → XMLDSig (RSA-SHA256) → GZip+Base64 → SEFIN → NFS-e
```

Também renderiza a **DANF-Se** (HTML/PDF) a partir do XML retornado pela API
ou como prévia a partir do próprio `DpsData`. Distribuído via npm como
`nfse-nacional`. Runtime primário de desenvolvimento: **Bun**; a build ESM
gerada em `dist/` roda em **Node ≥ 18** também.

## Comandos essenciais

```bash
bun install              # dependências
bun run typecheck        # tsc --noEmit — rápido, rode antes de concluir qualquer task
bun test                 # testes unitários/integração (não precisa de certificado)
bun test tests/validator tests/xml   # subset rápido p/ iterar em builder/validator
bun run test:e2e         # testes e2e contra o dist compilado (precisa de build)
bun run build            # tsup → dist/
bun run lint             # biome
bun run example <n>      # executa examples/<n>-* (veja examples/CLAUDE.md)
```

## Estrutura por contexto

Cada pasta abaixo tem uma responsabilidade bem definida. Quando for tocar em
uma delas, entenda o papel antes de mudar APIs públicas — elas são
referenciadas em cadeia.

```
src/
├── types/       DTOs (DpsData, NfseContext, …), enums, re-exports
├── validator/   Zod schema (dps-schema.ts) + regras de negócio (dps-validator.ts)
├── xml/         buildDpsXml, buildPedRegEventoXml, parseNfseXml
├── crypto/      loadCertificate (A1 .pfx) + xml-signer (XMLDSig RSA-SHA256 + GZip/B64)
├── http/        SefinClient — camada baixa (mTLS, endpoints, parse de resposta)
├── service/     ContribuinteService — orquestração de alto nível (emitir, consultar, cancelar)
├── danfe/       html-renderer, pdf-generator (puppeteer opcional), preview-builder, danfe-service
├── utils/       cpf-cnpj (+DV), xsd-string (charset/limites TSString), id-generator, tax-calculator
├── data/        tabelas oficiais IBS/CBS (CST×cClassTrib, Anexo VIII) + lookup
├── index.ts     barrel — superfície pública principal
└── tabelas.ts   entrada `nfse-nacional/tabelas` — Anexo VIII + sugerirIbsCbs

assets/
├── templates/danfe.html   # template HTML da DANF-Se
└── municipios.csv         # tabela IBGE de municípios para lookup no renderer

tests/            espelha src/ (crypto, danfe, e2e, http, utils, validator, xml)
examples/         scripts executáveis — veja examples/CLAUDE.md
docs/             (conforme crescer)
```

## Pontos de entrada mais importantes

- **`src/index.ts`** é a **única** superfície pública. Qualquer símbolo que
  não esteja re-exportado daqui é considerado privado. Ao adicionar
  exportações, adicione também um smoke test em `tests/e2e/` se for API
  crítica.
- **`src/xml/dps-builder.ts`** constrói o XML do DPS seguindo o XSD v1.01.
  A **ordem dos elementos** é significativa pelo `<xs:sequence>` — qualquer
  reordenação quebra validação na SEFIN. O arquivo tem comentários
  referenciando os tipos do XSD (`TCInfDPS`, `TCInfoPessoa`, etc.).
- **`src/validator/dps-schema.ts`** é a fonte Zod e **precisa estar em sincronia
  com o XSD v1.01** e com os DTOs em `src/types/dtos.ts`. Divergências
  manifestam-se como falsos positivos/negativos no `validateDps`.
- **`src/service/contribuinte-service.ts`** é a fachada que os exemplos
  consomem. Erros tipados (`DpsValidationError`, `NfseNaoEncontradaError`,
  `NfseJaCanceladaError`) são parte do contrato público.
- **`src/http/sefin-client.ts`** decide o runtime (Bun vs Node) para mTLS.
  Mudanças aqui afetam o e2e.

## Referências do XSD (fora do repo)

O XSD oficial do NFS-e v1.01 vive fora do repositório, em uma pasta local
que varia por máquina — pergunte ao usuário o caminho quando precisar. Os
dois arquivos principais do pacote oficial são:

- `tiposComplexos_v1.01.xsd` — `TCDPS`, `TCInfDPS`, `TCInfoPrestador`,
  `TCRegTrib`, `TCInfoPessoa`, `TCEndereco`, `TCServ`, `TCInfoValores`,
  `TCTribMunicipal/Federal/Total`, `TCRTCInfoIBSCBS`, etc.
- `tiposSimples_v1.01.xsd` — enumerações (`TSOpSimpNac`, `TSRegEspTrib`,
  `TSTribISSQN`, `TSRTCFinNFSe`, `TSRTCTpOper`, …).

Fonte oficial pública: [Documentação Técnica — Portal NFS-e](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica).

Quando o validador ou o builder precisar de ajustes, **consulte o XSD**
antes de adivinhar. Muitas regras (ex: `<xs:choice>` em `TCInfoPessoa`) não
são óbvias a partir do nome do campo.

## Decisões arquiteturais que vale saber

- **Bloco IBS/CBS é opcional** durante o período de transição da Reforma
  Tributária (NT 007/2026), mas já é usado em produção pelo EmissorWeb.
  Exemplos 13 e 14 emitem com ele; os demais omitem. O DPS envia só
  `finNFSe`, `indFinal?`, `cIndOp`, `tpOper?`, `indDest` e
  `gIBSCBS/{CST,cClassTrib,cCredPres?}` — `cLocalidadeIncid`, alíquotas e
  `totCIBS` são **calculados pela SEFIN** e voltam no XML da NFS-e
  (`nfse-parser.ts` já lê). Os códigos têm enums string em `types/enums.ts`
  (`CstIbsCbs`, `ClassTribIbsCbs`, `CodigoIndOp`, `FinalidadeNFSe`,
  `IndicadorDestinatario`, `IndicadorConsumidorFinal`, `TipoOperacaoEnteGov`),
  os três primeiros "abertos" (`Enum | (string & {})`) porque as tabelas
  oficiais são maiores que os atalhos. Quando a SEFIN tornar o bloco
  obrigatório, `ibsCbs?` precisa virar required no schema.
- **Validação: o que o XSD exige, o SDK exige.** O `dps-schema.ts` deixava
  quase tudo opcional e a SEFIN devolvia `E1235 — Falha no esquema XML do DF-e`
  sem dizer o campo. Hoje o schema espelha o XSD: `TCEndereco` exige
  `xLgr`/`nro`/`xBairro`, `TCEnderNac` exige `cMun`+`CEP`, `TCEnderExt` exige os
  quatro, e `TCInfoPessoa` é `choice` (exatamente um de CNPJ/CPF/NIF/cNaoNIF).
  Regra geral ao mexer aqui: **bloco opcional é "ausente ou completo", nunca
  parcial**.
- **Dois regimes de texto no XSD.** `TSString` (logradouro, número,
  complemento, bairro, e-mail) restringe o charset a Latin-1 imprimível;
  `xs:string` (cidade, estado/província, código postal, nome, NIF) não restringe
  nada — cidade chinesa é válida. `src/utils/xsd-string.ts` tem os limites e os
  normalizadores (`normalizeTsString`/`normalizeXsString`), exportados para o
  consumidor normalizar antes de validar. O SDK **valida**, não normaliza
  sozinho.
- **CNPJ alfanumérico** (IN RFB 2.229/2024) é aceito por `isValidCnpj` — o DV
  usa `ASCII − 48`, mesma conta para dígito e letra. ⚠️ O XSD v1.01 ainda diz
  `TSCNPJ = [0-9]{14}`, então um CNPJ alfanumérico passa aqui e é recusado pela
  SEFIN até eles atualizarem o schema.
- **Tabelas IBS/CBS em `src/data/`** transcrevem publicações oficiais da RFB /
  Portal Nacional. Cada arquivo carrega a data da última conferência
  (`IBS_CBS_CST_TABLE_ATUALIZADA_EM`, `IBS_CBS_ANEXO_VIII_ATUALIZADO_EM`) —
  ao atualizar contra uma publicação nova, mexa na data junto. Dos 164
  `cClassTrib` só **71 valem para NFS-e** — o `validateDps` recusa par
  CST×cClassTrib inexistente ou de outro documento fiscal. O Anexo VIII fica no
  subpath `nfse-nacional/tabelas` para não inchar o pacote de quem só emite.
- **XML é escapado em um lugar só**: `tag()` em `dps-builder.ts`/
  `eventos-builder.ts` (`src/xml/escape.ts`). Razão social com `&` gerava XML
  malformado. Qualquer builder novo precisa passar o texto por `tag()`.
- **Sem retrocompatibilidade shim** quando a API muda. Esta biblioteca
  prefere fazer mudanças diretas e subir versão (`semver`) a manter aliases
  deprecated. Se renomear um campo, apague o antigo.
- **Dependência de Puppeteer é opcional.** `danfe/pdf-generator.ts` faz
  import dinâmico; o HTML renderer funciona sem ele. Nunca torne o
  Puppeteer peer/required.
- **Validação é dupla**: primeiro Zod (estrutural, tipos, formatos), depois
  regras de negócio em `dps-validator.ts` (XSD `<xs:choice>`, somatórios,
  códigos de serviço exigindo grupo obrigatório). Não mova regras entre
  camadas sem entender o motivo — erros Zod precisam vir primeiro porque
  regras de negócio pressupõem que o objeto está bem-formado.

## Gotchas recorrentes

- **Encoding de XML**: os XMLs de fixture em `examples/` vieram do
  EmissorWeb e têm `\r\n` dentro de `<xDescServ>`. Qualquer comparador
  estrutural precisa normalizar line endings (ver `examples/10-extrair-emitir-comparar.ts`).
- **Ordem de declarações em arquivos top-level**: `bun` executa código
  top-level imediatamente, então `const` usados dentro de funções chamadas
  no topo precisam estar declarados **antes** da chamada (TDZ estrita).
- **`dataCompetencia`** é `YYYY-MM-DD`, não `YYYY-MM`. O validador rejeita
  o formato curto — já houve teste pra isso.
- **`numeroDps`** não pode começar com zero. O `generateNumDps()` evita,
  mas entrada manual precisa ser validada.
- **`regTrib`** é obrigatório no XSD mesmo quando `opSimpNac = 1` (Não
  Optante). O builder emite default `{ opSimpNac: 1, regEspTrib: 0 }` se
  omitido.
- **Windows vs Unix paths**: este repo está em Windows (`C:\git\…`), mas o
  shell configurado é bash (git bash). Use forward slashes e cuidado com
  `\r\n` em arquivos gerados por ferramentas nativas.

## Testes

- Testes unitários não precisam de certificado nem rede. Se um teste
  novo precisar de I/O, coloque em `tests/e2e/` e marque como opcional.
- Quando mexer em `dps-builder.ts` ou `dps-schema.ts`, rode pelo menos
  `bun test tests/validator tests/xml` antes de concluir.
- Snapshot não é usado na suite — preferimos asserts explícitos. Se for
  tentador adicionar snapshot, reveja — é quase sempre melhor extrair o
  valor e fazer asserts pontuais.

## Publicação

- Existe um cd no github actions que realiza a publicação de forma automatizada

---

## Auto-documentação progressiva

> **Diretriz permanente.** Este projeto usa um modelo de documentação
> distribuída: cada pasta de interesse pode (e deve, conforme o
> conhecimento se acumula) ter seu próprio `CLAUDE.md`, contendo o
> contexto específico daquele contexto — decisões, convenções, armadilhas,
> pontos de entrada, mapeamentos para XSD/API/docs externas.
>
> **Quando adicionar um `CLAUDE.md` em uma subpasta:**
>
> - Quando você (Claude) aprender algo **não óbvio a partir do código**
>   que outro agente futuro precisaria recuperar — decisão de design,
>   motivo histórico, cuidado com uma API externa, gotcha de runtime.
> - Quando uma pasta crescer o suficiente para ter convenções próprias
>   que não cabem no `CLAUDE.md` raiz sem inflá-lo.
> - Quando o usuário pedir explicitamente para documentar uma área.
>
> **Quando NÃO adicionar:**
>
> - Não crie `CLAUDE.md` em massa de forma especulativa. Crie só quando
>   houver conhecimento **concreto e não derivável do código** a registrar.
>   Pastas sem contexto especial ficam sem o arquivo — e tudo bem.
> - Não duplique o que já está no `README.md` público ou em comentários
>   do próprio código. `CLAUDE.md` é para o que **não cabe** neles.
>
> **Forma esperada:**
>
> - Título `# CLAUDE.md — <escopo>` e introdução de 1–2 frases.
> - Seções curtas focadas em: propósito, mapa dos arquivos (se útil),
>   convenções, decisões, gotchas, pontos de entrada.
> - Atualize quando decisões mudarem. Arquivos desatualizados são piores
>   que arquivos ausentes.
> - Ao adicionar um novo `CLAUDE.md`, **acrescente um link** no índice
>   logo abaixo para facilitar descoberta.

### Índice de `CLAUDE.md` existentes

- [`examples/CLAUDE.md`](./examples/CLAUDE.md) — mapa dos exemplos, variantes
  `.local.ts`, XMLs de fixture e notas sobre o exemplo 10 (round-trip).

> Quando criar novos `CLAUDE.md` em subpastas, adicione-os a este índice.
