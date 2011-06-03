var api, logger, static_phrases, _;
_ = require('underscore')._;
static_phrases = [
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
    regex: /quack/,
    msg: 'quack!'
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
logger = function(d) {
  try {
    return console.log("" + d.message.created_at + ": " + d.message.body);
  } catch (_e) {}
};
api = {
  phrases: static_phrases,
  listen: function(message, room) {
    return _.each(static_phrases, function(phrase) {
      if (phrase.regex.test(message.body) === false) {
        return;
      }
      if (_.isArray(phrase.msg)) {
        return _.each(phrase.msg, function(msg) {
          return room.speak(msg, logger);
        });
      }
      return room.speak(phrase.msg, logger);
    });
  }
};
module.exports = api;