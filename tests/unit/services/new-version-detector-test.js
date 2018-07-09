import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | new version detector', function(hooks) {
  setupTest(hooks);

  test('#reportedVersion', function(assert) {
    let service = this.owner.lookup('service:new-version-detector');

    service.set('_rawVersion', '0.0.0+079a4760');

    let reportedVersion = service.get('reportedVersion');

    assert.equal(reportedVersion, '079a4760');
  });

  test('#currentVersion', function(assert) {
    let service = this.owner.lookup('service:new-version-detector');

    service.set('_rawVersion', '0.0.0+079a4760');

    let currentVersion = service.get('currentVersion');

    assert.equal(currentVersion, '079a476');
  });

  test('it indicates when current version is newest available', function(assert) {
    let service = this.owner.lookup('service:new-version-detector');

    service.setProperties({
      _rawVersion: '0.0.0+079a4760',
      activeVersion: '079a476',
    });

    assert.notOk(service.get('isUpgradeAvailable'));

    service.set('currentVersion', '2');

    assert.ok(service.get('isUpgradeAvailable'));

    service.setProperties('activeVersion', '3');

    assert.ok(service.get('isUpgradeAvailable'));
  });

  test('it is false when activeVersion is null', function(assert) {
    let service = this.owner.lookup('service:new-version-detector');

    service.set('currentVersion', '3');

    assert.notOk(service.get('isUpgradeAvailable'));
  });
});
