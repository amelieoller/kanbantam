const express = require('express');
const { requireAuth } = require('./middleware');
const controllers = require('../controllers/boards');

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
