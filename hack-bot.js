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
        if (msg.user_id === parseInt(bot_id)) {
          return;
        }
        if (/^eval (.+)/.test(msg.body)) {
          sandbox.run(/^eval (.+)/.exec(msg.body)[1], function(output) {
            output = output.result.replace(/\n/g, ' ');
            return room.speak(output, logger);
          });
        }
        Reminder.listen(msg, room);
        Phrases.listen(msg, room);
        return Search.listen(msg, room);
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
server = http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  return res.end('quack bot <3s you\n');
});
port = process.env.PORT || 3000;
server.listen(port);