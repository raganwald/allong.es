You really should be looking at the [allong.es home page](http://allong.es). Or the [source code](https://github.com/allong-es/allong-es.github.com/blob/master/lib/allong.es.js). But here's a quick cheat sheet:

### variadic

Makes a function into a variadic (accepts any number of arguments). The last named parameter will be given an array of argument, e.g.

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


