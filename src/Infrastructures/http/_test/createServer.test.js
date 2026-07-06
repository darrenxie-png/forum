const createServer = require('../createServer');

describe('HTTP Server', () => {
  const makeServer = async (overrides = {}) => {
    return createServer({
      userRepository: {},
      authenticationRepository: {},
      authenticationTokenManager: {},
      passwordHash: {},
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
      likeRepository: {},
      ...overrides,
    });
  };

  it('should return 404 when request unknown route', async () => {
    const server = await makeServer();
    const response = await server.inject({ method: 'GET', url: '/unknown' });
    expect(response.statusCode).toBe(404);
  });

  it('should handle ClientError and return 400', async () => {
    const server = await makeServer();
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: { username: 'darren' },
    });
    expect(response.statusCode).toBe(400);
    const payload = JSON.parse(response.payload);
    expect(payload.status).toBe('fail');
  });

  it('should handle server error and return 500', async () => {
    const errorUserRepository = {
      verifyAvailableUsername: jest.fn().mockRejectedValue(new Error('unexpected server error')),
      addUser: jest.fn(),
    };
    const errorPasswordHash = { hash: jest.fn() };
    const server = await makeServer({
      userRepository: errorUserRepository,
      passwordHash: errorPasswordHash,
    });
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: { username: 'darren', password: 'secret', fullname: 'Darren Dev' },
    });
    expect(response.statusCode).toBe(500);
    const payload = JSON.parse(response.payload);
    expect(payload.status).toBe('error');
  });
});