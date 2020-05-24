const crudControllers = require('../utils/crud');
const Board = require('../database/schemas/Board');

module.exports = crudControllers(Board);
