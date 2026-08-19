# Exemplos de uso — nfse-nacional

Exemplos práticos de emissão de NFS-e Nacional via biblioteca `nfse-nacional`.

---

## Configuração

### 1. Instalar a biblioteca

**Via npm (após publicação):**
```bash
npm install nfse-nacional
# ou
bun add nfse-nacional
```

**Via path local (para testar antes de publicar):**
```bash
bun add ../gerador-nfse-nacional-bun
# ou adicionar no package.json:
# "nfse-nacional": "file:../gerador-nfse-nacional-bun"
```

### 2. Variáveis de ambiente

Todos os dados sensíveis (CNPJ, CPF, senha do certificado, endereços) são lidos
de variáveis de ambiente — **nenhum dado real está hardcoded nos exemplos**.

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp examples/.env.example examples/.env
```

> O arquivo `examples/.env` é ignorado pelo git (`.gitignore`).
> **Nunca faça commit de dados reais.**

#### Variáveis disponíveis em `.env.example`

| Variável | Descrição | Obrigatória |
|---|---|:---:|
| `CERT_PATH` | Caminho para o `.pfx` do prestador | ✅ |
| `CERT_PASSWORD` | Senha do certificado digital | ✅ |
| `CNPJ_PRESTADOR` | CNPJ do prestador (14 dígitos, sem pontuação) | ✅ |
| `COD_IBGE_PRESTADOR` | Código IBGE do município do prestador (7 dígitos) | ✅ |
| `PRESTADOR_TELEFONE` | Telefone do prestador | — |
| `PRESTADOR_EMAIL` | E-mail do prestador | — |
| `CNPJ_TOMADOR_PJ` | CNPJ do tomador PJ (exemplos 2 e 3) | ✅ |
| `NOME_TOMADOR_PJ` | Nome empresarial do tomador PJ | ✅ |
| `COD_IBGE_TOMADOR_PJ` | Código IBGE do município do tomador PJ | ✅ |
| `CEP_TOMADOR_PJ` | CEP do tomador PJ (8 dígitos, sem hífen) | ✅ |
| `LOGRADOURO_TOMADOR_PJ` | Logradouro do tomador PJ | ✅ |
| `NUMERO_TOMADOR_PJ` | Número do endereço do tomador PJ | ✅ |
| `COMPLEMENTO_TOMADOR_PJ` | Complemento do endereço do tomador PJ | — |
| `BAIRRO_TOMADOR_PJ` | Bairro do tomador PJ | ✅ |
| `CPF_TOMADOR_PF` | CPF do tomador PF (11 dígitos, sem pontuação) — exemplo 3 | ✅ |
| `NOME_TOMADOR_PF` | Nome completo do tomador PF | ✅ |
| `COD_IBGE_TOMADOR_PF` | Código IBGE do município do tomador PF | ✅ |
| `CEP_TOMADOR_PF` | CEP do tomador PF (8 dígitos, sem hífen) | ✅ |
| `LOGRADOURO_TOMADOR_PF` | Logradouro do tomador PF | ✅ |
| `NUMERO_TOMADOR_PF` | Número do endereço do tomador PF | ✅ |
| `COMPLEMENTO_TOMADOR_PF` | Complemento do endereço do tomador PF | — |
| `BAIRRO_TOMADOR_PF` | Bairro do tomador PF | ✅ |
| `VALOR_SERVICO` | Valor do serviço em reais (ex: `100.00`) | ✅ |
| `DESCRICAO_SERVICO` | Descrição do serviço prestado | ✅ |
| `CHAVE_NFSE_EXISTENTE` | Chave de acesso (44 dígitos) para consultar/cancelar sem emitir (exemplos 7 e 8) | — |

### 3. Certificado digital

Coloque seu arquivo `.pfx` no caminho informado em `CERT_PATH` (ex: `./certificados/MEU_CERT.pfx`).
A pasta `certificados/` já está no `.gitignore`.

### 4. Variante local (dados hardcoded)

Se preferir editar diretamente o código sem usar variáveis de ambiente, crie uma
cópia do exemplo com o sufixo `.local.ts` — esses arquivos são ignorados pelo git:

```bash
cp examples/1-homologacao.ts examples/1-homologacao.local.ts
# edite 1-homologacao.local.ts à vontade com seus dados reais
bun run examples/1-homologacao.local.ts
```

> Qualquer arquivo `*.local.ts` em qualquer pasta do projeto é protegido pelo
> `.gitignore` e nunca será commitado acidentalmente.

---

## Exemplos disponíveis

| # | Arquivo | Descrição |
|:---:|---|---|
| 1 | [`1-homologacao.ts`](./1-homologacao.ts) | Emissão em homologação com certificado via arquivo em disco (tomador PJ) |
| 2 | [`2-homologacao-buffer.ts`](./2-homologacao-buffer.ts) | Emissão com certificado carregado em memória/buffer (tomador PJ) |
| 3 | [`3-homologacao-pf.ts`](./3-homologacao-pf.ts) | Emissão com tomador Pessoa Física (CPF) |
| 4 | [`4-danfe.ts`](./4-danfe.ts) | Geração de DANF-Se em PDF a partir do XML da NFS-e |
| 5 | [`5-emitir-e-danfe.ts`](./5-emitir-e-danfe.ts) | Fluxo completo: emissão em homologação + geração da DANF-Se em PDF |
| 6 | [`6-preview-danfe.ts`](./6-preview-danfe.ts) | Preview da DANF-Se (HTML ou PDF) com marca d'água — sem enviar para a SEFIN |
| 7 | [`7-consulta.ts`](./7-consulta.ts) | Consulta de NFS-e pela chave de acesso (emite ou usa chave existente) |
| 8 | [`8-cancelamento.ts`](./8-cancelamento.ts) | Cancelamento de NFS-e (emite ou usa chave existente e cancela) |
| 9 | [`9-render-xml.ts`](./9-render-xml.ts) | Renderiza a DANF-Se em HTML a partir de um XML já existente (NFS-e completa ou DPS avulso como prévia) |
| 10 | [`10-extrair-emitir-comparar.ts`](./10-extrair-emitir-comparar.ts) | Round-trip: extrai DPS de um XML, revalida, reemite via `buildDpsXml` e compara com o original |
| 11 | [`11-emitir-exterior.ts`](./11-emitir-exterior.ts) | Emissão para tomador no exterior identificado por NIF (`endExt` + `comExt`) + DANF-Se — só homologação |
| 12 | [`12-emitir-exterior-sem-nif.ts`](./12-emitir-exterior-sem-nif.ts) | Emissão para tomador no exterior sem NIF (`cNaoNIF`) + DANF-Se — só homologação |
| 13 | [`13-emitir-ibs-cbs.ts`](./13-emitir-ibs-cbs.ts) | Emissão com o bloco IBS/CBS da Reforma Tributária, tomador nacional — só homologação |
| 14 | [`14-emitir-exterior-ibs-cbs.ts`](./14-emitir-exterior-ibs-cbs.ts) | Emissão com IBS/CBS para tomador no exterior (exportação de serviço, CST 410) — só homologação |

---

## Executar

```bash
# Primeiro configure o .env:
cp examples/.env.example examples/.env
# edite examples/.env com seus dados

# Exemplo 1 — homologação (certificado em disco, tomador PJ)
bun run example 1

# Exemplo 2 — homologação (certificado em memória, tomador PJ)
bun run example 2

# Exemplo 3 — homologação (tomador PF/CPF)
bun run example 3

# Exemplo 4 — DANF-Se a partir de um XML existente (requer puppeteer)
bun add puppeteer
bun run example 4

# Exemplo 5 — Emissão + DANF-Se em um único fluxo (requer puppeteer)
bun add puppeteer
bun run example 5

# Exemplo 6 — Preview da DANF-Se com marca d'água (HTML ou PDF, sem enviar para a SEFIN)
bun run example 6   # HTML por padrão; edite FORMAT no arquivo para PDF

# Exemplo 7 — Consulta de NFS-e pela chave de acesso
bun run example 7
# Para consultar uma nota já existente sem emitir, defina no .env:
#   CHAVE_NFSE_EXISTENTE=<44 dígitos>

# Exemplo 8 — Cancelamento de NFS-e
bun run example 8
# Para cancelar uma nota já existente sem emitir, defina no .env:
#   CHAVE_NFSE_EXISTENTE=<44 dígitos>

# Exemplo 9 — Renderiza DANF-Se de um XML existente
bun run example 9 caminho/para/arquivo.xml
# Detecta automaticamente NFS-e completa vs DPS avulso (este último vira prévia)

# Exemplo 10 — Round-trip: extrai DPS, reemite e compara com o original
bun run example 10                                     # XML padrão em examples/
bun run example 10 caminho/para/arquivo.xml            # XML específico
# Gera examples/compare-<nome>.report.md com o DpsData em JSON,
# os XMLs original/reemitido indentados e a primeira divergência (se houver).

# Exemplo 11 — Emissão para o exterior com NIF (requer puppeteer)
bun run example 11

# Exemplo 12 — Emissão para o exterior sem NIF (cNaoNIF)
bun run example 12

# Exemplo 13 — Emissão com IBS/CBS (Reforma Tributária), tomador nacional
bun run example 13
# Imprime no final o bloco <IBSCBS> que a SEFIN calculou e devolveu

# Exemplo 14 — Emissão com IBS/CBS para o exterior (exportação, CST 410/410004)
bun run example 14
```

---

## Fluxo resumido

**Emissão:**
```
env.ts                                → carrega e valida variáveis de ambiente
validateDps(dps)                      → valida regras de negócio antes de enviar
ContribuinteService.emitir(dps)       → assina, comprime e envia para a SEFIN
DanfeService.generateFromXml(xml)     → gera PDF da DANF-Se
```

**Consulta (exemplo 7):**
```
ContribuinteService.consultar(chave)  → retorna os dados da NFS-e
ContribuinteService.consultarDps(id)  → retorna a situação do DPS
parseNfseXml(xml)                     → extrai campos do XML retornado
```

**Cancelamento (exemplo 8):**
```
ContribuinteService.cancelar(evento)  → envia o evento de cancelamento assinado
ContribuinteService.consultar(chave)  → confirma o status após o cancelamento
```

**Tipos de evento de cancelamento:**

| Código | Descrição |
|:---:|---|
| `101101` | Cancelamento por erro de emissão |
| `101102` | Cancelamento a pedido do tomador |
| `101103` | Cancelamento por determinação judicial |

---

## Debug

Defina `debug: true` no contexto para salvar o XML gerado antes do envio:

```typescript
const context: NfseContext = {
  // ...
  debug: true,
}
```

O XML será salvo em `debug/<timestamp>_dps.xml` (pasta ignorada pelo git).
