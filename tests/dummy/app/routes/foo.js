import Route from '@ember/routing/route';

export default class Foo extends Route {
  model() {
    return this.store.findAll('foo');
  }
}
