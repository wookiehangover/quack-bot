var ObjectId, Schema, models, mongo_url, mongoose, _;
_ = require('underscore')._;
mongoose = require('mongoose');
mongo_url = process.env.MONGOHQ_URL || 'mongodb://localhost/quack-bot';
mongoose.connect(mongo_url);
Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
models = {
  note: {
    sender_name: {
      type: String
    },
    sender_id: {
      type: Number
    },
    target_name: {
      type: String
    },
    target_id: {
      type: Number
    },
    msg: {
      type: String
    },
    date: {
      type: Date,
      "default": Date.now
    }
  },
  user: {
    avatar_url: {
      type: String
    },
    user_id: {
      type: Number,
      unique: true
    },
    email: {
      type: String
    },
    name: {
      type: String
    }
  },
  phrase: {
    regex: {
      type: String,
      unique: true
    },
    msg: {
      type: String
    }
  }
};
module.exports = {};
_.each(models, function(o, i) {
  mongoose.model(i, new Schema(o));
  return module.exports[i] = mongoose.model(i);
});