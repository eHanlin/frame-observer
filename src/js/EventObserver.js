
/**
 * @class
 */
var EventObserver = function(){

  this.events = {};
};

EventObserver.prototype = {

  /**
   * @param {String} name
   * @param {function} func
   * @param {Object} opts
   * @param {*} opts.target
   * @param {boolean} opts.once is a inner variable
   */
  on:function( name, func, opts ){
    var opts = opts || {};

    if ( !this.events[name] ) this.events[name] = [];

    this.events[name].push({
      func:func,
      once:opts.once || false,
      target:opts.target || null
    });
  },

  /**
   * @param {String} name
   * @param {function} func
   */
  once:function( name, func ){

    this.on( name, func, {once:true} );
  },

  /**
   * @param {String} name
   * @param {function} func
   * @param {*} target
   */
  off:function( name, func, target ){

    var eventList = this.events[name] || [];

    if ( arguments.length === 1 ) {

      delete this.events[name];

    } else {

      for ( var i in eventList ) {
        var evt = eventList[i];

        if ( (evt.func === func && ( evt.target === null || evt.target === target )) ||
             (func === undefined && evt.target === target )
           ) {

          eventList.splice( i, 1 );
          break;
        }
      }
    }
  },

  /**
   * @param {String} eventName
   * @type Number
   */
  getEventNumber:function( eventName ){

    return this.events[eventName]? this.events[eventName].length : 0;
  },

  /**
   * @param {String} name
   */
  /**
   * @param {Objects} opts
   * @param {String} opts.name
   * @param {*} opts.target
   */
  trigger:function( opts ){
    var name, target;

    if ( util.isString( opts ) ) {
      name = opts;
    } else {
      name = opts.name;
      target = opts.target || null;
    }

    var eventList = this.events[name] || [], i;
    var originParams = util.copyArray( arguments );

    if ( target ) {

      eventList = (function( eventList, target ){
        var filterList = [];

        for ( var i in eventList ) {
          if ( eventList[i].target === target ) filterList.push( eventList[i] );
        }        

        return filterList;
      })( eventList, target );
    }

    for ( i in eventList ) {

      var evt = {
        type:name
      };

      var params = originParams.slice(1);

      params.unshift( evt );
      eventList[i].func.apply( null, params )
    }

    for ( i = 0; i < eventList.length ; i++ ) {

      if ( eventList[i].once ) {

        target? this.off( name, opts.func, opts.target ) : this.off( name, opts.func );
      }
    }

  }
};


