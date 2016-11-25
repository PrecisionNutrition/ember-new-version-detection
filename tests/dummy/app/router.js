import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('foo');
  this.route('foo-new-version');

  this.route('bar');
  this.route('bar-new-version');
});

export default Router;
