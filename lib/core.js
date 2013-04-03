(function (root) {
  
  var __slice = Array.prototype.slice,
      __map = Array.prototype.map,
      __filter = Array.prototype.filter;

  // ## Functionalizing
  //
  // The utility functions operate on other functions. They can also operate on string
  // abbreviations for functions by calling `functionalzie(...)` on their inputs.
      
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
  }

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

  function extend () {
    var consumer = arguments[0],
        providers = __slice.call(arguments, 1),
        key,
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
  };

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

  
  // this can be done with composition, but speed matters
  function flip (fn) {
    fn = functionalize(fn);
    var fnLength = fn.length
    
    if (fnLength === 1) {
      return fn;
    }
    else if (fnLength === 2) {
      return function (a, b) {
        if (b == null) {
          return function (b) {
            return fn.call(this, b, a);
          }
        }
        else return fn.call(this, b, a);
      };
    }
    else if (fnLength === 3) {
      return function (a, b, c) {
        if (b == null && c == null) {
          return function (b, c) {
            if (c == null) {
              return function (c) {
                return fn(c, b, a);
              };
            }
            else return fn(c, b, a);
          }
        }
        else if (c == null) {
          return function (c) {
            return fn(c, b, a);
          };
        }
        else return fn(c, b, a);
      };
    }
    else {
      return variadic( function (args) {
        return fn.apply(this, reverse(args));
      });
    }

  };

  //    sequence(a, b, c)
  //      //=> function (x) {
  //        return c(b(a(x)))
  //      }
  var sequence = flip(compose);
  
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
  
  function apply (fn, args) {
    fn = functionalize(fn);
    
    return fn.apply(this, args);
  };
  
  var call = variadic( apply );
  
  function unvariadic (fn) {
    fn = functionalize(fn);
    
    return function (args) {
      return fn.apply(this, args);
    }
  };
  
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
    to_function: to_function,
    functionalize: functionalize,
    unary: unary,
    binary: binary,
    ternary: ternary,
    variadic: variadic,
    unvariadic: unvariadic,
    extend: extend,
    compose: compose,
    sequence: sequence,
    defaults: defaults,
    apply: apply,
    call: call,
    args: args,
    flip: flip,
    list: {
      reverse: reverse,
      rotate: rotate
    }
  });
  
})(this);