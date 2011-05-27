var Campfire, Google, Sandbox, google, instance, logger, room_id, sandbox, sys, token, user_id, _;
sys = require('sys');
_ = require('underscore')._;
Campfire = require('./node-campfire/lib/campfire').Campfire;
Sandbox = require('sandbox');
Google = require('./google');
token = require('./token');
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
room_id = 401915;
user_id = 600703;
instance.room(room_id, function(room) {
  return room.join(function() {
    room.speak("hai guys", logger);
    return room.listen(function(msg) {
      var g_exp, mdc_exp, yt_exp;
      if (/deal/.test(msg.body)) {
        room.speak("DEAL WITH IT", logger);
        room.speak("http://s3.amazonaws.com/gif.ly/gifs/490/original.gif?1294726461", logger);
      }
      if (/WET/.test(msg.body)) {
        room.speak('write everything twice', logger);
      }
      if (/noob/.test(msg.body)) {
        room.speak('http://www.marriedtothesea.com/022310/i-hate-thinking.gif', logger);
      }
      if (msg.body === 'quack') {
        room.speak('quack!', logger);
      }
      if (/IMO/i.test(msg.body)) {
        room.speak("http://s3.amazonaws.com/gif.ly/gifs/485/original.gif?1294425077", logger);
        room.speak("well, that's just like your opinion, man.");
      }
      if (/advice/i.test(msg.body)) {
        room.speak('talk to Paul on quora http://www.quora.com/Dating-Relationships-on-Quora', logger);
      }
      if (/^(?:hi|hello|hey|yo)$/i.test(msg.body)) {
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
      g_exp = /^[\/.`?]?g ([^#@]+)?$/;
      if (g_exp.test(msg.body)) {
        google.search(msg.body.match(g_exp)[1], function(results) {
          if (results.length) {
            return room.speak("" + results[0].titleNoFormatting + " - " + results[0].unescapedUrl, logger);
          } else {
            return room.speak("Sorry, no results for", logger);
          }
        });
      }
      mdc_exp = /^[\/.`?]?mdc ([^#@]+)(?:\s*#([1-9]))?$/;
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
            return room.speak("" + results[0].titleNoFormatting + " - " + results[0].unescapedUrl, logger);
          } else {
            return room.speak("Sorry, no results for", logger);
          }
        });
      }
    });
  });
});