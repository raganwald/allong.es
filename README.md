# `allong.es`

The `allong.es` library is a collection of functions designed to facilitate writing JavaScript and/or CoffeeScript with functions as first-class values. The emphasis in `allong.es` is on composing and decomposing functions using combinators and decorators. `allong.es` is designed to complement libraries like [Underscore](http://underscorejs.org), not compete with them.

## Currying and Partial Application

At the heart of `allong.es` are the functions that curry and partially apply other functions. The two most important to understand are `call` and `apply`. They work very much like the `.call` and `.apply` methods that every JavaScript function implements:

```javascript
function greet (how, whom) {
  return '' + how + ', ' + whom + '!';
};
  
call(greet, 'Hello', 'Tom')
  //=> 'Hello, Tom!'
  
apply(greet, ['Hello', 'Tom'])
  //=> 'Hello, Tom!'
```

Their "special sauce" is that they automatically *curry* the supplied function, so if you provide fewer or no arguments, you get back a partially applied or curried function:

```javascript
call(greet)('Hello')('Tom')
  //=> 'Hello, Tom!'
  
call(greet, 'Hello')('Tom'])
  //=> 'Hello, Tom!'
  
apply(greet, [])('Hello')('Tom')
  //=> 'Hello, Tom!'
  
apply(greet, ['Hello'])('Tom'])
  //=> 'Hello, Tom!'
```

### immediate application

If you don't want the currying/partial application behaviour, there is an immediate application version named (appropriately), `callNow` (and also another named `applyNow`, not shown):

```javascript
callNow(greet, 'Hello', 'Tom')
  //=> 'Hello, Tom!'
  
callNow(greet, 'Hello')
  //=> 'Hello, undefined!'
```

### variations on the order of applying the arguments

`callRight` applies any arguments supplied to the right. If you supply all the arguments, it's the same as `call`, but if you supply fewer arguments, you get a right partial application:

```javascript
callRight(greet, 'Hello', 'Tom')
  //=> 'Hello, Tom!'
  
callRight(greet, 'Hello')('Tom')
  //=> 'Tom, Hello!'
```

`callFlipped` applies the arguments backwards, even when curried:

```javascript
callFlipped(greet, 'Hello', 'Tom')
  //=> 'Tom, Hello!'
  
callFlipped(greet, 'Hello')('Tom')
  //=> 'Tom, Hello!'
  
callFlipped(greet)('Hello')('Tom')
  //=> 'Tom, Hello!'
```

### more partial application

`callLeft` is actually synonymous with `call`: It applies arguments given to the left. We've seen `callRight` above. Both are *variadic*: You can supply as many arguments as you want.

`callFirst` and `callLast` are just like `callLeft` and `callRight`, but they are *binary* functions: They accept a function and exactly one argument. This is sometimes useful when combining functions together.

`callFirst` and `callLast` both have "flipped and curried" versions (`callFirstWith` and `callLastWith`). `callLastWith` is especially useful for working with functions written in "collection - operation" style. Here we take advantage of the fact that they are "automatically curried" to implement the popular `pluck` function.

### currying

`allong.es` does support the `curry` function, it is implemented as the unary form of `call`:

```javascript
var curry = unary(call);
```

### with

`splat` was present in earlier versions of `allong.es` but has been deprecated as being too cryptic. Instead, there is a general naming convention that works as follows. Many binary functions such as `map` and `filter` are historically written to take a noun or collection as the first argument and a verb as the second.

However, reversing and currying these functions is super-useful as it makes composeable functions out of them. That's why `callFlipped` is so important. But to save you the trouble of writing `callFlipped map` everywhere, many such functions in `allong.es` have a clipped version pre-defined and named with the suffix `With`:

```
map(list, function)       <=> mapWith(function, list)
filter(list, function)    <=> filterWith(function, list)
get(object, propertyName) <=> getWith(propertyName, object)
pluck(list, propertyName) <=> pluckWith(propertyName, list)
```

So you "map" a list, but "mapWith" a function. And of course, they are all curried. For example:

```
map(list)(function)       <=> mapWith(function)(list)
deepMap(list)(function)   <=> deepMapWith(function)(list)
filter(list)(function)    <=> filterWith(function)(list)
get(object)(propertyName) <=> getWith(propertyName)(object)
pluck(list)(propertyName) <=> pluckWith(propertyName)(list)
```

Thus if you have a collection such as:

```javascript
var users = [
  { name: 'Huey' },
  { name: 'Dewey' },
  { name: 'Louie' }
]
```

You can get the names with either:

```javascript
pluck(users, 'name')
  //=> ['Huey', 'Dewey', 'Louie']
```

Or:

```javascript
pluckWith('name', users)
  //=> ['Huey', 'Dewey', 'Louie']
```

The latter is interesting because `pluck` and `pluckWith` are both automatically curried (like almost everything that isn't named "now"). Thus, we could also write:

```javascript
var namesOf = pluckWith('name');

// ...
namesOf(users)
  //=> ['Huey', 'Dewey', 'Louie']
```

## Arity Function Decorators

### variadic

Makes a function into a variadic (accepts any number of arguments). The last named parameter will be given an array of arguments.

```javascript
var variadic = require('allong.es').allong.es.variadic;

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

### variadic, part ii

When given just the function, `variadic` returns a function with an arity of zero. This is consistent with JavaScript programming practice. There are times when you wish to report an arity, meaning that you want the returned function to have its `length` getibute set.

You do this by prefacing the function argument with a length:

```javascript
fn = variadic(function (a,b) { return { a: a, b: b } });

fn.length
  //=> 0
  
fn2 = variadic(1, function (a,b) { return { a: a, b: b } }); 

fn2.length
  //=> 1
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

## Miscellaneous Combinators

### bound

```javascript
var bound = require('allong.es').allong.es.bound;
    
bound(fn, args...)(obj)
  //=> fn.bind(obj, args...)
```

### getWith

```javascript
var getWith = require('allong.es').allong.es.getWith;
    
array.map(getWith('property'))
  //=> array.map(function (element) {
  //               return element['property']
  //             })
```

## Functional Composition

```javascript
var compose = require('allong.es').allong.es.compose,
    sequence = require('allong.es').allong.es.sequence;
    
compose(a, b, c)
  //=> function (x) {
  //     return a(b(c(x)))
  //   }
 
sequence(a, b, c)
  //=> function (x) {
  //     return c(b(a(x)))
  //   }
```

## List Combinators

### mapWith and deepMapWith

```javascript
var mapWith = require('allong.es').allong.es.mapWith,
    deepMapWith = require('allong.es').allong.es.deepMapWith;
    
var squareList = mapWith(function (x) { return x * x })

squareList([1, 2, 3, 4])
  //=> [1, 4, 9, 16]
  
var squareTree = deepMapWith(function (x) { return x * x })

squareTree([1, 2, [3, 4]])
  //=> [1, 4, [9, 16]]
```

## Function/Method Decorators

### maybe

```javascript
var maybe = require('allong.es').allong.es.maybe;
    
var safeFirst = maybe(function (arr) { return arr[0] })

safeFirst([1, 2, 3])
  //=> 1
safeFirst(null)
  //=> null
```

### tap

```javascript
var tap = require('allong.es').allong.es.tap;
    
tap([1, 2, 3, 4, 5], send('pop'))
  //=> [1, 2, 3, 4]
```

### fluent

```javascript
var fluent = require('allong.es').allong.es.fluent;
    
Role = function () {}

Role.prototype.set = fluent( function (property, name) { 
  this[property] = name 
})

var doomed = new Role()
  .set('name', "Fredo")
  .set('relationship', 'brother')
  .set('parts', ['I', 'II'])
```

### once

```javascript
var once = require('allong.es').allong.es.once;
    
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

## Decorating Classes/Constructors

```javascript
var mixin = require('allong.es').allong.es.mixin,
    classDecorator = require('allong.es').allong.es.classDecorator;
    
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

## Functional Iterators

Functional iterators are stateful functions that "iterate over" the values in some ordered data set. You call the iterator repeatedly to obtain the values, and it will either never stop returning values (an infinite data set) or return `undefined` when there are no more values to return.

The functional iterators utilities are all namespaced:

```javascript
var iterators = require('allong.es').allong.es.iterators;
```

### FlatArrayIterator and RecursiveArrayIterator

Making functional iterators from arrays:

```javascript
var FlatArrayIterator = iterators.FlatArrayIterator,
    RecursiveArrayIterator = iterators.RecursiveArrayIterator;
    
var i = FlatArrayIterator([1, 2, 3, 4, 5]);

i();
  //=> 1
i();
  //=> 2
i();
  //=> 3
i();
  //=> 4
i();
  //=> 5
i();
  //=> undefined
    
var i = FlatArrayIterator([1, [2, 3, 4], 5]);

i();
  //=> 1
i();
  //=> [2, 3, 4]
i();
  //=> 5
i();
  //=> undefined
    
var i = RecursiveArrayIterator([1, [2, 3, 4], 5]);

i();
  //=> 1
i();
  //=> 2
i();
  //=> 3
i();
  //=> 4
i();
  //=> 5
i();
  //=> undefined
```

### range and numbers

```javascript
var range = iterators.range,
    numbers = iterators.numbers;

var i = range(1, 5);

i();
  //=> 1
i();
  //=> 2
i();
  //=> 3
i();
  //=> 4
i();
  //=> 5
i();
  //=> undefined

var i = range(1, 5, 2);

i();
  //=> 1
i();
  //=> 3
i();
  //=> 5
i();
  //=> undefined

var i = range(5, 1);

i();
  //=> 5
i();
  //=> 4
i();
  //=> 3
i();
  //=> 2
i();
  //=> 1
i();
  //=> undefined

var i = range(1);

i();
  //=> 1
i();
  //=> 2
i();
  //=> 3
// ...

var i = numbers();

i();
  //=> 1
i();
  //=> 2
i();
  //=> 3
// ...

var i = numbers(0);

i();
  //=> 0
i();
  //=> 1
i();
  //=> 2
i();
  //=> 3
// ...
```

### unfold and unfoldWithReturn

Unfold makes an iterator out of a seed by successively applying a function to the seed value. Here's an example duplicating the "numbers" feature:

```javascript
var unfold = iterators.unfold,
    unfoldWithReturn = iterators.unfoldWithReturn;
    
var i = unfold(1, function (n) { return n + 1; });

i();
  //=> 1
i();
  //=> 2
i();
  //=> 3
// ...
    
var i = unfoldWithReturn(1, function (n) { 
  return [n + 1, n + n]; 
});

i();
  //=> 2
i();
  //=> 4
i();
  //=> 6
// ...
```

A richer example of `unfoldWithReturn`:

```javaascript
var cards = ['A', 2, 3, 4, 5, 6, 7, 8, 9, '10', 'J', 'Q', 'K'];

function pickCard (deck) {
  var position;
  
  if (deck.length === 0) {
    return [[], void 0];
  }
  else {
    position = Math.floor(Math.random() * deck.length);
    return [
      deck.slice(0, position).concat(deck.slice(position + 1)),
      deck[position]
    ];
  }
};

var i = unfoldWithReturn(cards, pickCard);

i();
  //=> 5
i();
  //=> 4
i();
  //=> 2
i();
  //=> J
  
// ...
```

### map

Stateless mapping of an iterator to another iterator:

```javascript
var map = iterators.map;
    
var squares = map(numbers, function (n) { return n * n; });

squares();
  //=> 1
squares();
  //=> 4
squares();
  //=> 9
// ...
```

### accumulate

Accumulating an iterator to another iterator, a/k/a stateful mapping, with an optional seed:

```javascript
var accumulate = iterators.accumulate;
    
var runningTotal = accumulate(numbers, function (accumulation, n) { 
      return accumulation + n; 
    });

runningTotal();
  //=> 1
runningTotal();
  //=> 3
runningTotal();
  //=> 6
runningTotal();
  //=> 10
runningTotal();
  //=> 15
// ...

var runningTotal = accumulate(numbers, function (accumulation, n) { 
      return accumulation + n; 
    }, 5);

runningTotal();
  //=> 6
runningTotal();
  //=> 8
runningTotal();
  //=> 11
runningTotal();
  //=> 15
runningTotal();
  //=> 20
// ...
```

### accumulateWithReturn

This code transforms filters duplicates out of an iterator of numbers by turning them into "false." It consumes space proportional to the time it runs and the size of the set of possible numbers in its iterator.

```javascript
var accumulateWithReturn = iterators.accumulateWithReturn;
    
var randomNumbers = function () {
  return Math.floor(Math.random() * 10);
};

randomNumbers();
  //=> 7
randomNumbers();
  //=> 0
randomNumbers();
  //=> 1
randomNumbers();
  //=> 1
randomNumbers();
  //=> 6
// ...

var uniques = accumulateWithReturn(randomNumbers, function (alreadySeen, number) {
  var key = number.toString();
  
  if (alreadySeen[key]) {
    return [alreadySeen, false];
  }
  else {
    alreadySeen[key] = true;
    return [alreadySeen, number];
  }
}, {});

uniques();
  //=> 7
uniques();
  //=> 5
uniques();
  //=> 1
uniques();
  //=> false
uniques();
  //=> 9
uniques();
  //=> 4
uniques();
  //=> false
// ...
```

### select and reject

```javascript
var select = iterators.select,
    reject = iterators.reject;

function isEven (number) {
  return number === 0 || !isEven(number - 1);
};

var evens = select(randomNumbers, isEven);

evens();
  //=> 0
evens();
  //=> 6
evens();
  //=> 0
evens();
  //=> 2
evens();
  //=> 4
// ...

var odds = reject(randomNumbers, isEven);

odds();
  //=> 3
odds();
  //=> 1
odds();
  //=> 7
odds();
  //=> 9
odds();
  //=> 9
// ...
```

Note: `select` and `reject` will enter an "infinite loop" if the iterator does not terminate and also does not have any elements matching the condition.

### slice

```javascript
var slice = iterators.slice,
    numbers = unfold(1, function (n) { return n + 1; });

var i = slice(numbers, 3);

i();
  //=> 4
i();
  //=> 5
i();
  //=> 6

i = slice(numbers, 3, 2);

i();
  //=> 10
i();
  //=> 11
i();
  //=> undefined
```

### take

```javascript
var take = iterators.take,
    numbers = unfold(1, function (n) { return n + 1; });

var i = take(numbers);

i();
  //=> 1
i();
  //=> undefined

var i = take(numbers);

i();
  //=> 2
i();
  //=> undefined

var i = take(numbers, 3);

i();
  //=> 3
i();
  //=> 4
i();
  //=> 5
i();
  //=> undefined
// ...
```

### drop

```javascript
var drop = iterators.drop,
    numbers = unfold(1, function (n) { return n + 1; });

drop(numbers);

numbers();
  //=> 2
numbers();
  //=> 3
numbers();
  //=> 4

drop(numbers);

numbers();
  //=> 6
numbers();
  //=> 7

drop(numbers, 3);

numbers();
  //=> 11
numbers();
  //=> 12
// ...
```

## Trampolining

```
var trampoline = require('allong.es').allong.es.trampoline,
    tailCall = require('allong.es').allong.es.tailCall;
    
function factorial (n) {
  var _factorial = trampoline( function myself (acc, n) {
    return n > 0
      ? tailCall(myself, acc * n, n - 1)
      : acc
  });
  
  return _factorial(1, n);
};

factorial(10);
  //=> 3628800
```
