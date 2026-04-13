import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm", "cjs"],
	target: "node18",
	outDir: "dist",
	sourcemap: true,
	clean: true,
	splitting: false,
	shims: true,
	outExtension: ({ format }) => ({
		js: format === "cjs" ? ".cjs" : ".js",
	}),
	external: [
		"xml-crypto",
		"fast-xml-parser",
		"qrcode",
		"node-forge",
		"csv-parse",
		"puppeteer",
	],
});
