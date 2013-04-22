{sequence, flatten} = require('../lib/allong.es').allong.es

WithLogging =
  chain: (valueAndLogList, fn) ->
    value = valueAndLogList[0]
    logList = valueAndLogList[1]
    resultAndLogList = fn(value)
    result = resultAndLogList[0]
    resultLogList = flatten(logList.concat(resultAndLogList[1]))
    [result, resultLogList]
  of: (argument) -> [argument, []]

double = (number) ->
  result = number * 2
  [result, ['' + number + ' * 2 = ' + result]]

plus1 = (number) ->
  result = number + 1
  [result, ['' + number + ' + 1 = ' + result]]  

describe "sequence with object definitions", ->
  
  it "should work for some simple math", ->
    expect( sequence(WithLogging, double, plus1 )(2) ).toEqual [5, ['2 * 2 = 4', '4 + 1 = 5']]