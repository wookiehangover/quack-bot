var Note, Reminder, User, room, test_user;
Reminder = require('../lib/reminder');
Note = require('../lib/models').note;
User = require('../lib/models').user;
test_user = new User({
  name: "Test Dude",
  user_id: 1,
  email: "test@quickleft.com"
});
room = {
  speak: function(msg, logger) {
    if (_.isFunction(logger)) {
      return logger({
        message: msg
      });
    }
  }
};
describe('Reminders', function() {
  it('should save a message with full name', function() {
    var msg;
    msg = {
      body: "tell Test Dude whatever man",
      user_id: 794174
    };
    test_user.save(function(error, user) {
      return Reminder.save(msg, function(e) {
        return Note.findOne({
          target_name: "Test Dude"
        }, function(err, doc) {
          expect(doc.target_name).toEqual("Test Dude");
          expect(doc.msg).toEqual("whatever man");
          doc.remove();
          User.remove({
            name: /Test/
          });
          return jasmine.asyncSpecDone();
        });
      });
    });
    return jasmine.asyncSpecWait();
  });
  return it('should save via the listener', function() {
    spyOn(Reminder, 'save');
    return test_user.save(function(error, user) {
      Reminder.listen({
        body: 'tell @test that his shits realy fly'
      }, room);
      expect(Reminder.save).toHaveBeenCalled();
      return User.remove({
        name: /Test/
      });
    });
  });
});