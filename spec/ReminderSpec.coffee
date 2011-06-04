Reminder  = require('../lib/reminder')
Note      = require('../lib/models').note
User      = require('../lib/models').user

test_user = new User
  name: "Test Dude"
  user_id: 1
  email: "test@quickleft.com"

# mocking the campfire room api
room =
  speak: ( msg, logger ) ->
    logger( { message: msg } ) if _.isFunction( logger )


describe 'Reminders', ->
  it 'should save a message with full name', ->
    msg =
      body: "tell Test Dude whatever man"
      user_id: 794174

    test_user.save ( error, user ) ->
      Reminder.save msg, ( e ) ->
        Note.findOne { target_name: "Test Dude" }, ( err, doc ) ->

          expect( doc.target_name ).toEqual( "Test Dude" )
          expect( doc.msg ).toEqual( "whatever man" )

          doc.remove()
          User.remove { name: /Test/ }
          jasmine.asyncSpecDone()

    jasmine.asyncSpecWait()

  it 'should save via the listener', ->
    spyOn( Reminder, 'save')

    test_user.save ( error, user ) ->
      Reminder.listen( { body: 'tell @test that his shits realy fly' }, room )
      expect( Reminder.save ).toHaveBeenCalled()

      User.remove { name: /Test/ }

  #it 'should reply to a saved message via the listener', ->
      #spyOn( room, 'speak' )

      #test_user.save ( error, user ) ->
        #Reminder.listen( { body: 'woot', user_id: 1 }, room )

        #expect( room.speak ).toHaveBeenCalled()
        #User.remove { name: /Test/ }
        #jasmine.asyncSpecDone()

    #jasmine.asyncSpecWait()


