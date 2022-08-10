import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class FooNewVersion extends Route {
  @service('store') store;

  model() {
    return this.store.findRecord('foo', 1);
  }
}
