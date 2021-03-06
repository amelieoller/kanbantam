const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');

const { Schema } = mongoose;

const todoSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  board: { type: Schema.ObjectId, ref: 'Board', required: true },
  list: { type: Schema.ObjectId, ref: 'List', required: true },
  completedListId: { type: String },
  text: { type: String },
  important: { type: Boolean },
  minutes: { type: Number },
  elapsedMinutes: { type: Number, defaultValue: 0 },
  dueDate: { type: String },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date },
  order: { type: Number, decimal: true, defaultValue: '' },
  category: { type: String },
  highlighted: { type: Boolean, default: false },
});

todoSchema.plugin(immutablePlugin);

todoSchema.methods.hide = function () {
  return R.omit(['__v'], this.toObject());
};

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
