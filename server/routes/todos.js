const express = require('express');
const { requireAuth } = require('./middleware');
const controllers = require('../controllers/todos');
const { Todo } = require('../database/schemas');

const router = express.Router();

module.exports = router;

router.get('/', requireAuth, async (req, res) => {
  const user = req.user._id;
  const board = req.query.boardId;
  const completed = req.query.completed;

  try {
    let docs
    if(board) {
      if(completed === "true") {
        docs = await Todo.find({ user, board, completedAt: { $exists: true, $ne: null } }, { __v: 0, user: 0 }).lean().exec();
      } else {
        docs = await Todo.find({ user, board, completedAt: { $exists: false } }, { __v: 0, user: 0 }).lean().exec();
      }
    }
    
    res.status(200).send({ message: 'Docs retrieved successfully', data: docs });
  } catch (e) {
    console.log('ERROR', e);
    res.status(400).send({ message: 'Retrieving of docs failed', e });
  }
});

router.route('/').post(controllers.createOne, requireAuth);

router
  .route('/:id')
  .put(controllers.updateOne, requireAuth)
  .delete(controllers.removeOne, requireAuth);

