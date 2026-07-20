const ClientError = require('../../../Commons/exceptions/ClientError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({ status: 'fail', message: err.message });
  }

  console.error(err);
  return res.status(500).json({ status: 'error', message: 'terjadi kegagalan pada server kami' });
};

module.exports = errorHandler;
