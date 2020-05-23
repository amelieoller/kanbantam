const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');
const { Todo } = require('./');

const { Schema } = mongoose;

const listSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  board: { type: Schema.ObjectId, ref: 'Board', required: true },
  title: { type: String },
  completed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now, immutable: true },
  updated_at: { type: Date },
});

listSchema.plugin(immutablePlugin);

listSchema.methods.hide = function () {
  return R.omit(['__v'], this.toObject());
};

listSchema.pre('deleteOne', function (next) {
  const listId = this.getQuery()['_id'];

  mongoose.model('Todo').deleteMany({ list: listId }, function (err, result) {
    if (err) {
      console.log(`Error on List delete ${err}`);
      next(err);
    } else {
      console.log('Success deleting List');
      next();
    }
  });
});

const List = mongoose.model('List', listSchema);

module.exports = List;
