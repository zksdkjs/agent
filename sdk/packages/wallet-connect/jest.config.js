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
    "^@zksdk/privacy-provider/(.*)$": "<rootDir>/../providers/privacy/src/$1"
  }
};
