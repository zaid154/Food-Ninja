/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  clearMocks: true,
  collectCoverage: false,
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/.parcel-cache/"],
  moduleNameMapper: {
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/src/mockData/fileMock.js"
  }
};

module.exports = config;
