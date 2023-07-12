import type { Config } from '@jest/types'
// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  restoreMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageProvider: 'v8',
  modulePathIgnorePatterns: [
    '.d.ts',
    'node_modules'
  ],
  maxWorkers: 1

}

export default config

