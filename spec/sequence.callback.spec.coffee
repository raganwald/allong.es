{sequence, sequence: {Identity, Maybe, Writer, List, Then, Callback}} = require('../lib/allong.es.js').allong.es

describe "Sequence", ->
      
  describe "Callback", ->
    
    identity = (v) -> v
      
    describe "with one parameter", ->

      double = (v, c) -> c(v * 2)
      plus1 = (v, c) -> c(v + 1)
  
      it "should work for a double", ->
    
        expect( sequence(Callback, double)(42, identity) ).toBe 84
  
      it "should work for a double double", ->
    
        expect( sequence(Callback, double, double)(2, identity) ).toBe 8
  
      it "should work for a double plus1 double", ->
    
        expect( sequence(Callback, double, plus1, double)(2, identity) ).toBe 10
        
    describe "with multiple parameters", ->
      
      argsToArray = (args..., callback) ->
        callback(args)
      
      argsToArgs = (args..., callback) ->
        callback(args...)
      
      it "should work for a singleton", ->
        expect( sequence(Callback, argsToArgs, argsToArray)(1, identity) ).toEqual [1]
      
      it "should work for a doubleton", ->
        expect( sequence(Callback, argsToArgs, argsToArray)(1, 2, identity) ).toEqual [1, 2]