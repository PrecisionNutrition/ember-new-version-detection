import RestAdapter from 'ember-data/adapters/rest';
import VersionHeaderHandler from 'ember-new-version-detection/mixins/version-header-handler';

export default RestAdapter.extend(VersionHeaderHandler);
