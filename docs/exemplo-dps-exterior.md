# Exemplo de DPS — emissão de NFS-e para o exterior

Mostra estrutura de um `DpsData` p/ NFS-e c/ **tomador no exterior**. Cobre
só o objeto de dados — fluxo completo (certificado, envio SEFIN, DANF-Se)
está em [`examples/11-emitir-exterior.ts`](../examples/11-emitir-exterior.ts).

## O que muda vs DPS nacional

| Campo | Nacional | Exterior |
|---|---|---|
| `tomador.cnpj`/`cpf` | informado | **omitido** |
| `tomador.nif` | — | informado (Número de Identificação Fiscal estrangeiro) |
| `tomador.endereco.cMun` | código IBGE | **omitido** |
| `tomador.endereco.exterior` (`endExt`) | — | informado (`cPais`, `xCidade`, …) |
| `servico.comercioExterior` (`comExt`) | — | **obrigatório** |

`cMun` e `endereco.exterior` são mutuamente exclusivos (XSD `TCEndereco`:
choice `endNac`\|`endExt`). `validateDps` rejeita DPS c/ ambos ou nenhum.

## Objeto `DpsData` completo

```typescript
import {
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  OpcaoSimplesNacional,
  RegimeEspecialTributacao,
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
      regimeTributario: {
        opSimpNac: OpcaoSimplesNacional.NaoOptante,
        regEspTrib: RegimeEspecialTributacao.Nenhum,
      },
    },

    // Tomador identificado por NIF — sem cnpj/cpf.
    tomador: {
      nif: '1234567890',
      nome: 'GLOBAL OVERSEAS HOLDINGS LLC',
      email: 'contact@example-overseas.com',
      endereco: {
        // endExt — sem cMun (IBGE). País em código alfabético.
        exterior: {
          cPais: 'SA',                 // Arábia Saudita
          cEndPost: '13332-0000',
          xCidade: 'RIYADH',
          xEstProvReg: 'ARABIA SAUDITA',
        },
        xLgr: 'VILLA',
        nro: '124',
        xCpl: 'BUSINESS DISTRICT 0000',
        xBairro: 'AL ARID UNIT 2',
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
        vServMoeda: 1000.00,             // valor na moeda estrangeira
        mecAFComexP: MecAFComexPrestador.Nenhum,
        mecAFComexT: MecAFComexTomador.Nenhum,
        movTempBens: MovimentacaoTemporariaBens.Nao,
        mdic: EnvioMDIC.NaoEnviar,
      },
    },

    valores: {
      vServico: 1000.00,
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

## Campos de `comercioExterior` (`comExt`)

| Campo XML | Campo TS | Descrição |
|---|---|---|
| `mdPrestacao` | `mdPrestacao` | Modo de prestação no comércio exterior (ex.: transfronteiriço) |
| `vincPrest` | `vincPrest` | Vínculo entre prestador e tomador (ex.: sem vínculo) |
| `tpMoeda` | `tpMoeda` | Código da moeda da transação, tabela BACEN (3 dígitos) |
| `vServMoeda` | `vServMoeda` | Valor do serviço na moeda estrangeira informada em `tpMoeda` |
| `mecAFComexP` | `mecAFComexP` | Mecanismo de apoio/fomento ao comércio exterior do prestador |
| `mecAFComexT` | `mecAFComexT` | Mecanismo de apoio/fomento ao comércio exterior do tomador |
| `movTempBens` | `movTempBens` | Indica movimentação temporária de bens |
| `mdic` | `mdic` | Compartilhamento das informações com MDIC/SECEX |

Ref. tipos: [`src/types/dtos.ts`](../src/types/dtos.ts) (`ComercioExteriorData`),
enums em `src/types/enums.ts`.

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
[`examples/11-emitir-exterior.ts`](../examples/11-emitir-exterior.ts).
