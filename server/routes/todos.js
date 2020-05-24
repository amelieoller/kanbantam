const express = require('express');
const { requireAuth } = require('./middleware');
const { Todo } = require('../database/schemas');
const controllers = require('../controllers/todos');

const router = express.Router();

module.exports = router;

router
  .route('/')
  .get(controllers.getMany, requireAuth)
  .post(controllers.createOne, requireAuth);

router
  .route('/:id')
  .put(controllers.updateOne, requireAuth)
  .delete(controllers.removeOne, requireAuth);

router.put('/complete', requireAuth, (req, res) => {
  Todo.findById(req.body.id, { __v: 0, user: 0 }, (err, todo) => {
    if (err) {
      res.status(400).send({ message: 'Toggle todo failed', err });
    } else {
      todo.completed = !todo.completed;
      todo.save((err, savedTodo) => {
        if (err) {
          res.status(400).send({ message: 'Toggle todo failed', err });
        } else {
          res.send({
            message: 'Toggled complete todo successfully',
            todo: savedTodo.hide(),
          });
        }
      });
    }
  });
});
