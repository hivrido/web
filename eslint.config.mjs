import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // El anillo 3D empaquetado: lo escupe esbuild desde src/cosmos/, minificado
    // y en una sola línea. Lintarlo son 980 quejas sobre código que nadie edita,
    // y entre ellas se pierden las del código que sí se escribe a mano.
    "public/cosmos/ring*.js",
  ]),
]);

export default eslintConfig;
