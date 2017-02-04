
'use strict';

import frameObserver from '../src/js/index';

describe('Ready Test', function () {
 
  it('should has a callback when iframe is ready', function(done) {
    this.timeout(10000);
    var iframe = document.createElement('iframe');

    iframe.onload = function() {

      describe('Listen idle event from iframe', function() {
        this.timeout(10000);

        it('should recv a idle event', function(idleDone) {
          frameObserver.on(iframe, 'idle', function(resp, ms) {
            expect(typeof ms).to.equal('number');
            idleDone();
          });
        })
      });

      frameObserver
      .readyState( iframe, 'ready' )
      .then(function(){

         describe('Call iframe "add" method', function() {
           this.timeout(10000);
           var valueA = 5;
           var valueB = 6;

           it('should get ' + valueA + ' + ' + valueB + ' = ' + (valueA + valueB), function(addDone) {
             frameObserver.callMethod(iframe, 'add', 5, 6).then(function(resp) {
               expect(resp[0].result[0]).to.equal(valueA + valueB);
               addDone();
             });
           });
         });

         frameObserver.callMethod(iframe, 'initIdle');

         done();
      });
    
    };
    iframe.src = '/base/test/iframe.html';
    document.body.appendChild(iframe);
  });
});
  
