# Exemplos de uso — nfse-nacional

Exemplos de como consumir a biblioteca `nfse-nacional` em um projeto externo.

## Configuração

### 1. Instalar a biblioteca

**Via npm (após publicação):**
```bash
bun add nfse-nacional
# ou
npm install nfse-nacional
```

**Via path local (para testar antes de publicar):**
```bash
bun add ../gerador-nfse-nacional-bun
# ou adicionar no package.json:
# "nfse-nacional": "file:../gerador-nfse-nacional-bun"
```

### 2. Certificado digital

Coloque seu arquivo `.pfx` na raiz do projeto e defina a senha:

```bash
export CERT_PASSWORD=sua_senha
```

---

## Exemplos disponíveis

| Arquivo | Descrição |
|---|---|
| [`1-emitir-nfse.ts`](./1-emitir-nfse.ts) | Emissão em produção com dados reais |
| [`2-homologacao.ts`](./2-homologacao.ts) | Emissão em homologação com CPF/CNPJ gerados automaticamente |
| [`3-danfe.ts`](./3-danfe.ts) | Geração de DANF-Se em PDF a partir do XML da NFS-e |

---

## Executar

```bash
# Exemplo 1 — produção
bun run examples/1-emitir-nfse.ts

# Exemplo 2 — homologação (não precisa de dados reais)
bun run examples/2-homologacao.ts

# Exemplo 3 — DANF-Se (requer puppeteer e um nfse.xml válido)
bun add puppeteer
bun run examples/3-danfe.ts
```

---

## Fluxo resumido

```
generateCnpj() / generateCpf()   → gera documentos válidos para teste
calculateTax(valorServico, 5)     → calcula ISS (5% = R$ 50 sobre R$ 1.000)
validateDps(dps)                  → valida regras de negócio antes de enviar
ContribuinteService.emitir(dps)   → assina, comprime e envia para a SEFIN
DanfeService.generateFromXml(xml) → gera PDF da DANF-Se
```
