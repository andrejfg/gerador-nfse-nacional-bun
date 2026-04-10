# CLAUDE.md — pasta `examples/`

Notas para um Claude futuro trabalhando nos exemplos de uso da biblioteca
`nfse-nacional`. O objetivo é evitar retrabalho e ajudar a recuperar contexto
rápido.

## Propósito da pasta

Scripts executáveis que demonstram os fluxos principais do SDK contra a
**API SEFIN Nacional** (homologação por padrão). Todos são rodáveis via
`bun run example <n>` — o dispatcher em `run.ts` traduz o número para o
caminho do arquivo e redireciona para a variante `.local.ts` quando existe.

## Mapa dos exemplos

| # | Arquivo | O que demonstra | Requer credenciais/API? |
|:---:|---|---|:---:|
| 1 | `1-homologacao.ts` | Emissão com certificado em disco (tomador PJ) | sim |
| 2 | `2-homologacao-buffer.ts` | Emissão com certificado carregado como `ArrayBuffer` | sim |
| 3 | `3-homologacao-pf.ts` | Emissão com tomador Pessoa Física | sim |
| 4 | `4-danfe.ts` | Gera DANF-Se em PDF a partir de um XML (usa Puppeteer) | não |
| 5 | `5-emitir-e-danfe.ts` | Emissão + DANF-Se em um único fluxo | sim |
| 6 | `6-preview-danfe.ts` | Preview de DANF-Se com marca d'água (sem enviar à API) | não |
| 7 | `7-consulta.ts` | Consulta NFS-e por chave / DPS por ID | sim |
| 8 | `8-cancelamento.ts` | Cancelamento com pré-verificação | sim |
| 9 | `9-render-xml.ts` | Renderiza DANF-Se de qualquer XML (detecta NFS-e vs DPS avulso) | não |
| 10 | `10-extrair-emitir-comparar.ts` | Round-trip: parse → `DpsData` → `buildDpsXml` → compara com original | não |

## Convenções

- **`env.ts`** é o único ponto de leitura de `examples/.env`. Novos exemplos
  que precisem de credenciais devem importar dali — nunca ler `process.env`
  direto.
- **Variante `.local.ts`**: qualquer arquivo `*.local.ts` está no
  `.gitignore` e é resolvido automaticamente pelo `run.ts` antes da variante
  base quando existir. Use para:
  - Hardcodar dados reais sem mexer em `.env` (ex: `5-emitir-e-danfe.local.ts`).
  - Apontar exemplos não interativos para um arquivo específico de análise
    (ex: `10-extrair-emitir-comparar.local.ts` aponta para um XML fixo).
- **Nunca commite dados reais** (CNPJ, CPF, chaves, certificados). Os XMLs
  reais que estão versionados já foram autorizados pelo usuário para uso
  como fixture.
- **Novos exemplos** devem ser numerados sequencialmente e registrados em:
  1. `run.ts` (dispatcher)
  2. `README.md` (tabela de exemplos + seção "Executar")
  3. Este `CLAUDE.md` (mapa acima)

## XMLs de fixture

Somente um XML é versionado: **`nfse-exemplo.xml`** — fixture sintético
(CNPJs/empresas fictícios) usado pelos testes de DANF-Se. É anonimizado
e pode ser referenciado livremente em código/docs.

**NFS-e reais de homologação** (obtidas do EmissorWeb) **não devem ser
commitadas**: o `examples/.gitignore` já cobre `*.xml` exceto
`nfse-exemplo.xml`. Relatórios/HTML gerados (`compare-*.report.md`,
`render-*.html`) também estão bloqueados no `.gitignore`.

Se você precisar iterar contra uma NFS-e real localmente, coloque o arquivo
em `examples/` (fica untracked) e aponte para ele via argv ou via uma
variante `.local.ts`. **Nunca** registre o nome do arquivo em código/docs
versionados — o nome carrega CNPJ/chave do contribuinte real.

## Exemplo 10 — notas específicas

- Parse XML → `DpsData` é feito **inline** no próprio arquivo (não reutiliza
  `parseNfseXml` porque aquele retorna `NfseSchema`, não `DpsData`).
- A normalização do comparador estrutural precisa cobrir:
  - `<?xml …?>` → removido
  - `xmlns="…"` → removido
  - whitespace entre tags → removido
  - self-closing `<foo/>` → `<foo></foo>`
  - `\r\n` e `\r` → `\n` (o fast-xml-parser entrega os textos com `\n` após o
    trim, mas o XML original pode ter CRLF dentro de `<xDescServ>`)
- `xmlParser` (instância do `XMLParser`) **precisa ser declarada no topo do
  arquivo**, antes do código top-level de execução — senão o TDZ dispara
  `Cannot access 'xmlParser' before initialization` ao chamar
  `parseDpsXmlToDpsData`.
- O relatório gerado em `compare-<nome>.report.md` contém:
  - resultado (idênticos / divergem)
  - erros do `validateDps`
  - `DpsData` extraído em JSON (útil pra debug de mapeamento)
  - XML original e reemitido indentados (via `prettyPrintXml`)
  - primeira divergência com contexto, quando houver
- Se o round-trip quebrar, isso quase sempre indica **bug no `dps-builder`
  ou no parser inline**, não no XML de entrada. Use o arquivo de relatório
  para localizar a divergência — o campo "posição" aponta o índice exato.

## Debug de emissões (exemplos 1, 2, 3, 5, 7, 8)

Quando `debug: true` é passado no `NfseContext`, o SDK grava os XMLs
intermediários em `debug/<timestamp>_dps.xml` (pasta no `.gitignore`). Esse é
o melhor ponto para inspecionar o que foi efetivamente enviado à API quando
uma emissão falha. O exemplo 9 (ou 10) consegue carregar esses arquivos
diretamente.

## Gotchas

- **Puppeteer é dependência opcional.** Exemplos 4 e 5 quebram se o
  Puppeteer não estiver instalado; 6 (HTML) e 9 (HTML) funcionam sem ele.
- **`verAplic` padrão do builder** é `'1.01'`. O builder preserva o valor
  extraído quando informado em `infDps.versaoAplicativo`, o que é essencial
  para o round-trip do exemplo 10 contra XMLs do EmissorWeb (que usa
  `EmissorWeb_1.4.0.27`).
- **mTLS** é usado quando o `SefinClient` detecta Bun/Node com suporte. Se
  um exemplo de emissão falhar com erro de handshake TLS, verifique
  `src/http/sefin-client.ts` e o runtime em uso.
