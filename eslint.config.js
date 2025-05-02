import js from '@eslint/js';
import google from 'eslint-config-google';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended, // Base recommended rules from ESLint
  google, // Google style guide as the base configuration
  prettier,
  {
    env: {
      node: true,
      es2021: true,
    },
    rules: {
      // Disable rules from Google's style guide that you don't want
      'require-jsdoc': 'off', // Disable JSDoc requirement
      'valid-jsdoc': 'off', // Disable validation of JSDoc comments

      // Custom rules to override Google's defaults
      indent: ['error', 2], // Enforce 2-space indentation
      'max-len': ['error', { code: 120 }], // Set max line length to 120 characters
      'object-curly-spacing': ['off'],
      'no-unused-vars': 'warn', // Warn about unused variables
      'arrow-parens': ['error', 'always'], // Require parentheses around arrow function arguments
      'space-before-function-paren': ['error', 'always'],
      // 'no-console': 'warn',
    },
  },
];
