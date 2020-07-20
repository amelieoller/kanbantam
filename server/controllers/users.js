const crudControllers = require('../utils/crud');
const User = require('../database/schemas/User');

module.exports = crudControllers(User);
