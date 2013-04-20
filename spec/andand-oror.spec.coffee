{andand, oror} = require('../lib/allong.es').allong.es

T = () -> true
F = () -> false
N = () -> null
U = () -> undefimed

describe "andand", ->
  
  it " should pass null through", ->
    expect( andand(T)(null) ).toEqual(null && true)
  
  it " should pass undefined through", ->
    expect( andand(T)(undefined) ).toEqual(undefined && true)
  
  it " should pass false through", ->
    expect( andand(T)(false) ).toEqual(false && true)
    
  it 'should evaluate on truthy', ->
    expect( andand(T)('truthy') ).toEqual('truthy' && true)
    
  it 'should evaluate on []', ->
    expect( andand(T)([]) ).toEqual([] && true)
    
  it 'should evaluate on \'\'', ->
    expect( andand(T)('') ).toEqual('' && true)
    
  it 'should evaluate on 0', ->
    expect( andand(T)(0) ).toEqual(0 && true)

describe "oror", ->
  
  it " should pass null through", ->
    expect( oror(T)(null) ).toEqual(null || true)
  
  it " should pass undefined through", ->
    expect( oror(T)(undefined) ).toEqual(undefined || true)
  
  it " should pass false through", ->
    expect( oror(T)(false) ).toEqual(false || true)
    
  it 'should evaluate on truthy', ->
    expect( oror(T)('truthy') ).toEqual('truthy' || true)
    
  it 'should evaluate on []', ->
    expect( oror(T)([]) ).toEqual([] || true)
    
  it 'should evaluate on \'\'', ->
    expect( oror(T)('') ).toEqual('' || true)
    
  it 'should evaluate on 0', ->
    expect( oror(T)(0) ).toEqual(0 || true)