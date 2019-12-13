import JSONAPIAdapter from '@ember-data/adapter/json-api';

import { computed } from '@ember/object';

import { next as runNext } from '@ember/runloop';

import { inject as service } from '@ember/service';

import fetchHeader from '../utils/fetch-header';

import config from 'ember-get-config';

const {
  'ember-new-version-detection': {
    appName,
  },
} = config;

export default class VersionDetectingJsonApiAdapter extends JSONAPIAdapter {
  @service() newVersionDetector;

  @computed('newVersionDetector.reportedVersion')
  get headers() {
    return {
      'X-App-Version': this.newVersionDetector.reportedVersion,
      'X-App-Name': appName,
    };
  }

  handleResponse(_, headers) {
    runNext(this, function() {
      this.set('newVersionDetector.activeVersion', fetchHeader('X-Current-Version', headers));
    });

    return super.handleResponse(...arguments);
  }
}
