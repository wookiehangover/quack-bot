var ObjectId, Schema, mongoose, note, user, _;
mongoose = require('mongoose');
_ = require('underscore')._;
mongoose.connect(process.env.MONGOHQ_URL);
Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
note = {
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
};
user = {
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
};
mongoose.model('note', new Schema(note));
mongoose.model('user', new Schema(user));
module.exports = {
  note: mongoose.model('note'),
  user: mongoose.model('user')
};