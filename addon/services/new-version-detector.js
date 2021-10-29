import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';

export default class NewVersionDetector extends Service {
  get _appConfig() {
    const config = getOwner(this).resolveRegistration('config:environment');
    return config;
  }

  // Version as reported by the app build
  get _rawVersion() {
    return this._appConfig.APP._appVersion;
  }

  /**
   * Configured name of the host application
   */
  get appName() {
    return this._appConfig['ember-new-version-detection'].appName;
  }

  // activeVersion (optional): string -- the version currently active, as reported by the API
  @tracked
  activeVersion = null;

  // ignoredVersions (optional): string -- version the user doesn't care about, perhaps they just want to get on with their life
  @tracked
  ignoredVersion = null;

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

    return !!(
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
