import Model, { attr } from '@ember-data/model';

export default class Foo extends Model {
  @attr('string') name;
}
