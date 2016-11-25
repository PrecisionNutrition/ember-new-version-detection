# ember-new-version-detection [![Build Status](https://travis-ci.org/PrecisionNutrition/ember-new-version-detection.svg?branch=master)](https://travis-ci.org/PrecisionNutrition/ember-new-version-detection)

**This is a highly opinionated add-on. It's incredibly specific to our needs at
Precision Nutrition. We welcome pull requests to make this more flexible.**

We needed a way to test if a new version of our Ember apps were being reported
by our API. Our API does this by reporting back the SHA of the currently
available release for the specific app in question.

Our Ember apps report back:

* `X-App-Name`: the name of the app in question
* `X-App-Version`: the version the app is (this comes from ember-cli-app-version)

And our API reports back:

* `X-Current-Version`: the current version as understood by the API (we use
  ember-cli-deploy to manage this)

## Installation

* `ember install ember-new-version-detection`

### Configuring your application

In your `config/environment.js` file you'll need to add a block like this:

```javascript
var ENV = {
  // snip

  'ember-new-version-detection': {
    appName: 'pickles' /* whatever your app is called by the API */
  }

  // snip
};
```

### Hooking up the detector

This step is really easy. It works for both ember-ajax, and ember-data. Here's
an example using Ember Data:

```javascript
// app/adapters/application.js

import RestAdapter from 'ember-data/adapters/rest';
import VersionHeaderHandler from 'ember-new-version-detection/mixins/version-header-handler';

export default RestAdapter.extend(VersionHeaderHandler, {
  // snip
});
```

Done! You could mix this into your ember-ajax service using the same approach.

## Possible Gotchas

### I'm already overriding headers in my adapter/ajax service!

That's okay, we can fix this by calling `this._super(...arguments)` in your
adapter/ajax service.
