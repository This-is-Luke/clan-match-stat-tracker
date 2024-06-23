module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['**/*.{js,jsx}', '!**/node_modules/**', '!**/vendor/**'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1'
  },

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/tests/**/*.test.js'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/'],

  // A preset that is used as a base for Jest's configuration
  // Add this if you are using babel for transpiling JavaScript
  // preset: 'jest-preset',

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules', 'app'],

  // The directory where Jest should store its cached dependency information
  cacheDirectory: '.jest/cache',

  // A number of seconds after which a test is considered as slow and reported as such in the results
  slowTestThreshold: 5,

  // A number of seconds before each test automatically times out
  testTimeout: 10000,

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFiles: ['dotenv/config'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,
};
