{trampoline, tailCall} = require('../lib/allong.es.js').allong.es

describe "trampolining", ->

  depth = 32768

  it "should execute a clean even/odd to #{depth} levels", ->
  
    even = trampoline (n) ->
      if n is 0
        true
      else
        tailCall odd, n - 1
  
    odd = trampoline (n) ->
      if n is 0
        false
      else
        tailCall even, n - 1
  
    expect( even(0) ).toEqual true
    expect( even(1) ).toEqual false
    expect( even(2) ).toEqual true
    expect( even(3) ).toEqual false
    expect(-> even(depth) ).not.toThrow()
    
  it "should allow tail calling a co-recursive non-trampolined function too", ->
  
    even2 = trampoline (n) ->
      if n is 0
        true
      else
        tailCall odd2, n - 1
  
    odd2 = (n) ->
      if n is 0
        false
      else
        even2 n - 1
  
    expect(-> even2(1000) ).not.toThrow()
    expect( even2(100) ).toEqual true
    expect( even2(101) ).toEqual false