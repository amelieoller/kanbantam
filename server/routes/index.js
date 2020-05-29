const express = require('express');
const path = require('path');

const auth = require('./auth');
const user = require('./user');
const users = require('./users');
const todos = require('./todos');
const boards = require('./boards');
const lists = require('./lists');
const categories = require('./categories');

const router = express.Router();

router.use('/api/auth', auth);
router.use('/api/user', user);
router.use('/api/users', users);
router.use('/api/todos', todos);
router.use('/api/boards', boards);
router.use('/api/lists', lists);
router.use('/api/categories', categories);

router.get('/api/tags', (req, res) => {
  res.send([
    'MERN',
    'Node',
    'Express',
    'Webpack',
    'React',
    'Redux',
    'Mongoose',
    'Fontawesome',
    'Ramda',
    'ESLint',
    'Jest',
    'Enzyme',
  ]);
});

router.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
});

module.exports = router;
