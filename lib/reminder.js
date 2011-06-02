var Note, User, api, _;
_ = require('underscore')._;
Note = require('./models').note;
User = require('./models').user;
api = {
  save: function(msg, callback) {
    var message, reg, user_name;
    reg = /^tell (\w+\s\w+|\@\w+)\s(.+)$/;
    user_name = reg.exec(msg.body)[1] || null;
    message = reg.exec(msg.body)[2] || null;
    if (/\@/.test(user_name)) {
      user_name = new RegExp(user_name.split('@')[1], 'i');
    }
    if (!(user_name && message)) {
      return;
    }
    return User.findOne({
      name: user_name
    }, function(err, target) {
      if (err) {
        return;
      }
      return User.findOne({
        user_id: msg.user_id
      }, function(err, sender) {
        var note;
        if (err) {
          return;
        }
        try {
          note = new Note({
            sender_id: msg.user_id,
            msg: message,
            target_id: target.user_id,
            target_name: target.name,
            sender_name: sender.name
          });
          return note.save(function(error) {
            if (_.isFunction(callback)) {
              callback.call(this, error);
            }
            return console.log(error ? error : "" + message + " saved");
          });
        } catch (error) {
          if (_.isFunction(callback)) {
            return callback.call(this, error);
          }
        }
      });
    });
  },
  poller: function(msg, room) {
    return Note.find({}, function(err, doc) {
      return _.each(doc, function(note) {
        if (msg.user_id === parseInt(note.target_id, 10)) {
          return room.speak("@" + (note.target_name.split(' ')[0]) + ", " + (note.sender_name.split(' ')[0]) + " says '" + note.msg + "'", function(d) {
            return note.remove();
          });
        }
      });
    });
  }
};
module.exports = api;