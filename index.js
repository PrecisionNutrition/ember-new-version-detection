'use strict';

const path = require('path');
const gitRepoInfo = require('git-repo-info');

function getVersion(shaLength, root) {
  let projectPath = root || process.cwd();
  let packageVersion = require(path.join(projectPath, 'package.json')).version;
  let info = gitRepoInfo(projectPath);

  let sha = info.sha || '';
  let prefix;

  if (packageVersion !== null) {
    prefix = packageVersion;
  } else if (info.branch) {
    prefix = info.branch;
  } else {
    prefix = 'DETACHED_HEAD';
  }

  return `${prefix}+${sha.slice(0, shaLength || 8)}`;
}

module.exports = {
  name: require('./package').name,

  config(_, baseConfig) {
    let config = this._super.config.apply(this, arguments);

    let version = getVersion(null, this.project.root);

    if (version && baseConfig.APP) {
      // Do not consume this value. This is used by the addon to figure out
      // what the currently running version of the app is. If you need something
      // similar, please see ember-cli-app-version.
      baseConfig.APP._appVersion = version;
    }

    return config;
  },

  included() {
    this.eachAddonInvoke('included', arguments);
  },
};
