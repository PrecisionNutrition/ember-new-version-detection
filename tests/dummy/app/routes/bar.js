import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class BarRoute extends Route {
  model() {
    return fetch('/foos');
  }
}
