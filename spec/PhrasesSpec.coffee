_       = require('underscore')._
Phrases = require('../lib/phrases')
models  = require('../lib/models')

# mocking the campfire room api
room =
  speak: ( msg, logger ) ->
    logger( { message: msg } ) if _.isFunction( logger )


describe 'Static Phrases', ->

  it 'should match and speak static phrases', ->
    spyOn room, 'speak'

    # phrases are currently hard coded, so let's test one that's in ther
    Phrases.listen( { body: "wet" }, room )
    expect( room.speak ).toHaveBeenCalled()

  it 'should not match non-phrases', ->
    spyOn room, 'speak'

    Phrases.listen( { body: "ertyuiuytrertyui" }, room )
    expect( room.speak ).not.toHaveBeenCalled()

  it 'should match complex (static) phrases', ->
    lock = 0
    spyOn(room, 'speak').andCallFake ( msg, logger ) ->
      lock++

    # match to a known 2 part phrase
    Phrases.listen( { body: 'deal' }, room )
    expect( room.speak ).toHaveBeenCalled()
    expect( lock ).toEqual( 2 )

  it 'should register new phrases', ->
    spyOn(room, 'speak')
    len = Phrases.phrases.length

    Phrases.register( /test/, "test" )
    expect( len + 1 ).toEqual( Phrases.phrases.length )

    Phrases.listen( { body: 'test' }, room )
    expect( room.speak ).toHaveBeenCalled()

  it 'should call your registerd callbacks', ->
    holla =
      back: -> return

    spyOn( holla, 'back' )

    Phrases.register( /holla/, 'back', holla.back )
    Phrases.listen( { body: 'holla' }, room )
    expect( holla.back ).toHaveBeenCalled()

describe 'Persistant Phrases', ->

  it 'should store phrases persistently', ->
    Phrases.store 'testing', 'this is just a test', ->
      models.phrase.findOne { msg: 'this is just a test' }, ( err, doc ) ->
        expect( doc.msg ).toEqual( 'this is just a test' )
        # clean up and advance runner
        doc.remove()
        jasmine.asyncSpecDone()

    jasmine.asyncSpecWait()

  it 'should remove phrases', ->
   Phrases.store 'testing', 'this is just a test', ->
      Phrases.remove 'testing', ->
        models.phrase.find { regex: 'testing' }, ( err, doc ) ->
          expect( doc ).toEqual( [] )
          jasmine.asyncSpecDone()

    jasmine.asyncSpecWait()

  it 'should add phrases via the listener', ->
    spyOn( Phrases, 'store' )

    Phrases.listen { body: 'testing1234 = testing stuff' }, room
    expect( Phrases.store ).toHaveBeenCalled()

  it 'should remove phrases via the listener', ->
    spyOn( Phrases, 'remove' )

    Phrases.listen { body: 'destroy testing1234' }, room
    expect( Phrases.remove ).toHaveBeenCalled()

