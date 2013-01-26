(function() {
  var __slice = Array.prototype.slice,
      __map = Array.prototype.map;

  root = this;

  // # allong.es
  //
  // See the [home page](http://allong.es)

  // ## JavaScript Allongé
  //
  // The book [JavaScript Allongé](http://leanpub.com/javascript-allonge) contains
  // recipes for practical combinators and function decorators. They are all
  // included in the allong.es library with robust, production-ready implementations.

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

	// limits a function to taking only one argument
	function unary (fn) {
    fn = functionalize(fn);

		if (fn.length == 1) {
			return fn
		}
		else return function (something) {
			return fn.call(this, something)
		}
	}

  // ### Partial Application and Currying

  // Applies the first argument, returns a variadic function taking the rest
  function applyFirst (fn, first) {
    fn = functionalize(fn);
    return variadic( function (args) {
      return fn.apply(this, [first].concat(args))
    })
  }

  // Applies the last argument, returns a variadic function taking the rest
  function applyLast (fn, last) {
    fn = functionalize(fn);
		var fnLength = fn.length;

		if (fnLength < 1) {
	    return variadic( function (args) {
	      return fn.apply(this, args.concat([last]));
	    })
		}
		else if (fnLength > 1) {
	    return variadic( function (args) {
	      return fn.apply(this, __slice.call(args, 0, fnLength - 1).concat([last]));
	    })
		}
		else return function () { return fn.call(this, last); }
  }

  // applies one or more arguments in the leftmost positions,
  // returns a variadic function taking the rest
  var applyLeft = variadic( function (fn, args) {
    fn = functionalize(fn);
    return variadic( function (remainingArgs) {
      return fn.apply(this, args.concat(remainingArgs))
    })
  });

	// Send a message/invoke a method on the receiver. 
	// TODO: Think about what it has in common with applyLeft
  var send = variadic( function (methodName, args) {
    return variadic( function (receiver, remainingArgs) {
    	var fn = receiver[methodName];
      return fn.apply(receiver, args.concat(remainingArgs))
    })
  });

  // applies one or more arguments in the rightmost positions,
  // returns a variadic function taking the rest
  var applyRight = variadic( function (fn, args) {
    fn = functionalize(fn);
		var fnLength = fn.length;

		if (fnLength < 1) {
	    return variadic( function (precedingArgs) {
	      return fn.apply(this, precedingArgs.concat(args))
	    })
		}
		else if (fnLength > args.length) {
	    return variadic( function (precedingArgs) {
	      return fn.apply(this, __slice.call(precedingArgs, 0, fnLength - args.length).concat(args));
	    })
		}
		else return function () { return fn.apply(this, args); }

  });

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

  // transforms a polyadic function into a chain of unary
  // functions. Named after Haskell Curry, although it
  // is now known to have been first discovered by Moses
  // Schoöenfinkel
  //
  //    curry(function (x, y) { return x })
  //      //=> function (x) {
  //             return function (y) { return x }
  //           }
  function curry (fn) {
    fn = functionalize(fn);
    var arity = fn.length;

    return given([]);

    function given (argsSoFar) {
      return function curried () {
        var updatedArgsSoFar = argsSoFar.concat(__slice.call(arguments, 0));

        if (updatedArgsSoFar.length >= arity) {
          return fn.apply(this, updatedArgsSoFar)
        }
        else return given(updatedArgsSoFar)
      }
    }

  }

  // ### Composition

  //    compose(a, b, c)
  //      //=> function (x) {
  //        return a(b(c(x)))
  //      }
  var compose = variadic( function myself (fns) {
    fns = fns.map(functionalize);
    if (fns.length === 2) {
      var a = fns[0],
          b = fns[1];

      return function (c) {
        return a(b(c))
      }
    }
    else if (fns.length > 2) {
      var first = fns[0],
          butFirst = __slice.call(fns, 1);

      return myself.call(this, first, myself.apply(this, butFirst));
    }
  });

  //    sequence(a, b, c)
  //      //=> function (x) {
  //        return c(b(a(x)))
  //      }
  var sequence = variadic( function (first, butFirst) {
    if (first === void 0) {
      return Idiot
    }
    else if (butFirst.length === 0) {
      return first
    }
    else {
      return function (value) {
        return sequence.apply(this, butFirst)(first.call(this, value))
      }
    }
  });

  // turns any function into a mapper
  //
  //    splat(function (x) { return x * x })([1, 2, 3, 4])
  //      //=> [1, 4, 9, 16]
  function splat (fn) {
    fn = functionalize(fn);
    return function (list) {
      return __map.call(list, function (something) { return fn(something) })
    }
  };

  // turns any function into a mapper and pass an index
  //
  //    splat(function (x) { return x * x })([1, 2, 3, 4])
  //      //=> [1, 4, 9, 16]
  function splatWithIndex (fn) {
    fn = functionalize(fn);
    return function (list) {
      return __map.call(list, fn)
    }
  };

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

  function invoke (fn) {
    fn = functionalize(fn);
    var args = __slice.call(arguments, 1);

    return function (instance) {
      return fn.apply(instance, args)
    }
  }

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
  }

  function get (attr) {
    return function (object) { return object[attr]; }
  }

  var pluck = compose(splat, get);

  // ## Functionalizing
  //
  // The utility functions operate on other functions. They can also operate on string
  // abbreviations for functions by calling `functionalzie(...)` on their inputs.

  if ('ab'.split(/a*/).length < 2) {
    if (typeof console !== "undefined" && console !== null) {
      console.log("Warning: IE6 split is not ECMAScript-compliant.  This breaks '->1'");
    }
  }

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

  var extend = variadic( function (consumer, providers) {
    var key,
        i,
        provider,
        except;

    for (i = 0; i < providers.length; ++i) {
      provider = providers[i];
      except = provider['except'] || []
      except.push('except')
      for (key in provider) {
        if (except.indexOf(key) < 0 && provider.hasOwnProperty(key)) {
          consumer[key] = provider[key]
        }
      }
    }
    return consumer
  });

  // ## Export the songbird and utility functions
  extend(root, {
    extend: extend,
    variadic: variadic, ellipsis: variadic,
		unary: unary,
    applyFirst: applyFirst,
    applyLast: applyLast,
    applyLeft: applyLeft,
    applyRight: applyRight,
    compose: compose,
    curry: curry,
    sequence: sequence,
    bound: bound,
    splat: splat,
    splatWithIndex: splatWithIndex,
    send: send,
    maybe: maybe,
    tap: tap,
    fluent: fluent,
    invoke: invoke,
    once: once,
    unbind: unbind,
    bind: bind,
    memoized: memoized,
    get: get,
    pluck: pluck
  });

}).call(this);
