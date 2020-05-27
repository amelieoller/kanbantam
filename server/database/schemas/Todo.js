const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');

const { Schema } = mongoose;

const todoSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  board: { type: Schema.ObjectId, ref: 'Board', required: true },
  list: { type: Schema.ObjectId, ref: 'List', required: true },
  text: { type: String },
  difficulty: { type: Number },
  minutes: { type: Number },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now, immutable: true },
  updated_at: { type: Date },
});

todoSchema.plugin(immutablePlugin);

todoSchema.methods.hide = function () {
  return R.omit(['__v'], this.toObject());
};

todoSchema.post('save', async function (doc) {
  // When a new list is added, it should go to the end of orderedTodos for that board
  const todoId = doc._id.toString();
  const listId = doc.list.toString();

  const boardToUpdate = await mongoose
    .model('Board')
    .findOne({
      user: doc.user,
      _id: doc.board,
    })
    .exec();

  const todos = boardToUpdate.orderedTodos.get(listId);
  boardToUpdate.orderedTodos.set(listId, [...todos, todoId]);

  boardToUpdate.save(() => {});
});

todoSchema.pre('findOneAndRemove', async function (next) {
  // When a todo is removed is also needs to be removed from the orderedTodos array for that listId
  const todoId = this.getFilter()['_id'];
  const userId = this.getFilter()['user'];

  const todo = await mongoose
    .model('Todo')
    .findOne({
      user: userId,
      _id: todoId,
    })
    .exec();

  const boardToUpdate = await mongoose
    .model('Board')
    .findOne({
      user: userId,
      _id: todo.board,
    })
    .exec();

  const listId = todo.list.toString();
  const todos = boardToUpdate.orderedTodos.get(listId);

  const index = todos.indexOf(todoId);
  const newArr = [...todos];
  if (index !== -1) newArr.splice(index, 1);

  boardToUpdate.orderedTodos.set(listId, newArr);
  boardToUpdate.save(() => {});
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
