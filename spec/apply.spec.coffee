{ apply, call, curry, unvariadic, args, sequence, applyThis, applyThisFirst, list: {reverse} } = require '../lib/allong.es.js'

echo = (a, b, c) -> "#{a} #{b} #{c}"

# unvariadic and apply duplicate each other's functionality

describe "unvariadic", ->
  
  it "should unvariadic an array of arguments to a function", ->
    expect( unvariadic(echo)([1, 2, 3]) ).toEqual "1 2 3"

describe "apply", ->
  
  it "should apply an array of arguments to a function", ->
    expect( apply(echo, [1, 2, 3]) ).toEqual "1 2 3"
    
# Curry and call duplicate each other's functionality

describe "curry", ->
  
  it "should call individual arguments to a function", ->
    expect( curry(echo)(1, 2, 3) ).toEqual "1 2 3"

describe "call", ->
  
  it "should call an array of arguments to a function", ->
    expect( call(echo, 1, 2, 3) ).toEqual "1 2 3"
    
describe "args", ->
  
  it "should collect arguments into an array", ->
    expect( args(3)(1, 2, 3) ).toEqual [1, 2, 3]