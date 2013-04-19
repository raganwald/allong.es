{Supervisor, Supervisor: {sequence}} = require('../lib/allong.es.js').allong.es

double = (v, c) -> c(v * 2)
plus1 = (v, c) -> c(v + 1)
identity = (v) -> v

describe "continuation", ->
  
  it "should work for the null sequence", ->
    
    expect( sequence(Supervisor.Callback)(42)(identity) ).toBe 42
  
  it "should work for a double", ->
    
    expect( sequence(Supervisor.Callback, double)(42)(identity) ).toBe 84
  
  it "should work for a double double", ->
    
    expect( sequence(Supervisor.Callback, double, double)(2)(identity) ).toBe 8
  
  it "should work for a double plus1 double", ->
    
    expect( sequence(Supervisor.Callback, double, plus1, double)(2)(identity) ).toBe 10