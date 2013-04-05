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
  
  var call = extend( variadic(function call (fn, args) {
    fn = functionalize(fn);
    
    if (fn.length > 0) {
      return polyadic(fn, args);
    }
    else if (args.length === 0) {
      return function (args) {
        return fn.apply(this, args);
      };
    }
    else return fn.apply(this, args);
  }), {
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