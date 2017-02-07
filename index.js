const {EventEmitter} = require('events')

function prepare(report) {
    if (typeof report !== 'function') {
        throw new TypeError(`Invalid report function: ${report}`)
    }

    return {
        * nothing($) {
            if ($) {
                return
            }
            
            yield $
        },
        
        * error($) {
            if ($ instanceof Error) {
                report($)
                
                yield $
            }
        },
        
        * func($) {
            if (typeof $ === 'function') {
                yield function wrapped(...args) {
                    if (args[0] instanceof Error) {
                        report(args[0])
                    }
                    
                    try {
                        return $.apply(this, args)
                    }
                    catch (err) {
                        report(err)
                        
                        throw err
                    }
                }
            }
        },
        
        * promise($) {
            if ($ && typeof $.catch === 'function') {
                $.catch(report)
                
                yield $
            }
        },
        
        * emitter($) {
            if ($ instanceof EventEmitter) {
                $.removeListener('error', report)
                $.addListener('error', report)
                
                yield $
            }
        },
    }
}

function compose(...captures) {
    return function $capture($) {
        for (const capture of captures) {
            for (const res of capture($)) {
                return res
            }
        }
    }
}

function init(report) {
    const captures = prepare(report)

    return compose(
        ...Object.keys(captures).map(k => captures[k])
    )
}

init.prepare = prepare
init.compose = compose

module.exports = init
