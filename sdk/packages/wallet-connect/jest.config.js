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
    "^@zksdk/core$": "<rootDir>/../core/src",
    "^@zksdk/core/(.*)$": "<rootDir>/../core/src/$1",
    "^@zksdk/privacy-provider$": "<rootDir>/../providers/privacy/src",
    "^@zksdk/privacy-provider/(.*)$": "<rootDir>/../providers/privacy/src/$1",
    "^@zksdk/railgun-provider$": "<rootDir>/../providers/railgun/src",
    "^@zksdk/railgun-provider/(.*)$": "<rootDir>/../providers/railgun/src/$1",
    "^@railgun-community/engine$": "<rootDir>/../../test/__mocks__/railgun-engine.ts",
    "^@railgun-community/wallet$": "<rootDir>/../../test/__mocks__/railgun-wallet.ts"
  }
};
