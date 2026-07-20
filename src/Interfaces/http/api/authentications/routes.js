const express = require('express');
const AuthenticationsHandler = require('./handler');

const createAuthenticationsRouter = ({ userRepository, authenticationRepository, authenticationTokenManager, passwordHash }) => {
  const router = express.Router();
  const handler = new AuthenticationsHandler({ userRepository, authenticationRepository, authenticationTokenManager, passwordHash });

  router.post('/authentications', handler.postAuthenticationHandler);
  router.put('/authentications', handler.putAuthenticationHandler);
  router.delete('/authentications', handler.deleteAuthenticationHandler);

  return router;
};

module.exports = createAuthenticationsRouter;
