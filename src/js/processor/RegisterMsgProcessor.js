
import util from '../utils/util';
import {buildMessageEvent} from '../builder'; 
import {SEND} from '../constants/Event';
import {EVENT} from '../constants/MessageType';

/**
 * @class
 */
var RegisterMsgProcessor = function( frameObserver ){

  this.frameObserver = frameObserver;
};

RegisterMsgProcessor.prototype = {

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

    //console.log( arguments , param);
    frameObserver.registerEventObserver.on( eventName, function(){
      //console.log( arguments );
      var respMsgEvt = buildMessageEvent( EVENT, SEND, {result:util.copyArray( arguments ) }, msgEvt.id );
      respMsgEvt.frameEventId = frameEventId;
      util.postMessage( source, respMsgEvt, origin );
    }, {target:source} );
  },

  /**
   * @param {Event} msgEvt
   */
  onSendResp:function( msgEvt ){

  }
};

export default RegisterMsgProcessor;

