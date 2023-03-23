module.exports = {
  projects: [
    require('./packages/ncrl-cli/jest.config.js'),
    require('./packages/ncrl-json/jest.config.js'),
  ],
  testPathIgnorePatterns: ['.*'],
};
