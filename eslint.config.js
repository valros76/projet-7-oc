import pluginSecurity from 'eslint-plugin-security';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

export default [
  // 1. Ignorer les dossiers de build et de dépendances
  {
    ignores: [
      '**/node_modules/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/dist/**',
      '**/coverage/**'
    ]
  },

  // 2. Configurations recommandées TypeScript et Vue
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  // 3. Configuration spécifique pour parser le TypeScript dans les fichiers .vue
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },
    },
  },

  // 4. Plugin de sécurité
  pluginSecurity.configs.recommended,

  // 5. Ajustements de règles (passage de certaines erreurs bloquantes en warnings)
  {
    rules: {
      'security/detect-object-injection': 'warn',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',

      // --- Désactivation du style visuel strict ---
      'vue/max-attributes-per-line': 'off',
      'vue/attributes-order': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-closing-bracket-spacing': 'off',
    },
  },
];