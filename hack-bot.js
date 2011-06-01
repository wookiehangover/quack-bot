var Campfire, Google, Note, Sandbox, google, instance, logger, quack, reminder, room_id, sandbox, token, _;
_ = require('underscore')._;
token = require('./token');
Campfire = require('./lib/node-campfire/lib/campfire').Campfire;
Sandbox = require('sandbox');
Google = require('./lib/google');
Note = require('./lib/models').note;
sandbox = new Sandbox();
google = new Google();
instance = new Campfire({
  ssl: true,
  token: token,
  account: 'quickleft'
});
logger = function(d) {
  return console.log(d);
};
room_id = 265458;
reminder = function(msg, room) {
  var message, note, reg, user_name;
  reg = /^tell (\w+\s\w+)\s(.+)$/;
  user_name = reg.exec(msg.body)[1] || null;
  message = reg.exec(msg.body)[2] || null;
  if (!(user_name && message)) {
    return;
  }
  note = {
    sender_id: msg.user_id,
    target_name: user_name,
    msg: message
  };
  return room.show(function(r) {
    var n, sender, target;
    target = _.detect(r.room.users, function(u) {
      return u.name === user_name;
    });
    sender = _.detect(r.room.users, function(u) {
      return u.id === msg.user_id;
    });
    note['target_id'] = target.id;
    note['sender_name'] = sender.name;
    n = new Note(note);
    return n.save(function(s) {
      return console.log('saved and shit');
    });
  });
};
quack = function(room) {
  return room.join(function() {
    console.log(room);
    room.speak("hai guys", logger);
    return room.listen(function(msg) {
      var $_exp, g_exp, mdc_exp, yt_exp;
      Note.find({}, function(err, doc) {
        return _.each(doc, function(n) {
          if (msg.user_id === parseInt(n.target_id, 10)) {
            return room.speak("@" + n.target_name + ", " + n.sender_name + " says '" + n.msg + "'", function(d) {
              return n.remove();
            });
          }
        });
      });
      if (/^tell (\w+\s\w+)\s(.+)$/.test(msg.body)) {
        reminder(msg, room);
        room.speak("sure", logger);
      }
      if (/deal/.test(msg.body)) {
        room.speak("DEAL WITH IT", logger);
        room.speak("http://s3.amazonaws.com/gif.ly/gifs/490/original.gif?1294726461", logger);
      }
      if (/WET/i.test(msg.body)) {
        room.speak('write everything twice?', logger);
      }
      if (/noob/i.test(msg.body)) {
        room.speak('http://www.marriedtothesea.com/022310/i-hate-thinking.gif', logger);
      }
      if (msg.body === 'quack') {
        room.speak('quack!', logger);
      }
      if (/imo/i.test(msg.body)) {
        room.speak("http://s3.amazonaws.com/gif.ly/gifs/485/original.gif?1294425077", logger);
        room.speak("well, that's just like your opinion, man.");
      }
      if (/^\?about/.test(msg.body)) {
        room.speak('quack bot was born on may 26, 2011. he lives here: https://github.com/wookiehangover/quack-bot');
      }
      if (/^\?bot.snack/.test(msg.body)) {
        room.speak('nom nom nom', logger);
      }
      if (/advice/i.test(msg.body)) {
        room.speak('talk to Paul on quora http://www.quora.com/Dating-Relationships-on-Quora', logger);
      }
      if (/^(?:hi|hello|hey|yo)/i.test(msg.body)) {
        room.speak("oh hai", logger);
      }
      if (/^wookie/.test(msg.body)) {
        room.speak('is prettymuch the best', logger);
      }
      if (/^eval (.+)/.test(msg.body)) {
        sandbox.run(/^eval (.+)/.exec(msg.body)[1], function(output) {
          output = output.result.replace(/\n/g, ' ');
          return room.speak(output, logger);
        });
      }
      g_exp = /^g ([^#@]+)?$/;
      if (g_exp.test(msg.body)) {
        google.search(msg.body.match(g_exp)[1], function(results) {
          if (results.length) {
            return room.speak("" + results[0].titleNoFormatting + " - " + results[0].unescapedUrl, logger);
          } else {
            return room.speak("Sorry, no results for", logger);
          }
        });
      }
      mdc_exp = /^mdc ([^#@]+)(?:\s*#([1-9]))?$/;
      if (mdc_exp.test(msg.body)) {
        google.search(msg.body.match(mdc_exp)[1] + ' site:developer.mozilla.org', function(results) {
          if (results.length) {
            return room.speak("" + results[0].titleNoFormatting + " - " + results[0].unescapedUrl, logger);
          } else {
            return room.speak("Sorry, no results for", logger);
          }
        });
      }
      $_exp = /^jq ([^#@]+)(?:\s*#([1-9]))?$/;
      if ($_exp.test(msg.body)) {
        google.search(msg.body.match($_exp)[1] + ' site:api.jquery.com', function(results) {
          if (results.length) {
            return room.speak("" + results[0].titleNoFormatting + " - " + results[0].unescapedUrl, logger);
          } else {
            return room.speak("Sorry, no results for", logger);
          }
        });
      }
      yt_exp = /^[\/.`?]?yt ([^#@]+)(?:\s*#([1-9]))?$/;
      if (yt_exp.test(msg.body)) {
        google.search(msg.body.match(yt_exp)[1] + ' site:youtube.com', function(results) {
          if (results.length) {
            return room.speak("" + results[0].unescapedUrl, logger);
          } else {
            return room.speak("Sorry, no results for", logger);
          }
        });
      }
    });
  });
};
instance.room(room_id, quack);