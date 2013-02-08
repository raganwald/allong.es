You really should be looking at the [allong.es home page](http://allong.es). Or the [source code](https://github.com/allong-es/allong-es.github.com/blob/master/lib/allong.es.js). But here's a cheat sheet:

### variadic

Makes a function into a variadic (accepts any number of arguments). The last named parameter will be given an array of arguments.

```javascript
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

### partial application

The basics. Note: applyFirst is faster than applyLeft, use it if you are only applying a single argument. Likewise, applyLast is faster than applyRight.

```javascript
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
// sends a message
inventories.map(send('apples')) 
  //=> [ 0, 240, 24 ]

// sends a message and partially applies an argument
inventories.forEach(send('addApples', 12))
```

### currying

```javascript
curry( function (x, y) { return x } )
  //=> function (x) {
  //     return function (y) {
  //       return x
  //     }
  //   }
```

### binding

```javascript
bound(fn, args...)(obj)
  //=> fn.bind(obj, args...)
```

### properties
```
array.map(get('property'))
  //=> array.map(function (element) {
  //               return element['property']
  //             })
```

### composition

```javascript
compose(a, b, c)
  //=> function (x) {
  //     return a(b(c(x)))
  //   }
```

```javascript
sequence(a, b, c)
  //=> function (x) {
  //     return c(b(a(x)))
  //   }
```

### mapping

```javascript
var squareAll = splat(function (x) { return x * x })

squareAll([1, 2, 3, 4])
  //=> [1, 4, 9, 16]
```

### function/method decorators

Maybe:

```javascript
var safeFirst = maybe(function (arr) { return arr[0] })

safeFirst([1, 2, 3])
  //=> 1
safeFirst(null)
  //=> null
```

Tap:

```javascript
tap([1, 2, 3, 4, 5], send('pop'))
  //=> [1, 2, 3, 4]
```

Fluent:

```javascript
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

### class decorator

```javascript
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

var AndColourCoded = ClassDecorator({
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

Note: `ClassDecorator` works with JavaScript constructors that have a default implementation (they work properly with no arguments), and are new-agnostic (they can be called with new or as a normal function). `Todo` above has both properties.