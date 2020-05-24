const crudControllers = require('../utils/crud');
const List = require('../database/schemas/List');

module.exports = crudControllers(List);
