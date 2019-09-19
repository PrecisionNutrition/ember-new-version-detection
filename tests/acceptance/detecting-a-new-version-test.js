import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import Pretender from 'pretender';
import env from '../../config/environment';

let server;
let headers;
let responseBody;

module('Acceptance | detecting a new version', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    headers = {
      'Content-Type': 'application/json',
    };

    responseBody = JSON.stringify({
      foos: [
        {
          id: 1,
          name: 'bar',
        },
      ],
    });
  });

  hooks.afterEach(function() {
    headers = null;

    responseBody = null;

    server.shutdown();

    server = null;
  });

  test('via the ember-data adapter', async function(assert) {
    server = new Pretender(function() {
      this.get('/foos', function(req) {
        let {
          requestHeaders,
        } = req;

        assert.equal(
          requestHeaders['X-App-Name'],
          env['ember-new-version-detection'].appName,
          'reports the app name to the server'
        );

        assert.ok(
          'X-App-Version' in requestHeaders,
          'reports the app version to the server'
        );

        return [
          200,
          headers,
          responseBody
        ];
      });

      this.get('/foos/1', function() {
        headers['X-Current-Version'] = '26716999';

        return [
          200,
          headers,
          responseBody
        ];
      });
    });

    await visit('/foo');

    assert.dom('#alert').doesNotExist('does not signal new version when not available');

    await visit('/foo-new-version');

    assert.dom('#alert').exists('detects a new version is available');
  });

  test('via the ember-ajax service', async function(assert) {
    assert.expect(4);

    server = new Pretender(function() {
      this.get('/foos', function(req) {
        let {
          requestHeaders,
        } = req;

        assert.equal(
          requestHeaders['X-App-Name'],
          env['ember-new-version-detection'].appName,
          'reports the app name to the server'
        );

        assert.ok(
          'X-App-Version' in requestHeaders,
          'reports the app version to the server'
        );

        return [
          200,
          headers,
          responseBody
        ];
      });

      this.get('/foos/1', function() {
        headers['X-Current-Version'] = '26716999';

        return [
          200,
          headers,
          responseBody
        ];
      });
    });

    await visit('/bar');

    assert.dom('#alert').doesNotExist('does not signal new version when not available');

    await visit('/bar-new-version');

    assert.dom('#alert').exists('detects a new version is available');
  });
});
