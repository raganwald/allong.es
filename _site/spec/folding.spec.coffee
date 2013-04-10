{mapWith, deepMapWith} = require('../lib/allong.es.min.js').allong.es

square = (n) -> n * n

describe 'mapWith', ->
  
  it 'should square some numbers', ->
    
    expect( mapWith(square)([1..5]) ).toEqual [1, 4, 9, 16, 25]

describe 'deepMapWith', ->
  
  it 'should square some numbers', ->
    
    expect( deepMapWith(square)([1, [2..4], 5]) ).toEqual [1, [4, 9, 16], 25]