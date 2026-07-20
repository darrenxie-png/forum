const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

const authMiddleware = (jwt) => (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthenticationError('Missing authentication'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.auth = { credentials: { id: decoded.id, username: decoded.username } };
    return next();
  } catch (error) {
    return next(new AuthenticationError('Missing authentication'));
  }
};

module.exports = authMiddleware;
