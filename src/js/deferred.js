/**
 * @namespace
 */
var Deferred = (function(){

  /***
   * @function
   * @param {String} cbName
   * @type function
   */
  var buildTask = function( cbName ){

    return function( cb ){

       if ( !this.hasResult() ) this[cbName + 'Cbs_'].push( cb ); else cb.apply( null, this.taskParams_ );
    };
  };


  /**
   * @class
   * @constructor
   */
  var Deferred = function(){
    this.doneCbs_ = [];
    this.failCbs_ = [];
    this.alwayCbs_ = [];
    this.result_ = {};
  };

  Deferred.prototype = {

    TYPES:['resolve','reject'],

    TASK_MAPPING:{
      'done':'resolve',
      'fail':'reject'
    },

    done:buildTask('done'),

    fail:buildTask('fail'),

    always:buildTask('alway'),

    /***
     * @param {String} taskName
     * @type boolean
     */
    hasEndTask:function( taskName ){
      return this.result_[this.TASK_MAPPING[taskName]]?true:false;
    },

    /**
     * @type boolean
     */
    hasResult:function(){
      var result = this.result_,
      TYPES = this.TYPES;
      for ( var index in TYPES ) {
        if ( TYPES[index] in result ) return true;
      }
      return false
    },

    /**
     * @param {String[]} cbNames
     * @param {Array[*]} params 
     */
    runTask:function( cbNames, params ){
      for ( var i in cbNames ) {
        var cb = null,
        cbName = cbNames[i];
        while( cb = this[cbName + 'Cbs_'].shift() ) cb.apply(null,params);
        delete this[cbName + 'Cbs_'];
      }
    },

    /**
     *
     */
    resolve:function(){
      if ( !this.hasResult() ) {
        this.result_['resolve'] = true;
        this.taskParams_ = arguments;
        this.runTask( ['alway','done'], arguments );
      }
    },

    /**
     *
     */
    reject:function(){
      if ( !this.hasResult() ) {
        this.result_['reject'] = true;
        this.taskParams_ = arguments;
        this.runTask( ['alway','fail'], arguments );
      }
    }
  };

  return function(){
    return new Deferred();
  };

})();

