(function (root) {
  
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;
      
  var LIST = require('./internal/list'),
      reverse = LIST.reverse;
      
  var ARITY = require('./arity'),
      variadic = ARITY.variadic,
      unvariadic = ARITY.unvariadic;
  
  var __slice = Array.prototype.slice,
      __map = Array.prototype.map,
      __filter = Array.prototype.filter;
        
  // call is the centerpiece of the library, it performs partial application and currying
  
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
        
    if (fnLength === 0) {
      console.log('1 broken assumption', fnLength, remainingLength, fn);
    }
        
    if (remainingLength < 1) {
      console.log('2 broken assumption', fnLength, remainingLength, fn);
    }
    
    // if (remainingLength < byArityLength) {
    //   return byArity[remainingLength](handleRemaining);
    // }
    // else 
    return unvariadic(remainingLength, handleRemaining);
        
    function handleRemaining () {
      var params = __slice.call(arguments, 0, arguments.length),
          numParams = (params.indexOf(void 0) >= 0)
            ? params.indexOf(void 0)
            : params.length
          args = leftArgs.concat(params.slice(0, numParams));
          argsLength = args.length,
          remainingLength = fnLength - argsLength;
      
      
      if (remainingLength <= 0) {
        return fn.apply(this, args);
      }
      else return polyadic(fn, args);
    };
  };
  
  var call = extend( 
    function call (fn) {
      fn = functionalize(fn);
      var args = __slice.call(arguments, 1),
          argsLength = args.length,
          fnLength = fn.length;
    
      if (fnLength > 0) { // polyadic
        if (fnLength <= argsLength) {
          return fn.apply(this, args);
        }
        else return polyadic(fn, args);
      }
      else {  // variadic
        if (argsLength > 0) {
          return fn.apply(this, args);
        }
        else return fn;
      }
    }
  , {
    unary: unary,
    binary: binary,
    ternary: ternary,
    quaternary: quaternary,
    polyadic: polyadic
    });
  
  extend(root, {
    call: call,
    unary: unary,
    binary: binary,
    ternary: ternary,
    quaternary: quaternary,
    polyadic: polyadic,
  });
  
})(this);