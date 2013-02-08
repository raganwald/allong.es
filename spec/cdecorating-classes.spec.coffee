{classDecorator, mixin, fluent} = require '../lib/allong.es.js'

class Todo
  constructor: (name) ->
    self = if this instanceof Todo
             this
           else
             new Todo()
    self.name = name or 'Untitled'
    self.done = false
  do: fluent -> this.done = true
  undo: fluent -> this.done = false
  
describe "features", ->
  it "should include mixin", ->
    expect(typeof mixin).toEqual 'function'
  it "should include classDecorator", ->
    expect(typeof classDecorator).toEqual 'function'

describe "classDecorator", ->

  AndColourCoded = classDecorator
    setColourRGB: (r, g, b) ->
      @colourCode = { r, g, b }
      this
    getColourRGB: -> @colourCode

  ColourTodo = AndColourCoded Todo

  todo = new ColourTodo('Use More Decorators')
        .setColourRGB(0, 255, 0)

  it "should set the name correctly", ->
    expect( todo.name ).toEqual "Use More Decorators"

  it "should set the colour code correctly", ->
    expect( todo.getColourRGB() ).toEqual
      r: 0
      g: 255
      b: 0

describe "mixin", ->

  LocationAware = mixin
    setLocation: (@location) -> this
    getLocation: -> @location

  LocationAware(Todo)

  it "should add location to the existing class", ->
    expect( typeof Todo.prototype.setLocation ).toEqual 'function'
    expect( typeof Todo.prototype.getLocation ).toEqual 'function'