(function (root) {
  var CORE = require('./core'),
      functionalize = CORE.functionalize,
      extend = CORE.extend;
      
  function fold (iter, binaryFn, seed) {
    var acc, element;
    binaryFn = functionalize(binaryFn);
    acc = seed;
    element = iter();
    while (element != null) {
      acc = binaryFn.call(element, acc, element);
      element = iter();
    }
    return acc;
  };

  function accumulate (iter, binaryFn, seed) {
    var acc = seed;
    binaryFn = functionalize(binaryFn);
    return function () {
      element = iter();
      if (element == null) {
        return element;
      }
      else {
        return (acc = binaryFn.call(element, acc, element));
      }
    }
  };

  extend(root, {
    accumulate: accumulate,
    fold: fold
  });
  
})(this);