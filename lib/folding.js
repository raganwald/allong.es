(function (root) {
  var CORE = require('./core');
  var functionalize = CORE.functionalize,
      extend = CORE.extend;

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
    splat: splat,
    splatWithIndex: splatWithIndex,
    soak: soak
  })
  
})(this);