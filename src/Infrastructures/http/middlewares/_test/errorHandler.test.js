const errorHandler = require('../errorHandler');
const ClientError = require('../../../../Commons/exceptions/ClientError');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../../Commons/exceptions/NotFoundError');

describe('errorHandler', () => {
  const mockNext = jest.fn();

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('should handle ClientError and return correct status code', () => {
    const error = new InvariantError('Bad request');
    errorHandler(error, {}, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ status: 'fail', message: 'Bad request' });
  });

  it('should handle NotFoundError and return 404', () => {
    const error = new NotFoundError('Not found');
    errorHandler(error, {}, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  it('should handle unknown error and return 500', () => {
    const error = new Error('unexpected error');
    errorHandler(error, {}, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ status: 'error', message: 'terjadi kegagalan pada server kami' });
  });
});
