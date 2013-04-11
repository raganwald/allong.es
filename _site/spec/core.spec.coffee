# unary, binary, ternary, variadic, compose, sequence???
{defaults, mapWith, getWith, filterWith, compose, sequence, variadic, flip, curry} = require('../lib/allong.es.js').allong.es

echo = (a, b, c) -> "#{a} #{b} #{c}"
parenthesize = (a) -> "(#{a})"
square = (n) -> n * n
oddP = (n) -> !!(n % 2)

describe "defaults", ->
  
  it "should default values", ->
    expect( defaults(echo, 'c')('a', 'b') ).toEqual 'a b c'
    expect( defaults(echo, 'b', 'c')('a') ).toEqual 'a b c'
    expect( defaults(echo, 'a', 'b', 'c')() ).toEqual 'a b c'
  
  it "should ignore uneccesary defaults", ->
    expect( defaults(echo, 'a', 'b', 'c')('A') ).toEqual 'A b c'
    expect( defaults(echo, 'a', 'b', 'c')('A', 'B') ).toEqual 'A B c'
    expect( defaults(echo, 'a', 'b', 'c')('A', 'B', 'C') ).toEqual 'A B C'
    expect( defaults(echo, 'a', 'b', 'c')('A', 'B', 'C', 'D') ).toEqual 'A B C'
    
describe "mapWith", ->
  
  it "should map backwards", ->
    expect( mapWith(square, [1..5]) ).toEqual [1, 4, 9, 16, 25]
  
  it "should map backwards, curried", ->
    expect( mapWith(square)([1..5]) ).toEqual [1, 4, 9, 16, 25]
    
describe "filterWith", ->
  
  it "should filter backwards", ->
    expect( filterWith(oddP, [1..5]) ).toEqual [1, 3, 5]
  
  it "should filter backwards, curried", ->
    expect( filterWith(oddP)([1..5]) ).toEqual [1, 3, 5]

describe "compose", ->
  
  it "should compose two functions", ->
    expect( compose(parenthesize, parenthesize)('hello') ).toEqual '((hello))'
  
  it "should respect the arity of the first function", ->
    expect( compose(parenthesize, parenthesize).length ).toEqual 1
    expect( compose(echo, parenthesize).length ).toEqual 3
    
  it "should handle a common use case, pluckWith", ->
    myPluckWith = compose mapWith, getWith
    expect( myPluckWith('name')([{name: 'foo'}, {name: 'bar'}]) ).toEqual ['foo', 'bar']
    expect( myPluckWith('name', [{name: 'foo'}, {name: 'bar'}]) ).toEqual ['foo', 'bar']

describe "sequence", ->
  
  it "should sequence two functions", ->
    expect( sequence(parenthesize, parenthesize)('hello') ).toEqual '((hello))'
  
  it "should respect the arity of the first function", ->
    expect( sequence(parenthesize, parenthesize).length ).toEqual 1
    expect( sequence(parenthesize, echo).length ).toEqual 3
    
  it "should handle a common use case, pluckWith", ->
    myPluckWith = sequence getWith, mapWith
    expect( myPluckWith('name')([{name: 'foo'}, {name: 'bar'}]) ).toEqual ['foo', 'bar']
    expect( myPluckWith('name', [{name: 'foo'}, {name: 'bar'}]) ).toEqual ['foo', 'bar']
  
describe "flip", ->
  
  a = (a) -> [a]
  b = (a, b) -> [a, b]
  c = (a, b, c) -> [a, b, c]
  d = (a, b, c, d) -> [a, b, c, d]
  v = variadic( (x) -> x )
  
  it "should flip a unary function", ->
    expect( flip(a)(1) ).toEqual [1]
    
  it "should flip a binary function", ->
    expect( flip(b)(1, 2) ).toEqual [2, 1]
    
  it "should flip a ternary function", ->
    expect( flip(c)(1, 2, 3) ).toEqual [3, 2, 1]
    
  it "should flip a quaternary function", ->
    expect( flip(d)(1, 2, 3, 4) ).toEqual [4, 3, 2, 1]
    
  it "should flip a variadic function", ->
    expect( flip(v)(1, 2, 3, 4, 5) ).toEqual [5, 4, 3, 2, 1]
    
  it "should respect arities", ->
    expect( flip(v).length ).toEqual v.length
    expect( flip(a).length ).toEqual a.length
    expect( flip(b).length ).toEqual b.length
    expect( flip(c).length ).toEqual c.length
    
    # expect( flip(d).length ).toEqual d.length
    # NO; We do not guarantee arity for length > 3
    
  it 'should be self-currying', ->
    expect( flip(b)(1)(2) ).toEqual [2, 1]
    expect( flip(c)(1)(2)(3) ).toEqual [3, 2, 1]
    expect( flip(d)(1)(2)(3)(4) ).toEqual [4, 3, 2, 1]