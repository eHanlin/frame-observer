
/**
 * @function
 * @type Promise
 */
var buildDeferred = function() {
  var reject, resolve;
  var promise = new Promise(function( res, rej ){
    resolve = res;
    reject = rej;
  });
  promise.resolve = resolve;
  promise.reject = reject;

  var toArray = function(val){
    return Array.prototype.slice.call(val, 0);
  };

  promise.resolve = function(){
    resolve.call(null, toArray(arguments));
  };

  promise.reject = function(){
    reject.call(null, toArray(arguments));
  };

  promise.always = function(always){
    promise.then(function(val){

      always.apply(null, toArray(val));
    },
    function(){

      always.apply(null, toArray(val));
    });
  };

  promise.done = function(done){
    promise.then(function(val){
      done.apply(null, toArray(val));
    });
  };

  promise.fail = function(fail){
    promise.then(function(){},function(val){
      fail.apply(null, toArray(val));
    });
  };

  return promise;
};


export default buildDeferred;

