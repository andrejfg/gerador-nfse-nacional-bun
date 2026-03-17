# gerador-nfse-nacional-bun

Gerador de **NFS-e Nacional** em **TypeScript/Bun** — migrado de [nfse-php](https://github.com/nfse-nacional/nfse-php) e [direction-nfse-danfe](https://github.com/JairoMarques/direction-nfse-danfe).

## Funcionalidades

- ✅ **Emissão de NFS-e** via API SEFIN Nacional
- ✅ **Assinatura digital** XMLDSig (RSA-SHA256) com certificado A1 (.pfx)
- ✅ **Compressão GZip+Base64** (formato exigido pela API)
- ✅ **mTLS** com certificado digital (PKCS12)
- ✅ **Cancelamento** de NFS-e (eventos)
- ✅ **DANF-Se em PDF** (HTML → PDF via Puppeteer)
- ✅ **Parser NFS-e** (XML → objetos TypeScript)
- ✅ **Consulta** de NFS-e e DPS

## Requisitos

- [Bun](https://bun.sh) >= 1.0
- Certificado digital A1 (arquivo `.pfx`)
- Acesso à [API SEFIN Nacional](https://www.nfse.gov.br/EmissorNacional/Login)

## Instalação

```bash
bun install
```

## Uso rápido

```typescript
import {
  ContribuinteService,
  TipoAmbiente,
  EmitenteDPS,
  TributacaoIssqn,
  TipoRetencaoIssqn,
  OpcaoSimplesNacional,
  type DpsData,
  type NfseContext,
  generateDpsId,
  generateNumDps,
  formatDhEmissao,
  formatDataCompetencia,
} from './src/index.js'

const context: NfseContext = {
  ambiente: TipoAmbiente.Homologacao,
  certificatePath: './certificado.pfx',
  certificatePassword: 'sua_senha',
  codigoMunicipio: '3106200',           // Belo Horizonte/MG (7 dígitos IBGE)
}

const service = new ContribuinteService(context)

const dps: DpsData = {
  infDps: {
    id: generateDpsId('53193608000146', '3106200', '001', generateNumDps()),
    tipoAmbiente: TipoAmbiente.Homologacao,
    dataEmissao: formatDhEmissao(new Date(), -3),
    numeroDps: generateNumDps(),
    serie: '001',
    dataCompetencia: formatDataCompetencia(),
    tipoEmitente: EmitenteDPS.Prestador,
    codigoLocalEmissao: '3106200',
    prestador: {
      cnpj: '53193608000146',
      nome: 'Minha Empresa LTDA',
    },
    servico: {
      localPrestacao: { cLocPrestacao: '3106200' },
      codigoServico: { cServTribNac: '01.01.00163' },
      xDescServ: 'Desenvolvimento de software',
    },
    valores: { vServico: 1000.00, vBC: 1000.00, vISSQN: 50.00, vLiq: 950.00 },
    tributacao: {
      issqn: {
        tributacaoIssqn: TributacaoIssqn.TributadaMunicipioPrestador,
        aliquota: 0.05,
        tipoRetencaoIssqn: TipoRetencaoIssqn.NaoRetido,
      },
    },
  },
}

const response = await service.emitir(dps)
console.log(response.cStat, response.xMotivo)
```

## Gerar DANF-Se

```typescript
import { DanfeService } from './src/index.js'

const danfe = new DanfeService()

// A partir do XML da NFS-e
const result = await danfe.generateFromXml(xmlString)
Bun.write('nota.pdf', result.pdfBytes)

// A partir do GZip+Base64 retornado pela API
const result2 = await danfe.generateFromGzipB64(nfseXmlGZipB64)
```

## Exemplo completo

```bash
bun src/example.ts
```

## Estrutura do projeto

```
src/
├── types/          # Enums, DTOs, NfseContext
├── xml/            # DPS builder, NFS-e parser, eventos builder
├── crypto/         # Certificado A1 (node-forge), XMLDSig signer
├── http/           # SEFIN API client com mTLS (node:https)
├── service/        # ContribuinteService (alto nível)
├── danfe/          # HTML renderer + PDF generator (Puppeteer)
├── utils/          # CPF/CNPJ, ID generator, endpoint resolver
├── index.ts        # Exports públicos
└── example.ts      # Exemplo de uso completo
assets/
└── templates/
    └── danfe.html  # Template HTML da DANF-Se
```

## Municípios suportados

O sistema usa a **API SEFIN Nacional** (`sefin.nfse.gov.br`), que abrange todos os municípios aderentes ao programa nacional de NFS-e.

> **Nota**: São Paulo-SP usa sistema próprio (SOAP) e **não** é compatível com esta biblioteca.
> Consulte [nfe.prefeitura.sp.gov.br](https://nfe.prefeitura.sp.gov.br).

## Referências

- [API SEFIN Nacional – gov.br](https://www.nfse.gov.br/EmissorNacional/Login)
- [nfse-php](https://github.com/nfse-nacional/nfse-php) — PHP SDK (origem)
- [direction-nfse-danfe](https://github.com/JairoMarques/direction-nfse-danfe) — C# DANF-Se (origem)

## Licença

MIT
