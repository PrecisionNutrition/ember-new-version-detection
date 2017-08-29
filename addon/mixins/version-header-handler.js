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

function fetchHeader(header, headers) {
  return headers[header] || headers[header.toLowerCase()];
}

export default Mixin.create({
  newVersionDetector: service(),

  headers: computed('newVersionDetector.reportedVersion', function() {
    let headers = this._super(...arguments) || {};

    headers['X-App-Version'] = this.get('newVersionDetector.reportedVersion');
    headers['X-App-Name'] = appName;

    return headers;
  }),

  handleResponse(_, headers) {
    runNext(this, function() {
      this.set('newVersionDetector.activeVersion', fetchHeader('X-Current-Version', headers));
    });

    return this._super(...arguments);
  },
});
