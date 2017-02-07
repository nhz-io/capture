import test from 'ava'
import {EventEmitter} from 'events'
import init from '.'

test('capture nothing', t => {
    const $capture = init(() => t.fail())
    t.is($capture(undefined), undefined) // eslint-disable-line no-undefined
    t.is($capture(null), null)
    t.is($capture(''), '')
    t.is($capture(0), 0)
})

test('capture error', t => {
    t.plan(1)

    const pass = new Error()
    const $capture = init(err => t.is(err, pass))
    
    $capture(pass)
})

test('wrap function and capture thrown errors', t => {
    t.plan(2)

    const pass = new Error()
    const $capture = init(err => t.is(err, pass))
    
    try {
        $capture(() => {
            throw pass
        })()
    }
    catch (err) {
        t.is(err, pass)
    }
})

test('wrap function and capture callback errors', t => {
    t.plan(2)

    const pass = new Error()
    const $capture = init(err => t.is(err, pass))

    $capture(() => {
        t.pass()
    })(pass)
})

test('wrap promise and capture rejected errors', t => {
    t.plan(2)

    const pass = new Error()
    const $capture = init(err => t.is(err, pass))

    return $capture(Promise.reject(pass)).catch(err => t.is(err, pass))
})

test.cb('wrap event emitter and capture emitted errors', t => {
    const pass = new Error()

    const $capture = init(err => {
        t.is(err, pass)
        t.end()
    })

    $capture(new EventEmitter()).emit('error', pass)
})
