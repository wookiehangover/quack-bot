_       = require('underscore')._
Phrases = require('../lib/phrases')

# mocking the campfire room api
room =
  speak: ( msg, logger ) ->
    logger( { message: msg } ) if _.isFunction( logger )


describe 'Phrases', ->

  it 'should match and speak static phrases', ->
    spyOn room, 'speak'

    # phrases are currently hard coded, so let's test one that's in ther
    # TODO change once db support added
    Phrases.listen( { body: "wet" }, room )

    expect( room.speak ).toHaveBeenCalled()

  it 'should not match non-(static) phrases', ->
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



