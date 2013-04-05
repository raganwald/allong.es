(function (root) {
  
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;
      
  var ARITY = require('./arity'),
      variadic = ARITY.variadic;

  var FLIP = require('./call_flipped'),
      callFlipped = FLIP.callFlipped,
      flip = FLIP.flip;

  // ### Composition

  //    compose(a, b, c)
  //      //=> function (x) {
  //        return a(b(c(x)))
  //      }
  var compose = variadic( function myself (fns) {
    fns = fns.map(functionalize);
    
    var first, firstLength, second, rest;
    
    if (fns.length === 0) {
      return function () {};
    }
    else if (fns.length === 1) {
      return fns[0];
    }
    else if (fns.length === 2) {
      first = fns[0];
      firstLength = first.length;
      second = fns[1];
      
      if (firstLength === 1) {
        return function (a) { return first(second(a)); };
      }
      else if (firstLength === 2) {
        return function (a, b) { return first(second(a), b); };
      }
      else if (firstLength === 3) {
        return function (a, b, c) { return first(second(a), b, c); };
      }
      else return variadic( function (a, rest) {
        first.apply(this, [second(a)].concat(rest))
      });
    }
    else {
      var first = fns[0],
          butFirst = __slice.call(fns, 1);

      return myself.call(this, first, myself.apply(this, butFirst));
    }
  });
  
  //    sequence(a, b, c)
  //      //=> function (x) {
  //        return c(b(a(x)))
  //      }
  var sequence = callFlipped(compose);

  extend(root, {
    compose: compose,
    sequence: sequence,
  });
  
})(this);