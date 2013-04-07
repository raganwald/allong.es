(function (root) {
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;
      
  var ARITY = require('./arity'),
      unary = ARITY.unary,
      binary = ARITY.binary;
      
  var FOLDING = require('./folding'),
      flip = FOLDING.flip;
      
  var CALL_FLIPPED = require('./call_flipped'),
      callFLipped = CALL_FLIPPED.callFLipped,
      flip = CALL_FLIPPED.flip;
  
  
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
  
  var map = binary( function map (list, fn) {
    fn = functionalize(fn);
    var fnLength = fn.length;
  
    if (fnLength !== 1) {
      fn = unary(fn);
    }
    return __map.call(list, fn);
  });
  
  var mapWith = flip(map);

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
        return mapWith(list, fn);
    }
    else return __map.call(list, fn);
  };

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
  
  extend(root, {
    map: map,
    mapWith: mapWith,
    filterWith: filterWith,
    deepMap: deepMap,
    deepMapWith: deepMapWith
  })
  
})(this);