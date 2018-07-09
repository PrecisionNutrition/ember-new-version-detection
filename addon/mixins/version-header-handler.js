import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { next as runNext } from '@ember/runloop';
import Mixin from '@ember/object/mixin';
import config from 'ember-get-config';

const {
  'ember-new-version-detection': {
    appName,
  },
} = config;

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
