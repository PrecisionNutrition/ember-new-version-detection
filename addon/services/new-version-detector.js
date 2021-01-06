import Service from '@ember/service';

import { tracked } from '@glimmer/tracking';

import config from 'ember-get-config';

const {
  APP: { _appVersion: version },
} = config;

export default class NewVersionDetector extends Service {
  // activeVersion (optional): string -- the version currently active, as reported by the API
  @tracked
  activeVersion = null;

  @tracked
  _rawVersion = version;

  get reportedVersion() {
    return this._rawVersion?.slice(6);
  }

  get currentVersion() {
    const rawVersion = this._rawVersion;

    if (rawVersion) {
      const fullSHA = rawVersion.slice(6);
      const trimmedSHA = fullSHA.slice(0, 7);

      return trimmedSHA;
    } else {
      return null;
    }
  }

  get isUpgradeAvailable() {
    const { currentVersion, activeVersion } = this;

    return currentVersion && activeVersion && currentVersion !== activeVersion;
  }
}
