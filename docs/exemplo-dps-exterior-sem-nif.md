# Exemplo de DPS — emissão de NFS-e para o exterior sem NIF

Mostra estrutura de um `DpsData` p/ NFS-e c/ **tomador no exterior sem NIF**
(estrangeiro sem Número de Identificação Fiscal). Cobre só o objeto de dados
— fluxo completo (certificado, envio SEFIN, DANF-Se) está em
[`examples/12-emitir-exterior-sem-nif.ts`](../examples/12-emitir-exterior-sem-nif.ts).

Para tomador estrangeiro **com** NIF, ver
[`exemplo-dps-exterior.md`](./exemplo-dps-exterior.md).

## O que muda vs DPS exterior com NIF

| Campo | Com NIF | Sem NIF |
|---|---|---|
| `tomador.nif` | informado | **omitido** |
| `tomador.codigoNaoNif` | — | **obrigatório** (`MotivoNaoNif`) |
| `tomador.endereco.exterior` (`endExt`) | informado | informado (igual) |
| `servico.comercioExterior` (`comExt`) | obrigatório | obrigatório (igual) |

`nif` e `codigoNaoNif` são mutuamente exclusivos (XSD `TCInfoPessoa`: choice
`NIF`|`cNaoNIF`). `validateDps` rejeita DPS c/ ambos ou nenhum quando o
tomador é estrangeiro.

## Valores de `MotivoNaoNif`

| Valor | Enum TS | Descrição |
|---|---|---|
| `0` | `NaoInformadoNaOrigem` | Não informado na nota de origem — ⚠️ **não emite** |
| `1` | `DispensadoDoNif` | Tomador dispensado do NIF |
| `2` | `NaoExigenciaDoNif` | País do tomador não exige NIF |

O valor `0` é aceito pelo XSD mas **rejeitado na emissão** pela SEFIN com o erro
**E0226** — ele só descreve nota de origem/substituição cujo dado não veio
preenchido. `validateDps` bloqueia antes do envio; para emitir, use `1` ou `2`
(ou informe o `nif`).

Ref. enum: [`src/types/enums.ts`](../src/types/enums.ts) (`MotivoNaoNif`).

## Objeto `DpsData` completo

```typescript
import {
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  OpcaoSimplesNacional,
  RegimeEspecialTributacao,
  MotivoNaoNif,
  ModoPrestacaoComExt,
  VinculoPrestacao,
  CodigoMoeda,
  MecAFComexPrestador,
  MecAFComexTomador,
  MovimentacaoTemporariaBens,
  EnvioMDIC,
  generateDpsId,
  generateNumDps,
  formatDhEmissao,
  formatDataCompetencia,
  type DpsData,
} from 'nfse-nacional'

const numeroDps = generateNumDps()

const dps: DpsData = {
  infDps: {
    id: generateDpsId(cnpjPrestador, codIbgePrestador, '001', numeroDps),
    tipoAmbiente: TipoAmbiente.Homologacao,
    dataEmissao: formatDhEmissao(new Date(), -3),
    numeroDps,
    serie: '001',
    dataCompetencia: formatDataCompetencia(),
    tipoEmitente: EmitenteDPS.Prestador,
    codigoLocalEmissao: codIbgePrestador,

    prestador: {
      cnpj: cnpjPrestador,
      email: 'administrativo@investimentos.one',
      regimeTributario: {
        opSimpNac: OpcaoSimplesNacional.NaoOptante,
        regEspTrib: RegimeEspecialTributacao.Nenhum,
      },
    },

    // Tomador estrangeiro SEM NIF — codigoNaoNif no lugar de nif.
    tomador: {
      codigoNaoNif: MotivoNaoNif.NaoExigenciaDoNif,
      nome: 'A.I. MULTI INVESTMENTS',
      endereco: {
        // endExt — sem cMun (IBGE). País em código alfabético.
        exterior: {
          cPais: 'VG',                 // Ilhas Virgens Britânicas
          cEndPost: 'VG 1110',
          xCidade: 'Road Town',
          xEstProvReg: 'Tortola',
        },
        xLgr: 'Wickhams Cay II',
        nro: 'S/N',
        xCpl: 'Vistra Corporate Services Centre',
        xBairro: 'N/A',
      },
    },

    servico: {
      // Serviço prestado a partir do município do prestador (local de incidência).
      localPrestacao: { cLocPrestacao: codIbgePrestador },
      codigoServico: {
        cServTribNac: '171201',       // ajustar conforme o serviço prestado
        cNBSPrinc: '109054000',       // código NBS — consultar tabela oficial
      },
      xDescServ: 'Descrição do serviço prestado ao tomador estrangeiro.',
      // comExt — obrigatório p/ tomador no exterior.
      comercioExterior: {
        mdPrestacao: ModoPrestacaoComExt.Transfronteirico,
        vincPrest: VinculoPrestacao.SemVinculo,
        tpMoeda: CodigoMoeda.DolarEUA,   // código da moeda (tabela BACEN)
        vServMoeda: 278.98,              // valor na moeda estrangeira
        mecAFComexP: MecAFComexPrestador.Nenhum,
        mecAFComexT: MecAFComexTomador.Nenhum,
        movTempBens: MovimentacaoTemporariaBens.Nao,
        mdic: EnvioMDIC.NaoEnviar,
      },
    },

    valores: {
      vServico: 1438.42,
    },

    tributacao: {
      issqn: {
        tributacaoIssqn: TributacaoIssqn.OperacaoTributavel,
        tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      },
      federal: {
        cstPisCofins: '00',
      },
      percentualTotalTributosFederais: 11.33,
      percentualTotalTributosEstaduais: 0.00,
      percentualTotalTributosMunicipais: 2.00,
    },
  },
}
```

## Validação

Antes de enviar, valide sempre:

```typescript
import { validateDps } from 'nfse-nacional'

const validation = validateDps(dps)
if (!validation.isValid) {
  console.error(validation.errors)
}
```

## Fluxo completo

Para emissão real (certificado, envio à SEFIN, geração de DANF-Se), ver
[`examples/12-emitir-exterior-sem-nif.ts`](../examples/12-emitir-exterior-sem-nif.ts).
