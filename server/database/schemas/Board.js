const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');

const { Schema } = mongoose;

const boardSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  category: { type: String, default: '' },
  title: { type: String },
  created_at: { type: Date, default: Date.now, immutable: true },
  updated_at: { type: Date },
  theme: { type: String },
  sidebarOpen: { type: Boolean },
  defaultTime: { type: Number },
  defaultCategory: { type: String },
  focusMode: { type: Boolean },
  defaultFocusList: { type: String },
});

boardSchema.plugin(immutablePlugin);

boardSchema.methods.hide = function () {
  return R.omit(['__v'], this.toObject());
};

boardSchema.pre('deleteOne', async function (next) {
  const boardId = this.getFilter()['_id'];
  const lists = await mongoose.model('List').find({ board: boardId }).exec();

  for (let i = 0; i < lists.length; i++) {
    const list = lists[i];

    await mongoose.model('List').deleteOne({ _id: list._id }, (err) => {
      if (err) {
        console.log(`Error on Board delete ${err}`);
        next(err);
      } else {
        console.log('Success deleting Board');
        next();
      }
    });
  }
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
