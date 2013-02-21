{defaults} = require '../lib/allong.es.js'

echo = (a, b, c) -> "#{a} #{b} #{c}"

describe "defaults", ->
  
  it "should default values", ->
    expect( defaults(echo, 'c')('a', 'b') ).toEqual 'a b c'
    expect( defaults(echo, 'b', 'c')('a') ).toEqual 'a b c'
    expect( defaults(echo, 'a', 'b', 'c')() ).toEqual 'a b c'
  
  it "should ignore uneccesary defaults", ->
    expect( defaults(echo, 'a', 'b', 'c')('A') ).toEqual 'A b c'
    expect( defaults(echo, 'a', 'b', 'c')('A', 'B') ).toEqual 'A B c'
    expect( defaults(echo, 'a', 'b', 'c')('A', 'B', 'C') ).toEqual 'A B C'
    expect( defaults(echo, 'a', 'b', 'c')('A', 'B', 'C', 'D') ).toEqual 'A B C'

