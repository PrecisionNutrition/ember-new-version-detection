import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Service | new version detector', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.service = this.owner.lookup('service:new-version-detector');

    sinon.stub(this.service, '_rawVersion').value('0.0.0+079a4760');
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
    this.service.activeVersion = '079a476';

    assert.false(this.service.isUpgradeAvailable);

    sinon.stub(this.service, '_rawVersion').value('0.0.0+2');

    assert.true(this.service.isUpgradeAvailable);

    sinon.stub(this.service, '_rawVersion').value('0.0.0+3');

    assert.true(this.service.isUpgradeAvailable);
  });

  test('it is false when activeVersion is null', function (assert) {
    sinon.stub(this.service, '_rawVersion').value('3');

    assert.false(this.service.isUpgradeAvailable);
  });

  module('#ignoreThisUpgrade', function (hooks) {
    hooks.beforeEach(function () {
      sinon.stub(this.service, '_rawVersion').value('0.0.0+079a4760');
      this.service.activeVersion = '079a476';
    });

    test('when upgrade is available', function (assert) {
      this.service.activeVersion = '2';

      assert.true(this.service.isUpgradeAvailable);

      this.service.ignoreThisUpgrade();

      assert.false(this.service.isUpgradeAvailable);

      assert.equal(this.service.ignoredVersion, '2', 'marks active version as ignored');

      this.service.activeVersion = '3';

      assert.true(this.service.isUpgradeAvailable);

      this.service.ignoreThisUpgrade();

      assert.false(this.service.isUpgradeAvailable);

      assert.equal(this.service.ignoredVersion, '3', 'marks new active version as ignored');
    });
  });
});
