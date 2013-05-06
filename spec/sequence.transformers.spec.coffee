Promise = require 'promise'

{sequence, sequence: {Then, Callback, fn2Then, fn2Callback, callback2Then, then2Callback}} = require('../lib/allong.es.js').allong.es

describe "fn2Then", ->
  
  plus1 = (value) -> value + 1
    
  double = (value) ->
    new Promise (resolve, reject) ->
      resolve(value * 2)
      
  success = undefined
  failure = undefined
      
  beforeEach ->
      
    success = undefined
    failure = undefined
  
  describe "for a single function", ->
  
    it "should work ", (done) ->
      
      sequencedPromise = sequence(Then,
        double,
        fn2Then(plus1),
        double
      )(1)
            
      sequencedPromise.then ((value) ->
        success = value
        done()),
          ((reason) ->
            failure = reason
            done())
            
    afterEach ->    
      expect( success ).toEqual 6
      expect( failure ).toBeUndefined()

describe "callback2Then", ->
  
  plus1 = (value, callback) ->
    callback(value + 1)
    
  double = (value) ->
    new Promise (resolve, reject) ->
      resolve(value * 2)
      
  success = undefined
  failure = undefined
      
  beforeEach ->
      
    success = undefined
    failure = undefined
  
  describe "for a single function", ->
  
    it "should work ", (done) ->
      
      sequencedPromise = sequence(Then,
        double,
        callback2Then(plus1),
        double
      )(1)
            
      sequencedPromise.then ((value) ->
        success = value
        done()),
          ((reason) ->
            failure = reason
            done())
            
    afterEach ->    
      expect( success ).toEqual 6
      expect( failure ).toBeUndefined()

describe "fn2Callback", ->
  
  plus1 = (value) -> value + 1
    
  double = (value, callback) ->
    callback(value * 2)
    
  identity = (n) -> n
  
  it "should work for a double plus1 double", ->

    expect(
      sequence(Callback, 
        double, 
        fn2Callback(plus1), 
        double
      )(2, identity) ).toBe 10

describe "then2Callback", ->
  
  plus1 = (value) ->
    new Promise (resolve, reject) ->
      resolve(value + 1)
    
  double = (value, callback) ->
    callback(value * 2)
    
  identity = (n) -> n
      
  success = undefined
  failure = undefined
      
  beforeEach ->
      
    success = undefined
    failure = undefined
  
  describe "for a single function", ->
  
    it "should work ", (done) ->

      sequence(Callback, 
        double, 
        then2Callback(plus1), 
        double
      )(2, (value) -> 
        success = value
        done())
            
    afterEach ->    
      expect( success ).toEqual 10
      expect( failure ).toBeUndefined()