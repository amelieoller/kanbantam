module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
    'prettier/react',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    jest: true,
    es6: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './client/config/webpack.config.js',
      },
    },
    react: {
      version: 'detect',
    },
  },
  parser: 'babel-eslint',
  plugins: ['react', 'react-hooks'],
  rules: {
    'no-console': 1,
    'react/jsx-key': 2,
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 1,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-autofocus': [
      2,
      {
        ignoreNonDOM: true,
      },
    ],
  },
};
