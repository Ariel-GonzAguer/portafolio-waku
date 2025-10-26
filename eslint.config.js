import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Reglas adicionales para mantenibilidad
      'max-lines': ['warn', { max: 1000, skipBlankLines: true, skipComments: true }], // Máximo 1000 líneas por archivo
      'max-lines-per-function': ['warn', { max: 750, skipBlankLines: true, skipComments: true }], // Máximo 750 líneas por función
      'no-console': 'warn', // Advertir sobre el uso de console.log
      '@typescript-eslint/no-explicit-any': 'error', // Prohibir el uso de 'any'
    },
  },
  {
    files: ['src/utils/logger.ts', 'src/test/logger.test.ts', 'src/test/setup.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['api/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      'no-var': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
