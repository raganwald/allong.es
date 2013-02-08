{classDecorator, fluent} = require '../lib/allong.es.js'

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

AndColourCoded = classDecorator
  setColourRGB: fluent (r, g, b) -> this.colourCode = { r, g, b }
  getColourRGB: -> this.colourCode

ColourTodo = AndColourCoded Todo

describe "classDecorator", ->

  todo = new ColourTodo('Use More Decorators')
        .setColourRGB(0, 255, 0)

  it "should set the name correctly", ->
    expect( todo.name ).toEqual "Use More Decorators"

  it "should set the colour code correctly", ->
    expect( todo.getColourRGB() ).toEqual
      r: 0
      g: 255
      b: 0