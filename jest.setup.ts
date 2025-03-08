import '@testing-library/jest-dom'

// text-encoder.mock.ts
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

// jest.config.ts
const nextJest = require('next/jest');
const createJestConfig = nextJest({
    dir: './',
});
const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>/'],
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: [
        '<rootDir>/path/to/text-encoder.mock.ts',
    ],
};

module.exports = createJestConfig(customJestConfig)