(function (root) {
  
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;
      
  var __slice = [].slice;
  
  function invoke (fn) { return fn(); };

  // ### "Ellipses" or "Variadic"
  //
  //    fn = variadic(function (args) { return args })
  //
  //    fn()        //=> []
  //    fn(1)       //=> [1]
  //    fn(1, 2)    //=> [1, 2]
  //    fn(1, 2, 3) //=> [1, 2, 3]
  //
  //    fn = variadic(function (first, rest) { return [first, rest]})
  //
  //    fn()        //=> [undefined, []]
  //    fn(1)       //=> [1, []]
  //    fn(1, 2)    //=> [1, [2]]
  //    fn(1, 2, 3) //=> [1, [2, 3]]
  //
  //    fn = variadic(function (first, second, rest) { return [first, second, rest]})
  //
  //    fn()        //=> [undefined, undefined, []]
  //    fn(1)       //=> [1, undefined, []]
  //    fn(1, 2)    //=> [1, 2, []]
  //    fn(1, 2, 3) //=> [1, 2, [3]]
  var variadic = function () {
    var FUNCTIONS = {};
    function oldVariadic (fn) {
      var fnLength = fn.length;

      if (fnLength < 1) {
        return fn;
      }
      else if (fnLength === 1)  {
        return function () {
          return fn.call(this, __slice.call(arguments, 0))
        }
      }
      else {
        return function () {
          var numberOfArgs = arguments.length,
              namedArgs = __slice.call(arguments, 0, fnLength - 1),
              numberOfMissingNamedArgs = Math.max(fnLength - numberOfArgs - 1, 0),
              argPadding = new Array(numberOfMissingNamedArgs),
              variadicArgs = __slice.call(arguments, fn.length - 1);

          return fn.apply(this, namedArgs.concat(argPadding).concat([variadicArgs]))
        }
      }
    };
    return function (arity, fn) {
      if (fn == null) {
        fn = functionalize(arity);
        arity = 0;
      }
      else fn = functionalize(fn);
      var fnLength = fn.length;
      if (arity === 0) {
        return oldVariadic(fn);
      }
      else if (fnLength <= arity) {
        var fixedParams = fnLength - 1;
        var index = '' + arity + '-' + fixedParams;
        var code;
      
        if (FUNCTIONS[index] == null) {
          var parameters = new Array(arity);
          for (var i = 0; i < arity; ++i) {
            parameters[i] = "__" + i;
          }
          var pstr = parameters.join();
          if (fnLength > 1) {
            var cstr = parameters.slice(0, fnLength - 1).join();
            code = "return function ("+pstr+") { return fn.call("+cstr+", [].slice.call(arguments,"+(fnLength - 1)+")); };";
          }
          else code = "return function ("+pstr+") { return fn.call(this, [].slice.call(arguments, 0)); };";
          FUNCTIONS[index] = new Function(['fn'], code);
        }
        return FUNCTIONS[index](fn);
      }
      else throw 'not supported yet'
    };
  }();
  
  // sets a fixed arity for a function, without currying
  var unvariadic = (function () {
    var FUNCTIONS = {};
    return function unvariadic (arity, fn) {
      if (FUNCTIONS[arity] == null) {
        var parameters = new Array(arity);
        for (var i = 0; i < arity; ++i) {
          parameters[i] = "__" + i;
        }
        var pstr = parameters.join();
        var code = "return function ("+pstr+") { return fn.apply(this, arguments); };";
        FUNCTIONS[arity] = new Function(['fn'], code);
      }
      if (fn == null) {
        return function (fn) { return unvariadic(arity, fn); };
      }
      else return FUNCTIONS[arity](functionalize(fn));
    };
  })();

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
  
  function curryWithLeftAndRight (fn, leftArgs, rightArgs) {
    leftArgs || (leftArgs = []);
    rightArgs || (rightArgs = []);
    var fnLength = fn.length,
        remainingLength = fnLength - leftArgs.length - rightArgs.length;
    
    if (remainingLength < byArityLength) {
      return byArity[remainingLength](handleRemaining);
    }
    else return unvariadic(remainingLength, handleRemaining);
        
    function handleRemaining () {
      var params = __slice.call(arguments, 0, arguments.length),
          numParams = ((params.indexOf(void 0) >= 0)
            ? params.indexOf(void 0)
            : params.length),
          newLeft = leftArgs.concat(params.slice(0, numParams)),
          args = newLeft.concat(rightArgs),
          argsLength = args.length,
          remainingLength = fnLength - argsLength;
      
      if (remainingLength <= 0) {
        return fn.apply(this, args);
      }
      else return curryWithLeftAndRight(fn, newLeft, rightArgs);
    };
  };
  
  function curry (fn) {
    fn = functionalize(fn);
    
    if (fn.length > 0) { // polyadic
      return curryWithLeftAndRight(fn, [], []);
    }
    else return fn;
  };
  
  function selfCurrying(fn) {
    fn = functionalize(fn);
    var fnLength = fn.length;
    
    if (fn.length > 0) {
      return variadic(fnLength, function (args) {
        if (args.length === 0) {
          return curry(fn)
        }
        else return fn.apply(this, args);
      });
    }
    else return fn;
  }
  
  extend(root, {
    variadic: variadic,
    unvariadic: unvariadic,
    curryWithLeftAndRight: curryWithLeftAndRight,
    unary: unary,
    binary: binary,
    ternary: ternary,
    quaternary: quaternary,
    curry: curry,
    selfCurrying: selfCurrying
  });
  
})(this);