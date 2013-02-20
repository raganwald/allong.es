(function (root) {
  var CORE = require('./core'),
      functionalize = CORE.functionalize,
      extend = CORE.extend,
      binary = CORE.binary;
      
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
        if (acc === void 0) {
          return (acc = element);
        }
        else return (acc = binaryFn.call(element, acc, element));
      }
    }
  };
  
  function map (iter, unaryFn) {
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

  function filter (iter, unaryPredicateFn) {
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

  function slice (iter, numberToDrop, numberToTake) {
    var count = 0;
    while (numberToDrop-- !== 0) {
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
  
  var drop = binary(slice);
  
  var take = function (iter, numberToTake) {
    return slice(iter, 0, numberToTake);
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

  extend(root, {
    accumulate: statefulMap,
    statefulMap: statefulMap,
    fold: fold,
    map: map,
    filter: filter,
    slice: slice,
    drop: drop,
    take: take,
    FlatArrayIterator: FlatArrayIterator,
    RecursiveArrayIterator: RecursiveArrayIterator
  });
  
})(this);