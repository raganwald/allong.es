(function (root) {
  var extend = require('./internal/plumbing').extend;

  extend(root,
    require('./arity'),
    require('./composition'),
    require('./call_flipped'),
    require('./application'),
    require('./folding'),
    require('./decorators'),
    require('./mixin'),
    require('./more'),
    require('./trampoline'),
    {
      iterators: require('./iterators')
    }
  );
  
})(this);