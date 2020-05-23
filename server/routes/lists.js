const express = require('express');
const { requireAuth } = require('./middleware');
const { List } = require('../database/schemas');

const router = express.Router();

module.exports = router;

router.get('/', requireAuth, (req, res) => {
  const board = req.query.boardId;

  List.find({ user: req.user.id, board: board }, { __v: 0, user: 0 }, (err, lists) => {
    if (err) {
      res.status(400).send({ message: 'Get users failed', err });
    } else {
      res.send({ message: 'Lists retrieved successfully', lists });
    }
  });
});

router.post('/', requireAuth, (req, res) => {
  req.body.user = req.user.id;

  const newList = List(req.body);

  newList.save((err, savedList) => {
    if (err) {
      res.status(400).send({ message: 'Create list failed', err });
    } else {
      res.send({
        message: 'List created successfully',
        list: savedList.hide(),
      });
    }
  });
});

router.put('/complete', requireAuth, (req, res) => {
  List.findById(req.body.id, { __v: 0, user: 0 }, (err, list) => {
    if (err) {
      res.status(400).send({ message: 'Toggle list failed', err });
    } else {
      list.completed = !list.completed;
      list.save((err, savedList) => {
        if (err) {
          res.status(400).send({ message: 'Toggle list failed', err });
        } else {
          res.send({
            message: 'Toggled complete list successfully',
            list: savedList.hide(),
          });
        }
      });
    }
  });
});

router.put('/', requireAuth, (req, res) => {
  List.findById(req.body.id, { __v: 0, user: 0 }, (err, list) => {
    if (err) {
      res.status(400).send({ message: 'Update list failed', err });
    } else {
      list.title = req.body.title;
      list.updated_at = Date.now();
      list.save((err, savedList) => {
        if (err) {
          res.status(400).send({ message: 'Update list failed', err });
        } else {
          res.send({
            message: 'Updated list successfully',
            list: savedList.hide(),
          });
        }
      });
    }
  });
});

router.delete('/', requireAuth, (req, res) => {
  List.deleteOne({ _id: req.body.id }, (err) => {
    if (err) {
      res.status(400).send({ message: 'Delete list failed', err });
    } else {
      res.send({ message: 'List successfully delete' });
    }
  });
});
