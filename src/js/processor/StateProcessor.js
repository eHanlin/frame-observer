
import {processorBuilder} from '../builder';

/**
 * @class
 */
var StateProcessor = function( frameObserver ){

  this.frameObserver = frameObserver;
};

StateProcessor.prototype = {

  /**
   * @param {Event} msgEvt
   * @param {Object} source
   * @param {String} origin
   * @param {Deferred} deferred
   */
  onRecv:function( msgEvt, source, origin, deferred ){
    var frameObserver = this.frameObserver;
    var data = msgEvt.data;
    var params = data.params;

    frameObserver.stateManager.assign( params[0], deferred );
    processorBuilder.deferredRecv().apply(this, arguments);
  },

  /**
   * @param {Event} msgEvt
   */
  onSendResp:processorBuilder.deferredSendResp()
};

export default StateProcessor;

