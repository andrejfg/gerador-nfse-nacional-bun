import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	target: "node18",
	outDir: "dist",
	sourcemap: true,
	clean: true,
	splitting: false,
	outExtension: () => ({ js: ".js" }),
	external: [
		"xml-crypto",
		"fast-xml-parser",
		"qrcode",
		"node-forge",
		"csv-parse",
		"puppeteer",
	],
});
