import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { next as runNext } from '@ember/runloop';
import { inject as service } from '@ember/service';
import fetchHeader from 'ember-new-version-detection/utils/fetch-header';
import NewVersionDetector from 'ember-new-version-detection/services/new-version-detector';

export interface VersionDetectingHeaders {
  'X-App-Version': NewVersionDetector['reportedVersion'];
  'X-App-Name': NewVersionDetector['appName'];
}

export default class VersionDetectingJsonApiAdapter extends JSONAPIAdapter {
  @service('new-version-detector')
  declare newVersionDetector: NewVersionDetector;

  get headers() {
    return {
      'X-App-Version': this.newVersionDetector.reportedVersion,
      'X-App-Name': this.newVersionDetector.appName,
    };
  }

  handleResponse(
    status: number,
    headers: Record<string, unknown>,
    payload: Record<string, unknown>,
    requestData: Record<string, unknown>
  ): Record<string, unknown> {
    runNext(this, () => {
      const activeVersion = fetchHeader('X-Current-Version', headers);
      this.newVersionDetector.activeVersion = activeVersion;
    });

    return super.handleResponse(status, headers, payload, requestData);
  }
}
