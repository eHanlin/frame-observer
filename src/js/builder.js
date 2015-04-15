
/**
 * @param {String} type
 * @param {Object} data
 * @param {String} id
 */
var buildMessageEvent = function( type, direction, data, id ){
  var infoData = data || {};
  var _id = id ? id: guid();
  return {type:type, data:infoData, id:_id, timestamp:+new Date(), direction:direction};
};

/**
 * @param {String} eventType
 */
var buildFrameCaller = function( eventType ){

  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  return function( el ){

    var deferred = Deferred();
    var origin;
    var contentWindow;
    var msgEvt = buildMessageEvent( eventType, 'send', {params:util.copyArray( arguments ).slice(1)} );
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




