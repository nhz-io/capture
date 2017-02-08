function isError($) {
    return $ && Object.prototype.toString.call($) === '[object Error]'
}

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
        
        * error($, ...args) {
            if (isError($)) {
                report($, ...args)
                
                yield $
            }
        },
        
        * func($, ctx) {
            if (typeof $ === 'function') {
                yield function wrapped(...args) {
                    if (isError(args[0])) {
                        report(...args, ctx)
                    }
                    
                    try {
                        return $.apply(this, args) // eslint-disable-line no-invalid-this
                    }
                    catch (err) {
                        report(err, ctx)
                        
                        throw err
                    }
                }
            }
        },
        
        * promise($, ctx) {
            if ($ && typeof $.catch === 'function') {
                $.catch(err => report(err, ctx))
                
                yield $
            }
        },
        
        * emitter($, ctx) {
            if ($ && typeof $.addListener === 'function') {
                $.removeListener('error', (...args) => report(...args, ctx))
                $.addListener('error', (...args) => report(...args, ctx))
                
                yield $
            }
        },
    }
}

function compose(...captures) {
    return function $capture($, ...args) {
        for (const capture of captures) {
            for (const res of capture($, ...args)) {
                return res
            }
        }

        return $
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
