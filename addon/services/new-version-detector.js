import Service from '@ember/service';

import { computed } from '@ember/object';

import config from 'ember-get-config';

const {
  APP: {
    _appVersion: version,
  }
} = config;

export default class NewVersionDetector extends Service {
  // activeVersion (optional): string -- the version currently active, as reported by the API
  activeVersion = null;

  _rawVersion = version;

  @computed('_rawVersion')
  get reportedVersion() {
    let rawVersion = this._rawVersion;

    return rawVersion && rawVersion.slice(6);
  }

  @computed('_rawVersion')
  get currentVersion() {
    let rawVersion = this._rawVersion;

    if (rawVersion) {
      let fullSHA = rawVersion.slice(6);
      let trimmedSHA = fullSHA.slice(0, 7);

      return trimmedSHA;
    } else {
      return null;
    }
  }

  @computed('currentVersion', 'activeVersion')
  get isUpgradeAvailable() {
    let {
      currentVersion,
      activeVersion,
    } = this;

    return currentVersion && activeVersion && currentVersion !== activeVersion;
  }
}
