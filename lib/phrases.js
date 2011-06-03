var Phrase, api, phrases, _;
_ = require('underscore')._;
Phrase = require('./models').phrase;
phrases = [
  {
    regex: /deal/,
    msg: ['DEAL WITH IT', "http://s3.amazonaws.com/gif.ly/gifs/490/original.gif?1294726461"]
  }, {
    regex: /WET/i,
    msg: 'write everything twice?'
  }, {
    regex: /noob/i,
    msg: 'http://www.marriedtothesea.com/022310/i-hate-thinking.gif'
  }, {
    regex: /imo/i,
    msg: ["http://s3.amazonaws.com/gif.ly/gifs/485/original.gif?1294425077", "well, that's just like your opinion, man."]
  }, {
    regex: /^\?about/,
    msg: 'quack bot was born on may 26, 2011. he lives here: https://github.com/wookiehangover/quack-bot'
  }, {
    regex: /^\?bot.snack/,
    msg: 'nom nom nom'
  }, {
    regex: /^(hi|hello|hey|yo )/i,
    msg: "oh hai"
  }, {
    regex: /^wookie/,
    msg: 'is prettymuch the best'
  }
];
api = {
  logger: function(d) {
    try {
      return console.log("" + d.message.created_at + ": " + d.message.body);
    } catch (_e) {}
  },
  store: function(match, msg) {
    var p;
    return p = new Phrase({
      regex: match,
      msg: msg != null ? msg : false
    }).save(function() {
      return console.log("" + (msg(saved)));
    });
  },
  register: function(match, msg, callback) {
    return phrases.push({
      regex: match,
      msg: msg != null ? msg : false,
      callback: callback != null ? callback : false
    });
  },
  phrases: (function() {
    return phrases;
  })(),
  listen: function(message, room) {
    return _.each(api.phrases, function(phrase) {
      if (phrase.regex.test(message.body) === false) {
        return;
      }
      if (_.isArray(phrase.msg)) {
        _.each(phrase.msg, function(msg) {
          return room.speak(msg, api.logger);
        });
      } else {
        room.speak(phrase.msg, api.logger);
      }
      if (_.isFunction(phrase.callback)) {
        return phrase.callback();
      }
    });
  }
};
module.exports = api;