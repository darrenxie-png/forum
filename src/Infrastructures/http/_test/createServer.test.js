const request = require('supertest');
const createServer = require('../createServer');

describe('Express Server', () => {
  const makeApp = (overrides = {}) =>
    createServer({
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

  it('should return 404 when request unknown route', async () => {
    const app = makeApp();
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });

  it('should handle ClientError and return correct status code', async () => {
    const app = makeApp();
    const res = await request(app).post('/users').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('should handle server error and return 500', async () => {
    const errorUserRepository = {
      verifyAvailableUsername: jest.fn().mockRejectedValue(new Error('unexpected server error')),
      addUser: jest.fn(),
    };
    const errorPasswordHash = { hash: jest.fn() };
    const app = makeApp({ userRepository: errorUserRepository, passwordHash: errorPasswordHash });
    const res = await request(app)
      .post('/users')
      .send({ username: 'darren', password: 'secret', fullname: 'Darren Dev' });
    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe('error');
  });

  it('should return 429 when rate limit exceeded on /threads', async () => {
    const app = makeApp();
    const responses = await Promise.all(
      Array.from({ length: 91 }, () => request(app).get('/threads/thread-xxx'))
    );
    const hasRateLimit = responses.some((r) => r.statusCode === 429);
    expect(hasRateLimit).toBe(true);
  });
});
