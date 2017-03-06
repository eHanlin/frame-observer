
import frameObserver from './frameObserver';
export default frameObserver;

if (typeof window !== 'undefined' &&typeof window.frameObserver !== 'undefined') window.frameObserver = frameObserver;
module.exports = frameObserver;

