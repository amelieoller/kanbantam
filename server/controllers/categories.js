const crudControllers = require('../utils/crud');
const Category = require('../database/schemas/Category');

module.exports = crudControllers(Category);
