const request = require('supertest');
const jwt = require('jsonwebtoken');
const createServer = require('../../../../../Infrastructures/http/createServer');
const NotFoundError = require('../../../../../Commons/exceptions/NotFoundError');

process.env.ACCESS_TOKEN_KEY = 'access_token_key_secret_for_testing_min32chars';
process.env.REFRESH_TOKEN_KEY = 'refresh_token_key_secret_for_testing_min32chars';

const getAccessToken = () => jwt.sign({ id: 'user-123', username: 'darren' }, process.env.ACCESS_TOKEN_KEY);

describe('Threads API', () => {
  const makeApp = (threadOverrides = {}, commentOverrides = {}) => {
    const mockThreadRepository = {
      addThread: jest.fn(),
      getThreadById: jest.fn(),
      verifyThreadExists: jest.fn(),
      ...threadOverrides,
    };
    const mockCommentRepository = {
      getCommentsByThreadId: jest.fn().mockResolvedValue([]),
      verifyCommentExists: jest.fn(),
      ...commentOverrides,
    };
    return createServer({
      userRepository: {},
      authenticationRepository: {},
      authenticationTokenManager: {},
      passwordHash: {},
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: { getRepliesByCommentId: jest.fn().mockResolvedValue([]) },
      likeRepository: { getLikeCountByCommentId: jest.fn().mockResolvedValue(0), isCommentLiked: jest.fn() },
    });
  };

  describe('POST /threads', () => {
    it('should return 201 and added thread', async () => {
      const app = makeApp({
        addThread: jest.fn().mockResolvedValue({ id: 'thread-123', title: 'Test Thread', owner: 'user-123' }),
      });
      const res = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${getAccessToken()}`)
        .send({ title: 'Test Thread', body: 'Body content' });
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.addedThread.id).toBe('thread-123');
    });

    it('should return 401 when no auth token', async () => {
      const res = await request(makeApp()).post('/threads').send({ title: 'Test', body: 'Body' });
      expect(res.statusCode).toBe(401);
    });

    it('should return 500 when addThread throws error', async () => {
      const app = makeApp({ addThread: jest.fn().mockRejectedValue(new Error('server error')) });
      const res = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${getAccessToken()}`)
        .send({ title: 'Test', body: 'Body' });
      expect(res.statusCode).toBe(500);
    });
  });

  describe('GET /threads/:threadId', () => {
    it('should return 200 with thread detail', async () => {
      const app = makeApp({
        getThreadById: jest.fn().mockResolvedValue({
          id: 'thread-123', title: 'Test Thread', body: 'Body', date: '2024-01-01', username: 'darren',
        }),
      });
      const res = await request(app).get('/threads/thread-123');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.thread.id).toBe('thread-123');
    });

    it('should return 404 when getThreadById throws NotFoundError', async () => {
      const app = makeApp({ getThreadById: jest.fn().mockRejectedValue(new NotFoundError('thread tidak ditemukan')) });
      const res = await request(app).get('/threads/thread-xxx');
      expect(res.statusCode).toBe(404);
    });
  });
});
