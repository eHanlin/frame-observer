
/**
 * @class
 */
var FrameObserver = function(){

  this.evtMapping = {};
  this.eventObservers = {};
  this.registerEventObserver = new EventObserver();

  this.msgProcessors = {
    method:new MethodMsgProcessor( this ),
    registerEvent:new RegisterMsgProcessor( this ),
    unregisterEvent:new UnregisterMsgProcessor( this ),
    event:new EventMsgProcessor( this )
  };
  window.addEventListener( 'message', this.onMessage.bind( this ) );
};

FrameObserver.prototype = {

  /**
   * @param {Event} evt
   */
  onMessage:function( evt ){
    var origin = evt.origin;
    var msgEvt = JSON.parse( evt.data );
    var deferred = Deferred();
    var source = evt.source;

    //console.log( msgEvt, evt );
    //console.log( evt );

    var msgProcessor = this.msgProcessors[ msgEvt.type ];

    if ( msgEvt.direction == 'send' ) msgProcessor.onRecv( msgEvt, source, origin, deferred ); else msgProcessor.onSendResp( msgEvt, origin, deferred );
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
        util.data( el, 'frameEventId', frameEventId );
        return frameEventId;
      })(util.data( el, 'frameEventId' ));
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

    observer.on( eventName, func );

    if ( observer.getEventNumber( eventName ) === 1 ) this.registerEvent( el, {eventName:eventName, frameEventId:frameEventId} );
  },

  /**
   * @param {HTMLElement} el
   * @param {String} eventName
   * @param {function} func
   */
  off:function( el, eventName, func ){

    var observer = this.getObserver_( el );
    var frameEventId = this.getFrameEventId_( el );

    observer.off( eventName, func );

    if ( observer.getEventNumber( eventName ) === 0 ) this.unregisterEvent( el, {eventName:eventName, frameEventId:frameEventId} );
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
  callMethod:buildFrameCaller( 'method' ),

  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  registerEvent:buildFrameCaller( 'registerEvent' ),

  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  unregisterEvent:buildFrameCaller( 'unregisterEvent' ),


  /**
   * @param {Object} methods
   */
  registerMethods:function( methods ){

    this.methods_ = methods;
  }
};


var frameObserver = new FrameObserver();

if ( typeof window !== "undefined" ) window.frameObserver = frameObserver;
if ( typeof module !== "undefined" ) module.exports = frameObserver;

