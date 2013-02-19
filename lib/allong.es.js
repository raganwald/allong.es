(function (root) {
  var CORE = require('./core');
  
  var extend = CORE.extend;

  extend(root,
    require('./core'),
    require('./partial_application'),
    require('./folding'),
    require('./decorators'),
    require('./mixin'),
    require('./more'),
    {
      iterators: require('./iterators')
    }
  );
  
})(this);