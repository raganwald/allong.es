(function (root) {
  var CORE = require('./core');
  var PLUMBING = require('./internal/plumbing'),
      functionalize = PLUMBING.functionalize,
      extend = PLUMBING.extend;

  function mixin (decoration) {
    return function decorator () {
      if (arguments[0] !== void 0) {
        return decorator.call(arguments[0]);
      }
      else {
        extend(this, decoration);
        return this;
      }
    };
  };

  function classDecorator (decoration) {
    return function (clazz) {
      function Decorated  () {
        var self = this instanceof Decorated
                   ? this
                   : new Decorated();

        return clazz.apply(self, arguments);
      };
      Decorated.prototype = extend(new clazz(), decoration);
      return Decorated;
    };
  };
  
  extend(root, {
    mixin: mixin,
    classDecorator: classDecorator
  });
  
})(this);