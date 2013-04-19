{ callRight, applyNow, callNow, applyNowFlipped, 
  call, applyLeftNow, callLeftNow, args, applyLeftNowWith,
  applyRightNow, callRightNow, applyRightNowWith,
  callFirst, callFirstWith, callLast, callLastWith, apply
} = require('../lib/allong.es.js').allong.es

echo = (a, b, c) -> "#{a} #{b} #{c}"

five = (a, b, c, d, e) -> [a, b, c, d, e]
three = (a, b, c) -> [a, b, c]
twelve = (a, b, c, d, e, f, g, h, i, j, k, l) ->
vari = (args...) -> args
one = (x) -> x

describe "apply", ->
  
  it "should apply an array of arguments to a function", ->
    expect( apply(three, [1, 2, 3]) ).toEqual three(1, 2, 3)
    
  it "should be curried", ->
    expect( apply(three)([1, 2, 3]) ).toEqual three(1, 2, 3)
    
  it "should  be self-currying, it should apply what it gets", ->
    expect( apply(three, [1, 2])(3) ).toEqual three(1, 2, 3)

describe "applyNow", ->
  
  it "should apply an array of arguments to a function", ->
    expect( applyNow(three, [1, 2, 3]) ).toEqual three(1, 2, 3)
    
  it "should not be self-currying, it should apply what it gets", ->
    expect( applyNow(three, [1, 2]) ).toEqual three(1, 2)
    expect( applyNow(three, [1]) ).toEqual three(1)
    
  it "should be curried", ->
    expect( applyNow(three)([1, 2, 3]) ).toEqual three(1, 2, 3)
    
  describe "when flipped", ->
    
    it "should apply an array of arguments to a function", ->
      expect( applyNowFlipped([1, 2, 3], three) ).toEqual three(1, 2, 3)

    it "should be curried", ->
      expect( applyNowFlipped([1, 2, 3])(three) ).toEqual three(1, 2, 3)

describe "callNow", ->
  
  it "should apply arguments to a function", ->
    expect( callNow(three, 1, 2, 3) ).toEqual three(1, 2, 3)
    
  it "should not be self-currying, it should apply what it gets", ->
    expect( callNow(three, 1, 2) ).toEqual three(1, 2)
    expect( callNow(three, 1) ).toEqual three(1)
    
  it "should not be curried", ->
    expect( callNow(three) ).toEqual three()
    
  # variadic functions do not have a 'this' predefined at this point.
    
describe "applyLeftNow", ->
  
  it 'should apply all the arguments if possible', ->
    expect( applyLeftNow(three, [1, 2, 3]) ).toEqual three(1, 2, 3)
    
  it 'should not be full application', ->
    expect( applyLeftNow(three, [1, 2]) ).not.toEqual three(1, 2)
    expect( applyLeftNow(three, [1, 2])(3) ).toEqual three(1, 2, 3)
    
  it 'should not be fully curried', ->
    expect( applyLeftNow(three, [1])(2) ).toEqual three(1, 2)
    
  describe "when flipped", ->
  
    it 'should apply all the arguments if possible', ->
      expect( applyLeftNowWith([1, 2, 3], three) ).toEqual three(1, 2, 3)
    
    it 'should not be full application', ->
      expect( applyLeftNowWith([1, 2], three) ).not.toEqual three(1, 2)
      expect( applyLeftNowWith([1, 2], three)(3) ).toEqual three(1, 2, 3)
    
    it 'should not be fully curried', ->
      expect( applyLeftNowWith([1], three)(2) ).toEqual three(1, 2)
    
describe "callLeftNow", ->
  
  it 'should apply all the arguments if possible', ->
    expect( callLeftNow(three, 1, 2, 3) ).toEqual three(1, 2, 3)
    
  it 'should not be full application', ->
    expect( callLeftNow(three, 1, 2) ).not.toEqual three(1, 2)
    expect( callLeftNow(three, 1, 2)(3) ).toEqual three(1, 2, 3)
    
  it 'should not be fully curried', ->
    expect( callLeftNow(three, 1)(2) ).toEqual three(1, 2)

describe "applyRightNow", ->
  
  it 'should apply all the arguments if possible', ->
    expect( applyRightNow(three, [1, 2, 3]) ).toEqual three(1, 2, 3)
    
  it 'should not be full application', ->
    expect( applyRightNow(three, [1, 2]) ).not.toEqual three(1, 2)
    expect( applyRightNow(three, [1, 2])(3) ).toEqual three(3, 1, 2)
    
  it 'should not be fully curried', ->
    expect( applyRightNow(three, [1])(2) ).toEqual three(2, 1)
    
  describe "when flipped", ->
  
    it 'should apply all the arguments if possible', ->
      expect( applyRightNowWith([1, 2, 3], three) ).toEqual three(1, 2, 3)
    
    it 'should not be full application', ->
      expect( applyRightNowWith([1, 2], three) ).not.toEqual three(1, 2)
      expect( applyRightNowWith([1, 2], three)(3) ).toEqual three(3, 1, 2)
    
    it 'should not be fully curried', ->
      expect( applyRightNowWith([1], three)(2) ).toEqual three(2, 1)
    
describe "callRightNow", ->
  
  it 'should apply all the arguments if possible', ->
    expect( callRightNow(three, 1, 2, 3) ).toEqual three(1, 2, 3)
    
  it 'should not be full application', ->
    expect( callRightNow(three, 1, 2) ).not.toEqual three(1, 2)
    expect( callRightNow(three, 1, 2)(3) ).toEqual three(3, 1, 2)
    
  it 'should not be fully curried', ->
    expect( callRightNow(three, 1)(2) ).toEqual three(2, 1)
    
################################

describe "call", ->
  
  it "should call an array of arguments to a function", ->
    expect( call(echo, 1, 2, 3) ).toEqual "1 2 3"
  
  it "should have a curried nature", ->
    expect( call(five)(1, 2, 3, 4, 5) ).toEqual [1..5]
    expect( call(five)(1, 2, 3)(4, 5) ).toEqual [1..5]
    expect( call(five, 1, 2, 3)(4, 5) ).toEqual [1..5]
    expect( call(five, 1, 2, 3)(4)(5) ).toEqual [1..5]
    
  it "should get the arity right for small amounts", ->
    expect( call(five, 1, 2).length ).toEqual 3

describe "callRight", ->
  
  it "should call an array of arguments to a function", ->
    expect( callRight(echo, 1, 2, 3) ).toEqual "1 2 3"
  
  it "should have a curried nature", ->
    expect( callRight(five)(1, 2, 3, 4, 5) ).toEqual [1..5]
    expect( callRight(five)(1, 2, 3)(4, 5) ).toEqual [1..5]
    
  it "should apply given arguments to the right", ->
    expect( callRight(five, 1)(2, 3, 4, 5) ).toEqual [2, 3, 4, 5, 1]
    expect( callRight(five, 1, 2)(3, 4, 5) ).toEqual [3, 4, 5, 1, 2]
    expect( callRight(five, 1, 2, 3)(4, 5) ).toEqual [4, 5, 1, 2, 3]
    expect( callRight(five, 1, 2, 3, 4)(5) ).toEqual [5, 1, 2, 3, 4]
    expect( callRight(five, 1, 2, 3)(4, 5) ).toEqual [4, 5, 1, 2, 3]
    expect( callRight(five, 1, 2, 3)(4)(5) ).toEqual [4, 5, 1, 2, 3]
    
  it "should get the arity right for small amounts", ->
    expect( callRight(five, 1, 2).length ).toEqual 3
    
describe 'callFirst', ->
  
  it 'should call with the first argument', ->
    expect( callFirst(three, 1)(2, 3) ).toEqual [1..3]
    
  it 'should get the arity right', ->
    expect( callFirst.length ).toEqual 2
    expect( callFirst(three, 1).length ).toEqual 2
    
  it 'should be curried', ->
    expect( callFirst(three)(1)(2, 3) ).toEqual [1..3]
    
describe 'callFirstWith', ->
  
  it 'should call with the first argument', ->
    expect( callFirstWith(1, three)(2, 3) ).toEqual [1..3]
    
  it 'should get the arity right', ->
    expect( callFirstWith.length ).toEqual 2
    expect( callFirstWith(1, three).length ).toEqual 2
    
  it 'should be curried', ->
    expect( callFirstWith(1)(three)(2, 3) ).toEqual [1..3]
    
describe "args", ->
  
  it "should collect arguments into an array", ->
    expect( args(3)(1, 2, 3) ).toEqual [1, 2, 3]