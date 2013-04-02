{splat, soak} = require '../lib/allong.es.js'

square = (n) -> n * n

describe 'splat', ->
  
  it 'should square some numbers', ->
    
    expect( splat(square)([1..5]) ).toEqual [1, 4, 9, 16, 25]

describe 'soak', ->
  
  it 'should square some numbers', ->
    
    expect( soak(square)([1, [2..4], 5]) ).toEqual [1, [4, 9, 16], 25]