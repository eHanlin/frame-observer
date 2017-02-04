
import {processorBuilder} from '../builder'; 

/**
 * @class
 */
var MethodMsgProcessor = function( frameObserver ){
  this.frameObserver = frameObserver;
};

MethodMsgProcessor.prototype = {

  /**
   * @param {Event} msgEvt
   * @param {Object} source
   * @param {String} origin
   * @param {Deferred} deferred
   */
  onRecv:function( msgEvt, source, origin, deferred ){
    var frameObserver = this.frameObserver;
    var params = msgEvt.data.params;
    var methodName = params.shift()

    params.unshift( deferred );

    if ( frameObserver.methods_ && frameObserver.methods_[methodName] ) {
      frameObserver.methods_[methodName].apply( frameObserver.methods_, params );
    } else {
      deferred.reject({err:"the method is not exist."});
    }

    processorBuilder.deferredRecv().apply(this, arguments);

  },

  /**
   * @param {Event} msgEvt
   */
  onSendResp:processorBuilder.deferredSendResp()
};


export default MethodMsgProcessor;

