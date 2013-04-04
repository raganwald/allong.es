(function (root) {
  
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;
      
  var __slice = [].slice;

  // limits a function to taking only one argument
  function unary (fn) {
    fn = functionalize(fn);

    return function (something) {
      return fn.call(this, something)
    }
  }

  // limits a function to taking two arguments
  function binary (fn) {
    fn = functionalize(fn);

    return function (something, somethingElse) {
      return fn.call(this, something, somethingElse)
    }
  }

  // limits a function to taking three arguments
  function ternary (fn) {
    fn = functionalize(fn);

    return function (something, somethingElse, andOneMoreThing) {
      return fn.call(this, something, somethingElse, andOneMoreThing)
    }
  }

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
  function variadic (fn) {
    fn = functionalize(fn);
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
  
  function unvariadic (fn) {
    fn = functionalize(fn);
    
    return function (args) {
      return fn.apply(this, args);
    }
  };
  
  extend(root, {
    unary: unary,
    binary: binary,
    ternary: ternary,
    variadic: variadic,
    unvariadic: unvariadic
  });
  
})(this);