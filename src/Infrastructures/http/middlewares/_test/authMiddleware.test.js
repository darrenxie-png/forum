const authMiddleware = require('../authMiddleware');

describe('authMiddleware', () => {
  const mockJwt = {
    verify: jest.fn(),
  };

  const mockNext = jest.fn();
  const mockRes = {};

  beforeEach(() => jest.clearAllMocks());

  it('should call next with error when no authorization header', () => {
    const middleware = authMiddleware(mockJwt);
    const mockReq = { headers: {} };
    middleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should call next with error when authorization does not start with Bearer', () => {
    const middleware = authMiddleware(mockJwt);
    const mockReq = { headers: { authorization: 'Basic token' } };
    middleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should call next with error when token is invalid', () => {
    mockJwt.verify.mockImplementation(() => { throw new Error('invalid'); });
    const middleware = authMiddleware(mockJwt);
    const mockReq = { headers: { authorization: 'Bearer invalid_token' } };
    middleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should set req.auth and call next when token is valid', () => {
    process.env.ACCESS_TOKEN_KEY = 'access_token_key_secret_for_testing_min32chars';
    mockJwt.verify.mockReturnValue({ id: 'user-1', username: 'darren' });
    const middleware = authMiddleware(mockJwt);
    const mockReq = { headers: { authorization: 'Bearer valid_token' } };
    middleware(mockReq, mockRes, mockNext);
    expect(mockReq.auth).toEqual({ credentials: { id: 'user-1', username: 'darren' } });
    expect(mockNext).toHaveBeenCalledWith();
  });
});
