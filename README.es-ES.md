

# nfse-nacional

> SDK TypeScript para la emisión de **NFS-e Nacional** a través de la API SEFIN del gobierno federal.
> Compatible con **Node.js ≥ 18** y **Bun ≥ 1.0**.

<!--
Badges — descomente após publicar no npm e configurar CI:

[![npm version](https://img.shields.io/npm/v/nfse-nacional.svg)](https://www.npmjs.com/package/nfse-nacional)
[![npm downloads](https://img.shields.io/npm/dm/nfse-nacional.svg)](https://www.npmjs.com/package/nfse-nacional)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build](https://github.com/andrejfg/gerador-nfse-nacional-bun/actions/workflows/ci.yml/badge.svg)](https://github.com/andrejfg/gerador-nfse-nacional-bun/actions)
-->

---

## ¿Qué es

El **nfse-nacional** es un SDK TypeScript para la integración con la [API SEFIN Nacional](https://www.nfse.gov.br/EmissorNacional/Login) — la plataforma del gobierno federal para la emisión de Notas Fiscales de Servicios electrónicas (NFS-e) por parte de los municipios adheridos al programa.

Se encarga de toda la pipeline técnica:

```
Sus datos  →  DPS (XML)  →  XMLDSig (RSA-SHA256)  →  GZip+Base64  →  API SEFIN  →  NFS-e
```

También genera la **DANF-Se** (documento auxiliar de la NFS-e) en HTML o PDF, con soporte para vista previa antes de la emisión.

---

## Funcionalidades

| Área | Recurso |
|---|---|
| **Emisión** | Construye, valida, firma y envía el DPS a la API SEFIN |
| **Firma digital** | XMLDSig RSA-SHA256 con certificado A1 (.pfx / buffer) |
| **Compresión** | GZip + Base64 (formato obligatorio de la API) |
| **mTLS** | Autenticación mutua con certificado digital |
| **Validación** | Schema Zod + reglas de negocio antes del envío |
| **Consulta** | NFS-e por clave de acceso, DPS por ID, eventos por tipo |
| **Cancelación** | Registro de evento con preverificación y errores tipados |
| **DANF-Se** | Renderiza HTML y genera PDF vía Puppeteer |
| **Vista previa** | Genera DANF-Se con marca de agua _antes_ de la emisión |
| **Parser XML** | Convierte el XML de la NFS-e en objetos TypeScript |
| **Utilidades** | Formateo de CPF/CNPJ, generación de IDs, cálculo de impuestos |

---

## Compatibilidad

| Runtime | Versión mínima | Observaciones |
|---|---|---|
| **Node.js** | 18.0.0 | Probado con 18 LTS y 20 LTS |
| **Bun** | 1.0.0 | Entorno de ejecución principal de desarrollo |

> La compilación generada (`dist/`) utiliza ESM puro y es compatible con cualquier entorno que soporte `import`.

---

## Instalación

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

### Generación de DANF-Se en PDF (opcional)

La generación de PDF utiliza [Puppeteer](https://pptr.dev), la cual es una dependencia **opcional**.
Instále solo si necesita PDF:

```bash
npm install puppeteer
# ou
bun add puppeteer
```

> Sin Puppeteer, la generación de HTML de la DANF-Se funciona normalmente.
> Solo la conversión a PDF requiere Chrome headless.

---

## Inicio rápido

### 1. Configure el contexto

```typescript
import { ContribuinteService, TipoAmbiente, type NfseContext } from 'nfse-nacional'

const context: NfseContext = {
  ambiente: TipoAmbiente.Homologacao,   // o TipoAmbiente.Producao
  certificatePath: './certificado.pfx', // ruta al archivo .pfx
  certificatePassword: 'senha_cert',
  codigoMunicipio: '3106200',           // código IBGE de 7 dígitos (municipio del prestador)
}
```

Alternativamente, cargue el certificado en memoria (ideal para entornos serverless):

```typescript
import { readFile } from 'node:fs/promises'

const context: NfseContext = {
  ambiente: TipoAmbiente.Homologacao,
  certificateData: await readFile('./certificado.pfx'),  // ArrayBuffer | Buffer
  certificatePassword: 'senha_cert',
  codigoMunicipio: '3106200',
}
```

### 2. Construya y emita el DPS

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
const cnpjPrestador = '00000000000000'   // reemplace por el CNPJ real
const codIbge = '3106200'               // código IBGE del municipio

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
        cServTribNac: '010100163',  // cód. tributación nacional
        cNBSPrinc: '109102000',     // cód. NBS — consulte la tabla oficial
      },
      xDescServ: 'Descripción del servicio prestado.',
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

// Valida antes de enviar (opcional — emitir() también valida internamente)
const validation = validateDps(dps)
if (!validation.isValid) {
  console.error(validation.errors)
  process.exit(1)
}

const service = new ContribuinteService(context)
const response = await service.emitir(dps)

console.log('cStat      :', response.cStat)       // '100' = aprobado
console.log('xMotivo    :', response.xMotivo)
console.log('chaveAcesso:', response.chaveAcesso)
console.log('nNFSe      :', response.nfse?.infNfse?.nNFSe)
```

---

## Cancelación de NFS-e

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
    chNFSe: '<chave-de-acesso-50-digitos>',  // clave de acceso (50 dígitos)
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
    // Nota no existe en SEFIN — cancelación abortada por el SDK
    console.error('NFS-e nao encontrada:', err.chaveAcesso)
  } else if (err instanceof NfseJaCanceladaError) {
    // API retornó E0840 — nota ya tiene cancelación vinculada
    console.warn('NFS-e ja esta cancelada:', err.chaveAcesso)
  } else {
    throw err
  }
}
```

El método `cancelar` realiza una **consulta previa** antes de enviar el evento.
Si la NFS-e no se encuentra, lanza `NfseNaoEncontradaError` sin llamar al endpoint de eventos.
Si ya está cancelada (E0840), lanza `NfseJaCanceladaError`.

---

## Generación de la DANF-Se

### A partir del XML de la NFS-e (devuelto por la API)

```typescript
import { DanfeService } from 'nfse-nacional'
import { writeFileSync } from 'node:fs'

const danfe = new DanfeService()

// PDF
const result = await danfe.generateFromXml(xmlNfse, {
  chaveAcesso: response.chaveAcesso,  // necesario cuando el XML no contiene <chNFSe>
})
writeFileSync('nota.pdf', result.pdfBytes)

// HTML (sin Puppeteer)
console.log(result.html)
```

### A partir del GZip+Base64 devuelto por la API

```typescript
const result = await danfe.generateFromGzipB64(response.nfseXmlGZipB64, {
  chaveAcesso: response.chaveAcesso,
})
writeFileSync('nota.pdf', result.pdfBytes)
```

### Vista previa antes de la emisión (sin certificado, sin API)

Genera una DANF-Se con **marca de agua "PREVIA — SIN VALOR FISCAL"** a partir de los datos
del DPS, sin necesidad de certificado o conexión con la API.

```typescript
import { DanfeService, DanfePreviewFormat } from 'nfse-nacional'

const danfe = new DanfeService()

// Vista previa en HTML (sin Puppeteer)
const preview = await danfe.previewFromDps(dps.infDps, {
  format: DanfePreviewFormat.Html,
})
writeFileSync('preview.html', preview.html)

// Vista previa en PDF (requiere Puppeteer)
const preview = await danfe.previewFromDps(dps.infDps, {
  format: DanfePreviewFormat.Pdf,
})
writeFileSync('preview.pdf', preview.pdfBytes!)
```

---

## Referencia de la API

### `ContribuinteService`

| Método | Descripción |
|---|---|
| `emitir(dps)` | Valida, firma y envía el DPS a la API SEFIN. Retorna `EmissaoNfseResponse`. |
| `consultar(chaveAcesso)` | Consulta una NFS-e por clave de acceso (50 dígitos). |
| `consultarDps(idDps)` | Consulta el estado de un DPS por ID (42 dígitos numéricos). |
| `verificarDps(idDps)` | Verifica si un DPS existe en SEFIN (retorna `boolean`). |
| `cancelar(evento)` | Registra evento de cancelación con preverificación. |
| `consultarEventos(chaveAcesso)` | Lista todos los eventos de una NFS-e. |
| `consultarEventosPorTipo(chave, tipo)` | Lista eventos de un tipo específico (`TipoEvento`). |
| `consultarEvento(chave, tipo, seq?)` | Consulta un evento específico por tipo y número secuencial. |
| `downloadDanfse(chaveAcesso)` | Descarga la DANF-Se en PDF directamente de SEFIN (cuando esté disponible). |
| `consultarAliquota(codMun, codServ)` | Consulta alícuota de ISSQN por municipio y código de servicio. |
| `consultarConvenio(codMunicipio)` | Consulta parámetros de convenio del municipio con SEFIN. |

### Errores tipados

| Clase | Cuándo se lanza |
|---|---|
| `DpsValidationError` | DPS inválido (schema/regnias de negocio) antes de llamar a la API |
| `NfseNaoEncontradaError` | NFS-e no localizada en SEFIN durante la preverificación del cancelación |
| `NfseJaCanceladaError` | API retornó E0840 — nota ya tiene cancelación vinculada |
| `NfseApiError` | Error HTTP genérico de la API SEFIN (acceda a `.statusCode` y `.body`) |

### `DanfeService`

| Método | Descripción |
|---|---|
| `generateFromXml(xml, opts?)` | Genera HTML + PDF a partir del XML de la NFS-e. |
| `generateFromGzipB64(b64, opts?)` | Genera HTML + PDF a partir del GZip+Base64 devuelto por la API. |
| `generate(schema, opts?)` | Genera HTML + PDF a partir de un `NfseSchema` ya analizado. |
| `saveToFile(xml, path, isGzip?, opts?)` | Genera el PDF y guarda directamente en un archivo. |
| `previewFromDps(dps, opts?)` | Genera vista previa con marca de agua **antes** de la emisión. |

> **Personalización de la DANF-Se** (plantilla HTML propia, marcadores de posición, marca de agua): consulte [docs/danfe-personalizada.md](docs/danfe-personalizada.md).

**`DanfeGenerateOptions`**

```typescript
{
  chaveAcesso?: string   // inyecta <chNFSe> cuando está ausente en el XML
  isCancelled?: boolean  // muestra marca de agua de cancelación
  danfe?: DanfeOptions   // opciones de renderizado (fuente, plantilla personalizada)
  pdf?: PdfOptions       // opciones de Puppeteer (pageSize, etc.)
}
```

### Funciones utilitarias

```typescript
// Generación de IDs
generateDpsId(cnpj, codMun, serie, numeroDps)  // ID en formato SEFIN (45 chars)
generateNumDps()                               // número secuencial único (timestamp)

// Formateo de fechas
formatDataCompetencia(date?)                   // 'YYYY-MM-DD'
formatDhEmissao(date, offsetHours)             // ISO 8601 con offset BRT

// Formateo de documentos
formatCpf(cpf)     // '000.000.000-00'
formatCnpj(cnpj)   // '00.000.000/0000-00'
formatCep(cep)     // '00000-000'

// Otros
calculateTax(base, aliquota)   // base × alícuota / 100
validateDps(dps)               // { isValid, errors }
parseNfseXml(xml)              // NfseSchema
```

---

## Enums principales

```typescript
import {
  TipoAmbiente,             // Producao = 1, Homologacao = 2
  EmitenteDPS,              // Prestador = 1, Tomador = 2, Intermediario = 3
  TributacaoIssqn,          // OperacaoTributavel = 1, Imunidade = 2, ExportacaoServico = 3, NaoIncidencia = 4
  TipoRetencaoIssqn,        // NaoRetido = 1, RetidoTomador = 2, RetidoIntermediario = 3
  OpcaoSimplesNacional,     // NaoOptante = 1, Optante = 2
  RegimeEspecialTributacao,
  TipoEvento,               // Los 15 tipos del XSD (cancelación, manifestación, oficio)
  MotivoEventoCancelamento, // ErroNaEmissao = 1, ServicoNaoPrestado = 2, Outros = 9
  DanfePreviewFormat,       // Html = 'html', Pdf = 'pdf'
  DanfeEnvironment,         // Production = 1, Restricted = 2
} from 'nfse-nacional'
```

### `TipoEvento` — tipos de evento del XSD

```typescript
// Cancelación (iniciada por el contribuyente)
TipoEvento.Cancelamento                        // e101101 — cancelación directa (requiere cMotivo)
TipoEvento.CancelamentoPorSubstituicao         // e105102 — sustitución por nueva nota
TipoEvento.SolicitacaoAnaliseFiscal            // e101103 — solicitud de análisis fiscal
TipoEvento.CancelamentoDeferidoAnaliseFiscal   // e105104
TipoEvento.CancelamentoIndeferidoAnaliseFiscal // e105105
```

---

## Configuración (`NfseContext`)

```typescript
interface NfseContext {
  /** Entorno de emisión */
  ambiente: TipoAmbiente

  /** Ruta al .pfx en disco */
  certificatePath?: string

  /** Contenido del .pfx en memoria (alternativa a la ruta) */
  certificateData?: ArrayBuffer | Buffer

  /** Contraseña del certificado .pfx */
  certificatePassword: string

  /** Código IBGE del municipio (7 dígitos) */
  codigoMunicipio?: string

  /** Endpoint personalizado (anula el predeterminado de SEFIN) */
  endpoint?: { producao: string; homologacao: string }

  /**
   * Cuando es true, guarda los XMLs generados (antes y después de la firma)
   * en la carpeta debug/ antes de enviar a la API.
   */
  debug?: boolean
}
```

---

## Ejemplos

La carpeta [`examples/`](./examples) contiene scripts listos para usar:

| # | Archivo | Descripción |
|---|---|---|
| 1 | `1-homologacao.ts` | Emisión en homologación — certificado vía archivo |
| 2 | `1b-homologacao-buffer.ts` | Emisión en homologación — certificado en memoria (ArrayBuffer) |
| 3 | `3-homologacao-pf.ts` | Emisión con tomador persona física (CPF) |
| 4 | `4-danfe.ts` | Generación de DANF-Se a partir de un XML existente |
| 5 | `5-emitir-e-danfe.ts` | Emisión + generación automática de DANF-Se en PDF |
| 6 | `6-preview-danfe.ts` | Vista previa de la DANF-Se antes de la emisión (marca de agua) |
| 7 | `7-consulta.ts` | Consulta de NFS-e por clave de acceso o ID del DPS |
| 8 | `8-cancelamento.ts` | Cancelación de NFS-e con registro de evento |
| 9 | `9-render-xml.ts` | Renderiza la DANF-Se de cualquier XML (NFS-e o DPS suelto) |
| 10 | `10-extrair-emitir-comparar.ts` | Round-trip: parse → `DpsData` → `buildDpsXml` → compara con el original |
| 11 | `11-emitir-exterior.ts` | Emisión al exterior (tomador por NIF + `endExt` + `comExt`) + DANF-Se |
| 12 | `12-emitir-exterior-sem-nif.ts` | Emisión al exterior con tomador sin NIF (`cNaoNIF` + `endExt` + `comExt`) + DANF-Se |

### Configurar y ejecutar los ejemplos

```bash
# 1. Copie la plantilla de variables de entorno
cp examples/.env.example examples/.env

# 2. Complete examples/.env con sus datos reales:
#    CERT_PATH, CERT_PASSWORD, CNPJ_PRESTADOR, etc.

# 3. Ejecute un ejemplo por número
bun run example 1   # ou 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
```

> **Datos sensibles locales:** Si prefiere codificar los datos directamente en el código,
> cree un archivo `*.local.ts` junto al ejemplo (ej: `1-homologacao.local.ts`).
> Estos archivos son ignorados por git (`.gitignore`) y tienen **prioridad automática**
> sobre el archivo base cuando ejecuta `bun run example <n>`.

---

## Estructura del proyecto

```
nfse-nacional/
├── src/
│   ├── types/          # Enums, DTOs (InfDpsData, PrestadorData, …), NfseContext
│   ├── xml/            # DPS builder, analizador NFS-e, constructor de eventos
│   ├── crypto/         # Certificado A1 (node-forge), firmador XMLDSig, compresión
│   ├── http/           # SefinClient — mTLS + análisis de respuestas de la API
│   ├── service/        # ContribuinteService — orquestación de alto nivel
│   ├── danfe/          # Renderizador HTML, generador PDF (Puppeteer), constructor de vista previa
│   ├── validator/      # Schema Zod + reglas de negocio (validador DPS)
│   ├── utils/          # CPF/CNPJ, generador ID, cálculo de impuestos, resolutor de endpoint
│   └── index.ts        # Exportaciones públicas del paquete
├── assets/
│   ├── templates/
│   │   └── danfe.html  # Plantilla HTML de la DANF-Se (personalizable)
│   └── municipios.csv  # Tabla IBGE de municipios para búsqueda en el PDF
├── tests/
│   ├── crypto/         # Pruebas de firma y compresión
│   ├── utils/          # Pruebas de utilidades
│   ├── validator/      # Pruebas del validador de DPS
│   ├── xml/            # Pruebas del constructor y analizador XML
│   ├── danfe/          # Pruebas de vista previa y renderizado
│   └── e2e/            # Pruebas end-to-end contra el dist compilado
├── examples/           # Scripts de ejemplo (consulte arriba)
├── dist/               # Compilación (generada por `bun run build`)
└── package.json
```

---

## Desarrollo y contribución

### Requisitos previos

- [Bun](https://bun.sh) >= 1.0

```bash
# Clonar el repositorio
git clone https://github.com/andrejfg/gerador-nfse-nacional-bun.git
cd gerador-nfse-nacional-bun

# Instalar dependencias
bun install
```

### Scripts disponibles

```bash
bun run build          # Compila src/ → dist/ (JS + tipos)
bun run test           # Ejecuta el conjunto de pruebas unitarias y de integración
bun run test:e2e       # Ejecuta las pruebas e2e contra el dist compilado
bun run test:coverage  # Pruebas con informe de cobertura
bun run typecheck      # Verificación de tipos sin generar archivos
bun run lint           # Linting con Biome
bun run lint:fix       # Linting con autocorrección
bun run format         # Formateo con Biome
bun run example <n>    # Ejecuta el ejemplo número <n> (1–11)
```

### Ejecutando las pruebas

```bash
# Pruebas unitarias (no requieren certificado ni API)
bun run test

# Pruebas e2e (requieren compilación previa)
bun run build && bun run test:e2e
```

### Flujo de trabajo de contribución

1. Cree una rama a partir de `main`: `git checkout -b feat/minha-funcionalidade`
2. Implemente los cambios con las pruebas correspondientes
3. Asegúrese de que `bun run test` pase sin errores
4. Asegúrese de que `bun run typecheck` no devuelva errores
5. Abra un Pull Request describiendo qué se cambió y por qué

### Publicación (mantenedores)

```bash
# El hook prepublishOnly ejecuta typecheck + test + build automáticamente
npm version patch   # o minor / major
npm publish
```

---

## Limitaciones conocidas

- **São Paulo/SP** utiliza un sistema propio (SOAP) y **no** es compatible con esta biblioteca.
  Consulte [nfe.prefeitura.sp.gov.br](https://nfe.prefeitura.sp.gov.br).
- **DANF-Se en PDF** requiere Puppeteer (Chrome headless). En entornos sin interfaz gráfica
  (Docker, CI) instale Chrome vía `apt-get install -y google-chrome-stable` o utilice
  `puppeteer/chrome` Docker image.
- El bloque **IBS/CBS** (Reforma Tributaria — NT 007/2026) es **opcional** durante el período
  de transición y omitido por defecto en los ejemplos.

---

## Referencias

- [API SEFIN Nacional — gov.br](https://www.nfse.gov.br/EmissorNacional/Login)
- [Swagger SEFIN Homologación](https://sefin.producaorestrita.nfse.gov.br/API/SefinNacional/docs/index)
- [**Manual dos Contribuintes — Sistema Nacional NFS-e v1.2 (out/2025)**](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual/manual-contribuintes-emissor-publico-api-sistema-nacional-nfs-e-v1-2-out2025.pdf) — documentación oficial de las APIs (parámetros municipales, NFS-e, DPS, eventos)
- [Documentación Técnica — Portal NFS-e](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica)
- [nfse-php](https://github.com/nfse-nacional/nfse-php) — SDK PHP usado como referencia de implementación
- [direction-nfse-danfe](https://github.com/JairoMarques/direction-nfse-danfe) — DANF-Se C# usado como referencia para la plantilla HTML

---

## Licencia

[MIT](LICENSE) © André Guimarães
