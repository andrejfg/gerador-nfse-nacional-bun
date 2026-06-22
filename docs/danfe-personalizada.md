# DANF-Se personalizada

Como gerar uma DANF-Se com layout próprio (logotipo, cores, fontes, textos)
usando um **template HTML customizado**.

## Como funciona

A DANF-Se é renderizada a partir de um template HTML
(`assets/templates/danfe.html`) por **substituição de placeholders**. O fluxo:

1. O renderer lê o template (o padrão da lib ou o seu, via `templatePath`).
2. Remove os **blocos condicionais** cujas flags são falsas.
3. Substitui os placeholders `{{...}}` pelos valores da NFS-e.
4. (Opcional) injeta a marca d'água quando `isPreview = true`.

Personalizar = fornecer o seu próprio HTML. Você controla 100% do layout/CSS,
desde que mantenha os placeholders que quiser preencher.

## Passo a passo

1. **Copie o template base** `assets/templates/danfe.html` para o seu projeto,
   ex.: `./meu-template.html`.
2. **Edite** CSS, estrutura, logotipo e textos à vontade. Para trocar a fonte
   ou inserir uma logo, altere o CSS / markup do próprio template.
3. **Mantenha os placeholders** (`{{...}}`) das informações que deseja exibir.
   Placeholders que você remover simplesmente não aparecem.
4. **Aponte para o seu template** via `DanfeOptions.templatePath`.

### Exemplo — gerar PDF a partir do XML da NFS-e

```ts
import { DanfeService } from 'nfse-nacional'

// templatePath no construtor: vale para todas as chamadas deste service
const danfe = new DanfeService({ templatePath: './meu-template.html' })

const { pdfBytes, warnings } = await danfe.generateFromXml(xmlNfse)
// warnings lista placeholders não preenchidos (ver abaixo)
```

### Exemplo — prévia a partir do DPS (antes de emitir)

```ts
import { DanfeService, DanfePreviewFormat } from 'nfse-nacional'

const danfe = new DanfeService()

const { html } = await danfe.previewFromDps(dps, {
  format: DanfePreviewFormat.Html,
  danfe: { templatePath: './meu-template.html' },
})
```

> `previewFromDps` injeta automaticamente a marca d'água "SEM VALOR FISCAL".

## Placeholders disponíveis

Use `{{NOME}}` no template. Valores ausentes viram `-`.

### Identificação

| Placeholder | Conteúdo |
|---|---|
| `{{CHAVE_NFSE}}` | Chave de acesso da NFS-e |
| `{{QRCODE_IMG}}` | `<img>` do QR Code (já vem com `src` data-URI) |
| `{{MUN_HEADER}}` | Município/UF do emitente (cabeçalho) |
| `{{NFSE_NUMERO}}` | Número da NFS-e |
| `{{NFSE_NDFSE}}` | Número do DF-e |
| `{{NFSE_COMPETENCIA}}` | Competência da NFS-e |
| `{{NFSE_DH_PROC}}` | Data/hora de processamento |
| `{{NFSE_DH_EMI}}` | Data/hora de emissão da DPS |
| `{{DPS_NUMERO}}` | Número da DPS |
| `{{DPS_SERIE}}` | Série da DPS |

### Prestador

| Placeholder | Conteúdo |
|---|---|
| `{{PREST_CNPJ}}` | CNPJ/CPF do prestador |
| `{{PREST_XNOME}}` | Razão social / nome |
| `{{PREST_XFANT}}` | Nome fantasia |
| `{{PREST_IM}}` | Inscrição municipal |
| `{{PREST_ENDERECO}}` | Logradouro, número, complemento, bairro |
| `{{PREST_MUNICIPIO}}` | Município/UF |
| `{{PREST_CEP}}` | CEP formatado |
| `{{PREST_FONE}}` | Telefone formatado |
| `{{PREST_EMAIL}}` | E-mail |
| `{{PREST_REGIME}}` | Regime especial de tributação |
| `{{PREST_SIMPNAC}}` | Opção pelo Simples Nacional |

### Tomador / Intermediário

| Placeholder | Conteúdo |
|---|---|
| `{{TOMA_CNPJ}}` | CNPJ/CPF do tomador |
| `{{TOMA_XNOME}}` | Nome do tomador |
| `{{TOMA_IM}}` | Inscrição municipal |
| `{{TOMA_ENDERECO}}` | Endereço |
| `{{TOMA_MUNICIPIO}}` | Município/UF |
| `{{TOMA_CEP}}` | CEP formatado |
| `{{TOMA_FONE}}` | Telefone |
| `{{TOMA_EMAIL}}` | E-mail |
| `{{INTERM_CNPJ}}` | CNPJ/CPF do intermediário |
| `{{INTERM_XNOME}}` | Nome do intermediário |

### Serviço

| Placeholder | Conteúdo |
|---|---|
| `{{SERVICO_CTRIBNAC}}` | Código + descrição da tributação nacional |
| `{{SERVICO_XNS}}` | Código NBS |
| `{{SERVICO_XCM}}` | Código de serviço municipal |
| `{{SERVICO_XCLES}}` | Local da prestação (município/UF) |
| `{{SERVICO_XPA}}` | País de prestação |
| `{{SERVICO_DESCRICAO}}` | Descrição do serviço |

### ISSQN

| Placeholder | Conteúdo |
|---|---|
| `{{ISSQN_TPIMUNICIPAL}}` | Tipo de tributação ISSQN |
| `{{ISSQN_CPAISRESULT}}` | País de resultado |
| `{{ISSQN_CMUNICIPIO}}` | Município de incidência |
| `{{ISSQN_REGESPECIA}}` | Regime especial |
| `{{ISSQN_TPIMUNIDADE}}` | Tipo de imunidade |
| `{{ISSQN_TPSUSP_TEXT}}` | Exigibilidade suspensa (Sim/Não) |
| `{{ISSQN_NPROCESSO}}` | Número do processo |
| `{{ISSQN_NBM}}` | Número do benefício municipal |
| `{{ISSQN_VSERVICO}}` | Valor do serviço |
| `{{ISSQN_VDESCINCOND}}` | Desconto incondicional |
| `{{ISSQN_VDEDUCOES}}` | Deduções/reduções |
| `{{ISSQN_VBASE}}` | Base de cálculo |
| `{{ISSQN_PALIQ}}` | Alíquota |
| `{{ISSQN_RET}}` | Retenção do ISSQN |
| `{{ISSQN_VCALCBM}}` | ISSQN apurado |

### Tributos federais

| Placeholder | Conteúdo |
|---|---|
| `{{IRRF_VALUE}}` | IRRF |
| `{{FED_CONTRIB_PREV}}` | Contribuição previdenciária (CP) |
| `{{FED_CONTRIB_SOC}}` | CSLL |
| `{{FED_CONTRIB_SOC_DESC}}` | Descrição da contribuição social |
| `{{FED_PIS_PROPRIO}}` | PIS |
| `{{FED_COFINS_PROPRIO}}` | COFINS |

### Financeiro

| Placeholder | Conteúdo |
|---|---|
| `{{FINANCEIRO_VSERVICO}}` | Valor do serviço |
| `{{FINANCEIRO_VDESCCONDICIONAL}}` | Desconto condicional |
| `{{FINANCEIRO_VDESCONTOINCOND}}` | Desconto incondicional |
| `{{FINANCEIRO_VISSQN_RETIDO}}` | ISSQN retido |
| `{{FINANCEIRO_TOTALRET}}` | Total de retenções federais |
| `{{FINANCEIRO_PISCOFINS_PROPRIO}}` | PIS + COFINS |
| `{{FINANCEIRO_VLIQ}}` | Valor líquido |

### Tributação total / IBS-CBS

| Placeholder | Conteúdo |
|---|---|
| `{{TRIB_PCT_FED}}` | % tributos federais |
| `{{TRIB_PCT_EST}}` | % tributos estaduais |
| `{{TRIB_PCT_MUN}}` | % tributos municipais |
| `{{COMPL_NBS}}` | Código NBS |
| `{{IBSCBS_VBC}}` | Base de cálculo IBS/CBS |
| `{{IBSCBS_PIBSUF}}` / `{{IBSCBS_VIBSUF}}` | Alíquota / valor IBS UF |
| `{{IBSCBS_PIBSMUN}}` / `{{IBSCBS_VIBSMUN}}` | Alíquota / valor IBS Município |
| `{{IBSCBS_PCBS}}` / `{{IBSCBS_VCBS}}` | Alíquota / valor CBS |
| `{{IBSCBS_VIBSTOT}}` | Total IBS |
| `{{IBSCBS_VTOTNF}}` | Valor total da NF |

### Substituição / Complemento

| Placeholder | Conteúdo |
|---|---|
| `{{SUBST_CHAVE}}` | Chave da NFS-e substituída |
| `{{SUBST_CMOTIVO}}` | Código do motivo |
| `{{SUBST_XMOTIVO}}` | Descrição do motivo |
| `{{COMPLEMENTO_XOUTINF}}` | Outras informações |
| `{{COMPLEMENTO_XINFADINAL}}` | Informações complementares |
| `{{COMPLEMENTO_IDDOCTEC}}` | ID do documento técnico |
| `{{COMPLEMENTO_DOCREF}}` | Documento de referência |
| `{{COMPLEMENTO_XPED}}` | Número do pedido |
| `{{IS_CANCELADA}}` | `block`/`none` — controla a tarja de cancelada |

## Blocos condicionais

Trechos delimitados por `{{CHAVE:BEGIN}} … {{CHAVE:END}}` são **removidos**
quando a flag correspondente é falsa. Use para esconder seções inteiras:

```html
{{TOMADOR_IDENTIFIED:BEGIN}}
  <div class="section">... dados do tomador ...</div>
{{TOMADOR_IDENTIFIED:END}}
```

| Flag | Verdadeira quando |
|---|---|
| `TOMADOR_IDENTIFIED` | Tomador tem CNPJ/CPF/nome |
| `INTERM_DADOS_IDENTIFIED` | Intermediário tem CNPJ/CPF |
| `INTERM_NAO_IDENTIFICADO` | Intermediário **não** identificado |
| `SUBSTITUICAO_IDENTIFIED` | NFS-e substitui outra |
| `IBSCBS_IDENTIFIED` | Há grupo IBS/CBS |
| `IS_CANCELADA` | NFS-e cancelada |

## Marca d'água

```ts
const danfe = new DanfeService({
  templatePath: './meu-template.html',
  isPreview: true,
  watermarkText: 'CÓPIA',
})
```

- `isPreview: true` injeta a marca d'água sobre o documento.
- `watermarkText` define o texto (padrão `SEM VALOR FISCAL`).

## Placeholders não preenchidos

Qualquer placeholder `{{...}}` que sobrar no template após a substituição é
trocado por `-` e gera um aviso em `result.warnings`:

```ts
const { warnings } = await danfe.generateFromXml(xml)
for (const w of warnings) {
  if (w.code === 'PLACEHOLDER_EMPTY') console.warn('Placeholder vazio:', w.field)
}
```

Útil para detectar erros de digitação nos nomes dos placeholders.

## Limitações

Os campos `fontFamily`, `fontSize` e `logoPath` em `DanfeOptions` **ainda não
têm efeito** na renderização. Para mudar fonte, tamanho ou logotipo, edite
diretamente o CSS/markup do seu template HTML.
