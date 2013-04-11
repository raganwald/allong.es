{mapWith, deepMapWith, filter} = require('../lib/allong.es.js').allong.es

square = (n) -> n * n

describe 'mapWith', ->
  
  it 'should square some numbers', ->
    
    expect( mapWith(square)([1..5]) ).toEqual [1, 4, 9, 16, 25]

describe 'deepMapWith', ->
  
  it 'should square some numbers', ->
    
    expect( deepMapWith(square)([1, [2..4], 5]) ).toEqual [1, [4, 9, 16], 25]
    
describe "filter", ->
  
  it "should find odd numbers", ->
    
    expect( filter([1, 2, 3, 4, 5, 6], '% 2 === 1') ).toEqual [1, 3, 5]
  
  it "should be self-currying", ->
    
    expect( filter([1, 2, 3, 4, 5, 6])('% 2 === 0') ).toEqual [2, 4, 6]