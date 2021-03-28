const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');

const { Schema } = mongoose;

const boardSchema = new Schema(
  {
    breakSessionLength: { type: Number, default: 5 },
    category: { type: String, default: '' },
    continuousPomodori: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, immutable: true },
    defaultCategory: { type: String, default: '' },
    defaultFocusList: { type: String, default: '' },
    defaultTimes: { type: Array, default: [0, 15, 30] },
    elapsedPomodori: { type: Object, default: {} },
    focusMode: { type: Boolean, default: false },
    focusToday: { type: String, default: '' },
    order: { type: Number, decimal: true, default: 0 },
    sidebarOpen: { type: Boolean, default: true },
    startFocusModeWithPomodoro: { type: Boolean, default: false },
    theme: { type: String, default: 'light' },
    title: { type: String, default: '' },
    totalPomodori: { type: Number, default: 0 },
    updatedAt: { type: Date },
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    workSessionLength: { type: Number, default: 25 },
  },
  { minimize: false },
);

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
