(function (root) {
  
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;
      
  var LIST = require('./internal/list'),
      reverse = LIST.reverse;
      
  var ARITY = require('./arity'),
      variadic = ARITY.variadic;
  
  var __slice = Array.prototype.slice,
      __map = Array.prototype.map,
      __filter = Array.prototype.filter;

  // ### Composition

  //    compose(a, b, c)
  //      //=> function (x) {
  //        return a(b(c(x)))
  //      }
  var compose = variadic( function myself (fns) {
    fns = fns.map(functionalize);
    
    var first, firstLength, second, rest;
    
    if (fns.length === 0) {
      return function () {};
    }
    else if (fns.length === 1) {
      return fns[0];
    }
    else if (fns.length === 2) {
      first = fns[0];
      firstLength = first.length;
      second = fns[1];
      
      if (firstLength === 1) {
        return function (a) { return first(second(a)); };
      }
      else if (firstLength === 2) {
        return function (a, b) { return first(second(a), b); };
      }
      else if (firstLength === 3) {
        return function (a, b, c) { return first(second(a), b, c); };
      }
      else return variadic( function (a, rest) {
        first.apply(this, [second(a)].concat(rest))
      });
    }
    else {
      var first = fns[0],
          butFirst = __slice.call(fns, 1);

      return myself.call(this, first, myself.apply(this, butFirst));
    }
  });
  
  // weird semantics: it takes an array but returns a curried function.
  var apply = (function () {
  
    function invoke (fn) { return fn(); };
  
    // a kind of optional semantics: unary(f)(value) === f(value), unary(f)() === unary(f)
    function unary (fn) {
      return function myself (a) {
        if (a == null) {
          return myself;
        }
        else return fn(a);
      }
    };
  
    function binary (fn) {
      return function myself (a, b) {
        if (a == null) {
          return myself;
        }
        else if (b == null) {
          return unary(function (b) { return fn(a, b); });
        }
        else return fn(a, b);
      }
    };
  
    function ternary (fn) {
      return function myself (a, b, c) {
        if (a == null) {
          return myself;
        }
        else if (b == null) {
          return binary(function (b, c) { return fn(a, b, c); });
        }
        else if (c == null) {
          return unary(function (c) { return fn(a, b, c); });
        }
        else return fn(a, b, c);
      }
    };
  
    function quaternary (fn) {
      return function myself (a, b, c, d) {
        if (a == null) {
          return myself;
        }
        else if (b == null) {
          return ternary(function (b, c, d) { return fn(a, b, c, d); });
        }
        else if (c == null) {
          return binary(function (c, d) { return fn(a, b, c, d); });
        }
        else if (d == null) {
          return unary(function (d) { return fn(a, b, c, d); });
        }
        else return fn(a, b, c, d);
      }
    };
    
    var byArity = [
          invoke,
          unary,
          binary,
          ternary,
          quaternary
        ],
        byArityLength = byArity.length;
    
    function polyadic (fn, leftArgs) {
      leftArgs || ( leftArgs = []);
      var fnLength = fn.length,
          remainingLength = fnLength - leftArgs.length;
          
      function handleRemaining () {
        var args = leftArgs.concat(__slice.call(arguments, 0)),
            argsLength = args.length;
        
        if (argsLength >= fnLength) {
          return fn.apply(this, args);
        }
        else return polyadic(fn, args);
      };
      
      if (remainingLength < byArityLength) {
        return byArity[remainingLength](handleRemaining);
      }
      else return handleRemaining;
    };
    
    return extend( function call (fn, args) {
      fn = functionalize(fn);
      
      if (fn.length > 0) {
        return polyadic(fn, args || []);
      }
      else if (args.length === 0) {
        return function (args) {
          return fn.apply(this, args);
        };
      }
      else return fn.apply(this, args);
    }, {
      unary: unary,
      binary: binary,
      ternary: ternary,
      quaternary: quaternary,
      polyadic: polyadic
    });
    
  })();
  
  var call = variadic(apply);
  
  // var apply = apply.binary( function (fn, args) {
  //   return call.apply(this, fn, args);
  // });
  
  var callFlipped = (function () {
    
    function nullary (fn) {
      return variadic( function (args) {
        return fn.apply(this, reverse(args));
      });
    };
  
    // a kind of optional semantics: unary(f)(value) === f(value), unary(f)() === unary(f)
    function unary (fn) {
      return function myself (a) {
        if (a == null) {
          return myself;
        }
        else return fn(a);
      }
    };
  
    function binary (fn) {
      return function myself (a, b) {
        if (a == null) {
          return myself;
        }
        else if (b == null) {
          return unary(function (b) { return fn(b, a); });
        }
        else return fn(b, a);
      }
    };
  
    function ternary (fn) {
      return function myself (a, b, c) {
        if (a == null) {
          return myself;
        }
        else if (b == null) {
          return binary(function (c, b) { return fn(c, b, a); });
        }
        else if (c == null) {
          return unary(function (c) { return fn(c, b, a); });
        }
        else return fn(c, b, a);
      }
    };
  
    function quaternary (fn) {
      return function myself (a, b, c, d) {
        if (a == null) {
          return myself;
        }
        else if (b == null) {
          return ternary(function (d, c, b) { return fn(d, c, b, a); });
        }
        else if (c == null) {
          return binary(function (d, c) { return fn(d, c, b, a); });
        }
        else if (d == null) {
          return unary(function (d) { return fn(d, c, b, a); });
        }
        else return fn(d, c, b, a);
      }
    };
    
    var byArity = [
          nullary,
          unary,
          binary,
          ternary,
          quaternary
        ],
        byArityLength = byArity.length;
        
    function polyadic (fn, leftArgs) {
      leftArgs || ( leftArgs = []);
      var fnLength = fn.length,
          remainingLength = fnLength - leftArgs.length;
          
      function handleRemaining () {
        var args = leftArgs.concat(__slice.call(arguments, 0)),
            argsLength = args.length;
        
        if (argsLength >= fnLength) {
          return fn.apply(this, reverse(args));
        }
        else return polyadic(fn, args);
      };
      
      if (remainingLength < byArityLength) {
        return byArity[remainingLength](handleRemaining);
      }
      else return handleRemaining;
    };
    
    return extend( variadic( function callFlipped (fn, args) {
      fn = functionalize(fn);
      var fnLength = fn.length,
          callFlippedped = (fnLength < byArityLength)
            ? byArity[fnLength](fn)
            : polyadic(fn);
      
      if (args.length === 0) {
        return callFlippedped;
      }
      else return callFlippedped.apply(this, args);
      
    }), {
      unary: unary,
      binary: binary,
      ternary: ternary,
      quaternary: quaternary,
      polyadic: polyadic
    });
    
  })();
  
  // synonymish
  var flip = apply.unary(callFlipped);

  //    sequence(a, b, c)
  //      //=> function (x) {
  //        return c(b(a(x)))
  //      }
  var sequence = callFlipped(compose);
  
  extend(root, {
    compose: compose,
    sequence: sequence,
    call: call,
    callFlipped: callFlipped,
    apply: apply,
    unary: apply.unary,
    binary: apply.binary,
    ternary: apply.ternary,
    quaternary: apply.quaternary,
    polyadic: apply.polyadic,
    flip: flip,
  });
  
})(this);