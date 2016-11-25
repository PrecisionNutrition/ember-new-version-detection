import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import Pretender from 'pretender';
import env from '../../config/environment';

let server;
let headers;
let responseBody;

moduleForAcceptance('Acceptance | detecting a new version', {
  beforeEach() {
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
  },

  afterEach() {
    headers = null;

    responseBody = null;

    server.shutdown();

    server = null;
  },
});

test('via the ember-data adapter', function(assert) {
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

  visit('/foo');

  andThen(function() {
    let alertBox = find('#alert');

    assert.notOk(alertBox.length, 'does not signal new version when not available');

    visit('/foo-new-version');
  });

  andThen(function() {
    let alertBox = find('#alert');

    assert.ok(alertBox.length, 'detects a new version is available');
  });
});

test('via the ember-ajax service', function(assert) {
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

  visit('/bar');

  andThen(function() {
    let alertBox = find('#alert');

    assert.notOk(alertBox.length, 'does not signal new version when not available');

    visit('/bar-new-version');
  });

  andThen(function() {
    let alertBox = find('#alert');

    assert.ok(alertBox.length, 'detects a new version is available');
  });
});
