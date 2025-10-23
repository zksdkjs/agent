const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  moduleNameMapper: {
    "^@zksdk/core$": "<rootDir>/packages/core/src",
    "^@zksdk/core/(.*)$": "<rootDir>/packages/core/src/$1",
    "^@zksdk/providers/(.*)$": "<rootDir>/packages/providers/$1",
    "^@zksdk/types$": "<rootDir>/types/index",
    "^@zksdk/types/(.*)$": "<rootDir>/types/$1",
    "^@aztec/aztec\\.js$": "<rootDir>/test/__mocks__/aztec-js.ts",
    "^@railgun-community/engine$": "<rootDir>/test/__mocks__/railgun-engine.ts",
    "^@aztec/accounts/schnorr$": "<rootDir>/test/__mocks__/aztec-accounts-schnorr.ts",
    "^@aztec/stdlib/keys$": "<rootDir>/test/__mocks__/aztec-stdlib-keys.ts"
  },
};
