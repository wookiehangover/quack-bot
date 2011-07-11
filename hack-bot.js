var Campfire, Phrases, Reminder, Sandbox, Search, User, bot_room, http, instance, logger, port, quack, room_id, sandbox, server;
http = require('http');
Sandbox = require('sandbox');
Campfire = require('./lib/vendor/campfire').Campfire;
User = require('./lib/models').user;
Reminder = require('./lib/reminder');
Phrases = require('./lib/phrases');
Search = require('./lib/search');
sandbox = new Sandbox();
instance = new Campfire({
  ssl: true,
  token: process.env.TOKEN,
  account: 'quickleft'
});
logger = function(d) {
  return console.log("" + d.message.created_at + ": " + d.message.body);
};
bot_room = 401915;
room_id = process.env.ROOM || bot_room;
quack = function(room) {
  return User.findOne({
    name: "Quick Bot"
  }, function(err, doc) {
    var bot_id;
    bot_id = doc.user_id;
    room.join(function() {
      console.log("Joining " + room.name);
      if (!process.env.SILENT) {
        room.speak("hai guys", logger);
      }
      return room.listen(function(msg) {
        var task, _i, _len, _ref, _results;
        if (msg.user_id === parseInt(bot_id)) {
          return;
        }
        if (/^eval (.+)/.test(msg.body)) {
          sandbox.run(/^eval (.+)/.exec(msg.body)[1], function(output) {
            return room.speak(output.result.replace(/\n/g, ' '), logger);
          });
        }
        _ref = [Reminder, Phrases, Search];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          task = _ref[_i];
          _results.push(task.listen(msg, room));
        }
        return _results;
      });
    });
    return process.on('SIGINT', function() {
      return room.leave(function() {
        console.log('\nGood Luck, Star Fox');
        return process.exit();
      });
    });
  });
};
instance.room(room_id, quack);
instance.room('379185', quack);
server = http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  return res.end('quack bot <3s you\n');
});
port = process.env.PORT || 3000;
server.listen(port);