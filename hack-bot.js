var Campfire, Google, Phrases, Reminder, Sandbox, google, http, instance, logger, port, quack, room_id, sandbox, server, token;
token = process.env.TOKEN;
Sandbox = require('sandbox');
Campfire = require('./lib/vendor/campfire').Campfire;
Google = require('./lib/vendor/google');
Reminder = require('./lib/reminder');
Phrases = require('./lib/phrases');
http = require('http');
sandbox = new Sandbox();
google = new Google();
instance = new Campfire({
  ssl: true,
  token: token,
  account: 'quickleft'
});
logger = function(d) {
  return console.log("" + d.message.created_at + ": " + d.message.body);
};
room_id = 265458;
quack = function(room) {
  room.join(function() {
    console.log("Joining " + room.name);
    if (!process.env.SILENT) {
      room.speak("hai guys", logger);
    }
    return room.listen(function(msg) {
      var g_exp, mdc_exp, yt_exp;
      Reminder.poller(msg, room);
      if (/^tell (\w+\s\w+|\@\w+)\s(.+)$/.test(msg.body)) {
        Reminder.save(msg, function() {
          return room.speak("sure", logger);
        });
      }
      Phrases.listen(msg, room);
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
  return process.on('SIGINT', function() {
    return room.leave(function() {
      console.log('\nGood Luck, Star Fox');
      return process.exit();
    });
  });
};
instance.room(room_id, quack);
server = http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  return res.end('quack bot <3s you\n');
});
port = process.env.PORT || 3000;
server.listen(port);