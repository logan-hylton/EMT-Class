/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  ignorePatterns: ["server.js"],
  rules: {
    "indent": ["error", 2],
  },
  overrides: [
    {
      "files": ["*.vue",],
      "rules": {
        "no-unused-vars": "off"
      }
    }
  ]
}
