/*! http://github.com/raganwald/allong.es (c) 2012-2013 Reg Braithwaite MIT Licensed */
(function (root) {
  
  // Setup
  // -----

  // Establish the root object, `window` in the browser, or `global` on the server.
  // *taken from [Underscore.js](http://underscorejs.org/)*

  var root = this;
  
  var __slice = Array.prototype.slice,
      __map = Array.prototype.map,
      __hasProp = Array.prototype.hasOwnProperty,
      __filter = Array.prototype.filter;
  
  // here's our export object
  var allong = { es: {} };

  // ## Functionalizing
  //
  // The utility functions operate on other functions. They can also operate on string
  // abbreviations for functions by calling `functionalzie(...)` on their inputs.

  // SHIM
  if ('ab'.split(/a*/).length < 2) {
    if (typeof console !== "undefined" && console !== null) {
      console.log("Warning: IE6 split is not ECMAScript-compliant.  This breaks '->1'");
    }
  }

  // on the fence about whether to export this?
  function to_function (str) {
    var expr, leftSection, params, rightSection, sections, v, vars, _i, _len;
    params = [];
    expr = str;
    sections = expr.split(/\s*->\s*/m);
    if (sections.length > 1) {
      while (sections.length) {
        expr = sections.pop();
        params = sections.pop().split(/\s*,\s*|\s+/m);
        sections.length && sections.push('(function(' + params + '){return (' + expr + ')})');
      }
    } else if (expr.match(/\b_\b/)) {
      params = '_';
    } else {
      leftSection = expr.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m);
      rightSection = expr.match(/[+\-*\/%&|\^\.=<>!]\s*$/m);
      if (leftSection || rightSection) {
        if (leftSection) {
          params.push('$1');
          expr = '$1' + expr;
        }
        if (rightSection) {
          params.push('$2');
          expr = expr + '$2';
        }
      } else {
        vars = str.replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, '').match(/([a-z_$][a-z_$\d]*)/gi) || [];
        for (_i = 0, _len = vars.length; _i < _len; _i++) {
          v = vars[_i];
          params.indexOf(v) >= 0 || params.push(v);
        }
      }
    }
    return new Function(params, 'return (' + expr + ')');
  };

  function functionalize (fn) {
    if (typeof fn === 'function') {
      return fn;
    } else if (typeof fn === 'string' && /^[_a-zA-Z]\w*$/.test(fn)) {
      return function() {
        var args, receiver, _ref;
        receiver = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return (_ref = receiver[fn]).call.apply(_ref, [receiver].concat(__slice.call(args)));
      };
    } else if (typeof fn === 'string') {
      return to_function(fn);
    } else if (typeof fn.lambda === 'function') {
      return fn.lambda();
    } else if (typeof fn.toFunction === 'function') {
      return fn.toFunction();
    }
  };

  function extend () {
    var consumer = arguments[0],
        providers = __slice.call(arguments, 1),
        key,
        i,
        provider,
        except;

    for (i = 0; i < providers.length; ++i) {
      provider = providers[i];
      except = provider['except'] || [];
      except.push('except');
      for (key in provider) {
        if (except.indexOf(key) < 0 && provider.hasOwnProperty(key)) {
          consumer[key] = provider[key];
        };
      };
    };
    return consumer;
  };
      
  function rotate (array, n) {
    var copy = array.slice(0),
        i, 
        pull, 
        push;
    
    if (n !== 0) {
      n || (n = 1);
      if (n > 0) {
        pull = 'shift';
        push = 'push';
      }
      else {
        n = -n;
        pull = 'pop';
        push = 'unshift'
      }
      for (i = 0; i < n; ++i) {
        copy[push](copy[pull]());
      }
    }
    
    return copy;
  };
  
  function reverse (array) {
    return array.reduce(function (acc, element) {
      acc.unshift(element);
      return acc;
    }, []);
  };
  
  // # ARITY
  
  function invokeImmediately (fn) { return fn(); };

  // ### "Variadic"
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
    return function unary (a) {
      if (a == null) {
        return unary;
      }
      else return fn(a);
    }
  };

  function binary (fn) {
    return function binary (a, b) {
      if (a == null) {
        return binary;
      }
      else if (b == null) {
        return unary(function (b) { return fn(a, b); });
      }
      else return fn(a, b);
    }
  };

  function ternary (fn) {
    return function ternary (a, b, c) {
      if (a == null) {
        return ternary;
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
    return function quaternary (a, b, c, d) {
      if (a == null) {
        return quaternary;
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
        invokeImmediately,
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
  
  extend(allong.es, { curryWithLeftAndRight: curryWithLeftAndRight });
  
  // TODO: Deprecate
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
  };
  
  extend(allong.es, {
    variadic: variadic,
    unvariadic: unvariadic,
    unary: unary,
    binary: binary,
    ternary: ternary,
    quaternary: quaternary
  });

  // ### Composition

  //    compose(a, b, c)
  //      //=> function (x) {
  //        return a(b(c(x)))
  //      }
  var compose = variadic( function compose (fns) {
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

      return compose.call(this, first, compose.apply(this, butFirst));
    }
  });

  extend(allong.es, {
    compose: compose
  });
  
  // # CALL_FLIPPED
  
  var callFlipped = (function () {
    
    function nullary (fn) {
      return variadic( function (args) {
        return fn.apply(this, reverse(args));
      });
    };
  
    // a kind of optional semantics: unary(f)(value) === f(value), unary(f)() === unary(f)
    function unary (fn) {
      return function unary (a) {
        if (a == null) {
          return unary;
        }
        else return fn(a);
      }
    };

    function binary (fn) {
      return function binary (a, b) {
        if (a == null) {
          return binary;
        }
        else if (b == null) {
          return unary(function (b) { return fn(b, a); });
        }
        else return fn(b, a);
      }
    };

    function ternary (fn) {
      return function ternary (a, b, c) {
        if (a == null) {
          return ternary;
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
      return function quaternary (a, b, c, d) {
        if (a == null) {
          return quaternary;
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
  
    return extend( variadic( function callFlipped (fn, args) {
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
  
  })();
  
  // synonymish
  var flip = unary(callFlipped);

  extend(allong.es, {
    callFlipped: callFlipped,
    flip: flip
  });
  
  // # APPLY
  
  // the basics: apply and call
  
  // call that retuns a curried function
  
  var apply = binary( function (fn, args) {
    return curryWithLeftAndRight(fn, args, []);
  });
  
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
  
  var applyNowFlipped = flip(urApply);
  
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
  
  extend(allong.es, {
    applyNow: applyNow,
    apply: apply,
    callNow: callNow,
    call: call,
    callLeft: call,
    callRight: callRight,
    applyNowFlipped: applyNowFlipped,
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
  
  // # FOLDING
  
  var filter = binary( function filter (list, fn) {
    fn = functionalize(fn);
    
    return __filter.call(list, fn);
  });
  
  var filterWith = flip(filter);
  
  var map = binary( function map (list, fn) {
    fn = functionalize(fn);
    var fnLength = fn.length;
  
    if (fnLength !== 1) {
      fn = unary(fn);
    }
    return __map.call(list, fn);
  });
  
  var mapWith = flip(map);

  // turns any function into a recursive mapper
  //
  // deepMap(function (x) { return x * x })([1, [2, 3], 4])
  //   //=> [1, [4, 9], 16]
  function deepMap (fn) {
    return function innerDeepMap (tree) {
      return __map.call(tree, function (element) {
        if (Array.isArray(element)) {
          return innerSoak(element);
        }
        else return fn(element);
      });
    };
  };
  
  var deepMap = binary( function (tree, fn) {
    fn = functionalize(fn);
    
    return __map.call(tree, function (element) {
      if (Array.isArray(element)) {
        return deepMap(element, fn);
      }
      else return fn(element);
    });
  });
  
  var deepMapWith = flip(deepMap);
  
  extend(allong.es, {
    map: map,
    mapWith: mapWith,
    filter: filter,
    filterWith: filterWith,
    deepMap: deepMap,
    deepMapWith: deepMapWith
  });
  
  // # DECORATORS

  function maybe (fn) {
    fn = functionalize(fn);
    return function () {
      var i;

      if (arguments.length === 0) {
        return
      }
      else {
        for (i = 0; i < arguments.length; ++i) {
          if (arguments[i] == null) return
        }
        return fn.apply(this, arguments)
      }
    }
  }

  function tap (value, fn) {
    fn = functionalize(fn);

    if (fn === void 0) {
      return curried
    }
    else return curried(fn);

    function curried (fn) {
      if (typeof(fn) === 'function') {
        fn(value)
      }
      return value
    }
  }

  function fluent (fn) {
    fn = functionalize(fn);
    return function () {
      fn.apply(this, arguments);
      return this
    }
  }

  // decorates a function to return its first argument
  var returnFirst = function (fn) {
    fn = functionalize(fn);
    return function () {
      fn.apply(this, arguments);
      return arguments[0];
    }
  }

  function tee (decoration) {
    decoration = functionalize(decoration);
    return function (fn) {
      fn = functionalize(fn);
      return compose(returnFirst(decoration), fn);
    };
  };

  function once (fn) {
    fn = functionalize(fn);
    var done = false,
        testAndSet;

    if (!!fn.name) {
      testAndSet = function () {
        this["__once__"] || (this["__once__"] = {})
        if (this["__once__"][fn.name]) return true;
        this["__once__"][fn.name] = true;
        return false
      }
    }
    else  {
      testAndSet = function (fn) {
        if (done) return true;
        done = true;
        return false
      }
    }

    return function () {
      return testAndSet.call(this) ? void 0 : fn.apply(this, arguments)
    }
  }

  function memoized (fn, keymaker) {
    fn = functionalize(fn);
    var lookupTable = {},
        key,
        value;

    keymaker || (keymaker = function (args) {
      return JSON.stringify(args)
    });

    return function () {
      var key = keymaker.call(this, arguments);

      return lookupTable[key] || (
        lookupTable[key] = fn.apply(this, arguments)
      )
    }
  };
  
  extend(allong.es, {
    maybe: maybe,
    tap: tap,
    fluent: fluent,
    returnFirst: returnFirst,
    tee: tee,
    once: once,
    memoized: memoized
  });
  
  // # MIXIN

  function mixin (decoration) {
    return function decorator () {
      if (arguments[0] !== void 0) {
        return decorator.call(arguments[0]);
      }
      else {
        extend(this, decoration);
        return this;
      }
    };
  };

  function classDecorator (decoration) {
    return function (clazz) {
      function Decorated  () {
        var self = this instanceof Decorated
                   ? this
                   : new Decorated();

        return clazz.apply(self, arguments);
      };
      Decorated.prototype = extend(new clazz(), decoration);
      return Decorated;
    };
  };
  
  extend(allong.es, {
    mixin: mixin,
    classDecorator: classDecorator
  });
  
  // # MORE

  var unbind = function unbind (fn) {
    fn = functionalize(fn);
    return fn.unbound ? unbind(fn.unbound()) : fn
  };

  function bind (fn, context, force) {
    fn = functionalize(fn);
    var unbound, bound;

    if (force) {
      fn = unbind(fn)
    }
    bound = function () {
      return fn.apply(context, arguments)
    };
    bound.unbound = function () {
      return fn;
    };

    return bound;
  }

  function invoke (fn) {
    fn = functionalize(fn);
    var args = __slice.call(arguments, 1);

    return function (instance) {
      return fn.apply(instance, args)
    }
  };

  function get (object, getName) {
    if (getName == null) {
      return function (getName) { return object[getName]; };
    }
    else return object[getName];
  };

  function getWith (getName, object) {
    if (object == null) {
      return function (object) { return object[getName]; };
    }
    else return object[getName];
  };

  var pluckWith = compose(mapWith, getWith),
      pluck = flip(pluckWith);

  // Send a message/invoke a method on the receiver.
  // TODO: Think about what it has in common with callLeft
  var send = variadic( function (methodName, args) {
    return variadic( function (receiver, remainingArgs) {
      var fn = receiver[methodName];
      return fn.apply(receiver, args.concat(remainingArgs))
    })
  });
  
  extend(allong.es, {
    bind: bind,
    unbind: unbind,
    invoke: invoke,
    get: get,
    getWith: getWith,
    send: send,
    pluckWith: pluckWith,
    pluck: pluck
  });
  
  // # TRAMPOLINE
      
  function Thunk (closure) {
    if (!(this instanceof Thunk))
      return new Thunk(closure);
    
    this.closure = closure;
  };
  
  Thunk.prototype.force = function () {
    return this.closure();
  };
      
  function trampoline (fn) {
    var trampolined = variadic( function (args) {
      var result = fn.apply(this, args);
      
      while (result instanceof Thunk) {
        result = result.force();
      }
      
      return result;
    });
    trampolined.__trampolined_fn = fn;
    return trampolined;
  };
  
  var tailCall = variadic( function (fn, args) {
    var context = this;
    if (fn.__trampolined_fn instanceof Function) {
      return new Thunk( function () { 
        return fn.__trampolined_fn.apply(context, args);
      });
    }
    else return new Thunk( function () { 
      return fn.apply(context, args);
    });
  });
  
  extend(allong.es, {
    trampoline: trampoline,
    tailCall: tailCall,
    Thunk: Thunk
  });
  
  // # ITERATORS
  
  (function (allong) {
      
    function fold (iter, binaryFn, seed) {
      var state, element;
      binaryFn = functionalize(binaryFn);
      if (seed !== void 0) {
        state = seed;
      }
      else {
        state = iter();
      }
      element = iter();
      while (element != null) {
        state = binaryFn.call(element, state, element);
        element = iter();
      }
      return state;
    };
  
    var HASNTBEENRUN = {};
  
    function unfold (seed, unaryFn) {
      var state = HASNTBEENRUN;
      unaryFn = functionalize(unaryFn);
      return function () {
        if (state === HASNTBEENRUN) {
          return (state = seed);
        }
        else if (state != null) {
          return (state = unaryFn.call(state, state));
        }
        else return state;
      };
    };
  
    // note that the unfoldWithReturn behaves differently than
    // unfold with respect to the first value returned
    function unfoldWithReturn (seed, unaryFn) {
      var state = seed,
          pair,
          value;
      unaryFn = functionalize(unaryFn);
      return function () {
        if (state != null) {
          pair = unaryFn.call(state, state);
          value = pair[1];
          state = value != null
                  ? pair[0]
                  : void 0
          return value;
        }
        else return void 0;
      };
    };

    function accumulate (iter, binaryFn, initial) {
      var state = initial;
      binaryFn = functionalize(binaryFn);
      return function () {
        element = iter();
        if (element == null) {
          return element;
        }
        else {
          if (state === void 0) {
            return (state = element);
          }
          else return (state = binaryFn.call(element, state, element));
        }
      }
    };
  
    function accumulateWithReturn (iter, binaryFn, initial) {
      var state = initial,
          stateAndReturnValue;
      binaryFn = functionalize(binaryFn);
      return function () {
        element = iter();
        if (element == null) {
          return element;
        }
        else {
          if (state === void 0) {
            return (state = element);
          }
          else {
            stateAndReturnValue = binaryFn.call(element, state, element);
            state = stateAndReturnValue[0];
            return stateAndReturnValue[1];
          }
        }
      }
    };
  
    function map (iter, unaryFn) {
      unaryFn = functionalize(unaryFn);
      return function() {
        var element;
        element = iter();
        if (element != null) {
          return unaryFn.call(element, element);
        } else {
          return void 0;
        }
      };
    };

    function select (iter, unaryPredicateFn) {
      unaryPredicateFn = functionalize(unaryPredicateFn);
      return function() {
        var element;
        element = iter();
        while (element != null) {
          if (unaryPredicateFn.call(element, element)) {
            return element;
          }
          element = iter();
        }
        return void 0;
      };
    };
  
    function reject (iter, unaryPredicateFn) {
      unaryPredicateFn = functionalize(unaryPredicateFn);
      return select(iter, function (something) {
        return !unaryPredicateFn(something);
      });
    };
  
    function find (iter, unaryPredicateFn) {
      unaryPredicateFn = functionalize(unaryPredicateFn);
      return select(iter, unaryPredicateFn)();
    }

    function slice (iter, numberToDrop, numberToTake) {
      var count = 0;
      while (numberToDrop-- > 0) {
        iter();
      }
      if (numberToTake != null) {
        return function() {
          if (++count <= numberToTake) {
            return iter();
          } else {
            return void 0;
          }
        };
      }
      else return iter;
    };
  
    var drop = defaults(binary(slice), 1);
  
    function take (iter, numberToTake) {
      return slice(iter, 0, numberToTake == null ? 1 : numberToTake);
    }

    function FlatArrayIterator (array) {
      var index = 0;
      return function() {
        return array[index++];
      };
    };
  
    function RecursiveArrayIterator (array) {
      var index, myself, state;
      index = 0;
      state = [];
      myself = function() {
        var element, tempState;
        element = array[index++];
        if (element instanceof Array) {
          state.push({
            array: array,
            index: index
          });
          array = element;
          index = 0;
          return myself();
        } else if (element === void 0) {
          if (state.length > 0) {
            tempState = state.pop(), array = tempState.array, index = tempState.index;
            return myself();
          } else {
            return void 0;
          }
        } else {
          return element;
        }
      };
      return myself;
    };
  
    function K (value) {
      return function () {
        return value;
      };
    };

    function upRange (from, to, by) {
      return function () {
        var was;
      
        if (from > to) {
          return void 0;
        }
        else {
          was = from;
          from = from + by;
          return was;
        }
      }
    };

    function downRange (from, to, by) {
      return function () {
        var was;
      
        if (from < to) {
          return void 0;
        }
        else {
          was = from;
          from = from - by;
          return was;
        }
      }
    };
  
    function range (from, to, by) {
      if (from == null) {
        return upRange(1, Infinity, 1);
      }
      else if (to == null) {
        return upRange(from, Infinity, 1);
      }
      else if (by == null) {
        if (from <= to) {
          return upRange(from, to, 1);
        }
        else return downRange(from, to, 1)
      }
      else if (by > 0) {
        return upRange(from, to, by);
      }
      else if (by < 0) {
        return downRange(from, to, Math.abs(by))
      }
      else return k(from);
    };
  
    var numbers = unary(range);

    extend(allong.es, { iterators: {
      accumulate: accumulate,
      accumulateWithReturn: accumulateWithReturn,
      fold: fold,
      unfold: unfold,
      unfoldWithReturn: unfoldWithReturn,
      map: map,
      select: select,
      reject: reject,
      filter: select,
      find: find,
      slice: slice,
      drop: drop,
      take: take,
      FlatArrayIterator: FlatArrayIterator,
      RecursiveArrayIterator: RecursiveArrayIterator,
      constant: K,
      K: K,
      numbers: numbers,
      range: range
    }});
  
  })(allong);
  
  // Monadic Sequencing
  // ------------------
  
  //    sequence(a, b, c)
  //      //=> function (x) {
  //        return c(b(a(x)))
  //      }
  var sequence = callFlipped(compose);

  var Promise = require('promise');

  var Supervisor = (function() {

    function Supervisor(methods) {
      var body, name;
      for (name in methods) {
        if (!__hasProp.call(methods, name)) continue;
        body = methods[name];
        this[name] = body;
      }
      this.of || (this.of = function(value) {
        return value;
      });
      this.map || (this.map = function(fn) {
        return fn;
      });
      this.chain || (this.chain = function(mValue, fn) {
        return this.map(fn)(mValue);
      });
      for (name in this) {
        if (!__hasProp.call(this, name)) continue;
        body = this[name];
        this[name] = body.bind(this);
      }
    }

    return Supervisor;

  })();

  Supervisor.Identity = new Supervisor();

  Supervisor.Maybe = new Supervisor({
    map: function(fn) {
      return function(mValue) {
        if (mValue === null || mValue === void 0) {
          return mValue;
        } else {
          return fn(mValue);
        }
      };
    }
  });

  Supervisor.Writer = new Supervisor({
    of: function(value) {
      return [value, ''];
    },
    map: function(fn) {
      return function(_arg) {
        var newlyWritten, result, value, writtenSoFar, _ref;
        value = _arg[0], writtenSoFar = _arg[1];
        _ref = fn(value), result = _ref[0], newlyWritten = _ref[1];
        return [result, writtenSoFar + newlyWritten];
      };
    }
  });

  Supervisor.List = new Supervisor({
    of: function(value) {
      return [value];
    },
    join: function(mValue) {
      return mValue.reduce(this.concat, this.zero());
    },
    map: function(fn) {
      return function(mValue) {
        return mValue.map(fn);
      };
    },
    zero: function() {
      return [];
    },
    concat: function(ma, mb) {
      return ma.concat(mb);
    },
    chain: function(mValue, fn) {
      return this.join(this.map(fn)(mValue));
    }
  });

  Supervisor.Promise = new Supervisor({
    of: function(value) {
      return new Promise(function(resolve, reject) {
        return resolve(value);
      });
    },
    map: function(fnReturningAPromise) {
      return function(promiseIn) {
        return new Promise(function(resolvePromiseOut, rejectPromiseOut) {
          return promiseIn.then((function(value) {
            return fnReturningAPromise(value).then(resolvePromiseOut, rejectPromiseOut);
          }), rejectPromiseOut);
        });
      };
    }
  });

  Supervisor.Callback = new Supervisor({
    of: function(value) {
      return function(callback) {
        return callback(value);
      };
    },
    map: function(fn) {
      return function(value) {
        return function(callback) {
          return fn(value, callback);
        };
      };
    },
    chain: function(mValue, fn) {
      var _this = this;
      return function(callback) {
        return mValue(function(value) {
          return _this.map(fn)(value)(callback);
        });
      };
    }
  });

  Supervisor.sequence = function() {
    var args, fns, supervisor;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args[0] instanceof Supervisor) {
      supervisor = args[0], fns = 2 <= args.length ? __slice.call(args, 1) : [];
    } else {
      supervisor = Supervisor.Identity;
      fns = args;
    }
    return function() {
      return fns.reduce(supervisor.chain, supervisor.of.apply(supervisor, arguments));
    };
  };

  extend(allong.es, {
    sequence: sequence,
    Supervisor: Supervisor
  });

  // Exports and sundries
  // --------------------

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = allong;
    }
    exports.allong = allong;
  } else {
    root.allong = allong;
  }
  
}).call(this);