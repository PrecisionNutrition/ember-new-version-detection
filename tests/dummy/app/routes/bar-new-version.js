import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class BarNewVersion extends Route {
  model() {
    return fetch('/foos/1');
  }
}
