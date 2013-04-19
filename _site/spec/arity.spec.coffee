{unvariadic, variadic, curry} = require('../lib/allong.es.js').allong.es

numberOfArgs = -> arguments.length
threeArguments = (a, b, c) -> arguments.length

describe "unvariadic", ->
  
  it "should clip arguments", ->
    expect( unvariadic(3, numberOfArgs)(1, 2, 3, 4, 5) ).toEqual threeArguments(1, 2, 3, 4, 5)
    
  it "shouldn't pad arguments", ->
    expect( unvariadic(3, numberOfArgs)(1) ).toEqual threeArguments(1)
    
describe "variadic", ->
  
  describe "with an arity", ->
    
    one = (args) -> [args]
    
    two = (arg, args) -> [arg, args]
    
    onev = (args...) -> [args]
    
    twov = (arg, args...) -> [arg, args]
    
    it 'should 1', ->
      expect( variadic(1, one)(1, 2, 3) ).toEqual onev(1, 2, 3)
    
    it 'should 2', ->
      expect( variadic(1, one).length ).toEqual 1
    
    it 'should 3', ->
      expect( variadic(2, one).length ).toEqual 2

describe "curry", ->
  
  three = (a, b, c) -> [a, b, c]
  
  it "should be a function that returns a function", ->
    expect( curry instanceof Function).toEqual true
    expect( curry(three) instanceof Function).toEqual true
  
  it "should allow a full invocation", ->
    expect( curry(three)(1, 2, 3) ).toEqual [1, 2, 3]
  
  it "should allow partial invocation", ->
    expect( curry(three)(1)(2, 3) ).toEqual [1, 2, 3]
    expect( curry(three)()(1, 2, 3) ).toEqual [1, 2, 3]
    expect( curry(three)(1)(2)(3) ).toEqual [1, 2, 3]
    expect( curry(three)(1, 2)(3) ).toEqual [1, 2, 3]
    
    # describe "self-currying", ->
    #   
    #   it "shouldn't affect normal useage", ->
    #     expect(selfCurrying(three)(4, 5, 6)).toEqual three(4, 5, 6)
    #     expect(selfCurrying(three)(4, 5)).toEqual three(4, 5)
    #     expect(selfCurrying(three)(4)).toEqual three(4)
    #   
    #   it "should curry with no arguments", ->
    # expect( selfCurrying(three)()(1)(2, 3) ).toEqual [1, 2, 3]
    # expect( selfCurrying(three)()()(1, 2, 3) ).toEqual [1, 2, 3]
    # expect( selfCurrying(three)()(1)(2)(3) ).toEqual [1, 2, 3]
    # expect( selfCurrying(three)()(1, 2)(3) ).toEqual [1, 2, 3]
