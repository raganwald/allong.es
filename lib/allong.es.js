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
    require('./trampoline'),
    {
      iterators: require('./iterators'),
      list: require('./list')
    }
  );
  
})(this);