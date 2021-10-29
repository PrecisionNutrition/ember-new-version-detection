import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import Pretender from 'pretender';
import env from '../../config/environment';

module('Acceptance | detecting a new version', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.headers = {
      'Content-Type': 'application/vnd.api+json',
    };

    this.responseBody = JSON.stringify({
      data: {
        id: 1,
        type: 'foo',
        attributes: {
          name: 'bar',
        },
      },
    });

    this.server;
  });

  hooks.afterEach(function () {
    this.headers = null;

    this.responseBody = null;

    this.server.shutdown();

    this.server = null;
  });

  test('via the ember-data adapter', async function (assert) {
    assert.expect(4);

    const { headers, responseBody } = this;

    this.server = new Pretender(function () {
      this.get('/foos', function (req) {
        let { requestHeaders } = req;

        assert.strictEqual(
          requestHeaders['X-App-Name'],
          env['ember-new-version-detection'].appName,
          'reports the app name to the server'
        );

        assert.ok('X-App-Version' in requestHeaders, 'reports the app version to the server');

        return [200, headers, responseBody];
      });

      this.get('/foos/1', function () {
        headers['X-Current-Version'] = '26716999';

        return [200, headers, responseBody];
      });
    });

    await visit('/foo');

    assert.dom('#alert').doesNotExist('does not signal new version when not available');

    await visit('/foo-new-version');

    assert.dom('#alert').exists('detects a new version is available');
  });

  test('ignoring a version', async function (assert) {
    assert.expect(6);

    const { headers, responseBody } = this;

    const service = this.owner.lookup('service:new-version-detector');

    this.server = new Pretender(function () {
      this.get('/foos', function (req) {
        const { requestHeaders } = req;

        assert.strictEqual(
          requestHeaders['X-App-Name'],
          env['ember-new-version-detection'].appName,
          'reports the app name to the server'
        );

        assert.ok('X-App-Version' in requestHeaders, 'reports the app version to the server');

        return [200, headers, responseBody];
      });

      this.get('/foos/1', function () {
        headers['X-Current-Version'] = '26716999';

        return [200, headers, responseBody];
      });
    });

    await visit('/foo');

    assert.dom('#alert').doesNotExist('does not signal new version when not available');

    await visit('/foo-new-version');

    assert.dom('#alert').exists('detects a new version is available');

    service.ignoreThisUpgrade();

    await assert.waitFor(() => {
      assert.dom('#alert').doesNotExist('current reported version is ignored');
    });

    this.server.get('/foos', function () {
      headers['X-Current-Version'] = '123123123';

      return [200, headers, responseBody];
    });

    await visit('/foo');

    await assert.waitFor(() => {
      assert.dom('#alert').exists('detects a new version is available');
    });
  });
});
