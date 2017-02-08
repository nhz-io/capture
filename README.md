# @nhz.io/capture

<p align="center">
  <a href="https://npmjs.org/package/@nhz.io/capture">
    <img src="https://img.shields.io/npm/v/@nhz.io/capture.svg?style=flat"
         alt="NPM Version">
  </a>
  
  <a href="https://travis-ci.org/nhz-io/capture">
    <img src="https://img.shields.io/travis/nhz-io/capture.svg?style=flat"
         alt="Travis Build">
  </a>

  <a href="https://coveralls.io/github/nhz-io/capture">
    <img src="https://img.shields.io/coveralls/nhz-io/capture.svg?style=flat"
         alt="Coveralls">
  </a>

  <a href="https://www.bithound.io/github/nhz-io/capture">
    <img src="https://img.shields.io/bithound/code/github/nhz-io/capture.svg?style=flat"
         alt="Bithound Status">
  </a>

  <a href="https://github.com/nhz-io/capture/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/nhz-io/capture.svg?style=flat"
         alt="License">
  </a>
</p>
<p align="center">
    <h3 align="center">Capture errors from various sources and forward to reporter</h3>
</p>

## Available auto-wrappers
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

## Version 1.0.3