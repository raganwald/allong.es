(function (root) {
  
  var extend = require('./plumbing').extend;
      
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
  
  extend(root, {
    rotate: rotate,
    reverse: reverse
  });
  
})(this);