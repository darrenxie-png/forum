const UsersHandler = require('./handler');

const usersRoutes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
];

module.exports = usersRoutes;
