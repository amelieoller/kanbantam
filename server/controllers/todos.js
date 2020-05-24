const crudControllers = require('../utils/crud');
const Todo = require('../database/schemas/Todo');

module.exports = crudControllers(Todo);
