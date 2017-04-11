
import frameObserver from './frameObserver';

class FrameObserverContext {

  constructor(scope){
    this.scope = scope;
  }

  on(...args){
    return frameObserver.on(this.scope, ...args);
  }

  off(...args){
    return frameObserver.off(this.scope, ...args);
  }

  readyState(...args){
    return frameObserver.readyState(this.scope, ...args);
  }

  callMethod(...args){
    return frameObserver.callMethod(this.scope, ...args);
  }

  getElement(){
    return this.scope instanceof HTMLElement ? this.scope : null;
  }

}

export default FrameObserverContext;

