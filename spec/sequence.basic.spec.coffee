{Sequence} = require('../lib/allong.es.js').allong.es

double = (n) -> n + n
plusOne = (n) -> n + 1
  
describe "Sequence", ->

  it "should be a thing", ->
    expect( Sequence ).not.toBeNull()
    
  it "should return a function when given a function", ->
    expect( Sequence.begin(double) ).not.toBeNull()
  
  it "should do a single function", ->
    expect( Sequence.begin(double)(3) ).toEqual 6
  
  it "should do two functions", ->
    expect( Sequence.begin(double, plusOne)(3) ).toEqual 7
    
  describe "Identity", ->
    
    it "should be a thing", ->
      console.log('Sequence.Identity', Sequence.Identity)
      expect( Sequence.Identity ).not.toBeNull()
    
    
  
    it "should do a single function", ->
      expect( Sequence.begin(Sequence.Identity, double)(3) ).toEqual 6
  
    it "should do two functions", ->
      expect( Sequence.begin(Sequence.Identity, double, plusOne)(3) ).toEqual 7
    
  describe "Maybe", ->
  
    it "should pass numbers through", ->
      expect( Sequence.begin(Sequence.Maybe, double, plusOne)(3) ).toEqual 7
  
    it "should pass null through", ->
      expect( Sequence.begin(Sequence.Maybe, double, plusOne)(null) ).toBeNull()
  
    it "should pass undefined through", ->
      expect( Sequence.begin(Sequence.Maybe, double, plusOne)(undefined) ).toBeUndefined()
    
    it "should short-circuit", ->
      expect( Sequence.begin(Sequence.Maybe, double, ((x) ->), plusOne)(undefined) ).toBeUndefined()
      
  describe "Writer", ->
  
    parity = (n) ->
      [
        n
        if n % 2 is 0 then 'even' else 'odd'
      ]
    
    space = (n) ->
      [
        n
        ' '
      ]
    
    size = (n) ->
      [
        n
        if n < 10 then 'small' else 'normal'
      ]
  
    it "should accumulate writes", ->
      expect( Sequence.begin(Sequence.Writer, parity, space, size)(5) ).toEqual [5, 'odd small']
    
  describe 'List', ->
  
    oneToN = (n) ->
      [1..n]
  
    nToOne = (n) ->
      [n..1]
    
    it "should handle two levels of lists", ->
      expect( Sequence.begin(Sequence.List, oneToN, nToOne)(3) ).toEqual [1, 2, 1, 3, 2, 1]
      