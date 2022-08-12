import fetchHeader from 'ember-new-version-detection/utils/fetch-header';
import { module, test } from 'qunit';

module('Unit | Utility | fetch-header', function () {
  test('it retrieves the value with a literal match', function (assert) {
    const result = fetchHeader('Foo', { Foo: 'bar' });
    assert.strictEqual(result, 'bar');
  });

  test('it retrieves the value when it is all lower case', function (assert) {
    const result = fetchHeader('foo-bar', { 'foo-bar': 'baz' });
    assert.strictEqual(result, 'baz');
  });

  test('it works with a Headers object', function (assert) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const result = fetchHeader('content-type', headers);
    assert.strictEqual(result, 'application/json');
  });
});
