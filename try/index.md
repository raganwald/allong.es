---
layout: default
title: try allong.es
---

### about this page

The code samples on this page are all editable and can be evaluated by pressing command-enter. Try playing with them. Each block of code is its own little environment, with the variable `allong.es` pre-defined as the `allong.es` library.

You can produce output with `console.log`, `alert`, or by inserting a comment that looks like this:

{% highlight javascript %}
2 + 2;
  //=>
{% endhighlight %}

(note: This page is a work in progress, some of the examples may not be fully operational yet).

---

## Currying and Partial Application

At the heart of `allong.es` are the functions that curry and partially apply other functions. The two most important to understand are `call` and `apply`. They work very much like the `.call` and `.apply` methods that every JavaScript function implements:

{% highlight javascript %}
var call = allong.es.call,
    apply = allong.es.apply;
    
function greet (how, whom) {
  return '' + how + ', ' + whom + '!';
};
  
call(greet, 'Hello', 'Tom')
  //=>
  
apply(greet, ['Hello', 'Tom'])
  //=>
{% endhighlight %}

Their "special sauce" is that they automatically *curry* the supplied function, so if you provide fewer or no arguments, you get back a partially applied or curried function:

{% highlight javascript %}
var call = allong.es.call,
    apply = allong.es.apply;
    
function greet (how, whom) {
  return '' + how + ', ' + whom + '!';
};
  
call(greet)('Hello')('Tom')
  //=>
  
call(greet, 'Hello')('Tom')
  //=>
  
apply(greet, [])('Hello')('Tom')
  //=>
  
apply(greet, ['Hello'])('Tom')
  //=>
{% endhighlight %}

### immediate application

If you don't want the currying/partial application behaviour, there is an immediate application version named (appropriately), `callNow` (and also another named `applyNow`, not shown):

{% highlight javascript %}
var callNow = allong.es.callNow;
    
function greet (how, whom) {
  return '' + how + ', ' + whom + '!';
};
  
callNow(greet, 'Hello', 'Tom')
  //=>
  
callNow(greet, 'Hello')
  //=>
{% endhighlight %}

### variations on the order of applying the arguments

`callRight` applies any arguments supplied to the right. If you supply all the arguments, it's the same as `call`, but if you supply fewer arguments, you get a right partial application:

{% highlight javascript %}
var callRight = allong.es.callRight;

function greet (how, whom) {
  return '' + how + ', ' + whom + '!';
};
  
callRight(greet, 'Hello', 'Tom')
  //=>
  
callRight(greet, 'Hello')('Tom')
  //=>
{% endhighlight %}

`callFlipped` applies the arguments backwards, even when curried:

{% highlight javascript %}
var callFlipped = allong.es.callFlipped;

function greet (how, whom) {
  return '' + how + ', ' + whom + '!';
};
  
callFlipped(greet, 'Hello', 'Tom')
  //=>
  
callFlipped(greet, 'Hello')('Tom')
  //=>
  
callFlipped(greet)('Hello')('Tom')
  //=>
{% endhighlight %}

### more partial application

`callLeft` is actually synonymous with `call`: It applies arguments given to the left. We've seen `callRight` above. Both are *variadic*: You can supply as many arguments as you want.

`callFirst` and `callLast` are just like `callLeft` and `callRight`, but they are *binary* functions: They accept a function and exactly one argument. This is sometimes useful when combining functions together.

`callFirst` and `callLast` both have "flipped and curried" versions (`callFirstWith` and `callLastWith`). `callLastWith` is especially useful for working with functions written in "collection - operation" style. Here we take advantage of the fact that they are "automatically curried" to implement the popular `pluck` function.

### currying

`allong.es` does support the `curry` function, it is implemented as the unary form of `call`:

{% highlight javascript %}
var call = allong.es.call,
    unary = allong.es.unary;

var curry = unary(call);
{% endhighlight %}

### with

`splat` was present in earlier versions of `allong.es` but has been deprecated as being too cryptic. Instead, there is a general naming convention that works as follows. Many binary functions such as `map` and `filter` are historically written to take a noun or collection as the first argument and a verb as the second.

However, reversing and currying these functions is super-useful as it makes composeable functions out of them. That's why `callFlipped` is so important. But to save you the trouble of writing `callFlipped map` everywhere, many such functions in `allong.es` have a clipped version pre-defined and named with the suffix `With`:

{% highlight javascript %}
// map(list, function)       <=> mapWith(function, list)
// filter(list, function)    <=> filterWith(function, list)
// get(object, propertyName) <=> getWith(propertyName, object)
// pluck(list, propertyName) <=> pluckWith(propertyName, list)
{% endhighlight %}

So you "map" a list, but "mapWith" a function. And of course, they are all curried. For example:

{% highlight javascript %}
// map(list)(function)       <=> mapWith(function)(list)
// deepMap(list)(function)   <=> deepMapWith(function)(list)
// filter(list)(function)    <=> filterWith(function)(list)
// get(object)(propertyName) <=> getWith(propertyName)(object)
// pluck(list)(propertyName) <=> pluckWith(propertyName)(list)
{% endhighlight %}

Thus if you have a collection such as:

{% highlight javascript %}
var users = [
  { name: 'Huey' },
  { name: 'Dewey' },
  { name: 'Louie' }
];
{% endhighlight %}

You can get the names with either:

{% highlight javascript %}
var pluck = allong.es.pluck;

var users = [
  { name: 'Huey' },
  { name: 'Dewey' },
  { name: 'Louie' }
];

pluck(users, 'name')
  //=>
{% endhighlight %}

Or:

{% highlight javascript %}
var pluckWith = allong.es.pluckWith;

var users = [
  { name: 'Huey' },
  { name: 'Dewey' },
  { name: 'Louie' }
];

pluckWith('name', users)
  //=>
{% endhighlight %}

The latter is interesting because `pluck` and `pluckWith` are both automatically curried (like almost everything that isn't named "now"). Thus, we could also write:

{% highlight javascript %}
var pluckWith = allong.es.pluckWith;

var users = [
  { name: 'Huey' },
  { name: 'Dewey' },
  { name: 'Louie' }
];

var namesOf = pluckWith('name');

// ...
namesOf(users)
  //=>
{% endhighlight %}

## Arity Function Decorators

### variadic

Makes a function into a variadic (accepts any number of arguments). The last named parameter will be given an array of arguments.

{% highlight javascript %}
var variadic = allong.es.variadic;

var fn = variadic(function (a) { return a })

fn()
  //=>
fn(1, 2, 3)
  //=>

fn = variadic(function (a,b) { return { a: a, b: b } })

fn()
  //=>
fn(1)
  //=>
fn(1,2,3)
  //=>
{% endhighlight %}

### variadic, part ii

When given just the function, `variadic` returns a function with an arity of zero. This is consistent with JavaScript programming practice. There are times when you wish to report an arity, meaning that you want the returned function to have its `length` getibute set.

You do this by prefacing the function argument with a length:

{% highlight javascript %}
var variadic = allong.es.variadic;

var fn = variadic(function (a, b) { return { a: a, b: b }; });
fn.length
  //=>

fn(1, 2, 3, 4, 5)
  //=>
  
var fn2 = variadic(3, function (a, b) { return { a: a, b: b }; }); 
fn2.length
  //=>

fn2(1, 2, 3, 4, 5)
  // TODO: Explain this result!
  //=>
{% endhighlight %}

### unary, binary, and ternary

Sometimes, you have a function that takes multiple arguments, but you only want it to accept one, or two, or maybe three arguments and ignore the rest. For example, `parseInt` takes a radix as an optional second parameter. And that is havoc if you try to use it with `Array.map`:

{% highlight javascript %}
['1', '2', '3', '4', '5'].map(parseInt)
  //=>
{% endhighlight %}

Use `unary(parseInt)` to solve the problem:

{% highlight javascript %}
var unary = allong.es.unary;

['1', '2', '3', '4', '5'].map(unary(parseInt))
  //=>
{% endhighlight %}

`binary` has similar uses when working with `Array.reduce` and its habit of passing three parameters to your supplied function.

## Miscellaneous Combinators

### get and getWith

{% highlight javascript %}
var get = allong.es.get,
    getWith = allong.es.getWith,
    map = allong.es.map;

var fruits = [
  { name: 'orange', colour: 'orange' },
  { name: 'banana', colour: 'yellow' }
];
    
get(fruits[0], 'colour')
  //=>

getWith('name', fruits[1])
  //=>
  
map(fruits, getWith('colour'))
  //=>
{% endhighlight %}

## Functional Composition

{% highlight javascript %}
var compose = allong.es.compose,
    sequence = allong.es.sequence,
    mapWith = allong.es.mapWith,
    getWith = allong.es.getWith;
    
var myPluckWith = compose(mapWith, getWith);

var fruits = [
  { name: 'orange', colour: 'orange' },
  { name: 'banana', colour: 'yellow' }
];

myPluckWith('name', fruits)
//=>
{% endhighlight %}

## List Combinators

### mapWith and deepMapWith

{% highlight javascript %}
var mapWith = allong.es.mapWith,
    deepMapWith = allong.es.deepMapWith;
    
var squareList = mapWith(function (x) { return x * x })

squareList([1, 2, 3, 4])
  //=>
  
var squareTree = deepMapWith(function (x) { return x * x })

squareTree([1, 2, [3, 4]])
  //=>
{% endhighlight %}

## Function/Method Decorators

### maybe

{% highlight javascript %}
var maybe = allong.es.maybe;
    
var safeFirst = maybe(function (arr) { return arr[0] })

safeFirst([1, 2, 3])
  //=>
safeFirst(null)
  //=>
{% endhighlight %}

### tap

{% highlight javascript %}
var tap = allong.es.tap,
    send = allong.es.send;
    
tap([1, 2, 3, 4, 5], send('pop'))
  //=>
{% endhighlight %}

### fluent

{% highlight javascript %}
var fluent = allong.es.fluent;
    
Role = function () {};

Role.prototype.set = fluent( function (property, name) { 
  this[property] = name 
});

var doomed = new Role()
  .set('name', "Fredo")
  .set('relationship', 'brother')
  .set('parts', ['I', 'II']);
  
doomed
  //=>
{% endhighlight %}

### once

{% highlight javascript %}
var once = allong.es.once;
    
var message = once( function () { return "Hello, it's me"; });

message()
  //=>
message()
  //=>
message()
  //=>
message()
  //=>
{% endhighlight %}

## Decorating Classes/Constructors

{% highlight javascript %}
var mixin = allong.es.mixin,
    classDecorator = allong.es.classDecorator;
    
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
  //=>
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
  //=>
  //     done: false,
  //     colourCode: { r: 0, g: 255, b: 0 } }
{% endhighlight %}

Note: `classDecorator` works with JavaScript constructors that have a default implementation (they work properly with no arguments), and are new-agnostic (they can be called with new or as a normal function). `Todo` above has both properties.

## Functional Iterators

Functional iterators are stateful functions that "iterate over" the values in some ordered data set. You call the iterator repeatedly to obtain the values, and it will either never stop returning values (an infinite data set) or return `undefined` when there are no more values to return.

The functional iterators utilities are all namespaced:

{% highlight javascript %}
var iterators = allong.es.iterators;
{% endhighlight %}

### FlatArrayIterator and RecursiveArrayIterator

Making functional iterators from arrays:

{% highlight javascript %}
var FlatArrayIterator = iterators.FlatArrayIterator,
    RecursiveArrayIterator = iterators.RecursiveArrayIterator;
    
var i = FlatArrayIterator([1, 2, 3, 4, 5]);

i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
    
var i = FlatArrayIterator([1, [2, 3, 4], 5]);

i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
    
var i = RecursiveArrayIterator([1, [2, 3, 4], 5]);

i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
{% endhighlight %}

### range and numbers

{% highlight javascript %}
var range = iterators.range,
    numbers = iterators.numbers;

var i = range(1, 5);

i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>

var i = range(1, 5, 2);

i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>

var i = range(5, 1);

i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>

var i = range(1);

i();
  //=>
i();
  //=>
i();
  //=>
// ...

var i = numbers();

i();
  //=>
i();
  //=>
i();
  //=>
// ...

var i = numbers(0);

i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
// ...
{% endhighlight %}

### unfold and unfoldWithReturn

Unfold makes an iterator out of a seed by successively applying a function to the seed value. Here's an example duplicating the "numbers" feature:

{% highlight javascript %}
var unfold = iterators.unfold,
    unfoldWithReturn = iterators.unfoldWithReturn;
    
var i = unfold(1, function (n) { return n + 1; });

i();
  //=>
i();
  //=>
i();
  //=>
// ...
    
var i = unfoldWithReturn(1, function (n) { 
  return [n + 1, n + n]; 
});

i();
  //=>
i();
  //=>
i();
  //=>
// ...
{% endhighlight %}

A richer example of `unfoldWithReturn`:

{% highlight javascript %}
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
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
  
// ...
{% endhighlight %}

### map

Stateless mapping of an iterator to another iterator:

{% highlight javascript %}
var map = iterators.map;
    
var squares = map(numbers, function (n) { return n * n; });

squares();
  //=>
squares();
  //=>
squares();
  //=>
// ...
{% endhighlight %}

### accumulate

Accumulating an iterator to another iterator, a/k/a stateful mapping, with an optional seed:

{% highlight javascript %}
var accumulate = iterators.accumulate;
    
var runningTotal = accumulate(numbers, function (accumulation, n) { 
      return accumulation + n; 
    });

runningTotal();
  //=>
runningTotal();
  //=>
runningTotal();
  //=>
runningTotal();
  //=>
runningTotal();
  //=>
// ...

var runningTotal = accumulate(numbers, function (accumulation, n) { 
      return accumulation + n; 
    }, 5);

runningTotal();
  //=>
runningTotal();
  //=>
runningTotal();
  //=>
runningTotal();
  //=>
runningTotal();
  //=>
// ...
{% endhighlight %}

### accumulateWithReturn

This code transforms filters duplicates out of an iterator of numbers by turning them into "false." It consumes space proportional to the time it runs and the size of the set of possible numbers in its iterator.

{% highlight javascript %}
var accumulateWithReturn = iterators.accumulateWithReturn;
    
var randomNumbers = function () {
  return Math.floor(Math.random() * 10);
};

randomNumbers();
  //=>
randomNumbers();
  //=>
randomNumbers();
  //=>
randomNumbers();
  //=>
randomNumbers();
  //=>
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
  //=>
uniques();
  //=>
uniques();
  //=>
uniques();
  //=>
uniques();
  //=>
uniques();
  //=>
uniques();
  //=>
// ...
{% endhighlight %}

### select and reject

{% highlight javascript %}
var select = iterators.select,
    reject = iterators.reject;

function isEven (number) {
  return number === 0 || !isEven(number - 1);
};

var evens = select(randomNumbers, isEven);

evens();
  //=>
evens();
  //=>
evens();
  //=>
evens();
  //=>
evens();
  //=>
// ...

var odds = reject(randomNumbers, isEven);

odds();
  //=>
odds();
  //=>
odds();
  //=>
odds();
  //=>
odds();
  //=>
// ...
{% endhighlight %}

Note: `select` and `reject` will enter an "infinite loop" if the iterator does not terminate and also does not have any elements matching the condition.

### slice

{% highlight javascript %}
var slice = iterators.slice,
    numbers = unfold(1, function (n) { return n + 1; });

var i = slice(numbers, 3);

i();
  //=>
i();
  //=>
i();
  //=>

i = slice(numbers, 3, 2);

i();
  //=>
i();
  //=>
i();
  //=>
{% endhighlight %}

### take

{% highlight javascript %}
var take = iterators.take,
    numbers = unfold(1, function (n) { return n + 1; });

var i = take(numbers);

i();
  //=>
i();
  //=>

var i = take(numbers);

i();
  //=>
i();
  //=>

var i = take(numbers, 3);

i();
  //=>
i();
  //=>
i();
  //=>
i();
  //=>
// ...
{% endhighlight %}

### drop

{% highlight javascript %}
var drop = iterators.drop,
    numbers = unfold(1, function (n) { return n + 1; });

drop(numbers);

numbers();
  //=>
numbers();
  //=>
numbers();
  //=>

drop(numbers);

numbers();
  //=>
numbers();
  //=>

drop(numbers, 3);

numbers();
  //=>
numbers();
  //=>
// ...
{% endhighlight %}

## Trampolining

{% highlight javascript %}
var trampoline = allong.es.trampoline,
    tailCall = allong.es.tailCall;
    
function factorial (n) {
  var _factorial = trampoline( function myself (acc, n) {
    return n > 0
      ? tailCall(myself, acc * n, n - 1)
      : acc
  });
  
  return _factorial(1, n);
};

factorial(10);
  //=>
{% endhighlight %}