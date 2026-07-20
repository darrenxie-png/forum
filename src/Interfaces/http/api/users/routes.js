const express = require('express');
const UsersHandler = require('./handler');

const createUsersRouter = ({ userRepository, passwordHash }) => {
  const router = express.Router();
  const handler = new UsersHandler({ userRepository, passwordHash });

  router.post('/users', handler.postUserHandler);

  return router;
};

module.exports = createUsersRouter;
