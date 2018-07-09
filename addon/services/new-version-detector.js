import { computed } from '@ember/object';
import Service from '@ember/service';
import config from 'ember-get-config';

const {
  APP: {
    _appVersion: version,
  }
} = config;

export default Service.extend({
  // activeVersion (optional): string -- the version currently active, as reported by the API

  init() {
    this._super(...arguments);

    this.set('_rawVersion', version);
  },

  reportedVersion: computed('_rawVersion', function() {
    let rawVersion = this.get('_rawVersion');

    if (rawVersion) {
      return rawVersion.slice(6);
    }
  }),

  currentVersion: computed('_rawVersion', function() {
    let rawVersion = this.get('_rawVersion');

    if (rawVersion) {
      let fullSHA = rawVersion.slice(6);
      let trimmedSHA = fullSHA.slice(0, 7);

      return trimmedSHA;
    }
  }),

  isUpgradeAvailable: computed('currentVersion', 'activeVersion', function() {
    let {
      currentVersion,
      activeVersion,
    } = this.getProperties('currentVersion', 'activeVersion');

    return currentVersion && activeVersion && currentVersion !== activeVersion;
  }),
});
