# Module Dependencies
mongoose  = require 'mongoose'
_ = require('underscore')._

# connect db adapter
mongoose.connect('mongodb://localhost/quack-bot')

Schema    = mongoose.Schema
ObjectId  = Schema.ObjectId

note =
  sender_name:
    type: String
  sender_id:
    type: Number
  target_name:
    type: String
  target_id:
    type: Number
  msg:
    type: String
  date:
    type: Date
    default: Date.now

mongoose.model 'note', new Schema( note )

module.exports =
  note: mongoose.model('note')

