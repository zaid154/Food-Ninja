/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  clearMocks: true,
  collectCoverage: false,
  moduleNameMapper: {
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/src/mockData/fileMock.js"
  }
};

module.exports = config;
