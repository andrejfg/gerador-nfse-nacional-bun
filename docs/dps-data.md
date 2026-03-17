# DpsData — Documento Preliminar de Serviço

O **DPS (Documento Preliminar de Serviço)** é o documento eletrônico estruturado emitido
pelo contribuinte para solicitar a geração da **NFS-e** pelo sistema SEFIN Nacional.
Após validação e autorização, o SEFIN retorna a NFS-e assinada digitalmente com chave
de acesso de 43 dígitos.

**Fluxo resumido:**
```
Contribuinte → DPS (assinado) → SEFIN Nacional → NFS-e (autorizada + chave de acesso)
```

**Referência oficial:** Manual de Integração NFS-e Nacional (NT 004/2021)
→ https://www.nfse.gov.br/downloads/

---

## Estrutura geral

```
DpsData
└── infDps (InfDpsData)
    ├── [identificação e controle]
    ├── prestador  (PrestadorData)
    │   └── regimeTributario  (RegimeTributarioData)
    ├── tomador    (TomadorData)       [opcional]
    ├── intermediario (IntermediarioData) [opcional]
    ├── servico    (ServicoData)
    │   ├── localPrestacao   (LocalPrestacaoData)
    │   ├── codigoServico    (CodigoServicoData)
    │   ├── obra             (ObraData)          [opcional]
    │   └── informacaoComplemento               [opcional]
    ├── valores    (ValoresServicoData)
    └── tributacao (TributacaoData)    [opcional]
        ├── issqn   (IssqnData)
        └── federal (TributacaoFederalData)
```

---

## `DpsData`

| Campo | Tipo | Obrig. | XML (`infDPS`) | Descrição |
|-------|------|--------|----------------|-----------|
| `versao` | `string` | Não | `@versao` | Versão do esquema. Padrão: `1.00`. |
| `infDps` | `InfDpsData` | **Sim** | `infDPS` | Corpo principal do DPS. |

---

## `InfDpsData` — Identificação e controle

Localização no XML: elemento `infDPS`, atributo `Id`.

| Campo | Tipo | Obrig. | XML | Descrição |
|-------|------|--------|-----|-----------|
| `id` | `string` | **Sim** | `@Id` | Identificador único do DPS — 45 chars. Use `generateDpsId()`. |
| `tipoAmbiente` | `TipoAmbiente` | **Sim** | `tpAmb` | `1` = Produção · `2` = Homologação. |
| `dataEmissao` | `string` | **Sim** | `dhEmi` | ISO 8601 com offset. Ex.: `2024-03-15T12:00:00-03:00`. Use `formatDhEmissao()`. |
| `versaoAplicativo` | `string` | Não | `verAplic` | Versão do sistema emissor. |
| `serie` | `string` | Não | `serie` | Série do DPS, até 5 chars. Padrão: `001`. |
| `numeroDps` | `string` | **Sim** | `nDPS` | Número sequencial, até 15 dígitos. Use `generateNumDps()`. |
| `dataCompetencia` | `string` | **Sim** | `dCompet` | Mês/ano de referência fiscal: `YYYY-MM`. Use `formatDataCompetencia()`. |
| `tipoEmitente` | `EmitenteDPS` | **Sim** | `tpEmit` | Quem emite: `1` Prestador · `2` Tomador · `3` Intermediário · `4` N/A. |
| `codigoLocalEmissao` | `string` | **Sim** | `cLocEmi` | Código IBGE (7 dígitos) do município do emitente. |
| `motivoEmissao` | `MotivoEmissaoTomadorIntermediario` | Não | `motEmissao` | Obrigatório quando `tipoEmitente ≠ Prestador`. |
| `chaveNfseRejeitada` | `string` | Não | `chNFSeRej` | Chave da NFS-e rejeitada, em caso de reemissão. |
| `prestador` | `PrestadorData` | **Sim** | `prest` | Ver seção [Prestador](#prestadordata). |
| `tomador` | `TomadorData` | Não* | `toma` | Ver seção [Tomador](#tomadordata). *Obrigatório na maioria dos casos. |
| `intermediario` | `IntermediarioData` | Não | `interm` | Ver seção [Intermediário](#intermediariodata). |
| `servico` | `ServicoData` | **Sim** | `serv` | Ver seção [Serviço](#servicodata). |
| `valores` | `ValoresServicoData` | **Sim** | `valores` | Ver seção [Valores](#valoresservicodata). |
| `tributacao` | `TributacaoData` | Não | `trib` | Ver seção [Tributação](#tributacaodata). |

### `id` — formato detalhado

O campo `Id` é gerado pela função `generateDpsId()` e segue o padrão definido
no **Manual de Integração NFS-e Nacional, item 4.1.1**:

```
DPS + CodMun(7) + TipoInscrição(1) + CNPJ/CPF(14) + Série(5) + Número(15) = 45 chars

Exemplo:
DPS 3106200 1 53193608000146 00100 000000000000001
    ↑ IBGE  ↑CNPJ            ↑série ↑número
```

`TipoInscrição`: `1` = CNPJ · `2` = CPF.

---

## `PrestadorData`

Localização no XML: elemento `prest` dentro de `infDPS`.

| Campo | Tipo | Obrig. | XML | Descrição |
|-------|------|--------|-----|-----------|
| `cnpj` | `string` | Não* | `CNPJ` | 14 dígitos, sem formatação. |
| `cpf` | `string` | Não* | `CPF` | 11 dígitos, sem formatação. |
| `nif` | `string` | Não* | `NIF` | Número de Identificação Fiscal (estrangeiro). |
| `codigoNaoNif` | `string` | Não | `cNaoNIF` | Código para estrangeiro dispensado de NIF. |
| `caepf` | `string` | Não | `CAEPF` | Cadastro de Atividade Econômica da Pessoa Física, 14 dígitos. |
| `inscricaoMunicipal` | `string` | Não | `IM` | Inscrição Municipal no município de emissão. |
| `nome` | `string` | Não | `xNome` | Razão social ou nome. |
| `endereco` | `EnderecoData` | Não | `enderNac` | Ver seção [Endereço](#enderecodata). |
| `telefone` | `string` | Não | `fone` | Somente dígitos. |
| `email` | `string` | Não | `email` | E-mail de contato. |
| `regimeTributario` | `RegimeTributarioData` | Não | `regTrib` | Obrigatório para optantes do Simples Nacional. |

*Pelo menos um identificador (`cnpj`, `cpf` ou `nif`) é obrigatório.

### `RegimeTributarioData`

| Campo | Tipo | XML | Descrição |
|-------|------|-----|-----------|
| `opSimpNac` | `OpcaoSimplesNacional` | `opSimpNac` | `1` Não optante · `2` Optante. |
| `regApurSN` | `number` | `regApurSN` | `1` Competência · `2` Caixa. |
| `regEspTrib` | `RegimeEspecialTributacao` | `regEspTrib` | Regime especial municipal (MEI, cooperativa, etc.). |

---

## `TomadorData`

Localização no XML: elemento `toma` dentro de `infDPS`.

Mesmo estrutura do prestador, sem `caepf` e sem `regimeTributario`.
O tomador pode ser dispensado quando o serviço for **isento**, **imune** ou
**exportação**, conforme legislação municipal e federal.

| Campo | Tipo | XML |
|-------|------|-----|
| `cnpj` / `cpf` / `nif` | `string` | `CNPJ` / `CPF` / `NIF` |
| `inscricaoMunicipal` | `string` | `IM` |
| `nome` | `string` | `xNome` |
| `endereco` | `EnderecoData` | `enderNac` |
| `telefone` / `email` | `string` | `fone` / `email` |

---

## `IntermediarioData`

Localização no XML: elemento `interm` dentro de `infDPS`.

Preencher quando `tipoEmitente = Intermediario (3)` ou quando houver retenção
de ISSQN pelo intermediário (conforme art. 6º da LC 116/2003).

| Campo | Tipo | XML |
|-------|------|-----|
| `cnpj` / `cpf` | `string` | `CNPJ` / `CPF` |
| `inscricaoMunicipal` | `string` | `IM` |
| `nome` | `string` | `xNome` |

---

## `ServicoData`

Localização no XML: elemento `serv` dentro de `infDPS`.

### `LocalPrestacaoData` — `locPrest`

| Campo | Tipo | Obrig. | XML | Descrição |
|-------|------|--------|-----|-----------|
| `cLocPrestacao` | `string` | **Sim** | `cLocPrestacao` | Código IBGE (7 dígitos) do município onde o serviço foi prestado. Determina o ente tributante do ISSQN. |
| `cPaisPrestacao` | `string` | Não | `cPaisPrestacao` | Código BACEN do país. Informar somente para serviços no exterior. |

> ⚠️ **Ponto de atenção:** o `cLocPrestacao` determina qual município é competente para
> cobrar o ISSQN. Para serviços de tecnologia (item 1.01 da LC 116/2003), a competência
> geralmente é do município do prestador (art. 3º, caput da LC 116/2003), salvo exceções
> previstas nos incisos I a XXII do mesmo artigo.

### `CodigoServicoData` — `cServ`

| Campo | Tipo | Obrig. | XML | Descrição |
|-------|------|--------|-----|-----------|
| `cServTribNac` | `string` | **Sim** | `cServTribNac` | Código de serviço nacional, formato `XX.XX.XXXXX`. Tabela em https://www.nfse.gov.br/downloads/ |
| `cServMun` | `string` | Não | `cServMun` | Código do item da Lista de Serviços (LC 116/2003) no município. Ex.: `14.01`. |
| `cNBSPrinc` | `string` | Não | `cNBSPrinc` | Código NBS (Nomenclatura Brasileira de Serviços), formato `X.XXXX.XX.XX`. |
| `cIntContrib` | `string` | Não | `cIntContrib` | Código interno do contribuinte. Uso facultativo. |

**Exemplos de `cServTribNac` comuns:**

| Código | Descrição |
|--------|-----------|
| `01.01.00163` | Desenvolvimento e licenciamento de programas de computador |
| `01.01.00180` | Suporte técnico em tecnologia da informação |
| `17.01.00010` | Assessoria ou consultoria de qualquer natureza |
| `17.02.00010` | Análise, exame, pesquisa, coleta, compilação de dados |

### Campos diretos de `ServicoData`

| Campo | Tipo | Obrig. | XML | Descrição |
|-------|------|--------|-----|-----------|
| `xDescServ` | `string` | **Sim** | `xDescServ` | Descrição do serviço, até 2.000 caracteres. |
| `obra` | `ObraData` | Não | `obra` | Dados de ART para construção civil. |
| `informacaoComplemento` | `InformacaoComplementarData` | Não | `xInfComp` | Informações adicionais livres. |

---

## `ValoresServicoData`

Localização no XML: elemento `valores` dentro de `infDPS`.
Todos os valores em **BRL** com até 2 casas decimais.

| Campo | Tipo | Obrig. | XML | Descrição |
|-------|------|--------|-----|-----------|
| `vServico` | `number` | **Sim** | `vServico` | Valor bruto total do serviço. |
| `vDescCondicionado` | `number` | Não | `vDescCondicionado` | Desconto condicionado (vinculado a condição contratual). |
| `vDescIncondicionado` | `number` | Não | `vDescIncondicionado` | Desconto incondicionado (reduz a base de cálculo do ISSQN). |
| `vBC` | `number` | Não | `vBC` | Base de cálculo do ISSQN = `vServico − vDescIncondicionado`. |
| `vISSQN` | `number` | Não | `vISSQN` | Valor do ISSQN = `vBC × pAliq`. |
| `vLiq` | `number` | Não | `vLiq` | Valor líquido = `vServico − retenções`. |
| `pAliq` | `number` | Não | `pAliq` | Alíquota em decimal. Ex.: `0.05` = 5%. |
| `vTotalRet` | `number` | Não | `vTotalRet` | Total retido (ISSQN + federais). |

---

## `TributacaoData`

Localização no XML: elemento `trib` dentro de `infDPS`.

### `IssqnData` — `tribISSQN`

| Campo | Tipo | XML | Descrição |
|-------|------|-----|-----------|
| `tributacaoIssqn` | `TributacaoIssqn` | `tribISSQN` | Situação tributária: 1 Prestador · 2 Tomador · 3 Isento · 4 Não incidente · 5 Imune · 6 Exportação · 7 Simples Nacional. |
| `tipoImunidade` | `TipoImunidade` | `tpImun` | Fundamento da imunidade (quando `tributacaoIssqn = 5`). |
| `tipoSuspensao` | `TipoSuspensao` | `tpSuspensao` | Tipo de suspensão judicial ou administrativa. |
| `numeroProcessoSuspensao` | `string` | `nProcessoSuspensao` | Número do processo de suspensão. |
| `tipoRetencaoIssqn` | `TipoRetencaoIssqn` | `tpRetISSQN` | 1 Não retido · 2 Retido pelo tomador · 3 Retido pelo intermediário. |
| `aliquota` | `number` | `pAliq` | Alíquota em decimal. Limites: 2% (mín.) a 5% (máx.) — LC 116/2003, art. 8º. |
| `exigibilidadeISS` | `number` | `exigISSQN` | Exigibilidade do ISS conforme LC 116/2003. |
| `cMunFG` | `string` | `cMunFG` | Município do fato gerador, quando diferente do local de prestação. |

### `TributacaoFederalData` — `tribFed`

Aplicável quando o tomador for **pessoa jurídica obrigada a reter** IRRF, CSLL,
PIS e COFINS (IN RFB 1.234/2012).

| Campo | Tipo | XML | Descrição |
|-------|------|-----|-----------|
| `valorRetidoIrrf` | `number` | `vRetIRRF` | IRRF retido na fonte. |
| `valorRetidoCsll` | `number` | `vRetCSLL` | CSLL retida na fonte. |
| `cstPisCofins` | `string` | `cstPisCofins` | CST do PIS/COFINS. |
| `baseCalculoPisCofins` | `number` | `vBCPisCofins` | Base de cálculo do PIS e COFINS. |
| `aliquotaPis` | `number` | `pAliqPis` | Alíquota PIS em decimal. Ex.: `0.0065`. |
| `aliquotaCofins` | `number` | `pAliqCofins` | Alíquota COFINS em decimal. Ex.: `0.03`. |
| `valorPis` | `number` | `vPis` | Valor do PIS. |
| `valorCofins` | `number` | `vCofins` | Valor do COFINS. |
| `tipoRetencaoPisCofins` | `TipoRetencaoPisCofins` | — | `0` Não retido · `1` Retido. |

### Campos de total de tributos

| Campo | XML | Descrição |
|-------|-----|-----------|
| `percentualTotalTributosSN` | `pTotTribSN` | Percentual total conforme faixa do Simples Nacional. |
| `valorTotalTributosFederais` | — | Para exibição obrigatória no DANF-Se (Lei 12.741/2012). |
| `valorTotalTributosEstaduais` | — | Idem. |
| `valorTotalTributosMunicipais` | — | Inclui o ISSQN. |
| `indicadorTotalTributos` | `indTotTrib` | `0` Não informado · `1` Informado. |

---

## `EnderecoData`

Reutilizado em `PrestadorData`, `TomadorData` e `TomadorData`.
Localização no XML: elemento `enderNac`.

| Campo | Tipo | Obrig. | XML | Descrição |
|-------|------|--------|-----|-----------|
| `cMun` | `string` | **Sim** | `cMun` | Código IBGE do município, 7 dígitos. Ex.: `3106200`. |
| `xLgr` | `string` | Não | `xLgr` | Logradouro (rua, avenida, etc.). |
| `nro` | `string` | Não | `nro` | Número. |
| `xCpl` | `string` | Não | `xCpl` | Complemento. |
| `xBairro` | `string` | Não | `xBairro` | Bairro. |
| `uf` | `string` | Não | `UF` | Sigla do estado. Ex.: `MG`. |
| `cep` | `string` | Não | `CEP` | CEP sem hífen, 8 dígitos. Ex.: `30100000`. |
| `cPais` | `string` | Não | `cPais` | Código BACEN do país. Padrão: `1058` (Brasil). |
| `xMun` | `string` | Não | `xMun` | Nome do município por extenso. |

---

## Funções utilitárias relacionadas

| Função | Módulo | Uso |
|--------|--------|-----|
| `generateDpsId(cnpj, ibge, serie, numero)` | `utils/id-generator` | Gera o `id` do DPS no formato oficial (45 chars). |
| `generateNumDps()` | `utils/id-generator` | Gera `numeroDps` baseado em timestamp. |
| `formatDataCompetencia(date)` | `utils/id-generator` | Formata `dataCompetencia` como `YYYY-MM`. |
| `formatDhEmissao(date, offset)` | `utils/id-generator` | Formata `dataEmissao` como ISO 8601 com offset BRT. |
| `buildDpsXml(dps, cert)` | `xml/dps-builder` | Serializa `DpsData` em XML assinado, comprimido e encodado em Base64. |
| `loadCertificate(pfxPath, password)` | `crypto/certificate` | Carrega o certificado A1 (.pfx) necessário para assinar o DPS. |
