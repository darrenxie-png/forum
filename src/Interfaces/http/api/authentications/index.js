const AuthenticationsHandler = require('./handler');
const authenticationsRoutes = require('./routes');

const authenticationsPlugin = {
  name: 'authentications',
  register: async (server, { userRepository, authenticationRepository, authenticationTokenManager, passwordHash }) => {
    const handler = new AuthenticationsHandler({
      userRepository,
      authenticationRepository,
      authenticationTokenManager,
      passwordHash,
    });
    server.route(authenticationsRoutes(handler));
  },
};

module.exports = authenticationsPlugin;
