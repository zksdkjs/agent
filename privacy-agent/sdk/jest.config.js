const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^@zksdk/core$": "<rootDir>/packages/core/src",
    "^@zksdk/core/(.*)$": "<rootDir>/packages/core/src/$1",
    "^@zksdk/providers/(.*)$": "<rootDir>/packages/providers/$1"
  },
};