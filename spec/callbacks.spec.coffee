{Sequence} = require('../lib/allong.es.js').allong.es

double = (v, c) -> c(v * 2)
plus1 = (v, c) -> c(v + 1)
identity = (v) -> v

describe "continuation", ->
  
  it "should work for the null do", ->
    
    expect( Sequence.begin(Sequence.Callback)(42)(identity) ).toBe 42
  
  it "should work for a double", ->
    
    expect( Sequence.begin(Sequence.Callback, double)(42)(identity) ).toBe 84
  
  it "should work for a double double", ->
    
    expect( Sequence.begin(Sequence.Callback, double, double)(2)(identity) ).toBe 8
  
  it "should work for a double plus1 double", ->
    
    expect( Sequence.begin(Sequence.Callback, double, plus1, double)(2)(identity) ).toBe 10