{Sequence, Sequence: {sequence}} = require('../lib/allong.es.js').allong.es

double = (n) -> n + n
plusOne = (n) -> n + 1
  
describe "sequence", ->

  it "should be a thing", ->
    expect( sequence ).not.toBeNull()
    
  it "should return a function when given a function", ->
    expect( sequence(double) ).not.toBeNull()
  
  it "should sequence a single function", ->
    expect( sequence(double)(3) ).toEqual 6
  
  it "should sequence two functions", ->
    expect( sequence(double, plusOne)(3) ).toEqual 7
    
describe "Identity", ->
  
  it "should sequence a single function", ->
    expect( sequence(Sequence.Identity, double)(3) ).toEqual 6
  
  it "should sequence two functions", ->
    expect( sequence(Sequence.Identity, double, plusOne)(3) ).toEqual 7
    
describe "Maybe", ->
  
  it "should pass numbers through", ->
    expect( sequence(Sequence.Maybe, double, plusOne)(3) ).toEqual 7
  
  it "should pass null through", ->
    expect( sequence(Sequence.Maybe, double, plusOne)(null) ).toBeNull()
  
  it "should pass undefined through", ->
    expect( sequence(Sequence.Maybe, double, plusOne)(undefined) ).toBeUndefined()
    
  it "should short-circuit", ->
    expect( sequence(Sequence.Maybe, double, ((x) ->), plusOne)(undefined) ).toBeUndefined()
      
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
    expect( sequence(Sequence.Writer, parity, space, size)(5) ).toEqual [5, 'odd small']
    
describe 'List', ->
  
  oneToN = (n) ->
    [1..n]
  
  nToOne = (n) ->
    [n..1]
    
  it "should handle two levels of lists", ->
    expect( sequence(Sequence.List, oneToN, nToOne)(3) ).toEqual [1, 2, 1, 3, 2, 1]
      