const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');

const { Schema } = mongoose;

const listSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  board: { type: Schema.ObjectId, ref: 'Board', required: true },
  title: { type: String },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date },
  order: { type: Number, decimal: true, defaultValue: '' },
  special: { type: Boolean, default: false },
});

listSchema.plugin(immutablePlugin);

listSchema.methods.hide = function () {
  return R.omit(['__v'], this.toObject());
};

listSchema.pre('findOneAndRemove', async function (next) {
  const listId = this.getFilter()['_id'].toString();

  // Delete all todos associated with this list
  mongoose.model('Todo').deleteMany({ list: listId }, function (err) {
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
