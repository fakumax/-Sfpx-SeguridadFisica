require('@rushstack/eslint-config/patch/modern-module-resolution');
module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/react'],
  parserOptions: { tsconfigRootDir: __dirname },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2018,
        sourceType: 'module'
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-unused-expressions': 'warn',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/typedef': 'off',
        'comma-dangle': 'off',
        'guard-for-in': 'off',
        'no-caller': 'off',
        'no-console': 'off',
        'no-eval': 'off',
        'no-fallthrough': 'off',
        'no-new-wrappers': 'off',
        'no-shadow': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-use-before-define': 'off',
        'no-with': 'error',
        'no-var': 'off',
        'prefer-const': 'off',
        'no-case-declarations': 'off',
        'no-prototype-builtins': 'off',
        '@typescript-eslint/prefer-as-const': 'off',
        'quotes': ['warn', 'single'],
        '@microsoft/spfx/no-require-ensure': 'error'
      }
    }
  ]
};