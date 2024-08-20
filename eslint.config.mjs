import js from '@eslint/js'
import ts from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      'no-undef': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: ['dist/*'],
  },
)
