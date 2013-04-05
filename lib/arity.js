(function (root) {
  
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;
      
  var __slice = [].slice;

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
        var code = "return function ("+pstr+") { return fn("+pstr+"); };";
        FUNCTIONS[arity] = new Function(['fn'], code);
      }
      if (fn == null) {
        return function (fn) { return unvariadic(arity, fn); };
      }
      else return FUNCTIONS[arity](functionalize(fn));
    };
  })();
  
  extend(root, {
    variadic: variadic,
    unvariadic: unvariadic
  });
  
})(this);