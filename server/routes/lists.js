const express = require('express');
const { requireAuth } = require('./middleware');
const { List } = require('../database/schemas');
const controllers = require('../controllers/lists');

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
