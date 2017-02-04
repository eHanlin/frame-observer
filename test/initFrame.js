
'use strict';

import frameObserver from '../src/js/index';
console.log(frameObserver);
console.log(window);

frameObserver.registerMethods({
  add:function( deferred, valueA, valueB ){
    deferred.resolve(valueA + valueB);
  },                             
  initIdle:function() {          
    setTimeout(function(){ frameObserver.trigger('idle', +new Date()); }, 1000);
  }                              
});                              

frameObserver.resolveState('ready');


