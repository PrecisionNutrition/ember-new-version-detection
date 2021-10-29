import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { next as runNext } from '@ember/runloop';
import { inject as service } from '@ember/service';
import fetchHeader from '../utils/fetch-header';

export default class VersionDetectingJsonApiAdapter extends JSONAPIAdapter {
  @service('new-version-detector')
  newVersionDetector;

  get headers() {
    return {
      'X-App-Version': this.newVersionDetector.reportedVersion,
      'X-App-Name': this.newVersionDetector.appName,
    };
  }

  handleResponse(_, headers) {
    runNext(this, function () {
      this.newVersionDetector.activeVersion = fetchHeader('X-Current-Version', headers);
    });

    return super.handleResponse(...arguments);
  }
}
