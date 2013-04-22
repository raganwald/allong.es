{mapArgumentsWith, variadic, maybe} = require('../lib/allong.es').allong.es

myArgs = variadic (a) -> a 
double = (n) -> n * 2
plus1 = (n) -> n + 1

describe "mapArgumentsWith", ->
  
  it "should map some simple integers", ->
    expect( mapArgumentsWith(double, myArgs)(1, 2, 3) ).toEqual [2, 4, 6]
    
  it "should curry", ->
    expect( mapArgumentsWith(double)(myArgs)(1, 2, 3) ).toEqual [2, 4, 6]
    
  it "should construct nice decorators", ->
    doubleYourArguments = mapArgumentsWith(double)
    expect( (doubleYourArguments myArgs)(1, 2, 3) ).toEqual [2, 4, 6]
    
describe "self-mapping", ->
  
  describe "maybe", ->
    
    it "should return a function for a function", ->
      expect( maybe(double)(2) ).toEqual 4
      expect( maybe(double)(undefined) ).toBeUndefined()
      
    it "should return an array for multiple items", ->
      expect( maybe(double, plus1)[0](4) ).toEqual 8
      expect( maybe(double, plus1)[0](undefined) ).toBeUndefined()
      expect( maybe(double, plus1)[1](4) ).toEqual 5
      expect( maybe(double, plus1)[1](undefined) ).toBeUndefined()
  
  