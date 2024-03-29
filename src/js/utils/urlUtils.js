
import util from './util';

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
    return result && result.length ? result[0] : null;
  },

  /** 
   * @param {HTMLElement} el
   * @type Object
   */
  getOriginByFrameEl:function( el ){

    var result =  util.isElement( el ) ? urlUtils.getOrigin( el.src ) : (document.referrer ? document.referrer : urlUtils.getOrigin(document.location.href));
    console.log('postmessage',el, result);
    return result;
  }
};

export default urlUtils;

