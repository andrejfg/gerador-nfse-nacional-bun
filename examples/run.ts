export {};

  import { existsSync } from 'node:fs';

const num = process.argv[2];

const examples: Record<string, string> = {
  "1": "examples/1-homologacao.ts",
  "2": "examples/2-homologacao-buffer.ts",
  "3": "examples/3-homologacao-pf.ts",
  "4": "examples/4-danfe.ts",
  "5": "examples/5-emitir-e-danfe.ts",
  "6": "examples/6-preview-danfe.ts",
  "7": "examples/7-consulta.ts",
  "8": "examples/8-cancelamento.ts",
  "9": "examples/9-render-xml.ts",
  "10": "examples/10-extrair-emitir-comparar.ts",
  "11": "examples/11-emitir-exterior.ts",
  "12": "examples/12-emitir-exterior-sem-nif.ts",
  "13": "examples/13-emitir-ibs-cbs.ts",
  "14": "examples/14-emitir-exterior-ibs-cbs.ts",
};

const base = examples[num];

if (!base) {
  console.error(`Exemplo inválido: "${num}". Use: bun run example <${Object.keys(examples).join("|")}>`);
  process.exit(1);
}

const local = base.replace(/\.ts$/, '.local.ts');
const file  = existsSync(local) ? local : base;

if (file === local) {
  console.log(`▶ Usando versão local: ${local}\n`);
}

const extraArgs = process.argv.slice(3);
const proc = Bun.spawn(["bun", file, ...extraArgs], { stdio: ["inherit", "inherit", "inherit"] });
process.exit(await proc.exited);
