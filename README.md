You really should be looking at the [allong.es home page](http://allong.es). Or the [source code](https://github.com/raganwald/allong.es/blob/master/lib/allong.es.js). But here's a cheat sheet:

### variadic

Makes a function into a variadic (accepts any number of arguments). The last named parameter will be given an array of arguments.

```javascript
var variadic = require('allong.es').variadic;

var fn = variadic(function (a) { return a })

fn()
  //=> []
fn(1, 2, 3)
  //=> [1,2,3]

fn = variadic(function (a,b) { return { a: a, b: b } })

fn()
  //=> { a: undefined, b: [] }
fn(1)
  //=> { a: 1, b: [] }
fn(1,2,3)
  //=> { a: 1, b: [2, 3] }
```

### unary, binary, and ternary

Sometimes, you have a function that takes multiple arguments, but you only want it to accept one, or two, or maybe three arguments and ignore the rest. For example, `parseInt` takes a radix as an optional second parameter. And that is havoc if you try to use it with `Array.map`:

```javascript
['1', '2', '3', '4', '5'].map(parseInt)
  //=> [ 1,
  //     NaN,
  //     NaN,
  //     NaN,
  //     NaN ]
```

Use `unary(parseInt)` to solve the problem:

```javascript
['1', '2', '3', '4', '5'].map(unary(parseInt))
  //=> [ 1, 2, 3, 4, 5 ]
```

`binary` has similar uses when working with `Array.reduce` and its habit of passing three parameters to your supplied function.

### partial application: applyFirst, applyLast, applyLeft, and applyRight

The basics. Note: applyFirst is faster than applyLeft, use it if you are only applying a single argument. Likewise, applyLast is faster than applyRight.

```javascript
var applyFirst = require('allong.es').applyFirst,
    applyLast = require('allong.es').applyLast,
    applyLeft = require('allong.es').applyLeft,
    applyRight = require('allong.es').applyRight;

var base = function (greeting, you, me) { return greeting + ', ' + you + ', my name is ' + me }
var hello = applyFirst(base, 'Hello')

hello('Giselle', 'Franka')
  //=> "Hello, Giselle, my name is Franka"
  
var helloTom = applyLeft(base, 'Hello', 'Tom')

helloTom('Harry')
  //=> "Hello, Tom, my name is Harry"
  
var ingrid = applyLast(base, 'Ingrid')

ingrid('Hi', 'Pia')
  //=> "Hi, Pia, my name is Ingrid"
  
var anthonyCarla = applyRight(base, 'Anthony', 'Carla')

anthonyCarla('Yo')
  //=> "Yo, Anthony, my name is Carla"
```

Partial application is also useful for methods:

```javascript
var send = require('allong.es').send;
    
// sends a message
inventories.map(send('apples')) 
  //=> [ 0, 240, 24 ]

// sends a message and partially applies an argument
inventories.forEach(send('addApples', 12))
```

### curry

```javascript
var curry = require('allong.es').curry;
    
curry( function (x, y) { return x } )
  //=> function (x) {
  //     return function (y) {
  //       return x
  //     }
  //   }
```

### bound

```javascript
var bound = require('allong.es').bound;
    
bound(fn, args...)(obj)
  //=> fn.bind(obj, args...)
```

### properties: get

```javascript
var get = require('allong.es').get;
    
array.map(get('property'))
  //=> array.map(function (element) {
  //               return element['property']
  //             })
```

### compose and sequence

```javascript
var compose = require('allong.es').compose,
    sequence = require('allong.es').sequence;
    
compose(a, b, c)
  //=> function (x) {
  //     return a(b(c(x)))
  //   }
 
sequence(a, b, c)
  //=> function (x) {
  //     return c(b(a(x)))
  //   }
```

### splat and soak

```javascript
var splat = require('allong.es').splat,
    soak = require('allong.es').soak;
    
var squareList = splat(function (x) { return x * x })

squareList([1, 2, 3, 4])
  //=> [1, 4, 9, 16]
  
var squareTree = soak(function (x) { return x * x })

squareTree([1, 2, [3, 4]])
  //=> [1, 4, [9, 16]]
```

### function/method decorators: maybe, tap, fluent, and once

Maybe:

```javascript
var maybe = require('allong.es').maybe;
    
var safeFirst = maybe(function (arr) { return arr[0] })

safeFirst([1, 2, 3])
  //=> 1
safeFirst(null)
  //=> null
```

Tap:

```javascript
var tap = require('allong.es').tap;
    
tap([1, 2, 3, 4, 5], send('pop'))
  //=> [1, 2, 3, 4]
```

Fluent:

```javascript
var fluent = require('allong.es').fluent;
    
Role = function () {}

Role.prototype.set = fluent( function (property, name) { 
  this[property] = name 
})

var doomed = new Attrs()
  .set('name', "Fredo")
  .set('relationship', 'brother')
  .set('parts', ['I', 'II'])
```

Once:

```javascript
var once = require('allong.es').once;
    
var message = once( function () { console.log("Hello, it's me") })

message()
  //=> "Hello, it's me"
message()
  //=>
message()
  //=>
message()
  //=>
```

### class decoration: mixin and classDecorator

```javascript
var mixin = require('allong.es').mixin,
    classDecorator = require('allong.es').classDecorator;
    
function Todo (name) {
  var self = this instanceof Todo
             ? this
             : new Todo();
  self.name = name || 'Untitled';
  self.done = false;
};

Todo.prototype.do = fluent( function () {
  this.done = true;
});

Todo.prototype.undo = fluent( function () {
  this.done = false;
});

var AddLocation = mixin({
      setLocation: fluent( function (location) {
        this.location = location;
      }),
      getLocation: function () { return this.location; }
    });

AddLocation.call(Todo.prototype);
// Or use AddLocation(Todo.prototype)

new Todo("Vacuum").setLocation('Home');
  //=> { name: 'Vacuum',
  //     done: false,
  //     location: 'Home' }

var AndColourCoded = classDecorator({
  setColourRGB: fluent( function (r, g, b) {
    this.colourCode = { r: r, g: g, b: b };
  }),
  getColourRGB: function () {
    return this.colourCode;
  }
});

var ColourTodo = AndColourCoded(Todo);

new ColourTodo('Use More Decorators').setColourRGB(0, 255, 0);
  //=> { name: 'Use More Decorators',
  //     done: false,
  //     colourCode: { r: 0, g: 255, b: 0 } }
```

Note: `classDecorator` works with JavaScript constructors that have a default implementation (they work properly with no arguments), and are new-agnostic (they can be called with new or as a normal function). `Todo` above has both properties.

### functional iterators

Functional iterators are stateful functions that "iterate over" the values in some ordered data set. You call the iterator repeatedly to obtain the values, and it will either never stop returning values (an infinite data set) or return `undefined` when there are no more values to return.

Making functional iterators from arrays:

```javascript
var FlatArrayIterator = require('allong.es').FlatArrayIterator,
    RecursiveArrayIterator = require('allong.es').RecursiveArrayIterator;
    
var i = FlatArrayIterator([1, 2, 3, 4, 5]);

i();
  #=> 1
i();
  #=> 2
i();
  #=> 3
i();
  #=> 4
i();
  #=> 5
i();
  #=> undefined
    
var i = FlatArrayIterator([1, [2, 3, 4], 5]);

i();
  #=> 1
i();
  #=> [2, 3, 4]
i();
  #=> 5
i();
  #=> undefined
    
var i = RecursiveArrayIterator([1, [2, 3, 4], 5]);

i();
  #=> 1
i();
  #=> 2
i();
  #=> 3
i();
  #=> 4
i();
  #=> 5
i();
  #=> undefined
``` 

Making functional iterators using generator functions:

```javascript
var unfold = require('allong.es').unfold,
    unfoldWithReturn = require('allong.es').unfoldWithReturn;
    
var i = unfold(1, function (n) { return n + 1; });

i();
  //=> 1
i();
  //=> 2
i();
  //=> 3
// ...
    
var i = unfoldWithReturn(1, function (n) { 
  return [n + 1, n * n]; 
});

i();
  //=> 1
i();
  //=> 4
i();
  //=> 9
// ...
```