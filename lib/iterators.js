(function (root) {
  var CORE = require('./core'),
      functionalize = CORE.functionalize,
      extend = CORE.extend;
      
  function fold (iter, binaryFn, seed) {
    var acc, element;
    binaryFn = functionalize(binaryFn);
    if (seed !== void 0) {
      acc = seed;
    }
    else {
      acc = iter();
    }
    element = iter();
    while (element != null) {
      acc = binaryFn.call(element, acc, element);
      element = iter();
    }
    return acc;
  };

  function statefulMap (iter, binaryFn, seed) {
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

  extend(root, {
    accumulate: statefulMap,
    statefulMap: statefulMap,
    fold: fold,
    FlatArrayIterator: FlatArrayIterator,
    RecursiveArrayIterator: RecursiveArrayIterator
  });
  
})(this);