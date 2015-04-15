
### Event (iframe)

```
evt = {
  type:'event',  
  data:{},
  direction:'send',
  id:"...",
  timestamp:1428548787139
}
```

#### type：

This is event type for process.

* event
* registerEvent
* unregisterEvent
* method


#### direction：

request or response flag.

* send
* recv


#### data：

Send data to other frame.

#### id：

This is a request id.

##### timestamp：

A millisecond by date.

---------------------------------------

### Method

##### on( el, eventName, func )：

```
on - register -> iframe
```

##### off( el, eventName, func )：

```
off - unregister -> iframe
```

##### trigger( eventName, func )：

```
trigger - search -> iframe
```

event implement

```
{
  window:[{
    observer:new EventObserver(),
    el:el
  }]
}
```

iframe implement

```
{
  click:[{
    source:source
  }],
  doubleClick:[{
    source:source
  }]
}
```