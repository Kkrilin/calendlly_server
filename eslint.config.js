import js from '@eslint/js';
import google from 'eslint-config-google';

export default [
  js.configs.recommended, // Base recommended rules from ESLint
  google, // Google style guide as the base configuration
  {
    rules: {
      // Disable rules from Google's style guide that you don't want
      'require-jsdoc': 'off', // Disable JSDoc requirement
      'valid-jsdoc': 'off', // Disable validation of JSDoc comments

      // Custom rules to override Google's defaults
      // quotes: ['error', 'single'], // Enforce single quotes
      // semi: ['error', 'always'], // Enforce semicolons
      indent: ['error', 2], // Enforce 2-space indentation
      'max-len': ['error', { code: 120 }], // Set max line length to 120 characters
      'object-curly-spacing': ['off'],
      // 'no-trailing-spaces': 'error', // Disallow trailing spaces
      'no-unused-vars': 'warn', // Warn about unused variables
      'arrow-parens': ['error', 'always'], // Require parentheses around arrow function arguments
      'space-before-function-paren': ['error', 'always'],
      // Optional: Uncomment to warn about console statements
      // 'no-console': 'warn',
    },
  },
];
