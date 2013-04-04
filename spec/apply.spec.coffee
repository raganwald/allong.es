{ callLeft, callFirst, apply, call, curry, unvariadic, args, sequence, applyThis, callThisFirst } = require '../lib/allong.es.js'

echo = (a, b, c) -> "#{a} #{b} #{c}"

five = (a, b, c, d, e) -> [a, b, c, d, e]
three = (a, b, c) -> [a, b, c]
vari = (args...) -> args

# unvariadic and apply duplicate each other's functionality

describe "unvariadic", ->
  
  it "should unvariadic an array of arguments to a function", ->
    expect( unvariadic(echo)([1, 2, 3]) ).toEqual "1 2 3"

describe "apply", ->
  
  it "should apply an array of arguments to a function", ->
    expect( apply(echo, [1, 2, 3]) ).toEqual "1 2 3"
    
  it "should apply an array of arguments immediately to a nullary function", ->
    expect( apply(vari, [4..6]) ).toEqual [4..6]
    
# Curry and call duplicate each other's functionality

describe "curry", ->
  
  describe "when given a ternary function", ->
  
    it "should call aggregate arguments", ->
      expect( curry(echo)(1)(2)(3) ).toEqual "1 2 3"
      expect( curry(echo)(1, 2)(3) ).toEqual "1 2 3"
      expect( curry(echo)(1)(2, 3) ).toEqual "1 2 3"
      expect( curry(echo)(1, 2, 3) ).toEqual "1 2 3"
    
    it "should have the correct arity", ->
      expect( curry(three).length ).toEqual 3
      expect( curry(three)(1).length ).toEqual 2
      expect( curry(three)(1, 2).length ).toEqual 1
      expect( curry(three)(1)(2).length ).toEqual 1
  
  describe "when given a pentary function", ->
    
    it "should have the correct arity", ->
      expect( curry(five)('x', 'y').length ).toEqual 3
      expect( curry(five)('x', 'y')(1).length ).toEqual 2
      expect( curry(five)('x', 'y')(1, 2).length ).toEqual 1
      expect( curry(five)('x', 'y')(1)(2).length ).toEqual 1

describe "call", ->
  
  it "should call an array of arguments to a function", ->
    expect( call(echo, 1, 2, 3) ).toEqual "1 2 3"
    
describe "args", ->
  
  it "should collect arguments into an array", ->
    expect( args(3)(1, 2, 3) ).toEqual [1, 2, 3]

describe 'callLeft', ->
  
  it "should have a curried nature", ->
    expect( callLeft(five)(1, 2, 3, 4, 5) ).toEqual [1..5]
    expect( callLeft(five)(1, 2, 3)(4, 5) ).toEqual [1..5]
    expect( callLeft(five, 1, 2, 3)(4, 5) ).toEqual [1..5]
    expect( callLeft(five, 1, 2, 3)(4)(5) ).toEqual [1..5]
    
  it "should get the arity right for small amounts", ->
    expect( callLeft(five, 1, 2).length ).toEqual 3
    
describe 'callFirst', ->
  
  it 'should call with the first argument', ->
    expect( callFirst(three, 1)(2, 3) ).toEqual [1..3]
    
  it 'should get the arity right', ->
    expect( callFirst.length ).toEqual 2
    expect( callFirst(three, 1).length ).toEqual 2
    
  it 'should be curried', ->
    expect( callFirst(three)(1)(2, 3) ).toEqual [1..3]
    
describe 'callThisFirst', ->
  
  it 'should call with the first argument', ->
    expect( callThisFirst(1, three)(2, 3) ).toEqual [1..3]
    
  it 'should get the arity right', ->
    expect( callThisFirst.length ).toEqual 2
    expect( callThisFirst(1, three).length ).toEqual 2
    
  it 'should be curried', ->
    expect( callThisFirst(1)(three)(2, 3) ).toEqual [1..3]