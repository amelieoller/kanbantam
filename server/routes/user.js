const express = require('express');
const bcrypt = require('bcryptjs');
const { requireAuth } = require('./middleware');
const { User } = require('../database/schemas');
const controllers = require('../controllers/users');

const router = express.Router();

module.exports = router;

router.delete('/', requireAuth, async (req, res) => {
  try {
    const removed = await User.findOneAndRemove({
      _id: req.user._id,
    });

    if (!removed) {
      return res.status(400).send({ message: 'Removing of doc failed' });
    }

    return res.status(200).send({ message: 'Doc removed successfully', data: removed });
  } catch (e) {
    console.log('ERROR', e);
    res.status(400).send({ message: 'Removing of doc failed', e });
  }
});

router.get('/', (req, res) => {
  const user = (req.user && req.user.hidePassword()) || {};

  res.send({ message: 'User info successfully retrieved', user });
});

router.put('/password', requireAuth, (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (req.user.validPassword(oldPassword)) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        res.status(400).send({ err, message: 'Error updating password' });
      }
      bcrypt.hash(newPassword, salt, (err, hash) => {
        if (err) {
          res.status(400).send({ err, message: 'Error updating password' });
        }
        User.findByIdAndUpdate({ _id: req.user._id }, { password: hash }, (err) => {
          if (err) {
            res.status(400).send({ err, message: 'Error updating password' });
          }
          res.status(200).send({ message: 'Password successfully updated' });
        });
      });
    });
  } else {
    res.status(400).send({ message: 'Old password did not match' });
  }
});

router.put('/', requireAuth, (req, res) => {
  req.body.updatedAt = Date.now();

  User.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: true }, (err, user) => {
    if (err) {
      res.status(400).send({ err, message: 'Error updating user' });
    }
    res.status(200).send({
      message: 'User successfully updated',
      user: user.hidePassword(),
    });
  });
});
