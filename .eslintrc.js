module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ["airbnb-base"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    quotes: 0,
    "linebreak-style": 0,
    "object-curly-newline": 0,
    "no-underscore-dangle": 0,
    "no-console": 0
  }
};
