(function (root) {
  var CORE = require('./core'),
      callFlipped = CORE.callFlipped,
      flip = CORE.flip,
      call = CORE.call,
      apply = CORE.apply,
      binary = CORE.binary,
      compose = CORE.compose;
      
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;

  var ARITY = require('./arity'),
      variadic = ARITY.variadic;
      
  var __slice = [].slice;
  
  // synonym
  var curry = apply;
  
  // synonym
  var applyLeft = apply;
  
  // synonym
  var callLeft = call;

  // Like callLeft, but it is binary so it can be (and is) curried 
  var callFirst = binary(call);
  var callThisFirst = callFlipped.binary(call);

  // Applies the last argument, returns a variadic function taking the rest
  function applyLast (fn, last) {
    if (last == null) return function (last) { return applyLast(fn, last); };
    
    fn = functionalize(fn);
    var fnLength = fn.length;

    if (fnLength < 1) {
      return variadic( function (args) {
        return fn.apply(this, args.concat([last]));
      })
    }
    else if (fnLength === 1) {
      return fn(last);
    }
    else if (fnLength === 2) {
      return function (a) {
        return fn(a, last);
      }
    }
    else if (fnLength === 3) {
      return function (a, b) {
        return fn(a, b, last);
      }
    }
    else if (fnLength > 1) {
      return variadic( function (args) {
        return fn.apply(this, __slice.call(args, 0, fnLength - 1).concat([last]));
      })
    }
    else return function () { return fn.call(this, last); }
  };
  
  var applyThisLast = flip(applyLast);

  // applies one or more arguments in the rightmost positions,
  // returns a variadic function taking the rest
  var applyRight = variadic( function (fn, args) {
    fn = functionalize(fn);
    var fnLength = fn.length;

    if (fnLength < 1) {
      return variadic( function (precedingArgs) {
        return fn.apply(this, precedingArgs.concat(args))
      })
    }
    else if (fnLength > args.length) {
      return variadic( function (precedingArgs) {
        return fn.apply(this, __slice.call(precedingArgs, 0, fnLength - args.length).concat(args));
      })
    }
    else return function () { return fn.apply(this, args); }

  });

  // ### Partial applications that bind

  // A partially applied binding function
  //
  // roughly equivalent to applyRight
  //
  // var fn = function (...) { ... }
  //
  // bound(fn)(x)
  //   //=> fn.bind(x)
  //
  // bound(fn, foo)(x)
  //   //=> fn.bind(x, foo)
  //
  // bound(fn, foo, bar)(x)
  //   //=> fn.bind(x, foo, bar)
  var bound = variadic( function (messageName, args) {
    if (args === []) {
      return function (instance) {
        return instance[messageName].bind(instance)
      }
    }
    else {
      return function (instance) {
        return Function.prototype.bind.apply(
          instance[messageName], [instance].concat(args)
        )
      }
    }
  });
  
  var defaults = variadic( function (fn, values) {
    var fln = fn.length,
        vln = values.length;
    return variadic( function (args) {
      var aln = args.length,
          mln = Math.max(fln - aln, 0);
      args = args.concat(values.slice(vln-mln));
      return fn.apply(this, args);
    })
  });
  
  // collects arguments
  function args (arity) {
    if (arity === 1) {
      return function (a) {
        return [a];
      };
    }
    else if (arity === 2) {
      return function (a, b) {
        return [a, b];
      };
    }
    else if (arity === 3) {
      return function (a, b, c) {
        return [a, b, c];
      };
    }
    else return variadic( function (args) {
      return args;
    });
  };
  
  extend(root, {
    curry: curry,
    applyLeft: applyLeft,
    callLeft: callLeft,
    callFirst: callFirst,
    applyLast: applyLast,
    callThisFirst: callThisFirst,
    applyThisLast: applyThisLast,
    applyLeft: applyLeft,
    applyRight: applyRight,
    bound: bound,
    defaults: defaults,
    args: args
  });
      
  
})(this);
