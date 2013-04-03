(function (root) {
  var CORE = require('./core');
  
  var functionalize = CORE.functionalize,
      extend = CORE.extend,
      unary = CORE.unary,
      binary = CORE.binary;
  
  var __slice = Array.prototype.slice,
      __map = Array.prototype.map,
      __filter = Array.prototype.filter;
  
  // optimize around returning curried
  function filterWith (fn, list) {
    fn = functionalize(fn);
    var fnLength = fn.length;
    
    if (fnLength !== 1) {
      fn = unary(fn);
    }
    
    if (list == null) {
      return function (list) {
        return __filter.call(list, fn);
      }
    }
    else return __filter.call(list, fn);
  };

  // turns any function into a mapper
  //
  //    mapWith(function (x) { return x * x })([1, 2, 3, 4])
  //      //=> [1, 4, 9, 16]
  function mapWith (fn, list) {
    fn = functionalize(fn);
    var fnLength = fn.length;
    
    if (fnLength !== 1) {
      fn = unary(fn);
    }
    
    if (list == null) {
      return function (list) {
        return __map.call(list, fn);
      }
    }
    else return __map.call(list, fn);
  };

  // turns any function into a mapper and pass an index
  //
  //    mapWith(function (x) { return x * x })([1, 2, 3, 4])
  //      //=> [1, 4, 9, 16]
  function mapWithIndex (fn) {
    fn = functionalize(fn);
    var fnLength = fn.length;
    
    if (fnLength !== 2) {
      fn = binary(fn);
    }
    return function (list) {
      return __map.call(list, fn)
    }
  };

  // turns any function into a recursive mapper
  //
  // soak(function (x) { return x * x })([1, [2, 3], 4])
  //   //=> [1, [4, 9], 16]
  function soak (fn) {
    return function innerSoak (tree) {
      return Array.prototype.map.call(tree, function (element) {
        if (Array.isArray(element)) {
          return innerSoak(element);
        }
        else return fn(element);
      });
    };
  };
  
  extend(root, {
    mapWith: mapWith,
    splat: mapWith,
    mapWithIndex: mapWithIndex,
    splatWithIndex: mapWithIndex,
    filterWith: filterWith,
    soak: soak
  })
  
})(this);