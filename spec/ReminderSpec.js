var Note, Reminder, User, test_user;
Reminder = require('../lib/reminder');
Note = require('../lib/models').note;
User = require('../lib/models').user;
test_user = new User({
  name: "Test Dude",
  user_id: 1,
  email: "test@quickleft.com"
});
describe('Reminders', function() {
  return it('should save a message with full name', function() {
    test_user.save(function(error, user) {
      var msg;
      msg = {
        body: "tell Test Dude whatever man",
        user_id: 794174
      };
      return Reminder.save(msg, function(e) {
        return Note.find({
          name: "Test Dude"
        }, function(err, doc) {
          expect(doc.target_name).toEqual("Test Dude");
          test_user.remove();
          return jasmine.asyncSpecDone();
        });
      });
    });
    return jasmine.asyncSpecWait();
  });
});