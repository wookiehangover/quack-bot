var _ = require('underscore')
  , c = require('./lib/vendor/campfire').Campfire
  , i = new c({ ssl: true, token: process.env.TOKEN, account: 'quickleft' })
  , m = require('./lib/models');


i.room(265458, function(r){
  r.show(function(x){
    _.each(x.room.users, function(u){
      console.log(u)

      m.user.findOne({ user_id: u.id }, function(err, doc){
      
        if( doc !== null ) {
          console.log(m.user.find({ user_id: u.id }));
          //return;
        }
        var user = new m.user({ avatar_url: u.avatar_url, user_id: u.id, email: u.email, name: u.name });

        console.log(user);

        user.save(function(s){
          console.log('saved',s);
        });

      });

    });

    //process.exit();
  });
});

