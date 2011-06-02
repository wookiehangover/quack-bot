var User = require('./lib/models').user,
    u;

function logger(err, doc){
  console.log("saved");
}

u = new User({ "name" : "Collin Schaafsma", "user_id" : 600701, "avatar_url" : "http://asset0.37img.com/global/7c3e0170e2ea75dd05bc9fac18a7fb4883e3211c/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "Ingrid Alongi", "user_id" : 600704, "avatar_url" : "http://asset0.37img.com/global/7ba682ed7ea7dd0b2d5201fd99b479b106f67504/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "Nico Valencia", "user_id" : 612936, "avatar_url" : "http://asset0.37img.com/global/a166cebca915b54e9d0666b72cb330973a057975/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "David Aragon", "user_id" : 663660, "avatar_url" : "http://asset0.37img.com/global/missing/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "Ryan Cook", "user_id" : 666967, "avatar_url" : "http://asset0.37img.com/global/missing/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "Taylor Beseda", "user_id" : 776999, "avatar_url" : "http://asset0.37img.com/global/6fbc200d4f8c39cff9bfca96b4b94617aa6cfd8a/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "Steven Hubert", "user_id" : 803088, "avatar_url" : "http://asset0.37img.com/global/missing/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "Jessica Dillon", "user_id" : 844756, "avatar_url" : "http://asset0.37img.com/global/missing/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "Brent Ertz", "user_id" : 905367, "avatar_url" : "http://asset0.37img.com/global/missing/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "Gerred Dillon", "user_id" : 726332, "avatar_url" : "http://asset0.37img.com/global/missing/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "Quick Bot", "user_id" : 794174, "avatar_url" : "http://asset0.37img.com/global/missing/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "Samuel Breed", "user_id" : 600703, "avatar_url" : "http://asset0.37img.com/global/e753dd30948e31968c0a1962735fdb7d71245fc4/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "Becca Gallery", "user_id" : 707812, "avatar_url" : "http://asset0.37img.com/global/missing/avatar.png?r=3" }).save(logger);

u = new User({ "name" : "John Wright", "user_id" : 856042, "avatar_url" : "http://asset0.37img.com/global/missing/avatar.png?r=3" }).save(logger);

