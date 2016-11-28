import AjaxService from 'ember-ajax/services/ajax';
import VersionHeaderHandler from 'ember-new-version-detection/mixins/version-header-handler';

export default AjaxService.extend(VersionHeaderHandler);
