const express = require('express');
const { requireAuth } = require('./middleware');
const { Board } = require('../database/schemas');

const router = express.Router();

module.exports = router;

router.get('/', requireAuth, (req, res) => {
  Board.find({ user: req.user.id }, { __v: 0, user: 0 }, (err, boards) => {
    if (err) {
      res.status(400).send({ message: 'Get users failed', err });
    } else {
      res.send({ message: 'Boards retrieved successfully', boards });
    }
  });
});

router.get('/:id', requireAuth, (req, res) => {
  const boardId = req.params.id;

  Board.findOne(
    { user: req.user.id, _id: boardId },
    { __v: 0, user: 0 },
    (err, board) => {
      if (err) {
        res.status(400).send({ message: 'Get users failed', err });
      } else {
        res.send({ message: 'Board retrieved successfully', board });
      }
    },
  );
});

router.post('/', requireAuth, (req, res) => {
  req.body.user = req.user.id;

  const newBoard = Board(req.body);

  newBoard.save((err, savedBoard) => {
    if (err) {
      res.status(400).send({ message: 'Create board failed', err });
    } else {
      res.send({
        message: 'Board created successfully',
        board: savedBoard.hide(),
      });
    }
  });
});

router.put('/', requireAuth, (req, res) => {
  Board.findById(req.body.id, { __v: 0, user: 0 }, (err, board) => {
    if (err) {
      res.status(400).send({ message: 'Update board failed', err });
    } else {
      board.title = req.body.title;
      board.updated_at = Date.now();
      board.save((err, savedBoard) => {
        if (err) {
          res.status(400).send({ message: 'Update board failed', err });
        } else {
          res.send({
            message: 'Updated board successfully',
            board: savedBoard.hide(),
          });
        }
      });
    }
  });
});

router.delete('/', requireAuth, (req, res) => {
  Board.deleteOne({ _id: req.body.id }, (err) => {
    if (err) {
      res.status(400).send({ message: 'Delete board failed', err });
    } else {
      res.send({ message: 'Board successfully delete' });
    }
  });
});
