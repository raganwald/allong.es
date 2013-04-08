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
      quaternary = ARITY.quaternary,
      curry = ARITY.curry;
  
  var __slice = Array.prototype.slice,
      __map = Array.prototype.map,
      __filter = Array.prototype.filter;
  
  // JS "apply" and "call" semantics if you need them. curried, but not self-currying--what would that mean?
  var apply = curry( function apply (fn, args) {
    return fn.apply(this, args);
  });
  
  var callCurried = variadic( function (fn, args) {
    return curryWithLeftAndRight(fn, args, []);
  });
  
  var call = extend( variadic(apply), {
    unary: unary,
    binary: binary,
    ternary: ternary,
    quaternary: quaternary
  });
  
  var callRightCurried = function callRightCurried (fn) {
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
    apply: apply,
    call: call,
    callRightCurried: callRightCurried,
    unary: unary,
    binary: binary,
    ternary: ternary,
    quaternary: quaternary
  });
  
})(this);