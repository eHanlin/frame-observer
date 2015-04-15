/**
 * @namespace
 *
 */
var urlUtils = {

  /***
   * @param {String} url
   * @type String
   */
  getOrigin:function( url ){
    var result = /https?:\/\/[^/]*\/?/.exec( url );
    return result.length ? result[0] : null;
  },

  /** 
   * @param {HTMLElement} el
   * @type Object
   */
  getOriginByFrameEl:function( el ){

    return util.isElement( el ) ? urlUtils.getOrigin( el.src ) : document.referrer;
  }
};

