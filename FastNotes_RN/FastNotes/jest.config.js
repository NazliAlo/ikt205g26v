module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(jpg|png|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "^@\/(.*)$": "<rootDir>/$1",
  },
};
