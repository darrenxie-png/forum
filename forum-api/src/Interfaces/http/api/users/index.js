const UsersHandler = require('./handler');
const usersRoutes = require('./routes');

const usersPlugin = {
  name: 'users',
  register: async (server, { userRepository, passwordHash }) => {
    const handler = new UsersHandler({ userRepository, passwordHash });
    server.route(usersRoutes(handler));
  },
};

module.exports = usersPlugin;
