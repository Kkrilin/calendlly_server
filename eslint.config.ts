// eslint.config.ts

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

// @ts-expect-error: No type declarations for eslint-config-google
import google from 'eslint-config-google';

export default [
  js.configs.recommended,
  google,
  prettier, // disables formatting rules that conflict with Prettier
  {
    plugins: {
      prettier: pluginPrettier,
    },
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        project: './tsconfig.json',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
      indent: ['error', 2],
      'max-len': ['error', { code: 120 }],
      'object-curly-spacing': 'off',
      'no-unused-vars': 'warn',
      'arrow-parens': ['error', 'always'],
      'space-before-function-paren': ['error', 'always'],
    },
  },
];
