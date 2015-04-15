frame Observer
==================================

This is a frame observer.

## Install node modules

```bash
npm install
```

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

##### on( iframe, eventName, func )

```js
var iframe = document.querySelector('iframe');

frameObserver.on( iframe, 'iframeClicked', function(){
  console.log('iframe clicked');
});
```

##### off( iframe, eventName, func )

```js
frameObserver.off( iframe, 'iframeClicked', iframeClicked );
```

##### registerMethods( methods )

```js
frameObserver.registerMethods({
  hello:function(){
    console.log('hello by self');
  }
});
```

##### callMethod( iframe, methodName, params... )

```js
var deferred = frameObserver.callMethod( iframe, "hello", {a:3} );

deferred.done(function(){
  console.log( arguments );
});
```

##### trigger( name, params... )

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


