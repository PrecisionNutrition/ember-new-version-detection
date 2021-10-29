import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { next as runNext } from '@ember/runloop';
import { inject as service } from '@ember/service';
import fetchHeader from '../utils/fetch-header';
import type NewVersionDetector from 'ember-new-version-detection/services/new-version-detector';

export default class VersionDetectingJsonApiAdapter extends JSONAPIAdapter {
  @service('new-version-detector')
  declare newVersionDetector: NewVersionDetector;

  get headers() {
    return {
      'X-App-Version': this.newVersionDetector.reportedVersion,
      'X-App-Name': this.newVersionDetector.appName,
    };
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  handleResponse(status: number, headers: Record<string, unknown>, payload: {}, requestData: {}) {
    runNext(this, function () {
      const activeVersion = fetchHeader('X-Current-Version', headers);
      this.newVersionDetector.activeVersion = activeVersion;
    });

    return super.handleResponse(status, headers, payload, requestData);
  }
}
