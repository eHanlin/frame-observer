
import {processorBuilder} from '../builder'; 

/**
 * @class
 */
var UnregisterMsgProcessor = function( frameObserver ){

  this.frameObserver = frameObserver;
};

UnregisterMsgProcessor.prototype = {

  /**
   * @param {Event} msgEvt
   * @param {Object} source
   * @param {String} origin
   * @param {Deferred} deferred
   */
  onRecv:function( msgEvt, source, origin, deferred ){
    var param = msgEvt.data.params[0];
    var frameObserver = this.frameObserver;
    var eventName = param.eventName;
    var frameEventId = param.frameEventId;

    frameObserver.registerEventObserver.off( eventName, undefined, source );
    deferred.resolve();
    processorBuilder.deferredRecv().apply(this, arguments);
  },

  /**
   * @param {Event} msgEvt
   */
  onSendResp:processorBuilder.deferredSendResp()

};

export default UnregisterMsgProcessor;

