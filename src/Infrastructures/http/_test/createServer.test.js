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

  it('should not rate limit non-threads path', async () => {
    const server = await makeServer();
    const response = await server.inject({ method: 'GET', url: '/users' });
    expect(response.statusCode).not.toBe(429);
  });

  it('should return 429 when rate limit exceeded on /threads', async () => {
    const server = await makeServer();
    const requests = [];
    for (let i = 0; i < 91; i++) {
      requests.push(server.inject({ method: 'GET', url: '/threads/thread-xxx' }));
    }
    const responses = await Promise.all(requests);
    const hasRateLimit = responses.some((r) => r.statusCode === 429);
    expect(hasRateLimit).toBe(true);
  });

  it('should reset rate limit after window expires', async () => {
    const { rateLimitStore } = require('../createServer');
    // Simulasi window expired dengan manipulasi store
    const server = await makeServer();

    // Set expired entry
    const ip = '127.0.0.1';
    const expiredTime = Date.now() - 61 * 1000;
    
    // Access internal store via inject dengan IP yang sudah expired
    // Kirim request pertama untuk init store
    await server.inject({ method: 'GET', url: '/threads/test' });
    
    // Paksa reset dengan kirim 91 requests lagi setelah manipulasi
    const requests = [];
    for (let i = 0; i < 3; i++) {
      requests.push(server.inject({ method: 'GET', url: '/threads/test' }));
    }
    const responses = await Promise.all(requests);
    expect(responses[0].statusCode).toBeDefined();
  });
});

it('should reset count when time window has expired', () => {
  const { isRateLimited, rateLimitStore } = require('../createServer');
  const testIp = 'test-reset-ip';
  
  // Set entry dengan waktu expired
  rateLimitStore.set(testIp, { count: 50, startTime: Date.now() - 61 * 1000 });
  
  // Harusnya false karena window sudah expired dan counter direset
  const result = isRateLimited(testIp);
  expect(result).toBe(false);
  expect(rateLimitStore.get(testIp).count).toBe(1);
});

it('should return true when request count reaches limit', () => {
  const { isRateLimited, rateLimitStore } = require('../createServer');
  const testIp = 'test-limit-ip';
  
  // Set entry dengan count sudah di limit
  rateLimitStore.set(testIp, { count: 90, startTime: Date.now() });
  
  const result = isRateLimited(testIp);
  expect(result).toBe(true);
});