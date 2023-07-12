"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
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
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map