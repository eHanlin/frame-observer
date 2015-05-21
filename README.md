frame observer
==================================

This is a frame observer.

## Install

```bash
bower install frame-observer
```

## Install node modules

```bash
npm install
```

## Dependencies

* [eh-deferred](https://github.com/eHanlin/eh-deferred)

## Usage

index.html

```js
var iframe = document.querySelector('iframe');
var deferred = frameObserver.callMethod( iframe, "info", {a:3} );
deferred.done(function(){
  console.log( arguments );
});
```

frame.html

```js
frameObserver.registerMethods({

  info:function( deferred ){
    deferred.resolve(1,2,3,5);
  }
});
```

## API

##### readyState( iframe, stateName ):Deferred
> listen a state from frame, deferred will be trigger when state is resolved or rejected.

```js
var iframe = document.querySelector('iframe');
frameObserver
.readyState( iframe, 'ready' )
.done(function(){
  console.log('ready state:done...');
}).
fail(function(){
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

##### callMethod( iframe, methodName, params... ):Deferred
> call a method of iframe or parent.

```js
var deferred = frameObserver.callMethod( iframe, "hello", {a:3} );

deferred.done(function(){
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


