(function (root) {

  var COMPOSITION = require('./composition'),
      compose = COMPOSITION.compose;

  var FLIP = require('./call_flipped'),
      callFlipped = FLIP.callFlipped,
      flip = FLIP.flip;
      
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;

  var ARITY = require('./arity'),
      variadic = ARITY.variadic,
      unary = ARITY.unary,
      binary = ARITY.binary,
      ternary = ARITY.ternary,
      quaternary = ARITY.quaternary,
      curry = ARITY.curry,
      curryWithLeftAndRight = ARITY.curryWithLeftAndRight;
      
  var __slice = [].slice;
  
  // the basics: apply and call
  
  // call that retuns a curried function
  
  var call = variadic( function (fn, args) {
    return curryWithLeftAndRight(fn, args, []);
  });
  
  var curry = unary(call);
  
  function urApply (fn, args) {
    return fn.apply(this, args);
  };
  
  var applyNow = call( urApply );
  
  var callNow = extend( variadic(applyNow), {
    unary: unary,
    binary: binary,
    ternary: ternary,
    quaternary: quaternary
  });
  
  // flipped forms
  
  var applyN = flip(urApply);
  
  // apply and call left
  
  function urApplyLeft (fn, leftArgs) {
    var remainingLength = fn.length - leftArgs.length;
    
    if (fn.length > 0 && remainingLength > 0) {
      return variadic(remainingLength, function (args) {
        return fn.apply(this, leftArgs.concat(args));
      });
    }
    else return fn.apply(this, leftArgs);
  };
  
  var applyLeftNow = call(urApplyLeft);
  
  var callLeftNow = variadic(urApplyLeft);
  
  // flipped
  
  var applyLeftNowWith = flip(urApplyLeft);
  
  var applyRightNowWith = flip(urApplyRight);
  
  // rightmost
  
  function urApplyRight (fn, rightArgs) {
    var remainingLength = fn.length - rightArgs.length;
    
    if (fn.length > 0 && remainingLength > 0) {
      return variadic(remainingLength, function (args) {
        return fn.apply(this, args.concat(rightArgs));
      });
    }
    else return fn.apply(this, rightArgs);
  }
  
  var applyRightNow = call(urApplyRight);
  
  var callRightNow = variadic(urApplyRight);
  
  var callRight = variadic( function (fn, args) {
    return curryWithLeftAndRight(fn, [], args);
  });
  
  var callFirst = binary(call);
  var callFirstWith = flip(callFirst);
  
  var callLast = binary(callRight);
  var callLastWith = flip(callLast);

  // ### Partial applications that bind

  // A partially applied binding function
  //
  // roughly equivalent to applyRight
  //
  // var fn = function (...) { ... }
  //
  // bound(fn)(x)
  //   //=> fn.bind(x)
  //
  // bound(fn, foo)(x)
  //   //=> fn.bind(x, foo)
  //
  // bound(fn, foo, bar)(x)
  //   //=> fn.bind(x, foo, bar)
  var bound = variadic( function (messageName, args) {
    if (args === []) {
      return function (instance) {
        return instance[messageName].bind(instance)
      }
    }
    else {
      return function (instance) {
        return Function.prototype.bind.apply(
          instance[messageName], [instance].concat(args)
        )
      }
    }
  });
  
  var defaults = variadic( function (fn, values) {
    var fln = fn.length,
        vln = values.length;
    return variadic( function (args) {
      var aln = args.length,
          mln = Math.max(fln - aln, 0);
      args = args.concat(values.slice(vln-mln));
      return fn.apply(this, args);
    })
  });
  
  // collects arguments
  function args (arity) {
    if (arity === 1) {
      return function (a) {
        return [a];
      };
    }
    else if (arity === 2) {
      return function (a, b) {
        return [a, b];
      };
    }
    else if (arity === 3) {
      return function (a, b, c) {
        return [a, b, c];
      };
    }
    else return variadic( function (args) {
      return args;
    });
  };
  
  extend(root, {
    applyNow: applyNow,
    callNow: callNow,
    call: call,
    callLeft: call,
    callRight: callRight,
    applyN: applyN,
    applyLeftNow: applyLeftNow,
    callLeftNow: callLeftNow,
    applyLeftNowWith: applyLeftNowWith,
    applyRightNow: applyRightNow,
    callRightNow: callRightNow,
    applyRightNowWith: applyRightNowWith,
    callFirst: callFirst,
    callLast: callLast,
    callFirstWith: callFirstWith,
    callLastWith: callLastWith,
    bound: bound,
    defaults: defaults,
    args: args,
    curry: curry
  });
      
  
})(this);
