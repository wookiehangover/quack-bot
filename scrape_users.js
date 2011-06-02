var _ = require('underscore')
  , c = require('./lib/node-campfire/lib/campfire').Campfire
  , i = new c({ ssl: true, token: "6b3a87666606cbd5d101bddfbca288de8d84ed17", account: 'quickleft' })
  , m = require('./lib/models');


i.room(265458, function(r){ 
  r.show(function(x){
    _.each(x.room.users, function(u){

      m.user.findOne({ user_id: u.id }, function(err, doc){
      
        if( doc !== null ) {
          console.log(m.user.find({ user_id: u.id }));
          //return;
        }
        var user = new m.user({ avatar_url: u.avatar_url, user_id: u.id, email: u.email, name: u.name });

        //console.log(user);

        user.save(function(s){
          console.log('saved',s);
        });

      });

    });

    process.exit();
  });
});

