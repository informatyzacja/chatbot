/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ['eslint-config-informatyzacja'], // uses the config in `packages/config/eslint`
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.json',
      './apps/*/tsconfig.json',
      './packages/*/tsconfig.json',
    ],
  },
  settings: {
    next: {
      rootDir: ['apps/admin'],
    },
  },
  ignorePatterns: ['.next', 'node_modules'],
};

module.exports = config;
