import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  { ignores: [
    "**/.next/**", "**/dist/**", "**/node_modules/**",
    "**/coverage/**", "**/next-env.d.ts", "**/.turbo/**"
  ] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } }
    }
  }
);
