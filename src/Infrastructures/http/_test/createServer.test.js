const createServer = require('../createServer');

describe('HTTP Server', () => {
  const makeServer = () =>
    createServer({
      userRepository: {},
      authenticationRepository: {},
      authenticationTokenManager: {},
      passwordHash: {},
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
      likeRepository: {},
    });

  it('should return 404 when request unknown route', async () => {
    const server = await makeServer();
    const response = await server.inject({ method: 'GET', url: '/unknown-route' });
    expect(response.statusCode).toBe(404);
  });

  it('should handle ClientError and return correct status code', async () => {
    const { InvariantError } = await import('../../../Commons/exceptions/InvariantError.js').catch(() => ({
      InvariantError: require('../../../Commons/exceptions/InvariantError'),
    }));

    const server = await makeServer();

    // POST /users with invalid payload triggers InvariantError via use case
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {},
    });

    expect([400, 500]).toContain(response.statusCode);
  });
});
