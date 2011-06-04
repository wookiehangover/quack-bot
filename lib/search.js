var Google, google, logger, unescape;
Google = require('./vendor/google');
unescape = require('./vendor/unescape');
google = new Google();
logger = function(d) {
  try {
    return console.log("" + d.message.created_at + ": " + d.message.body);
  } catch (e) {
    return console.log(d);
  }
};
module.exports = {
  listen: function(msg, room) {
    var g_exp, jq_exp, mdc_exp, yt_exp;
    g_exp = /^g ([^#@]+)?$/;
    mdc_exp = /^mdc ([^#@]+)(?:\s*#([1-9]))?$/;
    yt_exp = /^[\/.`?]?yt ([^#@]+)(?:\s*#([1-9]))?$/;
    jq_exp = /^jq ([^#@]+)(?:\s*#([1-9]))?$/;
    if (g_exp.test(msg.body)) {
      google.search(msg.body.match(g_exp)[1], function(results) {
        if (results.length) {
          return room.speak("" + results[0].titleNoFormatting + " - " + results[0].unescapedUrl, logger);
        } else {
          return room.speak("Sorry, no results for", logger);
        }
      });
    }
    if (jq_exp.test(msg.body)) {
      google.search(msg.body.match(jq_exp)[1] + ' site:api.jquery.com', function(results) {
        if (results.length) {
          return room.speak("" + (results[0].titleNoFormatting.replace('–', '-')) + " - " + results[0].unescapedUrl, logger);
        } else {
          return room.speak("Sorry, no results for", logger);
        }
      });
    }
    if (mdc_exp.test(msg.body)) {
      google.search(msg.body.match(mdc_exp)[1] + ' site:developer.mozilla.org', function(results) {
        if (results.length) {
          return room.speak("" + results[0].titleNoFormatting + " - " + results[0].unescapedUrl, logger);
        } else {
          return room.speak("Sorry, no results for", logger);
        }
      });
    }
    if (yt_exp.test(msg.body)) {
      return google.search(msg.body.match(yt_exp)[1] + ' site:youtube.com', function(results) {
        if (results.length) {
          return room.speak("" + results[0].unescapedUrl, logger);
        } else {
          return room.speak("Sorry, no results for", logger);
        }
      });
    }
  }
};