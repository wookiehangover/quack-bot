token     = process.env.TOKEN

Sandbox   = require('sandbox')
Campfire  = require('./lib/node-campfire/lib/campfire').Campfire
Google    = require('./lib/google')
Reminder  = require('./lib/reminder')

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
#room_id = 401915

#everyone
room_id = 265458

quack = ( room ) ->
  room.join ->

    console.log "Joining #{room.name}"
    room.speak "hai guys", logger

    room.listen ( msg ) ->

      Reminder.poller( msg, room )

      if  /^tell (\w+\s\w+|\@\w+)\s(.+)$/.test( msg.body )
        Reminder.save msg, ->
          room.speak "sure", logger

      if /deal/.test( msg.body )
        room.speak "DEAL WITH IT", logger
        room.speak "http://s3.amazonaws.com/gif.ly/gifs/490/original.gif?1294726461", logger

      if /WET/i.test( msg.body )
        room.speak 'write everything twice?', logger

      if /noob/i.test( msg.body )
        room.speak 'http://www.marriedtothesea.com/022310/i-hate-thinking.gif', logger

      if msg.body is 'quack'
        room.speak 'quack!', logger

      if /imo/i.test( msg.body )
        room.speak "http://s3.amazonaws.com/gif.ly/gifs/485/original.gif?1294425077", logger
        room.speak "well, that's just like your opinion, man."

      #if /no u/i.test( msg.body )
        #room.speak 'NO U', logger

      if /^\?about/.test( msg.body )
        room.speak 'quack bot was born on may 26, 2011. he lives here: https://github.com/wookiehangover/quack-bot'

      #if /wu|at/i.test( msg.body )
        #room.speak 'yr not david mark', logger

      if /^\?bot.snack/.test( msg.body )
        room.speak 'nom nom nom', logger

      if /advice/i.test( msg.body )
        room.speak 'talk to Paul on quora http://www.quora.com/Dating-Relationships-on-Quora', logger

      if /^(hi|hello|hey|yo)\s/i.test( msg.body )
        room.speak "oh hai", logger

      if /^wookie/.test( msg.body )
        room.speak 'is prettymuch the best', logger

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

instance.room room_id, quack

