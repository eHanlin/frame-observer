
import {FRAME_OBSERVER, FRAME_EVENT_ID} from './constants/Config';
import {MESSAGE, SEND} from './constants/Event';
import {METHOD, REGISTER_EVENT, UNREGISTER_EVENT, STATE, EVENT} from './constants/MessageType';
import util from './utils/util';
import guid from './utils/guid';
import EventObserver from './EventObserver';
import StateManager from './StateManager';
import EventMsgProcessor from './processor/EventMsgProcessor';
import RegisterMsgProcessor from './processor/RegisterMsgProcessor';
import StateProcessor from './processor/StateProcessor';
import UnregisterMsgProcessor from './processor/UnregisterMsgProcessor';
import MethodMsgProcessor from './processor/MethodMsgProcessor';
import {buildFrameCaller} from './builder';
import Deferred from './buildDeferred';
import FrameObserverContext from './FrameObserverContext';


/**
 * @class
 */
var FrameObserver = function(){

  this.evtMapping = {};
  this.eventObservers = {};
  this.registerEventObserver = new EventObserver();
  this.stateManager = new StateManager();
  this.methods_ = {};

  this.msgProcessors = {
    [METHOD]:new MethodMsgProcessor( this ),
    [REGISTER_EVENT]:new RegisterMsgProcessor( this ),
    [UNREGISTER_EVENT]:new UnregisterMsgProcessor( this ),
    [EVENT]:new EventMsgProcessor( this ),
    [STATE]:new StateProcessor( this )
  };
  window.addEventListener( MESSAGE, this.onMessage.bind( this ) );
};

FrameObserver.prototype = {

  /**
   * @param {Event} evt
   */
  onMessage:function( evt ){
    var origin = evt.origin, msgEvt;
    try {
      msgEvt = JSON.parse( evt.data );
    } catch (e){
      msgEvt = null;
    }

    //event filter if source is not sended from FrameObserver
    if ( util.isObject( msgEvt ) && msgEvt && FRAME_OBSERVER in msgEvt ) {
      var deferred = Deferred();
      var source = evt.source;

      //console.log( msgEvt, evt );
      //console.log( evt );

      var msgProcessor = this.msgProcessors[ msgEvt.type ];

      if ( msgEvt.direction == SEND ) msgProcessor.onRecv( msgEvt, source, origin, deferred ); else msgProcessor.onSendResp( msgEvt, origin, deferred );
    }
  },

  /**
   * @private 
   * @param {HTMLElement} el
   * @type String
   */
  getFrameEventId_:function( el ){
    var frameEventId = "window";

    if ( util.isElement( el ) ) {
      frameEventId = (function( id ){
        var frameEventId = id ? id : guid();
        util.data( el, FRAME_EVENT_ID, frameEventId );
        return frameEventId;
      })(util.data( el, FRAME_EVENT_ID ));
    }
    return frameEventId;
  },

  /**
   * @private
   * @param {String} frameEventId
   * @type Array[EventObserver]
   */
  getFrameObserverList_:function( frameEventId ){

    return !this.eventObservers[frameEventId] ? this.eventObservers[frameEventId] = []:this.eventObservers[frameEventId];
  },

  /**
   * @private
   * @param {HTMLElement} el
   * @type EventObserver
   */
  getObserver_:function( el ){

    var frameEventId = this.getFrameEventId_( el );
    var frameObserverList = this.getFrameObserverList_( frameEventId );
    var observer;

    for ( var i in frameObserverList ) {

      if ( frameObserverList[i].el === el ) {
        observer = frameObserverList[i].observer;
        break;
      }
    }

    if ( !observer ) {

      observer = new EventObserver();

      frameObserverList.push({
        el:el,
        observer:observer
      });
    }

    return observer;
  },

  /**
   * @param {HTMLElement} el
   * @param {String} eventName
   * @param {function} func
   */
  on:function( el, eventName, func ){

    var observer = this.getObserver_( el );
    var frameEventId = this.getFrameEventId_( el );
    var _this = this;

    observer.on( eventName, func );

    return new Promise(function(resolve, reject) {
      if ( observer.getEventNumber( eventName ) === 1 ) _this.registerEvent( el, {eventName:eventName, frameEventId:frameEventId} ).then(resolve);
      else resolve()
    });
  },

  /**
   * @param {HTMLElement} el
   * @param {String} eventName
   * @param {function} func
   */
  off:function( el, eventName, func ){

    var observer = this.getObserver_( el );
    var frameEventId = this.getFrameEventId_( el );
    var _this = this;

    if (arguments.length == 2) {
      observer.off( eventName );
    } else {
      observer.off( eventName, func );
    }

    return new Promise(function(resolve, reject) {
      if ( observer.getEventNumber( eventName ) === 0 ) _this.unregisterEvent( el, {eventName:eventName, frameEventId:frameEventId} ).then(resolve);
      else resolve();
    });
  },

  /**
   * @param {String} name
   */
  trigger:function( name ){
 
    this.registerEventObserver.trigger( name, util.copyArray( arguments ).slice(1) );
  },

  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  callMethod:buildFrameCaller( METHOD ),

  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  registerEvent:buildFrameCaller( REGISTER_EVENT ),

  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  unregisterEvent:buildFrameCaller( UNREGISTER_EVENT ),


  /**
   * @param {Object} methods
   */
  registerMethods:function( methods ){

    for (var i in methods) {
      this.methods_[i] = methods[i];
    };
  },

  /**
   * @param {String} stateName
   */
  resolveState:function( stateName ){

    this.stateManager.get( stateName ).resolve( util.copyArray( arguments ).slice(1) );
  },

  /**
   * @param {String} stateName
   */
  rejectState:function( stateName ){

    this.stateManager.get( stateName ).reject( util.copyArray( arguments ).slice(1) );
  },


  /**
   * @param {HTMLElement} el
   * @param {String} stateName
   * @type Deferred
   */
  readyState:buildFrameCaller( STATE ),

  /**
   * @param {HTMLElement|Window} el
   * @type FrameObserverContext
   */
  getContext:function(el) {
    return new FrameObserverContext(el);
  }
};


var frameObserver = new FrameObserver();

//if ( typeof window !== "undefined" ) window.frameObserver = frameObserver;
//if ( typeof module !== "undefined" ) module.exports = frameObserver;

export default frameObserver;

