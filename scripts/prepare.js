const isCi = process.env.CI !== undefined;

if (!isCi) {
  // eslint-disable-next-line node/no-unpublished-require
  require('husky').install();
}
