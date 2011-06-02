Reminder = require('../lib/reminder')

Note      = require('../lib/models').note
User      = require('../lib/models').user

test_user = new User
  name: "Test Dude"
  user_id: 1
  email: "test@quickleft.com"


describe 'Reminders', ->
  it 'should save a message with full name', ->

    test_user.save ( error, user ) ->

      msg =
        body: "tell Test Dude whatever man"
        user_id: 794174

      Reminder.save msg, ( e ) ->
        Note.findOne { target_name: "Test Dude" }, ( err, doc ) ->

          expect( doc.target_name ).toEqual( "Test Dude" )
          expect( doc.msg ).toEqual( "whatever man" )

          test_user.remove()
          doc.remove()
          jasmine.asyncSpecDone()

    jasmine.asyncSpecWait()

