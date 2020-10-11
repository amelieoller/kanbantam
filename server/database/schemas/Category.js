const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');

const { Schema } = mongoose;

const categorySchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  board: { type: Schema.ObjectId, ref: 'Board', required: true },
  title: { type: String },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date },
  color: { type: String },
});

categorySchema.plugin(immutablePlugin);

categorySchema.methods.hide = function () {
  return R.omit(['__v'], this.toObject());
};

// categorySchema.pre('deleteOne', async function (next) {
//   // Delete all associated cards or remove that category from those cards
// });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
