Promise = require 'promise'
{Supervisor, Supervisor: {sequence}} = require('../lib/allong.es.js').allong.es

describe "sequence", ->
    
  double = (value) ->
    new Promise (resolve, reject) ->
      resolve(value * 2)
      
  success = undefined
  failure = undefined
      
  beforeEach ->
      
    success = undefined
    failure = undefined
  
  describe "for a doubling promise", ->
  
    it "should work asynchronously", (done) ->
      
      sequencedPromise = sequence(Supervisor.Promise, double)(3)
            
      sequencedPromise.then ((value) ->
        success = value
        done()),
          ((reason) ->
            failure = reason
            done())
            
    afterEach ->    
      expect( success ).toEqual 6
      expect( failure ).toBeUndefined()
  
  describe "for a double double", ->
  
    it "should work asynchronously", (done) ->
      
      sequencedPromise = sequence(Supervisor.Promise, double, double)(2)
            
      sequencedPromise.then ((value) ->
        success = value
        done()),
          ((reason) ->
            failure = reason
            done())
            
    afterEach ->    
      expect( success ).toEqual 8
      expect( failure ).toBeUndefined()
  
  describe "for a double fail double", ->
  
    it "should fail forward", (done) ->
      
      failer = (value) ->
        new Promise (resolve, reject) ->
          reject 'sorry, old chap'
      
      sequencedPromise = sequence(Supervisor.Promise, double, failer, double)(2)
            
      sequencedPromise.then( ((value) ->
        success = value
        done()),
          ((reason) ->
            failure = reason
            done()))
            
    afterEach ->    
      expect( success ).toBeUndefined()
      expect( failure ).toBe 'sorry, old chap'
      