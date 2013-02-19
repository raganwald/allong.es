{iterators: {statefulMap, fold, map, filter, slice, FlatArrayIterator, RecursiveArrayIterator}} = require '../lib/allong.es.js'

describe "FlatArrayIterator", ->
  
  it "should iterate over a flat array", ->
    i = FlatArrayIterator([1, 2, 3, 4, 5])
    expect( i() ).toEqual(1)
    expect( i() ).toEqual(2)
    expect( i() ).toEqual(3)
    expect( i() ).toEqual(4)
    expect( i() ).toEqual(5)
    expect( i() ).toBeUndefined()
    
  it "should not iterate down through an array", ->
    i = FlatArrayIterator([1, [2, 3, [4]], 5])
    expect( i() ).toEqual(1)
    expect( i() ).not.toEqual(2)
    expect( i() ).toEqual(5)
    expect( i() ).toBeUndefined()
  
  it "should have no values given an empty array", ->
    i = FlatArrayIterator([])
    expect( i() ).toBeUndefined()
  
  it "should have a values given an empty tree", ->
    i = FlatArrayIterator([[], [[]]])
    expect( i() ).not.toBeUndefined()

describe "RecursiveArrayIterator", ->
  
  it "should have no values given an empty array", ->
    i = RecursiveArrayIterator([])
    expect( i() ).toBeUndefined()
  
  it "should have no values given an empty tree", ->
    i = RecursiveArrayIterator([[], [[]]])
    expect( i() ).toBeUndefined()
  
  it "should iterate over a flat array", ->
    i = RecursiveArrayIterator([1, 2, 3, 4, 5])
    expect( i() ).toEqual(1)
    expect( i() ).toEqual(2)
    expect( i() ).toEqual(3)
    expect( i() ).toEqual(4)
    expect( i() ).toEqual(5)
    expect( i() ).toBeUndefined()
    
  it "should also iterate down through an array", ->
    i = RecursiveArrayIterator([1, [2, 3, [4]], 5])
    expect( i() ).toEqual(1)
    expect( i() ).toEqual(2)
    expect( i() ).toEqual(3)
    expect( i() ).toEqual(4)
    expect( i() ).toEqual(5)
    expect( i() ).toBeUndefined()

sum = (x, y) -> x + y

describe "fold", ->
  
    describe "with a seed", ->
  
      it "should fold an iterator with many elements", ->
        expect( fold(RecursiveArrayIterator([1, [2, 3, [4]], 5]), sum, 0) ).toEqual(15)
  
      it "should fold an iterator with one element", ->
        expect( fold(RecursiveArrayIterator([[[4], []]]), sum, 42) ).toEqual(46)
  
      it "should fold an empty iterator", ->
        expect( fold(RecursiveArrayIterator([[], [[]]]), sum, 42) ).toEqual(42)
      
    describe "without a seed", ->
      
      it "should fold an array with two or more elements", ->
        expect( fold(RecursiveArrayIterator([1, [2, 3, [4]], 5]), sum) ).toEqual(15)
      
      it "should fold an array with one element", ->
        expect( fold(RecursiveArrayIterator([[[4], []]]), sum) ).toEqual(4)
      
      it "should fold an array with no elements", ->
        expect( fold(RecursiveArrayIterator([[[], []]]), sum) ).toBeUndefined()

describe "statefulMap", ->
  
    describe "with a seed", ->
  
      it "should map an iterator with many elements", ->
        i = statefulMap(RecursiveArrayIterator([1, [2, 3, [4]], 5]), sum, 0)
        expect( i() ).toEqual(1)
        expect( i() ).toEqual(3)
        expect( i() ).toEqual(6)
        expect( i() ).toEqual(10)
        expect( i() ).toEqual(15)
        expect( i() ).toBeUndefined()
  
      it "should map an iterator with one element", ->
        i = statefulMap(RecursiveArrayIterator([[[4], []]]), sum, 42)
        expect( i() ).toEqual(46)
        expect( i() ).toBeUndefined()
  
      it "should map an empty iterator", ->
        i = statefulMap(RecursiveArrayIterator([[[], []]]), sum, 42)
        expect( i() ).toBeUndefined()
      
    describe "without a seed", ->
  
      it "should map an iterator with many elements", ->
        i = statefulMap(RecursiveArrayIterator([1, [2, 3, [4]], 5]), sum)
        expect( i() ).toEqual(1)
        expect( i() ).toEqual(3)
        expect( i() ).toEqual(6)
        expect( i() ).toEqual(10)
        expect( i() ).toEqual(15)
        expect( i() ).toBeUndefined()
  
      it "should map an iterator with one element", ->
        i = statefulMap(RecursiveArrayIterator([[[4], []]]), sum)
        expect( i() ).toEqual(4)
        expect( i() ).toBeUndefined()
  
      it "should map an empty iterator", ->
        i = statefulMap(RecursiveArrayIterator([[[], []]]), sum)
        expect( i() ).toBeUndefined()
    