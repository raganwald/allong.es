{iterators: {slice, drop, take, accumulate, accumulateWithReturn, 
             fold, map, filter, FlatArrayIterator, RecursiveArrayIterator,
             unfold, unfoldWithReturn}} = require('../lib/allong.es.js').allong.es

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

describe "accumulate", ->
  
    describe "with a seed", ->
  
      it "should map an iterator with many elements", ->
        i = accumulate(RecursiveArrayIterator([1, [2, 3, [4]], 5]), sum, 0)
        expect( i() ).toEqual(1)
        expect( i() ).toEqual(3)
        expect( i() ).toEqual(6)
        expect( i() ).toEqual(10)
        expect( i() ).toEqual(15)
        expect( i() ).toBeUndefined()
  
      it "should map an iterator with one element", ->
        i = accumulate(RecursiveArrayIterator([[[4], []]]), sum, 42)
        expect( i() ).toEqual(46)
        expect( i() ).toBeUndefined()
  
      it "should map an empty iterator", ->
        i = accumulate(RecursiveArrayIterator([[[], []]]), sum, 42)
        expect( i() ).toBeUndefined()
      
    describe "without a seed", ->
  
      it "should map an iterator with many elements", ->
        i = accumulate(RecursiveArrayIterator([1, [2, 3, [4]], 5]), sum)
        expect( i() ).toEqual(1)
        expect( i() ).toEqual(3)
        expect( i() ).toEqual(6)
        expect( i() ).toEqual(10)
        expect( i() ).toEqual(15)
        expect( i() ).toBeUndefined()
  
      it "should map an iterator with one element", ->
        i = accumulate(RecursiveArrayIterator([[[4], []]]), sum)
        expect( i() ).toEqual(4)
        expect( i() ).toBeUndefined()
  
      it "should map an empty iterator", ->
        i = accumulate(RecursiveArrayIterator([[[], []]]), sum)
        expect( i() ).toBeUndefined()

square = (x) -> x*x

describe "map", ->
  
      it "should map an iterator with many elements", ->
        i = map(RecursiveArrayIterator([1, [2, 3, [4]], 5]), square)
        expect( i() ).toEqual(1)
        expect( i() ).toEqual(4)
        expect( i() ).toEqual(9)
        expect( i() ).toEqual(16)
        expect( i() ).toEqual(25)
        expect( i() ).toBeUndefined()
  
      it "should map an iterator with one element", ->
        i = map(RecursiveArrayIterator([[[4], []]]), square)
        expect( i() ).toEqual(16)
        expect( i() ).toBeUndefined()
  
      it "should map an empty iterator", ->
        i = map(RecursiveArrayIterator([[[], []]]), square)
        expect( i() ).toBeUndefined()

odd = (x) -> x % 2 is 1

describe "filter", ->
  
      it "should filter an iterator with many elements", ->
        i = filter(RecursiveArrayIterator([1, [2, 3, [4]], 5]), odd)
        expect( i() ).toEqual(1)
        expect( i() ).toEqual(3)
        expect( i() ).toEqual(5)
        expect( i() ).toBeUndefined()
  
      it "should filter an iterator with one element", ->
        i = filter(RecursiveArrayIterator([[[4], []]]), odd)
        expect( i() ).toBeUndefined()
  
      it "should filter an empty iterator", ->
        i = filter(RecursiveArrayIterator([[[], []]]), odd)
        expect( i() ).toBeUndefined()
  
      it "should filter an iterator with no matches", ->
        i = filter(FlatArrayIterator([2, 4, 6, 8, 10]), odd)
        expect( i() ).toBeUndefined()

describe "slice", ->
  
  describe "with two parameter", ->
    
    it "should return an identity iterator", ->
      i = slice(FlatArrayIterator([1, 2, 3, 4, 5]), 0)
      expect( i() ).toEqual 1
      expect( i() ).toEqual 2
      expect( i() ).toEqual 3
      expect( i() ).toEqual 4
      expect( i() ).toEqual 5
      expect( i() ).toBeUndefined()
    
    it "should return a trailing iterator", ->
      i = slice(FlatArrayIterator([1, 2, 3, 4, 5]), 1)
      expect( i() ).toEqual 2
      expect( i() ).toEqual 3
      expect( i() ).toEqual 4
      expect( i() ).toEqual 5
      expect( i() ).toBeUndefined()
      
    it "should return an empty iterator when out of range", ->
      i = slice(FlatArrayIterator([1, 2, 3, 4, 5]), 5)
      expect( i() ).toBeUndefined()
  
  describe "with three parameters", ->
    
    it "should return an identity iterator", ->
      i = slice(FlatArrayIterator([1, 2, 3, 4, 5]), 0, 5)
      expect( i() ).toEqual 1
      expect( i() ).toEqual 2
      expect( i() ).toEqual 3
      expect( i() ).toEqual 4
      expect( i() ).toEqual 5
      expect( i() ).toBeUndefined()
      i = slice(FlatArrayIterator([1, 2, 3, 4, 5]), 0, 99)
      expect( i() ).toEqual 1
      expect( i() ).toEqual 2
      expect( i() ).toEqual 3
      expect( i() ).toEqual 4
      expect( i() ).toEqual 5
      expect( i() ).toBeUndefined()
    
    it "should return a leading iterator", ->
      i = slice(FlatArrayIterator([1, 2, 3, 4, 5]), 0, 4)
      expect( i() ).toEqual 1
      expect( i() ).toEqual 2
      expect( i() ).toEqual 3
      expect( i() ).toEqual 4
      expect( i() ).toBeUndefined()
    
    it "should return a trailing iterator", ->
      i = slice(FlatArrayIterator([1, 2, 3, 4, 5]), 1, 4)
      expect( i() ).toEqual 2
      expect( i() ).toEqual 3
      expect( i() ).toEqual 4
      expect( i() ).toEqual 5
      expect( i() ).toBeUndefined()
      i = slice(FlatArrayIterator([1, 2, 3, 4, 5]), 1, 99)
      expect( i() ).toEqual 2
      expect( i() ).toEqual 3
      expect( i() ).toEqual 4
      expect( i() ).toEqual 5
      expect( i() ).toBeUndefined()
    
    it "should return an inner iterator", ->
      i = slice(FlatArrayIterator([1, 2, 3, 4, 5]), 1, 3)
      expect( i() ).toEqual 2
      expect( i() ).toEqual 3
      expect( i() ).toEqual 4
      expect( i() ).toBeUndefined()
      
    it "should return an empty iterator when given a zero length", ->
      i = slice(FlatArrayIterator([1, 2, 3, 4, 5]), 1, 0)
      expect( i() ).toBeUndefined()
      
    it "should return an empty iterator when out of range", ->
      i = slice(FlatArrayIterator([1, 2, 3, 4, 5]), 5, 1)
      expect( i() ).toBeUndefined()
      
describe "drop", ->
  
  it "should drop the number of items dropped", ->
    i = drop(FlatArrayIterator([1, 2, 3, 4, 5]), 2)
    expect( i() ).toEqual 3
    expect( i() ).toEqual 4
    expect( i() ).toEqual 5
    expect( i() ).toBeUndefined()
  
  it "should handle overdropping", ->
    i = drop(FlatArrayIterator([1, 2, 3, 4, 5]), 99)
    expect( i() ).toBeUndefined()
    
  it "should handle underdropping", ->
    i = drop(FlatArrayIterator([1, 2, 3, 4, 5]), 0)
    expect( i() ).toEqual 1
    expect( i() ).toEqual 2
    expect( i() ).toEqual 3
    expect( i() ).toEqual 4
    expect( i() ).toEqual 5
    expect( i() ).toBeUndefined()
    
  it "should default to one", ->
    i = drop(FlatArrayIterator([1, 2, 3, 4, 5]))
    expect( i() ).toEqual 2
    expect( i() ).toEqual 3
    expect( i() ).toEqual 4
    expect( i() ).toEqual 5
    expect( i() ).toBeUndefined()
    
describe "accumulateWithReturn", ->
  
  it "should pass the state and result in a pair", ->
    i = accumulateWithReturn(FlatArrayIterator([1, 2, 3, 4, 5]), (state, element) ->
      [state + element, 'Total is ' + (state + element)]
    , 0);
    
    expect( i() ).toEqual 'Total is 1'
    expect( i() ).toEqual 'Total is 3'
    expect( i() ).toEqual 'Total is 6'
    expect( i() ).toEqual 'Total is 10'
    expect( i() ).toEqual 'Total is 15'
    
describe "unfold", ->
  
  it "should unfold and include the seed", ->
    i = unfold 0, (n) -> n + 1
    
    expect( i() ).toEqual 0
    expect( i() ).toEqual 1
    expect( i() ).toEqual 2
  
  it "should not unfold without a seed", ->
    i = unfold undefined, (n) -> n + 1
    
    expect( i() ).toEqual undefined
    expect( i() ).toEqual undefined
    expect( i() ).toEqual undefined
    expect( i() ).toEqual undefined

describe "unfoldWithReturn", ->
  
  it "should unfold and throw off a value", ->
    i = unfoldWithReturn 1, (n) -> [n + 1, n*n]
    
    expect( i() ).toEqual 1
    expect( i() ).toEqual 4
    expect( i() ).toEqual 9
    expect( i() ).toEqual 16
  
  it "should halt if it returns undefined", ->
    i = unfoldWithReturn 1, (n) ->
      [n + 1, if n is 1 then undefined else n * n]
    
    expect( i() ).toEqual undefined
    expect( i() ).toEqual undefined
    expect( i() ).toEqual undefined
    expect( i() ).toEqual undefined
  
  it "should halt if the state becomes undefined", ->
    i = unfoldWithReturn 1, (n) ->
      [(if n is 3 then undefined else n + 1), (if n is undefined then 100 else n * n)]
    
    expect( i() ).toEqual 1
    expect( i() ).toEqual 4
    expect( i() ).toEqual 9
    expect( i() ).toEqual undefined