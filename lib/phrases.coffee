_ = require('underscore')._
Phrase = require('./models').phrase

phrases = [
  { regex: /deal/,  msg: [ 'DEAL WITH IT', "http://s3.amazonaws.com/gif.ly/gifs/490/original.gif?1294726461" ] }
  { regex: /WET/i,  msg: 'write everything twice?' }
  { regex: /noob/i, msg: 'http://www.marriedtothesea.com/022310/i-hate-thinking.gif' }
  { regex: /quack/, msg: 'quack!' }
  { regex: /imo/i,  msg: [ "http://s3.amazonaws.com/gif.ly/gifs/485/original.gif?1294425077", "well, that's just like your opinion, man."] }
  { regex: /^\?about/, msg: 'quack bot was born on may 26, 2011. he lives here: https://github.com/wookiehangover/quack-bot' }
  { regex: /^\?bot.snack/, msg: 'nom nom nom'  }
  { regex: /^(hi|hello|hey|yo )/i, msg: "oh hai"  }
  { regex: /^wookie/, msg: 'is prettymuch the best' }
]

api =

  logger: ( d ) ->
    try
      console.log "#{d.message.created_at}: #{d.message.body}"

  all: ( room ) ->
    Phrase.find {}, ( err, doc ) ->
      blob = "I know these things:\n\n"
      _.each doc, ( p ) ->
        blob += "#{p.regex}: #{p.msg}\n"

      room.paste blob, api.logger

  store: ( match, msg, callback ) ->
    p = new Phrase({ regex: match, msg: msg })

    p.save ( err, doc )->
      console.log("#{msg} saved")
      callback(doc) if _.isFunction( callback )

  remove: ( match, callback ) ->
    p = Phrase.findOne { regex: match }, ( err, doc ) ->
      doc.remove ->
        console.log("#{match} destroyed")
        callback() if _.isFunction( callback )

  register: ( match, msg, callback ) ->

    phrases.push { regex: match, msg: msg ? false, callback: callback ? false }

  phrases: phrases

  listen: ( message, room ) ->
    # learn and destroy phrases
    setter    = /^([^=]+)\s\=\s(.+)$/
    destroyer = /^destroy (.+)$/

    if setter.test( message.body )
      params = setter.exec( message.body )
      return api.store params[1], params[2], ->
        room.speak "#{params[1]} saved", api.logger

    if destroyer.test( message.body )
      match = destroyer.exec( message.body)[1]
      return api.remove match, ->
        room.speak "#{match} removed", api.logger

    # show all the memorized phrases
    if /^show me the money$/.test( message.body )
      return api.all( room )

    # loop through the static phrases
    _.each api.phrases, ( phrase ) ->
      return if phrase.regex.test( message.body ) is false

      if _.isArray( phrase.msg )
        _.each phrase.msg, ( msg ) ->
          room.speak msg, api.logger
      else
        room.speak phrase.msg, api.logger

      phrase.callback() if _.isFunction( phrase.callback )

    # and then the user entered phrases
    Phrase.find {}, ( err, doc ) ->
      _.each doc, ( phrase ) ->
        regex = new RegExp(phrase.regex)
        try
          return if regex.test( message.body ) is false
          room.speak phrase.msg, api.logger


module.exports = api

