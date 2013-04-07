{unvariadic, variadic} = require '../lib/allong.es'

numberOfArgs = -> arguments.length
threeArguments = (a, b, c) -> arguments.length

describe "unvariadic", ->
  
  it "should clip arguments", ->
    expect( unvariadic(3, numberOfArgs)(1, 2, 3, 4, 5) ).toEqual threeArguments(1, 2, 3, 4, 5)
    
  it "shouldn't pad arguments", ->
    expect( unvariadic(3, numberOfArgs)(1) ).toEqual threeArguments(1)
    
describe "variadc", ->
  
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