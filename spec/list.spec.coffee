{rotate, reverse} = require '../lib/internal/list'

echo = (a, b, c) -> "#{a} #{b} #{c}"

describe "rotate", ->
  
  it "should rotate a list by default", ->
    expect( rotate([1..5]) ).toEqual [2, 3, 4, 5, 1]
  
  it "should rotate a list by n", ->
    expect( rotate([1..5], 2) ).toEqual [3, 4, 5, 1, 2]
  
  it "should rotate a list by -n", ->
    expect( rotate([1..5], -1) ).toEqual [5, 1, 2, 3, 4]
    
describe "reverse", ->
  
  it "should reverse a list", ->
    expect( reverse([1..5]) ).toEqual [5, 4, 3, 2, 1]
  
  it "should reverse a list", ->
    expect( reverse([]) ).toEqual []