ember-new-version-detection [![CircleCI](https://circleci.com/gh/PrecisionNutrition/ember-new-version-detection.svg?style=svg)](https://circleci.com/gh/PrecisionNutrition/ember-new-version-detection)
==============================================================================

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

Installation
------------------------------------------------------------------------------

`ember install ember-new-version-detection`

Configuring your application
----------------------------

In your `config/environment.js` file you'll need to add a block like this:

```javascript
const ENV = {
  // snip

  'ember-new-version-detection': {
    appName: 'pickles' /* whatever your app is called by the API */
  }

  // snip
};
```

Hooking up the detector
-----------------------

```javascript
// app/adapters/application.js

import VersionDetectingJsonApiAdapter from 'ember-new-version-detection/adapter/json-api';

export default class MyAdapter extends VersionDetectingJsonApiAdapter {
  // snip
};
```

### Help! I Don't Use JSON:API!

The implementation of the adapter is pretty straightforward. Just copy and paste from our code.
