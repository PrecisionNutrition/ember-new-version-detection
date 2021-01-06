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

  // ignoredVersions (optional): string -- version the user doesn't care about, perhaps they just want to get on with their life
  @tracked
  ignoredVersion = null;

  // Version as reported by the app build
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
    const { activeVersion, currentVersion, ignoredVersion } = this;

    return (
      currentVersion &&
      activeVersion &&
      currentVersion !== activeVersion &&
      ignoredVersion !== activeVersion
    );
  }

  /**
   * Ignores the current upgrade. Subsequent upgrades will not be ignored.
   */
  ignoreThisUpgrade() {
    this.ignoredVersion = this.activeVersion;
  }
}
