const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');

const { Schema } = mongoose;

const listSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  board: { type: Schema.ObjectId, ref: 'Board', required: true },
  title: { type: String },
  created_at: { type: Date, default: Date.now, immutable: true },
  updated_at: { type: Date },
});

listSchema.plugin(immutablePlugin);

listSchema.methods.hide = function () {
  return R.omit(['__v'], this.toObject());
};

listSchema.post('save', async function (doc) {
  // When a new list is added, it should go to the end of orderedTodos for that board
  const listId = doc._id.toString();

  const boardToUpdate = await mongoose.model('Board').findOne({
    user: doc.user,
    _id: doc.board,
  });

  boardToUpdate.orderedTodos.set(listId, []);
  boardToUpdate.orderedLists.push(listId);

  boardToUpdate.save(() => {});
});

listSchema.pre('findOneAndRemove', async function (next) {
  const listId = this.getFilter()['_id'].toString();
  const userId = this.getFilter()['user'];

  const list = await mongoose
    .model('List')
    .findOne({
      user: userId,
      _id: listId,
    })
    .exec();

  // Delete list in orderedTodos for board
  const boardToUpdate = await mongoose
    .model('Board')
    .findOne({
      user: userId,
      _id: list.board,
    })
    .exec();

  // Update orderedLists
  boardToUpdate.orderedLists.pull(listId);

  // Update orderedTodos
  boardToUpdate.orderedTodos.set(listId, undefined);

  boardToUpdate.save(() => {});

  // Delete all todos associated with this list
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
