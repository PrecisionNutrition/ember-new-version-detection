import Ember from 'ember';
import config from 'ember-get-config';

const {
  'ember-new-version-detection': {
    appName,
  },
} = config;

const {
  computed,
  inject: {
    service,
  },
  run: {
    next: runNext,
  },
  Mixin,
} = Ember;

export default Mixin.create({
  newVersionDetector: service(),

  headers: computed('newVersionDetector.reportedVersion', function() {
    let reportedVersion = this.get('newVersionDetector.reportedVersion');

    return {
      'X-App-Version': reportedVersion,
      'X-App-Name': appName,
    };
  }),

  handleResponse(_, headers) {
    runNext(this, function() {
      this.set('newVersionDetector.activeVersion', headers['X-Current-Version']);
    });

    return this._super(...arguments);
  },
});
