import Route from '@ember/routing/route';

export default class FooNewVersion extends Route {
  model() {
    return this.store.findRecord('foo', 1);
  }
}
