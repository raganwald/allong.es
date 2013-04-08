(function (root) {
  
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;
      
  var LIST = require('./internal/list'),
      reverse = LIST.reverse;
      
  var ARITY = require('./arity'),
      variadic = ARITY.variadic,
      unvariadic = ARITY.unvariadic,
      curryWithLeftAndRight = ARITY.curryWithLeftAndRight;
  
  var __slice = Array.prototype.slice,
      __map = Array.prototype.map,
      __filter = Array.prototype.filter;
      
  var applyLeft = function (fn, leftArgs) {
    fn = functionalize(fn);
    var fnLength = fn.length,
        leftArgsLength = leftArgs.length,
        remainingArgsLength = fnLength - leftArgsLength;
    
    if (leftArgsLength >= fnLength) {
      return fn.apply(this, leftArgsLength);
    }
    else if (leftArgsLength === 0) {
      return fn;
    }
    else if (fnLength === 0) {
      return variadic( function (args) {
        return fn.apply(this, leftArgs.concat(args));
      });
    }
    else {
      return variadic(fnLength - leftArgsLength,  function (args) {
        return fn.apply(this, leftArgs.concat(args));
      });
    }
  };
  
  var callLeft = variadic(applyLeft);
      
  var applyRight = function (fn, rightArgs) {
    fn = functionalize(fn);
    var fnLength = fn.length,
        rightArgsLength = rightArgs.length,
        remainingArgsLength = fnLength - rightArgsLength;
    
    if (rightArgsLength >= fnLength) {
      return fn.apply(this, rightArgsLength);
    }
    else if (rightArgsLength === 0) {
      return fn;
    }
    else if (fnLength === 0) {
      return variadic( function (args) {
        return fn.apply(this, args.concat(rightArgs));
      });
    }
    else {
      return variadic(fnLength - rightArgsLength,  function (args) {
        return fn.apply(this, args.concat(rightArgs));
      })
    }
  };
  
  var callRight = variadic(applyRight);
  
})(this);