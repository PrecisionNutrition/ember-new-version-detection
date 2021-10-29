'use strict';

/**
  This file should mainly be used to customize the Prettier config during development.
  Long-term changes should be made in the `prettier-config` repo:
  https://github.com/PrecisionNutrition/prettier-config/blob/master/index.json
*/

const prettierConfig = require('@precision-nutrition/prettier-config');

module.exports = {
  ...prettierConfig,
};
