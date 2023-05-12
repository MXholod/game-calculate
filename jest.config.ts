import type { Config } from '@jest/types';
const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  moduleFileExtensions: ["js", "ts", "tsx"],
  testEnvironment: 'node',
  testMatch: ["**/**/*.test.ts"],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/",
	"<rootDir>/src/scripts/temp/"
  ],
  "roots": [
    "<rootDir>/src/scripts"
  ],
}

export default config;
