module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:import/errors', 'prettier', 'plugin:cypress/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: false,
  },
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  plugins: ['import', 'cypress'],
  rules: {},
};
