import Service from '@ember/service';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';
import type ApplicationInstance from '@ember/application/instance';

interface PartialAppConfig {
  APP: {
    _appVersion?: string;
  };
  'ember-new-version-detection'?: {
    appName: string;
  };
}

export default class NewVersionDetector extends Service {
  get _appConfig(): PartialAppConfig {
    const owner = getOwner(this) as ApplicationInstance;
    return owner.resolveRegistration('config:environment') as PartialAppConfig;
  }

  // Version as reported by the app build
  get _rawVersion(): string | undefined {
    return this._appConfig.APP._appVersion;
  }

  /**
   * Configured name of the host application
   */
  get appName(): string {
    const addonConfig = this._appConfig['ember-new-version-detection'];
    const appName = addonConfig?.appName;

    assert('You must set the application name. See README.md', typeof appName === 'string');

    return appName;
  }

  // activeVersion (optional): string -- the version currently active, as reported by the API
  @tracked
  activeVersion: string | null = null;

  // ignoredVersions (optional): string -- version the user doesn't care about, perhaps they just want to get on with their life
  @tracked
  ignoredVersion: string | null = null;

  get reportedVersion(): string | undefined {
    return this._rawVersion?.slice(6);
  }

  get currentVersion(): string | null {
    const rawVersion = this._rawVersion;

    if (rawVersion) {
      const fullSHA = rawVersion.slice(6);
      const trimmedSHA = fullSHA.slice(0, 7);

      return trimmedSHA;
    } else {
      return null;
    }
  }

  get isUpgradeAvailable(): boolean {
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
  ignoreThisUpgrade(): void {
    this.ignoredVersion = this.activeVersion;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'new-version-detector': NewVersionDetector;
  }
}
