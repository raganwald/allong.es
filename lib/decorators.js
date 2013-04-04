(function (root) {
  var CORE = require('./core');
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;

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
  }
  
  extend(root, {
    maybe: maybe,
    tap: tap,
    fluent: fluent,
    returnFirst: returnFirst,
    tee: tee,
    once: once,
    memoized: memoized
  });
  
})(this);