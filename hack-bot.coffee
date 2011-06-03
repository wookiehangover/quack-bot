token     = process.env.TOKEN

Sandbox   = require('sandbox')
Campfire  = require('./lib/vendor/campfire').Campfire
Google    = require('./lib/vendor/google')
Reminder  = require('./lib/reminder')
Phrases   = require('./lib/phrases')
User      = require('./lib/models').user
http      = require('http')

sandbox = new Sandbox()
google  = new Google()

instance = new Campfire({
  ssl: true
  token: token
  account: 'quickleft'
})

logger = ( d ) ->
  console.log "#{d.message.created_at}: #{d.message.body}"

#bot-room
bot_room = 401915

#everyone
#room_id = 265458

room_id = process.env.ROOM || bot_room

quack = ( room ) ->
  User.findOne { name: "Quick Bot" }, ( err, doc ) ->
    bot_id = doc.user_id

    room.join ->

      console.log "Joining #{room.name}"
      room.speak("hai guys", logger) unless process.env.SILENT

      room.listen ( msg ) ->

        return if msg.user_id is parseInt(bot_id)
        console.log(msg.user_id, bot_id)

        Reminder.poller( msg, room )

        if /^tell (\w+\s\w+|\@\w+)\s(.+)$/.test( msg.body )
          Reminder.save msg, ->
            room.speak "sure", logger

        Phrases.listen( msg, room )

        setter = /^([^=]+)\s\=\s(.+)$/

        if /^destroy (.+)$/.test( msg.body )
          match = /^destroy (.+)$/.exec(msg.body)[1]
          Phrases.remove match, ->
            room.speak "#{match} removed"

        if setter.test( msg.body )
          params = setter.exec( msg.body )
          Phrases.store params[1], params[2], ->
            room.speak "#{params[1]} saved", logger

        if /^show me the money$/.test( msg.body )
          Phrases.all( room )

        if /^eval (.+)/.test( msg.body )
          sandbox.run /^eval (.+)/.exec(msg.body)[1], ( output ) ->
            output = output.result.replace( /\n/g, ' ' )
            room.speak output, logger

        g_exp = /^g ([^#@]+)?$/

        if g_exp.test( msg.body )

          google.search msg.body.match(g_exp)[1], ( results ) ->
            if results.length
              room.speak "#{results[0].titleNoFormatting} - #{results[0].unescapedUrl}", logger
            else
              room.speak "Sorry, no results for", logger

        mdc_exp = /^mdc ([^#@]+)(?:\s*#([1-9]))?$/

        if mdc_exp.test( msg.body )
          google.search msg.body.match(mdc_exp)[1] + ' site:developer.mozilla.org', ( results ) ->
            if results.length
              room.speak "#{results[0].titleNoFormatting} - #{results[0].unescapedUrl}", logger
            else
              room.speak "Sorry, no results for", logger

        yt_exp = /^[\/.`?]?yt ([^#@]+)(?:\s*#([1-9]))?$/

        if yt_exp.test( msg.body )
          google.search msg.body.match(yt_exp)[1] + ' site:youtube.com', ( results ) ->
            if results.length
              room.speak "#{results[0].unescapedUrl}", logger
            else
              room.speak "Sorry, no results for", logger

        return

    process.on 'SIGINT', ->
      room.leave ->
        console.log('\nGood Luck, Star Fox')
        process.exit()


instance.room room_id, quack


server = http.createServer ( req, res ) ->
  res.writeHead 200, { 'Content-Type': 'text/plain' }
  res.end 'quack bot <3s you\n'

port = process.env.PORT || 3000

server.listen port
