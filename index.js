function hasProp($, name) {
    return $ && Object.prototype.hasOwnProperty.call($, name)
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
        
        * error($) {
            if (hasProp($, 'stack')) {
                report($)
                
                yield $
            }
        },
        
        * func($) {
            if (typeof $ === 'function') {
                yield function wrapped(...args) {
                    if (hasProp(args[0], 'stack')) {
                        report(args[0])
                    }
                    
                    try {
                        return $.apply(this, args) // eslint-disable-line no-invalid-this
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
            if ($ && typeof $.addListener === 'function') {
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
