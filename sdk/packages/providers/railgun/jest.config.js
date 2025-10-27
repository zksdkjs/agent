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
    '^@zksdk/railgun-provider$': '<rootDir>/src'
  },
  modulePaths: ['<rootDir>/../../../node_modules']
};
