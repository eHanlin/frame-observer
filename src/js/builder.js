
/**
 * @param {String} type
 * @param {Object} data
 * @param {String} id
 * @param {Object} extraAttrs
 */
var buildMessageEvent = function( type, direction, data, id, extraAttrs ){
  var infoData = data || {};
  var _id = id ? id: guid();
  var _extraAttrs = extraAttrs || {};
  return util.clone( {type:type, data:infoData, id:_id, timestamp:+new Date(), direction:direction}, _extraAttrs );
};

/**
 * @param {String} eventType
 * @param {Object} extraAttrs
 */
var buildFrameCaller = function( eventType, extraAttrs ){

  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  return function( el ){

    var deferred = Deferred();
    var origin;
    var contentWindow;
    var msgEvt = buildMessageEvent( eventType, 'send', {params:util.copyArray( arguments ).slice(1)}, null, extraAttrs );
    this.evtMapping[msgEvt.id] = {
      el:el,
      id:msgEvt.id,
      deferred:deferred
    };

    origin = urlUtils.getOriginByFrameEl( el );
    contentWindow = util.getContentWindowByEl( el );
    contentWindow.postMessage( JSON.stringify( msgEvt ), origin );

    return deferred;
  }
};


/**
 * @namespace
 */
var processorBuilder = {

  deferredSendResp:function(){

    /**
     * @param {Event} msgEvt
     */
    return function( msgEvt ) {
      var callMethodName = 'reject';
      var frameObserver = this.frameObserver;
      var respTmp = frameObserver.evtMapping[msgEvt.id];
      delete frameObserver.evtMapping[msgEvt.id];
      if ( msgEvt.deferredState === 'done' ) callMethodName = 'resolve';
      respTmp.deferred[callMethodName](msgEvt.data);
    };
  },

  deferredRecv:function(){

    /**
     * @param {Event} msgEvt
     * @param {Object} source
     * @param {String} origin
     * @param {Deferred} deferred
     */
    return function( msgEvt, source, origin, deferred ){

      var buildPostingOrigin = function( deferredState ){

        return function(){
          var respMsgEvt = buildMessageEvent( msgEvt.type, 'recv', {result:arguments}, msgEvt.id, {deferredState:deferredState} );
          source.postMessage( JSON.stringify( respMsgEvt ), origin); 
        };
      };
      deferred.done(buildPostingOrigin( 'done' ));
      deferred.fail(buildPostingOrigin( 'fail' ));
    };
  }
};

