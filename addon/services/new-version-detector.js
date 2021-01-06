import Service from '@ember/service';

import { tracked } from 'tracked-built-ins';

import config from 'ember-get-config';

const {
  APP: { _appVersion: version },
} = config;

export default class NewVersionDetector extends Service {
  // activeVersion (optional): string -- the version currently active, as reported by the API
  @tracked
  activeVersion = null;

  // ignoredVersions (optional): string[] -- versions the user doesn't care about, perhaps they just want to get on with their life
  ignoredVersions = tracked([]);

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
    const { activeVersion, currentVersion, ignoredVersions } = this;

    return (
      currentVersion &&
      activeVersion &&
      currentVersion !== activeVersion &&
      !ignoredVersions.includes(activeVersion)
    );
  }

  /**
   * Ignores the current upgrade. Subsequent upgrades will not be ignored.
   */
  ignoreThisUpgrade() {
    const { activeVersion } = this;

    this.ignoredVersions.push(activeVersion);
  }
}
