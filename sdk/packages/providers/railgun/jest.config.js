module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@zksdk/core$': '<rootDir>/../../core/src',
    '^@zksdk/core/(.*)$': '<rootDir>/../../core/src/$1',
    '^@zksdk/railgun-provider$': '<rootDir>/src',
    '^@railgun-community/engine$': '<rootDir>/../../../test/__mocks__/railgun-engine.ts',
    '^@railgun-community/wallet$': '<rootDir>/../../../test/__mocks__/railgun-wallet.ts'
  },
  modulePaths: ['<rootDir>/../../../node_modules']
};
