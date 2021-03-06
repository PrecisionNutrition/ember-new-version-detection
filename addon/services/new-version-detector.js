import Service from '@ember/service';

import { computed } from '@ember/object';

import config from 'ember-get-config';

const {
  APP: { _appVersion: version },
} = config;

export default class NewVersionDetector extends Service {
  // activeVersion (optional): string -- the version currently active, as reported by the API
  activeVersion = null;

  // ignoredVersions (optional): string -- version the user doesn't care about, perhaps they just want to get on with their life
  ignoredVersion = null;

  // Version as reported by the app build
  _rawVersion = version;

  @computed('_rawVersion')
  get reportedVersion() {
    return this._rawVersion?.slice(6);
  }

  @computed('_rawVersion')
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

  @computed('activeVersion', 'currentVersion', 'ignoredVersion')
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
    this.set('ignoredVersion', this.activeVersion);
  }
}
