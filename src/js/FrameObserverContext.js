
import frameObserver from './frameObserver';

class FrameObserverContext {

  constructor(scope){
    this.scope = scope;
  }

  on(...args){
    frameObserver.on(this.scope, ...args);
    return this;
  }

  off(...args){
    frameObserver.off(this.scope, ...args);
    return this;
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

