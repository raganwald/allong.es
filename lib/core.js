(function (root) {
  
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;
      
  var LIST = require('./internal/list'),
      reverse = LIST.reverse;
      
  var ARITY = require('./arity'),
      variadic = ARITY.variadic,
      unvariadic = ARITY.unvariadic,
      curryWithLeftAndRight = ARITY.curryWithLeftAndRight,
      unary = ARITY.unary,
      binary = ARITY.binary,
      ternary = ARITY.ternary,
      quaternary = ARITY.quaternary;
  
  var __slice = Array.prototype.slice,
      __map = Array.prototype.map,
      __filter = Array.prototype.filter;
        
  // call is the centerpiece of the library, it performs partial application and currying
  
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
        else return curryWithLeftAndRight(fn, args, []);
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
    quaternary: quaternary
  });
  
  var callRight = function callRight (fn) {
    fn = functionalize(fn);
    var args = __slice.call(arguments, 1),
        argsLength = args.length,
        fnLength = fn.length;
  
    if (fnLength > 0) { // polyadic
      if (fnLength <= argsLength) {
        return fn.apply(this, args);
      }
      else return curryWithLeftAndRight(fn, [], args);
    }
    else {  // variadic
      if (argsLength > 0) {
        return fn.apply(this, args);
      }
      else return fn;
    }
  };
  
  extend(root, {
    call: call,
    callRight: callRight,
    unary: unary,
    binary: binary,
    ternary: ternary,
    quaternary: quaternary
  });
  
})(this);