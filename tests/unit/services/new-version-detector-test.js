import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | new version detector', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.service = this.owner.lookup('service:new-version-detector');
  });

  test('#reportedVersion', function (assert) {
    this.service._rawVersion = '0.0.0+079a4760';

    let reportedVersion = this.service.reportedVersion;

    assert.equal(reportedVersion, '079a4760');
  });

  test('#currentVersion', function (assert) {
    this.service._rawVersion = '0.0.0+079a4760';

    let currentVersion = this.service.currentVersion;

    assert.equal(currentVersion, '079a476');
  });

  test('it indicates when current version is newest available', function (assert) {
    this.service._rawVersion = '0.0.0+079a4760';
    this.service.activeVersion = '079a476';

    assert.notOk(this.service.isUpgradeAvailable);

    this.service._rawVersion = '0.0.0+2';

    assert.ok(this.service.isUpgradeAvailable);

    this.service._rawVersion = '0.0.0+3';

    assert.ok(this.service.isUpgradeAvailable);
  });

  test('it is false when activeVersion is null', function (assert) {
    this.service._rawVersion = '3';

    assert.notOk(this.service.isUpgradeAvailable);
  });
});
