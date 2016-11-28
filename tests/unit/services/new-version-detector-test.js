import { moduleFor, test } from 'ember-qunit';

moduleFor('service:new-version-detector', 'Unit | Service | new version detector', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('#reportedVersion', function(assert) {
  let service = this.subject();

  service.set('_rawVersion', '0.0.0+079a4760');

  let reportedVersion = service.get('reportedVersion');

  assert.equal(reportedVersion, '079a4760');
});

test('#currentVersion', function(assert) {
  let service = this.subject();

  service.set('_rawVersion', '0.0.0+079a4760');

  let currentVersion = service.get('currentVersion');

  assert.equal(currentVersion, '079a476');
});

test('it indicates when current version is newest available', function(assert) {
  let service = this.subject();

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
  let service = this.subject();

  service.set('currentVersion', '3');

  assert.notOk(service.get('isUpgradeAvailable'));
});
