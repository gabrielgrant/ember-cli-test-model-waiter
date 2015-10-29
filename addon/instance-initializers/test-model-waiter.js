import Ember from 'ember';
import ModuleRegistry from 'ember-resolver/utils/module-registry';

export function initialize(appInstance) {
  if (Ember.testing) {
    var maxIterations = 250;
    var iterations = 0;

    Ember.Test.registerWaiter(function(){

      iterations++;

      // Get all models from the store
      // The following should work to get model names:
      //   var debugAdapter = appInstance.lookup('container-debug-adapter:main');
      //   debugAdapter.catalogEntriesByType('model');
      // but unfortunately it is buggy. Use that once the issue is fixed:
      // https://github.com/ember-cli/ember-resolver/issues/120
      // Until then:
      var modelRegexp = /^[a-zA-Z0-9-_]+\/models\/(.*)$/;
      var modelNames = new ModuleRegistry()
        .moduleNames()
        .filter((name) => modelRegexp.test(name))
        .map((name) => modelRegexp.exec(name)[1]);
      // Check for models in any pending state. Inspired by:
      // https://gist.github.com/rsutphin/73fdad14a24884eee336
      var store = appInstance.lookup('service:store');
      var pendingStates = ['isSaving','isEmpty', 'isLoading', 'isReloading'];
      var allPendingRecords = [];
      modelNames.forEach((name) => {
        var records = store.peekAll(name);
        var pendingRecords = records.filter((r) =>
          pendingStates.map((s) => r.get(s)).some((i) => i)
        );
        allPendingRecords =  allPendingRecords.concat(pendingRecords);
      });

      if (allPendingRecords.length > 0){
        if (iterations % 10 === 0){
          // limit number of messages logged
          Ember.Logger.log(
            'waiting for records: ' +
            allPendingRecords.map((r) => {
              return r.toString() + ' (' + r.get('currentState.stateName') + ')';
            }).join(', ')
          );
        }
        if (iterations < maxIterations){
          return false;
        } else if (iterations === maxIterations) {
          // output one error message when maxIterations is reached
          Ember.Logger.error(
            'Waiting for records for more than ' + maxIterations + ' iterations');
          return false;  // this line shouldn't be reached
        } else {
          // allow test to continue to avoid deadlocking
          return true;
        }
      } else {
        // all models have resolved
        iterations = 0;
        return true;
      }
    });
  }
}

export default {
  name: 'test-model-waiter',
  initialize: initialize
};
