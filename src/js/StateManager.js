
import Deferred from './buildDeferred';

/**
 * @class
 */
var StateManager = function(){

  this.stateDeferredMap = {};
};

StateManager.prototype = {

  /**
   * @param {String} stateName
   * @param {Deferred} deferred
   */
  assign:function( stateName, deferred ){
    var stateDeferred = this.get( stateName );
    stateDeferred.done(deferred.resolve.bind(deferred));
    stateDeferred.fail(deferred.reject.bind(deferred));
  },

  /**
   * @param {String} stateName
   * @type Deferred
   */
  get:function( stateName ){
    var deferred = this.stateDeferredMap[stateName];
    return deferred ? deferred : this.stateDeferredMap[stateName] = Deferred();
  }
};

export default StateManager;

