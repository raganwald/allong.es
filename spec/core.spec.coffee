# unary, binary, ternary, variadic, compose, sequence???
{defaults, mapWith, filterWith} = require '../lib/allong.es.js'

echo = (a, b, c) -> "#{a} #{b} #{c}"
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

