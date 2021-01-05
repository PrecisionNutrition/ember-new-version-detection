import fetchHeader from 'dummy/utils/fetch-header';
import { module, test } from 'qunit';

module('Unit | Utility | fetch-header', function () {
  test('it retrieves the value with a literal match', function (assert) {
    let result = fetchHeader('Foo', { Foo: 'bar' });

    assert.equal(result, 'bar');
  });

  test('it retrieves the value when it is all lower case', function (assert) {
    let result = fetchHeader('foo-bar', { 'foo-bar': 'baz' });

    assert.equal(result, 'baz');
  });
});
