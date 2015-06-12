/***
 * @namespace
 */
var util = {

  /**
   * @param {String} str
   * @type boolean
   */
  isString:function( str ){

    return typeof str === "string";
  },

  /**
   * @param {HTMLElement} el
   * @type boolean
   */
  isElement:function( el ){

    return el instanceof Element;
  },

  /**
   * @param {Object} obj
   * @type boolean
   */
  isObject:function( obj ){ return typeof obj == "object"; },

  /**
   * @param {Object} obj
   * @type boolean
   */
  isArray:function( obj ){ return typeof Object.prototype.toString.call(obj) == "[object Array]"; },

  /**
   * @param {Object} target
   * @param {Object} obj
   * @type Object
   */
  clone:function( deep, cloneObj, copyObj ){

    var target, obj, params = this.copyArray( arguments ), copyObjs;

    if ( typeof deep != "boolean" ) {
      target = deep,
      copyObjs = params.slice(1);
    } else {
      target = cloneObj;
      copyObjs = params.slice(2);
    }

    for ( var index in copyObjs ) {

      var obj = copyObjs[index];

      for ( var i in obj ) {

        if ( util.isArray( obj[i] ) ) {

          target[i] = util.isArray( target[i] ) ? target[i]: [];

        } else if ( util.isObject( obj[i] ) ) {

          target[i] = util.isObject( target[i] ) ? target[i]: {};

        }

        if ( deep && util.isObject( obj[i] ) ) clone( target[i], obj[i] );

        else target[i] = obj[i];
      }
    }

    return target;
  },

  /***
   * @param {Array} array
   * @type Array
   */
  copyArray:function( array ){

    var newArray = [];

    for ( var i = 0; i<array.length; i++ ) newArray[i] = array[i];
    return newArray;
  },

  /**
   * @param {String} tagName
   */
  createElement:function( tagName ){
    return doc.createElement( tagName );
  },

  DATA_KEY:guid(),

  /**
   * @param {HTMLElement} el
   * @param {String} key
   * @param {*} val
   */
  data:function( el, key, val ){
    var DATA_KEY = this.DATA_KEY;
    var data = el[DATA_KEY]? el[DATA_KEY] : el[DATA_KEY] = {};

    if ( arguments.length === 3 ) {
      data[key] = val;
    } else {
      return data[key];
    }
  },

  /** 
   * @param {HTMLElement} el
   * @type Object
   */
  getContentWindowByEl:function( el ){
  
    return util.isElement( el ) ? el.contentWindow: el; 
  },

  /**
   * @param {Window} win
   * @param {Object} data
   * @param {String} origin
   */
  postMessage:function( win, data, origin ){
    win.postMessage( JSON.stringify( data ), origin );
  }
};


