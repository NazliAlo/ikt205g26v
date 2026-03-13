module.exports = {
  preset: 'jest-expo',
   transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-navigation|@expo|expo(nent)?|@unimodules)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-navigation|@expo|expo(nent)?|@unimodules)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};