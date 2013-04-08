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
      
  // function polyadic (fn, leftArgs) {
  //   leftArgs || ( leftArgs = []);
  //   var fnLength = fn.length,
  //       remainingLength = fnLength - leftArgs.length;
  //       
  //   function handleRemaining () {
  //     var args = leftArgs.concat(__slice.call(arguments, 0)),
  //         argsLength = args.length,
  //         remainingLength = fnLength - argsLength;
  //     
  //     if (remainingLength <= 0) {
  //       return fn.apply(this, reverse(args));
  //     }
  //     else return unvariadic(remainingLength, polyadic(fn, args));
  //   };
  //   
  //   if (remainingLength < byArityLength) {
  //     return byArity[remainingLength](handleRemaining);
  //   }
  //   else return handleRemaining;
  // };

  function callWithLeftFlipped (fn, leftArgs) {
    leftArgs || ( leftArgs = []);
    var fnLength = fn.length,
        remainingLength = fnLength - leftArgs.length;
    
    if (remainingLength < byArityLength) {
      return byArity[remainingLength](handleRemaining);
    }
    else return unvariadic(remainingLength, handleRemaining);
        
    function handleRemaining () {
      var params = __slice.call(arguments, 0, arguments.length),
          numParams = (params.indexOf(void 0) >= 0)
            ? params.indexOf(void 0)
            : params.length
          args = leftArgs.concat(params.slice(0, numParams));
          argsLength = args.length,
          remainingLength = fnLength - argsLength;
      
      if (remainingLength <= 0) {
        return fn.apply(this, reverse(args));
      }
      else return callWithLeftFlipped(fn, args);
    };
  };
  
  var callFlipped = extend( variadic( function callFlipped (fn, args) {
    fn = functionalize(fn);
    var fnLength = fn.length,
        flipped = (fnLength < byArityLength)
          ? byArity[fnLength](fn)
          : callWithLeftFlipped(fn);
    
    if (args.length === 0) {
      return flipped;
    }
    else return flipped.apply(this, args);
    
  }), {
    unary: unary,
    binary: binary,
    ternary: ternary,
    quaternary: quaternary,
    callWithLeftFlipped: callWithLeftFlipped
  });
  
  // synonymish
  var flip = ARITY.unary(callFlipped);

  extend(root, {
    callFlipped: callFlipped,
    flip: flip
  })
  
})(this);