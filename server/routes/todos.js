const express = require('express');
const { requireAuth } = require('./middleware');
const controllers = require('../controllers/todos');
const mongoose = require('mongoose');

const router = express.Router();

module.exports = router;

router
  .route('/')
  .get(controllers.getMany, requireAuth)
  .post(controllers.createOne, requireAuth);

router.put('/complete', requireAuth, async (req, res) => {
  // find list
  const completedList = await mongoose
    .model('List')
    .findOne({ title: 'complete', special: true });

  const listId = completedList._id;

  try {
    const updatedDoc = await mongoose
      .model('Todo')
      .findOneAndUpdate(
        {
          user: req.user._id,
          _id: req.body.id,
        },
        { ...req.body, updated_at: Date.now(), list: listId, completed: true },
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedDoc) {
      return res.status(400).send({ message: 'Update of doc failed' });
    }

    res.status(200).send({ message: 'Doc updated successfully', data: updatedDoc });
  } catch (e) {
    console.log('ERROR', e);
    res.status(400).send({ message: 'Update of doc failed' });
  }
});

router
  .route('/:id')
  .put(controllers.updateOne, requireAuth)
  .delete(controllers.removeOne, requireAuth);
