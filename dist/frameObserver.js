(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["frameObserver"] = factory();
	else
		root["frameObserver"] = factory();
})(this, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because 'output.globalObject' reads 'this'.
/******/ 	var __webpack_modules__ = ({

/***/ 239:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _util = _interopRequireDefault(__webpack_require__(499));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @class
 */
var EventObserver = function EventObserver() {
  this.events = {};
};
EventObserver.prototype = {
  /**
   * @param {String} name
   * @param {function} func
   * @param {Object} opts
   * @param {*} opts.target
   * @param {boolean} opts.once is a inner variable
   */
  on: function on(name, func, opts) {
    var opts = opts || {};
    if (!this.events[name]) this.events[name] = [];
    this.events[name].push({
      func: func,
      once: opts.once || false,
      target: opts.target || null
    });
  },
  /**
   * @param {String} name
   * @param {function} func
   */
  once: function once(name, func) {
    this.on(name, func, {
      once: true
    });
  },
  /**
   * @param {String} name
   * @param {function} func
   * @param {*} target
   */
  off: function off(name, func, target) {
    var eventList = this.events[name] || [];
    if (arguments.length == 0) {
      for (var name in this.events) {
        delete this.events[name];
      }
    } else if (arguments.length === 1) {
      delete this.events[name];
    } else {
      for (var i in eventList) {
        var evt = eventList[i];
        if (evt.func === func && (evt.target === null || evt.target === target) || func === undefined && evt.target === target) {
          eventList.splice(i, 1);
          break;
        }
      }
    }
  },
  /**
   * @param {String} eventName
   * @type Number
   */
  getEventNumber: function getEventNumber(eventName) {
    return this.events[eventName] ? this.events[eventName].length : 0;
  },
  /**
   * @param {String} name
   */
  /**
   * @param {Objects} opts
   * @param {String} opts.name
   * @param {*} opts.target
   */
  trigger: function trigger(opts) {
    var name,
      target,
      timeStamp = +new Date();
    if (_util.default.isString(opts)) {
      name = opts;
    } else {
      name = opts.name;
      target = opts.target || null;
    }
    var eventList = this.events[name] || [],
      i;
    var originParams = _util.default.copyArray(arguments);
    if (target) {
      eventList = function (eventList, target) {
        var filterList = [];
        for (var i in eventList) {
          if (eventList[i].target === target) filterList.push(eventList[i]);
        }
        return filterList;
      }(eventList, target);
    }
    for (i in eventList) {
      var evt = {
        type: name,
        timeStamp: timeStamp
      };
      var params = originParams.slice(1);
      params.unshift(evt);
      eventList[i].func.apply(null, params);
    }
    var onceList = [];
    for (i = 0; i < eventList.length; i++) {
      if (eventList[i].once) onceList.push(eventList[i]);
    }
    if (onceList.length && this.events[name]) {
      this.events[name] = this.events[name].filter(function (evt) {
        return onceList.indexOf(evt) === -1;
      });
    }
  }
};
var _default = exports["default"] = EventObserver;

/***/ }),

/***/ 835:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _frameObserver = _interopRequireDefault(__webpack_require__(334));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(r, t) { for (var o = 0; o < t.length; o++) { var i = t[o]; i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(r, _toPropertyKey(i.key), i); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(r) { var o = _toPrimitive(r, "string"); return "symbol" == _typeof(o) ? o : o + ""; }
function _toPrimitive(t, e) { if ("object" != _typeof(t) || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
var FrameObserverContext = /*#__PURE__*/function () {
  function FrameObserverContext(scope) {
    _classCallCheck(this, FrameObserverContext);
    this.scope = scope;
  }
  return _createClass(FrameObserverContext, [{
    key: "on",
    value: function on() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _frameObserver.default.on.apply(_frameObserver.default, [this.scope].concat(args));
    }
  }, {
    key: "off",
    value: function off() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return _frameObserver.default.off.apply(_frameObserver.default, [this.scope].concat(args));
    }
  }, {
    key: "readyState",
    value: function readyState() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      return _frameObserver.default.readyState.apply(_frameObserver.default, [this.scope].concat(args));
    }
  }, {
    key: "callMethod",
    value: function callMethod() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return _frameObserver.default.callMethod.apply(_frameObserver.default, [this.scope].concat(args));
    }
  }, {
    key: "getElement",
    value: function getElement() {
      return this.scope instanceof HTMLElement ? this.scope : null;
    }
  }]);
}();
var _default = exports["default"] = FrameObserverContext;

/***/ }),

/***/ 361:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _buildDeferred = _interopRequireDefault(__webpack_require__(338));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @class
 */
var StateManager = function StateManager() {
  this.stateDeferredMap = {};
};
StateManager.prototype = {
  /**
   * @param {String} stateName
   * @param {Deferred} deferred
   */
  assign: function assign(stateName, deferred) {
    var stateDeferred = this.get(stateName);
    stateDeferred.done(deferred.resolve.bind(deferred));
    stateDeferred.fail(deferred.reject.bind(deferred));
  },
  /**
   * @param {String} stateName
   * @type Deferred
   */
  get: function get(stateName) {
    var deferred = this.stateDeferredMap[stateName];
    return deferred ? deferred : this.stateDeferredMap[stateName] = (0, _buildDeferred.default)();
  }
};
var _default = exports["default"] = StateManager;

/***/ }),

/***/ 338:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
/**
 * @function
 * @type Promise
 */
var buildDeferred = function buildDeferred() {
  var reject, resolve;
  var promise = new Promise(function (res, rej) {
    resolve = res;
    reject = rej;
  });
  promise.resolve = resolve;
  promise.reject = reject;
  var toArray = function toArray(val) {
    return Array.prototype.slice.call(val, 0);
  };
  promise.resolve = function () {
    resolve.call(null, toArray(arguments));
  };
  promise.reject = function () {
    reject.call(null, toArray(arguments));
  };
  promise.always = function (always) {
    promise.then(function (val) {
      always.apply(null, toArray(val));
    }, function (val) {
      always.apply(null, toArray(val));
    });
  };
  promise.done = function (done) {
    promise.then(function (val) {
      done.apply(null, toArray(val));
    });
  };
  promise.fail = function (fail) {
    promise.then(function () {}, function (val) {
      fail.apply(null, toArray(val));
    });
  };
  return promise;
};
var _default = exports["default"] = buildDeferred;

/***/ }),

/***/ 230:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.processorBuilder = exports.buildMessageEvent = exports.buildFrameCaller = void 0;
var _util = _interopRequireDefault(__webpack_require__(499));
var _guid = _interopRequireDefault(__webpack_require__(294));
var _urlUtils = _interopRequireDefault(__webpack_require__(813));
var _buildDeferred = _interopRequireDefault(__webpack_require__(338));
var _Config = __webpack_require__(221);
var _Event = __webpack_require__(291);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @param {String} type
 * @param {Object} data
 * @param {String} id
 * @param {Object} extraAttrs
 */
var buildMessageEvent = exports.buildMessageEvent = function buildMessageEvent(type, direction, data, id, extraAttrs) {
  var infoData = data || {};
  var _id = id ? id : (0, _guid.default)();
  var _extraAttrs = extraAttrs || {};
  var defaults = {};
  defaults[_Config.FRAME_OBSERVER] = true;
  return _util.default.clone({
    type: type,
    data: infoData,
    id: _id,
    timestamp: +new Date(),
    direction: direction
  }, _extraAttrs, defaults);
};

/**
 * @param {String} eventType
 * @param {Object} extraAttrs
 */
var buildFrameCaller = exports.buildFrameCaller = function buildFrameCaller(eventType, extraAttrs) {
  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  return function (el) {
    var deferred = (0, _buildDeferred.default)();
    var origin;
    var contentWindow;
    var msgEvt = buildMessageEvent(eventType, _Event.SEND, {
      params: _util.default.copyArray(arguments).slice(1)
    }, null, extraAttrs);
    this.evtMapping[msgEvt.id] = {
      el: el,
      id: msgEvt.id,
      deferred: deferred
    };
    if (this.createOrigin == null) {
      origin = _urlUtils.default.getOriginByFrameEl(el);
    } else {
      origin = this.createOrigin(el);
    }
    contentWindow = _util.default.getContentWindowByEl(el);
    _util.default.postMessage(contentWindow, msgEvt, origin);
    return deferred;
  };
};

/**
 * @namespace
 */
var processorBuilder = exports.processorBuilder = {
  deferredSendResp: function deferredSendResp() {
    /**
     * @param {Event} msgEvt
     */
    return function (msgEvt) {
      var callMethodName = 'reject';
      var frameObserver = this.frameObserver;
      var respTmp = frameObserver.evtMapping[msgEvt.id];
      delete frameObserver.evtMapping[msgEvt.id];
      if (msgEvt.deferredState === 'done') callMethodName = 'resolve';
      //ignore it when observer is not sender
      if (respTmp) respTmp.deferred[callMethodName](msgEvt.data);
    };
  },
  deferredRecv: function deferredRecv() {
    /**
     * @param {Event} msgEvt
     * @param {Object} source
     * @param {String} origin
     * @param {Deferred} deferred
     */
    return function (msgEvt, source, origin, deferred) {
      var buildPostingOrigin = function buildPostingOrigin(deferredState) {
        return function () {
          var respMsgEvt = buildMessageEvent(msgEvt.type, _Event.RECV, {
            result: arguments
          }, msgEvt.id, {
            deferredState: deferredState
          });
          _util.default.postMessage(source, respMsgEvt, origin);
        };
      };
      deferred.done(buildPostingOrigin('done'));
      deferred.fail(buildPostingOrigin('fail'));
    };
  }
};

/***/ }),

/***/ 221:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.FRAME_OBSERVER = exports.FRAME_EVENT_ID = void 0;
var FRAME_OBSERVER = exports.FRAME_OBSERVER = '_FRAME_OBSERVER_';
var FRAME_EVENT_ID = exports.FRAME_EVENT_ID = 'frameEventId';

/***/ }),

/***/ 291:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SEND = exports.RECV = exports.MESSAGE = void 0;
var MESSAGE = exports.MESSAGE = 'message';
var SEND = exports.SEND = 'send';
var RECV = exports.RECV = 'recv';

/***/ }),

/***/ 328:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UNREGISTER_EVENT = exports.STATE = exports.REGISTER_EVENT = exports.METHOD = exports.EVENT = void 0;
var EVENT = exports.EVENT = 'event';
var METHOD = exports.METHOD = 'method';
var REGISTER_EVENT = exports.REGISTER_EVENT = 'registerEvent';
var UNREGISTER_EVENT = exports.UNREGISTER_EVENT = 'unregisterEvent';
var STATE = exports.STATE = 'state';

/***/ }),

/***/ 334:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _Config = __webpack_require__(221);
var _Event = __webpack_require__(291);
var _MessageType = __webpack_require__(328);
var _util = _interopRequireDefault(__webpack_require__(499));
var _guid = _interopRequireDefault(__webpack_require__(294));
var _EventObserver = _interopRequireDefault(__webpack_require__(239));
var _StateManager = _interopRequireDefault(__webpack_require__(361));
var _EventMsgProcessor = _interopRequireDefault(__webpack_require__(61));
var _RegisterMsgProcessor = _interopRequireDefault(__webpack_require__(694));
var _StateProcessor = _interopRequireDefault(__webpack_require__(719));
var _UnregisterMsgProcessor = _interopRequireDefault(__webpack_require__(809));
var _MethodMsgProcessor = _interopRequireDefault(__webpack_require__(634));
var _builder = __webpack_require__(230);
var _buildDeferred = _interopRequireDefault(__webpack_require__(338));
var _FrameObserverContext = _interopRequireDefault(__webpack_require__(835));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(r, t, o) { return (t = _toPropertyKey(t)) in r ? Object.defineProperty(r, t, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : r[t] = o, r; }
function _toPropertyKey(r) { var o = _toPrimitive(r, "string"); return "symbol" == _typeof(o) ? o : o + ""; }
function _toPrimitive(t, e) { if ("object" != _typeof(t) || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
/**
 * @class
 */
var FrameObserver = function FrameObserver() {
  this.evtMapping = {};
  this.eventObservers = {};
  this.registerEventObserver = new _EventObserver.default();
  this.stateManager = new _StateManager.default();
  this.methods_ = {};
  this.msgProcessors = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, _MessageType.METHOD, new _MethodMsgProcessor.default(this)), _MessageType.REGISTER_EVENT, new _RegisterMsgProcessor.default(this)), _MessageType.UNREGISTER_EVENT, new _UnregisterMsgProcessor.default(this)), _MessageType.EVENT, new _EventMsgProcessor.default(this)), _MessageType.STATE, new _StateProcessor.default(this));
  window.addEventListener(_Event.MESSAGE, this.onMessage.bind(this));
};
FrameObserver.prototype = {
  /**
   * @param {Event} evt
   */
  onMessage: function onMessage(evt) {
    var origin = evt.origin,
      msgEvt;
    try {
      msgEvt = JSON.parse(evt.data);
    } catch (e) {
      msgEvt = null;
    }

    //event filter if source is not sended from FrameObserver
    if (_util.default.isObject(msgEvt) && msgEvt && _Config.FRAME_OBSERVER in msgEvt) {
      //ignore unknown message types
      if (!Object.prototype.hasOwnProperty.call(this.msgProcessors, msgEvt.type)) return;
      var deferred = (0, _buildDeferred.default)();
      var source = evt.source;

      //console.log( msgEvt, evt );
      //console.log( evt );

      var msgProcessor = this.msgProcessors[msgEvt.type];
      if (msgEvt.direction == _Event.SEND) msgProcessor.onRecv(msgEvt, source, origin, deferred);else msgProcessor.onSendResp(msgEvt, origin, deferred);
    }
  },
  /**
   * @private 
   * @param {HTMLElement} el
   * @type String
   */
  getFrameEventId_: function getFrameEventId_(el) {
    var frameEventId = "window";
    if (_util.default.isElement(el)) {
      frameEventId = function (id) {
        var frameEventId = id ? id : (0, _guid.default)();
        _util.default.data(el, _Config.FRAME_EVENT_ID, frameEventId);
        return frameEventId;
      }(_util.default.data(el, _Config.FRAME_EVENT_ID));
    }
    return frameEventId;
  },
  /**
   * @private
   * @param {String} frameEventId
   * @type Array[EventObserver]
   */
  getFrameObserverList_: function getFrameObserverList_(frameEventId) {
    return !this.eventObservers[frameEventId] ? this.eventObservers[frameEventId] = [] : this.eventObservers[frameEventId];
  },
  /**
   * @private
   * @param {HTMLElement} el
   * @type EventObserver
   */
  getObserver_: function getObserver_(el) {
    var frameEventId = this.getFrameEventId_(el);
    var frameObserverList = this.getFrameObserverList_(frameEventId);
    var observer;
    for (var i in frameObserverList) {
      if (frameObserverList[i].el === el) {
        observer = frameObserverList[i].observer;
        break;
      }
    }
    if (!observer) {
      observer = new _EventObserver.default();
      frameObserverList.push({
        el: el,
        observer: observer
      });
    }
    return observer;
  },
  /**
   * @param {HTMLElement} el
   * @param {String} eventName
   * @param {function} func
   */
  on: function on(el, eventName, func) {
    var observer = this.getObserver_(el);
    var frameEventId = this.getFrameEventId_(el);
    var _this = this;
    observer.on(eventName, func);
    return new Promise(function (resolve, reject) {
      if (observer.getEventNumber(eventName) === 1) _this.registerEvent(el, {
        eventName: eventName,
        frameEventId: frameEventId
      }).then(resolve);else resolve();
    });
  },
  /**
   * @param {HTMLElement} el
   * @param {String} eventName
   * @param {function} func
   */
  off: function off(el, eventName, func) {
    var observer = this.getObserver_(el);
    var frameEventId = this.getFrameEventId_(el);
    var _this = this;
    if (arguments.length == 2) {
      observer.off(eventName);
    } else {
      observer.off(eventName, func);
    }
    return new Promise(function (resolve, reject) {
      if (observer.getEventNumber(eventName) === 0) _this.unregisterEvent(el, {
        eventName: eventName,
        frameEventId: frameEventId
      }).then(resolve);else resolve();
    });
  },
  /**
   * @param {String} name
   */
  trigger: function trigger(name) {
    this.registerEventObserver.trigger(name, _util.default.copyArray(arguments).slice(1));
  },
  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  callMethod: (0, _builder.buildFrameCaller)(_MessageType.METHOD),
  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  registerEvent: (0, _builder.buildFrameCaller)(_MessageType.REGISTER_EVENT),
  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  unregisterEvent: (0, _builder.buildFrameCaller)(_MessageType.UNREGISTER_EVENT),
  /**
   * @param {Object} methods
   */
  registerMethods: function registerMethods(methods) {
    for (var i in methods) {
      this.methods_[i] = methods[i];
    }
    ;
  },
  /**
   * @param {String} stateName
   */
  resolveState: function resolveState(stateName) {
    this.stateManager.get(stateName).resolve(_util.default.copyArray(arguments).slice(1));
  },
  /**
   * @param {String} stateName
   */
  rejectState: function rejectState(stateName) {
    this.stateManager.get(stateName).reject(_util.default.copyArray(arguments).slice(1));
  },
  /**
   * @param {HTMLElement} el
   * @param {String} stateName
   * @type Deferred
   */
  readyState: (0, _builder.buildFrameCaller)(_MessageType.STATE),
  /**
   * @param {HTMLElement|Window} el
   * @type FrameObserverContext
   */
  getContext: function getContext(el) {
    return new _FrameObserverContext.default(el);
  }
};
var frameObserver = new FrameObserver();

//if ( typeof window !== "undefined" ) window.frameObserver = frameObserver;
//if ( typeof module !== "undefined" ) module.exports = frameObserver;
var _default = exports["default"] = frameObserver;

/***/ }),

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _frameObserver = _interopRequireDefault(__webpack_require__(334));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports["default"] = _frameObserver.default;
if (typeof window !== 'undefined' && typeof window.frameObserver === 'undefined') window.frameObserver = _frameObserver.default;
module.exports = _frameObserver.default;

/***/ }),

/***/ 61:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _util = _interopRequireDefault(__webpack_require__(499));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @class
 */
var EventMsgProcessor = function EventMsgProcessor(frameObserver) {
  this.frameObserver = frameObserver;
};
EventMsgProcessor.prototype = {
  /**
   * @param {Event} msgEvt
   * @param {Object} source
   * @param {String} origin
   * @param {Deferred} deferred
   */
  onRecv: function onRecv(msgEvt, source, origin, deferred) {
    var params = msgEvt.data.result;
    var type = params[0].type;
    var param = _util.default.copyArray(params[1]);
    //console.log( arguments );
    param.unshift(type);
    var observerList = this.frameObserver.getFrameObserverList_(msgEvt.frameEventId);
    if (observerList) {
      for (var i in observerList) {
        var observerContext = observerList[i];
        if (_util.default.getContentWindowByEl(observerContext.el) === source) {
          observerContext.observer.trigger.apply(observerContext.observer, param);
        }
      }
    }
  }
};
var _default = exports["default"] = EventMsgProcessor;

/***/ }),

/***/ 634:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _builder = __webpack_require__(230);
/**
 * @class
 */
var MethodMsgProcessor = function MethodMsgProcessor(frameObserver) {
  this.frameObserver = frameObserver;
};
MethodMsgProcessor.prototype = {
  /**
   * @param {Event} msgEvt
   * @param {Object} source
   * @param {String} origin
   * @param {Deferred} deferred
   */
  onRecv: function onRecv(msgEvt, source, origin, deferred) {
    var frameObserver = this.frameObserver;
    var params = msgEvt.data.params;
    var methodName = params.shift();
    params.unshift(deferred);
    if (frameObserver.methods_ && frameObserver.methods_[methodName]) {
      frameObserver.methods_[methodName].apply(frameObserver.methods_, params);
    } else {
      deferred.reject({
        err: "the method is not exist."
      });
    }
    _builder.processorBuilder.deferredRecv().apply(this, arguments);
  },
  /**
   * @param {Event} msgEvt
   */
  onSendResp: _builder.processorBuilder.deferredSendResp()
};
var _default = exports["default"] = MethodMsgProcessor;

/***/ }),

/***/ 694:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _util = _interopRequireDefault(__webpack_require__(499));
var _builder = __webpack_require__(230);
var _Event = __webpack_require__(291);
var _MessageType = __webpack_require__(328);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @class
 */
var RegisterMsgProcessor = function RegisterMsgProcessor(frameObserver) {
  this.frameObserver = frameObserver;
};
RegisterMsgProcessor.prototype = {
  /**
   * @param {Event} msgEvt
   * @param {Object} source
   * @param {String} origin
   * @param {Deferred} deferred
   */
  onRecv: function onRecv(msgEvt, source, origin, deferred) {
    var param = msgEvt.data.params[0];
    var frameObserver = this.frameObserver;
    var eventName = param.eventName;
    var frameEventId = param.frameEventId;

    //console.log( arguments , param);
    frameObserver.registerEventObserver.on(eventName, function () {
      //console.log( arguments );
      var respMsgEvt = (0, _builder.buildMessageEvent)(_MessageType.EVENT, _Event.SEND, {
        result: _util.default.copyArray(arguments)
      }, msgEvt.id);
      respMsgEvt.frameEventId = frameEventId;
      _util.default.postMessage(source, respMsgEvt, origin);
    }, {
      target: source
    });
    deferred.resolve();
    _builder.processorBuilder.deferredRecv().apply(this, arguments);
  },
  /**
   * @param {Event} msgEvt
   */
  onSendResp: _builder.processorBuilder.deferredSendResp()
};
var _default = exports["default"] = RegisterMsgProcessor;

/***/ }),

/***/ 719:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _builder = __webpack_require__(230);
/**
 * @class
 */
var StateProcessor = function StateProcessor(frameObserver) {
  this.frameObserver = frameObserver;
};
StateProcessor.prototype = {
  /**
   * @param {Event} msgEvt
   * @param {Object} source
   * @param {String} origin
   * @param {Deferred} deferred
   */
  onRecv: function onRecv(msgEvt, source, origin, deferred) {
    var frameObserver = this.frameObserver;
    var data = msgEvt.data;
    var params = data.params;
    frameObserver.stateManager.assign(params[0], deferred);
    _builder.processorBuilder.deferredRecv().apply(this, arguments);
  },
  /**
   * @param {Event} msgEvt
   */
  onSendResp: _builder.processorBuilder.deferredSendResp()
};
var _default = exports["default"] = StateProcessor;

/***/ }),

/***/ 809:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _builder = __webpack_require__(230);
/**
 * @class
 */
var UnregisterMsgProcessor = function UnregisterMsgProcessor(frameObserver) {
  this.frameObserver = frameObserver;
};
UnregisterMsgProcessor.prototype = {
  /**
   * @param {Event} msgEvt
   * @param {Object} source
   * @param {String} origin
   * @param {Deferred} deferred
   */
  onRecv: function onRecv(msgEvt, source, origin, deferred) {
    var param = msgEvt.data.params[0];
    var frameObserver = this.frameObserver;
    var eventName = param.eventName;
    var frameEventId = param.frameEventId;
    frameObserver.registerEventObserver.off(eventName, undefined, source);
    deferred.resolve();
    _builder.processorBuilder.deferredRecv().apply(this, arguments);
  },
  /**
   * @param {Event} msgEvt
   */
  onSendResp: _builder.processorBuilder.deferredSendResp()
};
var _default = exports["default"] = UnregisterMsgProcessor;

/***/ }),

/***/ 294:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var guid = function guid() {
  var s4 = function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};
var _default = exports["default"] = guid;

/***/ }),

/***/ 813:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _util = _interopRequireDefault(__webpack_require__(499));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @namespace
 *
 */
var urlUtils = {
  /***
   * @param {String} url
   * @type String
   */
  getOrigin: function getOrigin(url) {
    var result = /https?:\/\/[^/]*\/?/.exec(url);
    return result && result.length ? result[0] : null;
  },
  /** 
   * @param {HTMLElement} el
   * @type Object
   */
  getOriginByFrameEl: function getOriginByFrameEl(el) {
    return _util.default.isElement(el) ? urlUtils.getOrigin(el.src) : document.referrer ? document.referrer : urlUtils.getOrigin(document.location.href);
  }
};
var _default = exports["default"] = urlUtils;

/***/ }),

/***/ 499:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _guid = _interopRequireDefault(__webpack_require__(294));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/***
 * @namespace
 */
var util = {
  /**
   * @param {String} str
   * @type boolean
   */
  isString: function isString(str) {
    return typeof str === "string";
  },
  /**
   * @param {HTMLElement} el
   * @type boolean
   */
  isElement: function isElement(el) {
    return el instanceof Element;
  },
  /**
   * @param {Object} obj
   * @type boolean
   */
  isObject: function isObject(obj) {
    return _typeof(obj) == "object";
  },
  /**
   * @param {Object} obj
   * @type boolean
   */
  isArray: function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  },
  /**
   * @param {Object} target
   * @param {Object} obj
   * @type Object
   */
  clone: function clone(deep, cloneObj, copyObj) {
    var target,
      obj,
      params = this.copyArray(arguments),
      copyObjs;
    if (typeof deep != "boolean") {
      target = deep;
      deep = false;
      copyObjs = params.slice(1);
    } else {
      target = cloneObj;
      copyObjs = params.slice(2);
    }
    for (var index in copyObjs) {
      var obj = copyObjs[index];
      for (var i in obj) {
        var value = obj[i];
        if (deep && value !== null && util.isObject(value)) {
          if (util.isArray(value)) {
            target[i] = util.isArray(target[i]) ? target[i] : [];
          } else {
            target[i] = target[i] !== null && util.isObject(target[i]) && !util.isArray(target[i]) ? target[i] : {};
          }
          util.clone(true, target[i], value);
        } else {
          target[i] = value;
        }
      }
    }
    return target;
  },
  /***
   * @param {Array} array
   * @type Array
   */
  copyArray: function copyArray(array) {
    var newArray = [];
    for (var i = 0; i < array.length; i++) newArray[i] = array[i];
    return newArray;
  },
  /**
   * @param {String} tagName
   */
  createElement: function createElement(tagName) {
    return document.createElement(tagName);
  },
  DATA_KEY: (0, _guid.default)(),
  /**
   * @param {HTMLElement} el
   * @param {String} key
   * @param {*} val
   */
  data: function data(el, key, val) {
    var DATA_KEY = this.DATA_KEY;
    var data = el[DATA_KEY] ? el[DATA_KEY] : el[DATA_KEY] = {};
    if (arguments.length === 3) {
      data[key] = val;
    } else {
      return data[key];
    }
  },
  /** 
   * @param {HTMLElement} el
   * @type Object
   */
  getContentWindowByEl: function getContentWindowByEl(el) {
    return util.isElement(el) ? el.contentWindow : el;
  },
  /**
   * @param {Window} win
   * @param {Object} data
   * @param {String} origin
   */
  postMessage: function postMessage(win, data, origin) {
    win.postMessage(JSON.stringify(data), origin);
  }
};
var _default = exports["default"] = util;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(25);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=frameObserver.js.map