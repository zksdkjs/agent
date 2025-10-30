/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  moduleNameMapper: {
    "^@zksdk/core$": "<rootDir>/packages/core/src",
    "^@zksdk/core/(.*)$": "<rootDir>/packages/core/src/$1",
    "^@zksdk/privacy-provider$": "<rootDir>/packages/providers/privacy/src",
    "^@zksdk/privacy-provider/(.*)$": "<rootDir>/packages/providers/privacy/src/$1",
    "^@zksdk/providers/(.*)$": "<rootDir>/packages/providers/$1",
    "^@zksdk/types$": "<rootDir>/types/index",
    "^@zksdk/types/(.*)$": "<rootDir>/types/$1",
    "^@aztec/aztec\\.js$": "<rootDir>/test/__mocks__/aztec-js.ts",
    "^@railgun-community/engine$": "<rootDir>/test/__mocks__/railgun-engine.ts",
    "^@railgun-community/wallet$": "<rootDir>/test/__mocks__/railgun-wallet.ts",
    "^@aztec/accounts/schnorr$": "<rootDir>/test/__mocks__/aztec-accounts-schnorr.ts",
    "^@aztec/stdlib/keys$": "<rootDir>/test/__mocks__/aztec-stdlib-keys.ts"
  },
};
