frame observer
==================================

This is a frame observer.

You can need to add [polyfill](https://github.com/JasonBerry/babel-es6-polyfill) script if your browser is not support html5.

## Install

```bash
bower install frame-observer
```

## Install node modules

```bash
npm install frame-observer
```

## Usage

index.html

```js
var iframe = document.querySelector('iframe');
var promise = frameObserver.callMethod( iframe, "info", {a:3} );

promise.then(function(){
  console.log( arguments );
});
```

frame.html

```js
frameObserver.registerMethods({

  info:function( promise ){
    promise.resolve(1);
  }
});
```

## API

##### readyState( iframe, stateName ):Promise
> listen a state from frame, promise will be trigger when state is resolved or rejected.

```js
var iframe = document.querySelector('iframe');

frameObserver
.readyState( iframe, 'ready' )
.then(function(){
  console.log('ready state:done...');
},function(){
  console.log('ready state:fail...');
});
```

##### resolveState( stateName, params... )
> trigger a state for resolve.

```js
frameObserver.resolveState('ready');
```

##### rejectState( stateName, params... )
> trigger a state for reject.

```js
frameObserver.rejectState('ready');
```

##### on( iframe, eventName, func )
> listen a event from frame.

```js
var iframe = document.querySelector('iframe');

frameObserver.on( iframe, 'iframeClicked', function(){
  console.log('iframe clicked');
});
```

##### off( iframe, eventName, func )
> unregister a event from frame.

```js
frameObserver.off( iframe, 'iframeClicked', iframeClicked );
```

##### registerMethods( methods )
> implement some methods for others.

```js
frameObserver.registerMethods({
  hello:function(){
    console.log('hello by self');
  }
});
```

##### callMethod( iframe, methodName, params... ):Promise
> call a method of iframe or parent.

```js
var promise = frameObserver.callMethod( iframe, "hello", {a:3} );

promise.then(function(){
  console.log( arguments );
});
```

##### trigger( name, params... )
> trigger a event

```js
frameObserver.trigger( 'clicked' );
```

## Run Server

```bash
gulp server
```

## Build minfy

```bash
gulp
```


