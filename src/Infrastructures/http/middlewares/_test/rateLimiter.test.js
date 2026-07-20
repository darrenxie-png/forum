const rateLimiter = require('../rateLimiter');

describe('rateLimiter', () => {
  const mockNext = jest.fn();
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    rateLimiter.rateLimitStore.clear();
  });

  it('should call next for non-threads path', () => {
    const mockReq = { path: '/users', ip: '127.0.0.1' };
    rateLimiter(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next for threads path when under limit', () => {
    const mockReq = { path: '/threads', ip: '10.0.0.1' };
    rateLimiter(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should return 429 when rate limit exceeded', () => {
    const ip = '192.168.1.1';
    rateLimiter.rateLimitStore.set(ip, { count: 90, startTime: Date.now() });
    const mockReq = { path: '/threads/test', ip };
    rateLimiter(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(429);
  });

  it('should reset count when time window has expired', () => {
    const ip = 'test-reset-ip';
    rateLimiter.rateLimitStore.set(ip, { count: 90, startTime: Date.now() - 61 * 1000 });
    const mockReq = { path: '/threads/test', ip };
    rateLimiter(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
    expect(rateLimiter.rateLimitStore.get(ip).count).toBe(1);
  });

  it('should return true from isRateLimited when count reaches limit', () => {
    const ip = 'test-limit-ip';
    rateLimiter.rateLimitStore.set(ip, { count: 90, startTime: Date.now() });
    const result = rateLimiter.isRateLimited(ip);
    expect(result).toBe(true);
  });
});
