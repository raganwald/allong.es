{sequence, maybe, andand, oror} = require('../lib/allong.es.js').allong.es

describe "Sequence Decorations", ->
  
  identity = (fn) -> fn
  identitywrapper = (fn) -> (value) -> fn(value)
  double = (n) -> n + n
  plusOne = (n) -> n + 1
  nothing = (x) ->
    
  describe "maybe", ->
    
    it "for a number", ->
      expect(
        sequence(
          maybe(
            double, 
            plusOne))(3)
      ).toEqual sequence(maybe(double), maybe(plusOne))(3)
      
    it "for a null", ->
      expect(
        sequence(
          maybe(
            double, 
            plusOne))(null)
      ).toEqual sequence(maybe(double), maybe(plusOne))(null)
      
    it "for undefined", ->
      expect(
        sequence(
          maybe(
            double, 
            plusOne))(undefined)
      ).toEqual sequence(maybe(double), maybe(plusOne))(undefined)
    
    it "should short-circuit", ->
      expect(
        sequence(
          maybe(
            double, 
            nothing,
            plusOne))(10)
      ).toEqual sequence(maybe(double), maybe(nothing), maybe(plusOne))(10)