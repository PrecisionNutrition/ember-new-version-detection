import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | new version detector', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.service = this.owner.lookup('service:new-version-detector');

    this.service.set('_rawVersion', '0.0.0+079a4760');
  });

  test('#reportedVersion', function (assert) {
    const reportedVersion = this.service.reportedVersion;

    assert.equal(reportedVersion, '079a4760');
  });

  test('#currentVersion', function (assert) {
    const currentVersion = this.service.currentVersion;

    assert.equal(currentVersion, '079a476');
  });

  test('it indicates when current version is newest available', function (assert) {
    this.service.set('activeVersion', '079a476');

    assert.notOk(this.service.isUpgradeAvailable);

    this.service.set('_rawVersion', '0.0.0+2');

    assert.ok(this.service.isUpgradeAvailable);

    this.service.set('_rawVersion', '0.0.0+3');

    assert.ok(this.service.isUpgradeAvailable);
  });

  test('it is false when activeVersion is null', function (assert) {
    this.service.set('_rawVersion', '3');

    assert.notOk(this.service.isUpgradeAvailable);
  });

  module('#ignoreThisUpgrade', function (hooks) {
    hooks.beforeEach(function () {
      this.service.set('_rawVersion', '0.0.0+079a4760');
      this.service.set('activeVersion', '079a476');
    });

    test('when upgrade is available', function (assert) {
      this.service.set('activeVersion', '2');

      assert.ok(this.service.isUpgradeAvailable);

      this.service.ignoreThisUpgrade();

      assert.notOk(this.service.isUpgradeAvailable);

      assert.equal(this.service.ignoredVersion, '2', 'marks active version as ignored');

      this.service.set('activeVersion', '3');

      assert.ok(this.service.isUpgradeAvailable);

      this.service.ignoreThisUpgrade();

      assert.notOk(this.service.isUpgradeAvailable);

      assert.equal(this.service.ignoredVersion, '3', 'marks new active version as ignored');
    });
  });
});
