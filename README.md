# ember-cli-test-model-waiter

Make Ember acceptance tests wait for models to resolve

-----

When running acceptance tests with non-standard ember-data adapters (eg. [PouchDB/ember-pouch](https://github.com/nolanlawson/ember-pouch), [Firebase/EmberFire](https://github.com/firebase/emberfire), etc), you may run into synchronization errors such as:

* `Error: Assertion Failed: You can only unload a record which is not inFlight.` when you try to create, check, and then delete a record.
* `Error: Called stop() outside of a test context at Object.extend.stop`

With most adapters, this isn't a problem, because the testing system instruments AJAX calls to ensure they have completed before proceeding with the following tests. But for these non-AJAX-based adapters, the testing infrastructure has no way to know when requests are complete.

After installing this addon, the testing system will wait for all models to be resolved before proceeding, regardless of how they're arriving.

## Installation

`ember install ember-cli-test-model-waiter`


# Contributing

The rest of this README outlines the details of collaborating on this Ember addon.

## Installation for development

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
