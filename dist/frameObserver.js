//author: Sparrow.jang
//verion: 0.0.1
!function(e){var t=e.document,r=function(){var e=function(e){return function(t){this.hasResult()?this.hasEndTask(e)&&t.apply(null,this.taskParams_):this[e+"Cbs_"].push(t)}},t=function(){this.doneCbs_=[],this.failCbs_=[],this.alwayCbs_=[],this.result_={}};return t.prototype={TYPES:["resolve","reject"],TASK_MAPPING:{done:"resolve",fail:"reject"},done:e("done"),fail:e("fail"),always:e("alway"),hasEndTask:function(e){return this.result_[this.TASK_MAPPING[e]]?!0:!1},hasResult:function(){var e=this.result_,t=this.TYPES;for(var r in t)if(t[r]in e)return!0;return!1},runTask:function(e,t){for(var r in e){for(var n=null,s=e[r];n=this[s+"Cbs_"].shift();)n.apply(null,t);delete this[s+"Cbs_"]}},resolve:function(){this.hasResult()||(this.result_.resolve=!0,this.taskParams_=arguments,this.runTask(["alway","done"],arguments))},reject:function(){this.hasResult()||(this.result_.reject=!0,this.taskParams_=arguments,this.runTask(["alway","fail"],arguments))}},function(){return new t}}(),n={isString:function(e){return"string"==typeof e},isElement:function(e){return e instanceof Element},isObject:function(e){return"object"==typeof e},isArray:function(e){return"[object Array]"==typeof Object.prototype.toString.call(e)},clone:function(e,t,r){var s,i;"boolean"!=typeof e?(s=e,i=t):(s=t,i=r);for(var a in i)n.isArray(i[a])?s[a]=n.isArray(s[a])?s[a]:[]:n.isObject(i[a])&&(s[a]=n.isObject(s[a])?s[a]:{}),e&&n.isObject(i[a])?clone(s[a],i[a]):s[a]=i[a];return s},copyArray:function(e){for(var t=[],r=0;r<e.length;r++)t[r]=e[r];return t},createElement:function(e){return t.createElement(e)},DATA_KEY:guid(),data:function(e,t,r){var n=this.DATA_KEY,s=e[n]?e[n]:e[n]={};return 3!==arguments.length?s[t]:void(s[t]=r)},getContentWindowByEl:function(e){return n.isElement(e)?e.contentWindow:e}},s={getOrigin:function(e){var t=/https?:\/\/[^/]*\/?/.exec(e);return t.length?t[0]:null},getOriginByFrameEl:function(e){return n.isElement(e)?s.getOrigin(e.src):document.referrer}},i=function(){this.events={}};i.prototype={on:function(e,t,r){var r=r||{};this.events[e]||(this.events[e]=[]),this.events[e].push({func:t,once:r.once||!1,target:r.target||null})},once:function(e,t){this.on(e,t,{once:!0})},off:function(e,t,r){var n=this.events[e]||[];if(1===arguments.length)delete this.events[e];else for(var s in n){var i=n[s];if(i.func===t&&(null===i.target||i.target===r)||void 0===t&&i.target===r){n.splice(s,1);break}}},getEventNumber:function(e){return this.events[e]?this.events[e].length:0},trigger:function(e){var t,r;n.isString(e)?t=e:(t=e.name,r=e.target||null);var s,i=this.events[t]||[],a=n.copyArray(arguments);r&&(i=function(e,t){var r=[];for(var n in e)e[n].target===t&&r.push(e[n]);return r}(i,r));for(s in i){var o={type:t},u=a.slice(1);u.unshift(o),i[s].func.apply(null,u)}for(s=0;s<i.length;s++)i[s].once&&(r?this.off(t,e.func,e.target):this.off(t,e.func))}};var a=function(e,t,r,n){var s=r||{},i=n?n:guid();return{type:e,data:s,id:i,timestamp:+new Date,direction:t}},o=function(e){return function(t){var i,o,u=r(),v=a(e,"send",{params:n.copyArray(arguments).slice(1)});return this.evtMapping[v.id]={el:t,id:v.id,deferred:u},i=s.getOriginByFrameEl(t),o=n.getContentWindowByEl(t),o.postMessage(JSON.stringify(v),i),u}},u=function(e){this.frameObserver=e};u.prototype={onRecv:function(e,t,r,n){var s=this.frameObserver,i=e.data.params,o=i.shift();i.unshift(n),s.methods_&&s.methods_[o]&&s.methods_[o].apply(s.methods_,i),n.done(function(){var n=a(e.type,"recv",{result:arguments},e.id);t.postMessage(JSON.stringify(n),r)})},onSendResp:function(e){var t=this.frameObserver,r=t.evtMapping[e.id];delete t.evtMapping[e.id],r.deferred.resolve(e.data)}};var v=function(e){this.frameObserver=e};v.prototype={onRecv:function(e,t,r){var s=e.data.params[0],i=this.frameObserver,o=s.eventName,u=s.frameEventId;i.registerEventObserver.on(o,function(){var s=a("event","send",{result:n.copyArray(arguments)},e.id);s.frameEventId=u,t.postMessage(JSON.stringify(s),r)},{target:t})},onSendResp:function(){}};var f=function(e){this.frameObserver=e};f.prototype={onRecv:function(e,t){{var r=e.data.params[0],n=this.frameObserver,s=r.eventName;r.frameEventId}n.registerEventObserver.off(s,void 0,t)},onSendResp:function(){}};var c=function(e){this.frameObserver=e};c.prototype={onRecv:function(e,t){var r=e.data.result,s=r[0].type,i=n.copyArray(r[1]);i.unshift(s);var a=this.frameObserver.getFrameObserverList_(e.frameEventId);if(a)for(var o in a){var u=a[o];n.getContentWindowByEl(u.el)===t&&u.observer.trigger.apply(u.observer,i)}}};var h=function(){this.evtMapping={},this.eventObservers={},this.registerEventObserver=new i,this.msgProcessors={method:new u(this),registerEvent:new v(this),unregisterEvent:new f(this),event:new c(this)},e.addEventListener("message",this.onMessage.bind(this))};h.prototype={onMessage:function(e){var t=e.origin,n=JSON.parse(e.data),s=r(),i=e.source,a=this.msgProcessors[n.type];"send"==n.direction?a.onRecv(n,i,t,s):a.onSendResp(n,t,s)},getFrameEventId_:function(e){var t="window";return n.isElement(e)&&(t=function(t){var r=t?t:guid();return n.data(e,"frameEventId",r),r}(n.data(e,"frameEventId"))),t},getFrameObserverList_:function(e){return this.eventObservers[e]?this.eventObservers[e]:this.eventObservers[e]=[]},getObserver_:function(e){var t,r=this.getFrameEventId_(e),n=this.getFrameObserverList_(r);for(var s in n)if(n[s].el===e){t=n[s].observer;break}return t||(t=new i,n.push({el:e,observer:t})),t},on:function(e,t,r){var n=this.getObserver_(e),s=this.getFrameEventId_(e);n.on(t,r),1===n.getEventNumber(t)&&this.registerEvent(e,{eventName:t,frameEventId:s})},off:function(e,t,r){var n=this.getObserver_(e),s=this.getFrameEventId_(e);n.off(t,r),0===n.getEventNumber(t)&&this.unregisterEvent(e,{eventName:t,frameEventId:s})},trigger:function(e){this.registerEventObserver.trigger(e,n.copyArray(arguments).slice(1))},callMethod:o("method"),registerEvent:o("registerEvent"),unregisterEvent:o("unregisterEvent"),registerMethods:function(e){this.methods_=e}};var g=new h;"undefined"!=typeof e&&(e.frameObserver=g),"undefined"!=typeof module&&(module.exports=g)}(window);