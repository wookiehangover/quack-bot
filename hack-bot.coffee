# Module Requirements
http      = require('http')
Sandbox   = require('sandbox')
Campfire  = require('./lib/vendor/campfire').Campfire

User      = require('./lib/models').user
Reminder  = require('./lib/reminder')
Phrases   = require('./lib/phrases')
Search    = require('./lib/search')

# Module Instances
sandbox   = new Sandbox()
instance  = new Campfire { ssl: true, token: process.env.TOKEN, account: 'quickleft' }

logger = ( d ) ->
  console.log "#{d.message.created_at}: #{d.message.body}"

bot_room = 401915
#everyone 265458
room_id = process.env.ROOM || bot_room

quack = ( room ) ->
  User.findOne { name: "Quick Bot" }, ( err, doc ) ->
    bot_id = doc.user_id

    room.join ->
      console.log "Joining #{room.name}"
      room.speak("hai guys", logger) unless process.env.SILENT

      room.listen ( msg ) ->
        # ignore it if I said it
        return if msg.user_id is parseInt(bot_id)

        # eval JS in the sandbox
        if /^eval (.+)/.test( msg.body )
          sandbox.run /^eval (.+)/.exec(msg.body)[1], ( output ) ->
            output = output.result.replace( /\n/g, ' ' )
            room.speak output, logger


        Reminder.listen( msg, room )
        Phrases.listen( msg, room )
        Search.listen( msg, room )

    # leave the room on exit
    process.on 'SIGINT', ->
      room.leave ->
        console.log('\nGood Luck, Star Fox')
        process.exit()

instance.room room_id, quack

# heroku wants the app to bind to a port, so lets do that
server = http.createServer ( req, res ) ->
  res.writeHead 200, { 'Content-Type': 'text/plain' }
  res.end 'quack bot <3s you\n'

port = process.env.PORT || 3000

server.listen port
