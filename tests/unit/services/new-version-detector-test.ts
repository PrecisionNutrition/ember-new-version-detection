import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { TestContext } from 'ember-test-helpers';
import type NewVersionDetector from 'ember-new-version-detection/services/new-version-detector';

interface Context extends TestContext {
  service: NewVersionDetector;
}

module('Unit | Service | new version detector', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function (this: Context) {
    this.service = this.owner.lookup('service:new-version-detector') as NewVersionDetector;

    sinon.stub(this.service, '_rawVersion').value('0.0.0+079a4760');
  });

  test('#reportedVersion', function (this: Context, assert) {
    const reportedVersion = this.service.reportedVersion;

    assert.equal(reportedVersion, '079a4760');
  });

  test('#currentVersion', function (this: Context, assert) {
    const currentVersion = this.service.currentVersion;

    assert.equal(currentVersion, '079a476');
  });

  test('it indicates when current version is newest available', function (this: Context, assert) {
    this.service.activeVersion = '079a476';

    assert.false(this.service.isUpgradeAvailable);

    sinon.stub(this.service, '_rawVersion').value('0.0.0+2');

    assert.true(this.service.isUpgradeAvailable);

    sinon.stub(this.service, '_rawVersion').value('0.0.0+3');

    assert.true(this.service.isUpgradeAvailable);
  });

  test('it is false when activeVersion is null', function (this: Context, assert) {
    sinon.stub(this.service, '_rawVersion').value('3');

    assert.false(this.service.isUpgradeAvailable);
  });

  module('#ignoreThisUpgrade', function (hooks) {
    hooks.beforeEach(function (this: Context) {
      sinon.stub(this.service, '_rawVersion').value('0.0.0+079a4760');
      this.service.activeVersion = '079a476';
    });

    test('when upgrade is available', function (this: Context, assert) {
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
