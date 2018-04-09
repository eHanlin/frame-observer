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
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _guid = __webpack_require__(4);

var _guid2 = _interopRequireDefault(_guid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object";
  },

  /**
   * @param {Object} obj
   * @type boolean
   */
  isArray: function isArray(obj) {
    return typeof Object.prototype.toString.call(obj) == "[object Array]";
  },

  /**
   * @param {Object} target
   * @param {Object} obj
   * @type Object
   */
  clone: function (_clone) {
    function clone(_x, _x2, _x3) {
      return _clone.apply(this, arguments);
    }

    clone.toString = function () {
      return _clone.toString();
    };

    return clone;
  }(function (deep, cloneObj, copyObj) {

    var target,
        obj,
        params = this.copyArray(arguments),
        copyObjs;

    if (typeof deep != "boolean") {
      target = deep, copyObjs = params.slice(1);
    } else {
      target = cloneObj;
      copyObjs = params.slice(2);
    }

    for (var index in copyObjs) {

      var obj = copyObjs[index];

      for (var i in obj) {

        if (util.isArray(obj[i])) {

          target[i] = util.isArray(target[i]) ? target[i] : [];
        } else if (util.isObject(obj[i])) {

          target[i] = util.isObject(target[i]) ? target[i] : {};
        }

        if (deep && util.isObject(obj[i])) clone(target[i], obj[i]);else target[i] = obj[i];
      }
    }

    return target;
  }),

  /***
   * @param {Array} array
   * @type Array
   */
  copyArray: function copyArray(array) {

    var newArray = [];

    for (var i = 0; i < array.length; i++) {
      newArray[i] = array[i];
    }return newArray;
  },

  /**
   * @param {String} tagName
   */
  createElement: function createElement(tagName) {
    return document.createElement(tagName);
  },

  DATA_KEY: (0, _guid2.default)(),

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

exports.default = util;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processorBuilder = exports.buildFrameCaller = exports.buildMessageEvent = undefined;

var _util = __webpack_require__(0);

var _util2 = _interopRequireDefault(_util);

var _guid = __webpack_require__(4);

var _guid2 = _interopRequireDefault(_guid);

var _urlUtils = __webpack_require__(17);

var _urlUtils2 = _interopRequireDefault(_urlUtils);

var _buildDeferred = __webpack_require__(2);

var _buildDeferred2 = _interopRequireDefault(_buildDeferred);

var _Config = __webpack_require__(5);

var _Event = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {String} type
 * @param {Object} data
 * @param {String} id
 * @param {Object} extraAttrs
 */
var buildMessageEvent = function buildMessageEvent(type, direction, data, id, extraAttrs) {
  var infoData = data || {};
  var _id = id ? id : (0, _guid2.default)();
  var _extraAttrs = extraAttrs || {};
  var defaults = {};
  defaults[_Config.FRAME_OBSERVER] = true;
  return _util2.default.clone({ type: type, data: infoData, id: _id, timestamp: +new Date(), direction: direction }, _extraAttrs, defaults);
};

/**
 * @param {String} eventType
 * @param {Object} extraAttrs
 */
var buildFrameCaller = function buildFrameCaller(eventType, extraAttrs) {

  /**
   * @param {HTMLElement} el
   * @type Deferred
   */
  return function (el) {

    var deferred = (0, _buildDeferred2.default)();
    var origin;
    var contentWindow;
    var msgEvt = buildMessageEvent(eventType, _Event.SEND, { params: _util2.default.copyArray(arguments).slice(1) }, null, extraAttrs);
    this.evtMapping[msgEvt.id] = {
      el: el,
      id: msgEvt.id,
      deferred: deferred
    };

    origin = _urlUtils2.default.getOriginByFrameEl(el);
    contentWindow = _util2.default.getContentWindowByEl(el);
    _util2.default.postMessage(contentWindow, msgEvt, origin);

    return deferred;
  };
};

/**
 * @namespace
 */
var processorBuilder = {

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
          var respMsgEvt = buildMessageEvent(msgEvt.type, _Event.RECV, { result: arguments }, msgEvt.id, { deferredState: deferredState });
          _util2.default.postMessage(source, respMsgEvt, origin);
        };
      };
      deferred.done(buildPostingOrigin('done'));
      deferred.fail(buildPostingOrigin('fail'));
    };
  }
};

exports.buildMessageEvent = buildMessageEvent;
exports.buildFrameCaller = buildFrameCaller;
exports.processorBuilder = processorBuilder;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    }, function () {

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

exports.default = buildDeferred;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var MESSAGE = exports.MESSAGE = 'message';
var SEND = exports.SEND = 'send';
var RECV = exports.RECV = 'recv';

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var guid = function guid() {
  var s4 = function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

exports.default = guid;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var FRAME_OBSERVER = exports.FRAME_OBSERVER = '_FRAME_OBSERVER_';
var FRAME_EVENT_ID = exports.FRAME_EVENT_ID = 'frameEventId';

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EVENT = exports.EVENT = 'event';
var METHOD = exports.METHOD = 'method';
var REGISTER_EVENT = exports.REGISTER_EVENT = 'registerEvent';
var UNREGISTER_EVENT = exports.UNREGISTER_EVENT = 'unregisterEvent';
var STATE = exports.STATE = 'state';

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Config = __webpack_require__(5);

var _Event = __webpack_require__(3);

var _MessageType = __webpack_require__(6);

var _util = __webpack_require__(0);

var _util2 = _interopRequireDefault(_util);

var _guid = __webpack_require__(4);

var _guid2 = _interopRequireDefault(_guid);

var _EventObserver = __webpack_require__(9);

var _EventObserver2 = _interopRequireDefault(_EventObserver);

var _StateManager = __webpack_require__(11);

var _StateManager2 = _interopRequireDefault(_StateManager);

var _EventMsgProcessor = __webpack_require__(12);

var _EventMsgProcessor2 = _interopRequireDefault(_EventMsgProcessor);

var _RegisterMsgProcessor = __webpack_require__(14);

var _RegisterMsgProcessor2 = _interopRequireDefault(_RegisterMsgProcessor);

var _StateProcessor = __webpack_require__(15);

var _StateProcessor2 = _interopRequireDefault(_StateProcessor);

var _UnregisterMsgProcessor = __webpack_require__(16);

var _UnregisterMsgProcessor2 = _interopRequireDefault(_UnregisterMsgProcessor);

var _MethodMsgProcessor = __webpack_require__(13);

var _MethodMsgProcessor2 = _interopRequireDefault(_MethodMsgProcessor);

var _builder = __webpack_require__(1);

var _buildDeferred = __webpack_require__(2);

var _buildDeferred2 = _interopRequireDefault(_buildDeferred);

var _FrameObserverContext = __webpack_require__(10);

var _FrameObserverContext2 = _interopRequireDefault(_FrameObserverContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @class
 */
var FrameObserver = function FrameObserver() {
  var _msgProcessors;

  this.evtMapping = {};
  this.eventObservers = {};
  this.registerEventObserver = new _EventObserver2.default();
  this.stateManager = new _StateManager2.default();
  this.methods_ = {};

  this.msgProcessors = (_msgProcessors = {}, _defineProperty(_msgProcessors, _MessageType.METHOD, new _MethodMsgProcessor2.default(this)), _defineProperty(_msgProcessors, _MessageType.REGISTER_EVENT, new _RegisterMsgProcessor2.default(this)), _defineProperty(_msgProcessors, _MessageType.UNREGISTER_EVENT, new _UnregisterMsgProcessor2.default(this)), _defineProperty(_msgProcessors, _MessageType.EVENT, new _EventMsgProcessor2.default(this)), _defineProperty(_msgProcessors, _MessageType.STATE, new _StateProcessor2.default(this)), _msgProcessors);
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
    if (_util2.default.isObject(msgEvt) && msgEvt && _Config.FRAME_OBSERVER in msgEvt) {
      var deferred = (0, _buildDeferred2.default)();
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

    if (_util2.default.isElement(el)) {
      frameEventId = function (id) {
        var frameEventId = id ? id : (0, _guid2.default)();
        _util2.default.data(el, _Config.FRAME_EVENT_ID, frameEventId);
        return frameEventId;
      }(_util2.default.data(el, _Config.FRAME_EVENT_ID));
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

      observer = new _EventObserver2.default();

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
      if (observer.getEventNumber(eventName) === 1) _this.registerEvent(el, { eventName: eventName, frameEventId: frameEventId }).then(resolve);else resolve();
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

    observer.off(eventName, func);

    return new Promise(function (resolve, reject) {
      if (observer.getEventNumber(eventName) === 0) _this.unregisterEvent(el, { eventName: eventName, frameEventId: frameEventId }).then(resolve);else resolve();
    });
  },

  /**
   * @param {String} name
   */
  trigger: function trigger(name) {

    this.registerEventObserver.trigger(name, _util2.default.copyArray(arguments).slice(1));
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
    };
  },

  /**
   * @param {String} stateName
   */
  resolveState: function resolveState(stateName) {

    this.stateManager.get(stateName).resolve(_util2.default.copyArray(arguments).slice(1));
  },

  /**
   * @param {String} stateName
   */
  rejectState: function rejectState(stateName) {

    this.stateManager.get(stateName).reject(_util2.default.copyArray(arguments).slice(1));
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
    return new _FrameObserverContext2.default(el);
  }
};

var frameObserver = new FrameObserver();

//if ( typeof window !== "undefined" ) window.frameObserver = frameObserver;
//if ( typeof module !== "undefined" ) module.exports = frameObserver;

exports.default = frameObserver;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _frameObserver = __webpack_require__(7);

var _frameObserver2 = _interopRequireDefault(_frameObserver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _frameObserver2.default;


if (typeof window !== 'undefined' && typeof window.frameObserver === 'undefined') window.frameObserver = _frameObserver2.default;
module.exports = _frameObserver2.default;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(0);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    this.on(name, func, { once: true });
  },

  /**
   * @param {String} name
   * @param {function} func
   * @param {*} target
   */
  off: function off(name, func, target) {

    var eventList = this.events[name] || [];

    if (arguments.length === 1) {

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

    if (_util2.default.isString(opts)) {
      name = opts;
    } else {
      name = opts.name;
      target = opts.target || null;
    }

    var eventList = this.events[name] || [],
        i;
    var originParams = _util2.default.copyArray(arguments);

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

    for (i = 0; i < eventList.length; i++) {

      if (eventList[i].once) {

        target ? this.off(name, opts.func, opts.target) : this.off(name, opts.func);
      }
    }
  }
};

exports.default = EventObserver;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _frameObserver = __webpack_require__(7);

var _frameObserver2 = _interopRequireDefault(_frameObserver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FrameObserverContext = function () {
  function FrameObserverContext(scope) {
    _classCallCheck(this, FrameObserverContext);

    this.scope = scope;
  }

  _createClass(FrameObserverContext, [{
    key: 'on',
    value: function on() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _frameObserver2.default.on.apply(_frameObserver2.default, [this.scope].concat(args));
    }
  }, {
    key: 'off',
    value: function off() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _frameObserver2.default.off.apply(_frameObserver2.default, [this.scope].concat(args));
    }
  }, {
    key: 'readyState',
    value: function readyState() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return _frameObserver2.default.readyState.apply(_frameObserver2.default, [this.scope].concat(args));
    }
  }, {
    key: 'callMethod',
    value: function callMethod() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return _frameObserver2.default.callMethod.apply(_frameObserver2.default, [this.scope].concat(args));
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.scope instanceof HTMLElement ? this.scope : null;
    }
  }]);

  return FrameObserverContext;
}();

exports.default = FrameObserverContext;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _buildDeferred = __webpack_require__(2);

var _buildDeferred2 = _interopRequireDefault(_buildDeferred);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    return deferred ? deferred : this.stateDeferredMap[stateName] = (0, _buildDeferred2.default)();
  }
};

exports.default = StateManager;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(0);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var param = _util2.default.copyArray(params[1]);
    //console.log( arguments );
    param.unshift(type);
    var observerList = this.frameObserver.getFrameObserverList_(msgEvt.frameEventId);

    if (observerList) {

      for (var i in observerList) {
        var observerContext = observerList[i];

        if (_util2.default.getContentWindowByEl(observerContext.el) === source) {
          observerContext.observer.trigger.apply(observerContext.observer, param);
        }
      }
    }
  }
};

exports.default = EventMsgProcessor;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _builder = __webpack_require__(1);

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
      deferred.reject({ err: "the method is not exist." });
    }

    _builder.processorBuilder.deferredRecv().apply(this, arguments);
  },

  /**
   * @param {Event} msgEvt
   */
  onSendResp: _builder.processorBuilder.deferredSendResp()
};

exports.default = MethodMsgProcessor;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(0);

var _util2 = _interopRequireDefault(_util);

var _builder = __webpack_require__(1);

var _Event = __webpack_require__(3);

var _MessageType = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      var respMsgEvt = (0, _builder.buildMessageEvent)(_MessageType.EVENT, _Event.SEND, { result: _util2.default.copyArray(arguments) }, msgEvt.id);
      respMsgEvt.frameEventId = frameEventId;
      _util2.default.postMessage(source, respMsgEvt, origin);
    }, { target: source });

    deferred.resolve();
    _builder.processorBuilder.deferredRecv().apply(this, arguments);
  },

  /**
   * @param {Event} msgEvt
   */
  onSendResp: _builder.processorBuilder.deferredSendResp()
};

exports.default = RegisterMsgProcessor;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _builder = __webpack_require__(1);

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

exports.default = StateProcessor;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _builder = __webpack_require__(1);

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

exports.default = UnregisterMsgProcessor;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(0);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    return result.length ? result[0] : null;
  },

  /** 
   * @param {HTMLElement} el
   * @type Object
   */
  getOriginByFrameEl: function getOriginByFrameEl(el) {

    return _util2.default.isElement(el) ? urlUtils.getOrigin(el.src) : document.referrer;
  }
};

exports.default = urlUtils;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);


/***/ })
/******/ ]);
});
//# sourceMappingURL=frameObserver.js.map