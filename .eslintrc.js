module.exports = {
  extends: ['next', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'import/extensions': ['error', 'never', { css: 'always', mjs: 'always' }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.test.tsx',
          'src/msw/*',
          'vitest.config.ts',
        ],
      },
    ],
  },
  ignorePatterns: ['./.yarn'],
  settings: {
    'import/resolver': 'node',
  },
};
