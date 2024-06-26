
import util from './utils/util';
import guid from './utils/guid';
import urlUtils from './utils/urlUtils';
import Deferred from './buildDeferred';
import {FRAME_OBSERVER} from './constants/Config'; 
import {SEND, RECV} from './constants/Event';

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
  var defaults = {};
  defaults[FRAME_OBSERVER] = true;
  return util.clone( {type:type, data:infoData, id:_id, timestamp:+new Date(), direction:direction}, _extraAttrs, defaults );
};

/**
 * @param {String} eventType
 * @param {Object} extraAttrs
 */
var buildFrameCaller = function( eventType, extraAttrs){

  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  return function( el ){

    var deferred = Deferred();
    var origin;
    var contentWindow;
    var msgEvt = buildMessageEvent( eventType, SEND, {params:util.copyArray( arguments ).slice(1)}, null, extraAttrs );
    this.evtMapping[msgEvt.id] = {
      el:el,
      id:msgEvt.id,
      deferred:deferred
    };

    if (this.createOrigin == null) {
      origin = urlUtils.getOriginByFrameEl( el );
    } else {
      origin = this.createOrigin(el);
    }
    contentWindow = util.getContentWindowByEl( el );
    util.postMessage( contentWindow, msgEvt, origin );

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
      //ignore it when observer is not sender
      if (respTmp) respTmp.deferred[callMethodName](msgEvt.data);
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
          var respMsgEvt = buildMessageEvent( msgEvt.type, RECV, {result:arguments}, msgEvt.id, {deferredState:deferredState} );
          util.postMessage( source, respMsgEvt, origin );
        };
      };
      deferred.done(buildPostingOrigin( 'done' ));
      deferred.fail(buildPostingOrigin( 'fail' ));
    };
  }
};

export {buildMessageEvent, buildFrameCaller, processorBuilder};

