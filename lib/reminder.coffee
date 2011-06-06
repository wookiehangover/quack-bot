_         = require('underscore')._
Note      = require('./models').note
User      = require('./models').user

logger = ( d ) ->
  try
    console.log "#{d.message.created_at}: #{d.message.body}"

api =
  save: ( msg, callback ) ->
    reg = /^tell (\w+\s\w+|\@\w+)\s(.+)$/

    user_name = reg.exec(msg.body)[1] or null
    message = reg.exec(msg.body)[2] or null

    if /\@/.test( user_name )
      user_name = new RegExp user_name.split('@')[1], 'i'

    return unless (user_name && message)

    User.findOne { name: user_name }, (err, target) ->
      return if err

      User.findOne { user_id: msg.user_id }, ( err, sender ) ->
        return if err

        try
          note = new Note
            sender_id:
              msg.user_id
            msg:
              message
            target_id:
              target.user_id
            target_name:
              target.name
            sender_name:
              sender.name

          note.save ( error ) ->
            callback.call @, error if _.isFunction callback
            console.log if error then error else "#{message} saved"

        catch error
          callback.call @, error if _.isFunction callback

  listen: ( msg, room ) ->

    if /^tell (\w+\s\w+|\@\w+)\s(.+)$/.test( msg.body )
      return api.save msg, ->
        room.speak "sure", logger

    Note.find {}, ( err, doc ) ->
      _.each doc, ( note ) ->
        if msg.user_id is parseInt(note.target_id, 10)
          room.speak "@#{note.target_name.split(' ')[0]}, #{note.sender_name.split(' ')[0]} says '#{note.msg}'", (d)->
            note.remove()

module.exports = api

