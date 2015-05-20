
/**
 * @class
 */
var EventMsgProcessor = function( frameObserver ){

  this.frameObserver = frameObserver;
};

EventMsgProcessor.prototype = {
  /**
   * @param {Event} msgEvt
   * @param {Object} source
   * @param {String} origin
   * @param {Deferred} deferred
   */
  onRecv:function( msgEvt, source, origin, deferred ){
    var params = msgEvt.data.result;
    var type = params[0].type;
    var param = util.copyArray( params[1] );
    //console.log( arguments );
    param.unshift( type );
    var observerList = this.frameObserver.getFrameObserverList_( msgEvt.frameEventId );

    if ( observerList ) {

      for ( var i in observerList ) {
        var observerContext = observerList[i];

        if ( util.getContentWindowByEl( observerContext.el ) === source ) {
          observerContext.observer.trigger.apply( observerContext.observer, param );
        }
      }
    }
  }
};


