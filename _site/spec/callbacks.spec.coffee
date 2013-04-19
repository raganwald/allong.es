{Sequence, Sequence: {do}} = require('../lib/allong.es.js').allong.es

double = (v, c) -> c(v * 2)
plus1 = (v, c) -> c(v + 1)
identity = (v) -> v

describe "continuation", ->
  
  it "should work for the null do", ->
    
    expect( do(Sequence.Callback)(42)(identity) ).toBe 42
  
  it "should work for a double", ->
    
    expect( do(Sequence.Callback, double)(42)(identity) ).toBe 84
  
  it "should work for a double double", ->
    
    expect( do(Sequence.Callback, double, double)(2)(identity) ).toBe 8
  
  it "should work for a double plus1 double", ->
    
    expect( do(Sequence.Callback, double, plus1, double)(2)(identity) ).toBe 10