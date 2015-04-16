
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

    deferred.always(function(){
      var respMsgEvt = buildMessageEvent( msgEvt.type, 'recv', {result:arguments}, msgEvt.id );
      source.postMessage( JSON.stringify( respMsgEvt ), origin);
    });

  },

  /**
   * @param {Event} msgEvt
   */
  onSendResp:function( msgEvt ){
    var frameObserver = this.frameObserver;
    var respTmp = frameObserver.evtMapping[msgEvt.id];
    delete frameObserver.evtMapping[msgEvt.id];
    respTmp.deferred.resolve(msgEvt.data);
  }
};




