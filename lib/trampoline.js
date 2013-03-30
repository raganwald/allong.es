(function (root) {
  var CORE = require('./core');
  
  var functionalize = CORE.functionalize,
      extend = CORE.extend,
      variadic = CORE.variadic;
      
  function Thunk (closure) {
    if (!(this instanceof Thunk))
      return new Thunk(closure);
    
    this.closure = closure;
  };
  
  Thunk.prototype.force = function () {
    return this.closure();
  };
      
  function trampoline (fn) {
    var trampolined = variadic( function (args) {
      var result = fn.apply(this, args);
      
      while (result instanceof Thunk) {
        result = result.force();
      }
      
      return result;
    });
    trampolined.__trampolined_fn = fn;
    return trampolined;
  };
  
  var tailCall = variadic( function (fn, args) {
    var context = this;
    if (fn.__trampolined_fn instanceof Function) {
      return new Thunk( function () { 
        return fn.__trampolined_fn.apply(context, args);
      });
    }
    else return new Thunk( function () { 
      return fn.apply(context, args);
    });
  });
  
  extend(root, {
    trampoline: trampoline,
    tailCall: tailCall,
    Thunk: Thunk
  })
  
})(this);