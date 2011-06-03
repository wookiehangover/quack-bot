var Phrases, models, room, _;
_ = require('underscore')._;
Phrases = require('../lib/phrases');
models = require('../lib/models');
room = {
  speak: function(msg, logger) {
    if (_.isFunction(logger)) {
      return logger({
        message: msg
      });
    }
  }
};
describe('Phrases', function() {
  it('should match and speak static phrases', function() {
    spyOn(room, 'speak');
    Phrases.listen({
      body: "wet"
    }, room);
    return expect(room.speak).toHaveBeenCalled();
  });
  it('should not match non-(static) phrases', function() {
    spyOn(room, 'speak');
    Phrases.listen({
      body: "ertyuiuytrertyui"
    }, room);
    return expect(room.speak).not.toHaveBeenCalled();
  });
  it('should match complex (static) phrases', function() {
    var lock;
    lock = 0;
    spyOn(room, 'speak').andCallFake(function(msg, logger) {
      return lock++;
    });
    Phrases.listen({
      body: 'deal'
    }, room);
    expect(room.speak).toHaveBeenCalled();
    return expect(lock).toEqual(2);
  });
  it('should register new phrases', function() {
    var len;
    spyOn(room, 'speak');
    len = Phrases.phrases.length;
    Phrases.register(/test/, "test");
    expect(len + 1).toEqual(Phrases.phrases.length);
    Phrases.listen({
      body: 'test'
    }, room);
    return expect(room.speak).toHaveBeenCalled();
  });
  it('should call your registerd callbacks', function() {
    var holla;
    holla = {
      back: function() {}
    };
    spyOn(holla, 'back');
    spyOn(room, 'speak');
    Phrases.register(/holla/, 'back', holla.back);
    Phrases.listen({
      body: 'holla'
    }, room);
    return expect(holla.back).toHaveBeenCalled();
  });
  it('should store phrases persistently', function() {
    Phrases.store('testing', 'this is just a test', function() {
      return models.phrase.findOne({
        msg: 'this is just a test'
      }, function(err, doc) {
        expect(doc.msg).toEqual('this is just a test');
        doc.remove();
        return jasmine.asyncSpecDone();
      });
    });
    return jasmine.asyncSpecWait();
  });
  return it('should remove phrases', function() {
    Phrases.store('testing', 'this is just a test', function() {
      return Phrases.remove('testing', function() {
        return models.phrase.find({
          regex: 'testing'
        }, function(err, doc) {
          expect(doc).toEqual([]);
          return jasmine.asyncSpecDone();
        });
      });
    });
    return jasmine.asyncSpecWait();
  });
});