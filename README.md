# @nhz.io/capture

Capture errors from various sources. Automatically wraps:

* **Functions**
* **Callbacks**
* **Promises**
* **Event Emitters**

## Install

```sh
npm i -S @nhz.io/capture
```

## Usage

### Init all captures
```js
const $capture = require('@nhz.io/capture')(err => {
    console.log('Reporting error', err)
})
```

### Init captures selectively
```js
const {prepare, init} = require('@nhz.io/capture')

const $ = prepare(err => console.log('Reporting error', err))

/** `nothing` is advised to have first (fast fail) */
const $capture = init($.nothing, $.error, $.func)
```

### Capture and report an error explicitly
```js
$capture(new Error('Raw Error'))
```

### Wrap function with `try..catch` and expect a callback
```js
const func = $capture((...args) => {
    console.log('Called with args:', ...args)

    throw new Error('Thrown from function')
})

func() 
func(new Error('Error for callback'))
```

### Wrap promise (`.catch` with reporter)
```js
$capture(
    Promise.reject(new Error('Rejected from promise'))
).catch(err => console.log('Caught outside of promise:', err))
```

### Wrap EventEmitter instance (reporter as `error` listener)
```js
const ee = $capture(new EventEmitter())
ee.emit('error', new Error('Emitted error'))
```

## License [MIT](LICENSE)