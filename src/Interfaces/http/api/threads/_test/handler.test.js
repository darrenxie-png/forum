const createServer = require('../../../../../Infrastructures/http/createServer');
const Jwt = require('@hapi/jwt');

describe('Threads API', () => {
  process.env.ACCESS_TOKEN_KEY = 'access_token_key_secret_for_testing_purposes_min32';
  process.env.REFRESH_TOKEN_KEY = 'refresh_token_key_secret_for_testing_purposes_min32';

  const mockThreadRepository = {
    addThread: jest.fn(),
    getThreadById: jest.fn(),
    verifyThreadExists: jest.fn(),
  };
  const mockCommentRepository = {
    getCommentsByThreadId: jest.fn(),
    verifyCommentExists: jest.fn(),
  };
  const mockReplyRepository = {
    getRepliesByCommentId: jest.fn(),
  };
  const mockLikeRepository = {
    getLikeCountByCommentId: jest.fn(),
    isCommentLiked: jest.fn(),
  };

  const makeServer = () =>
    createServer({
      userRepository: {},
      authenticationRepository: {},
      authenticationTokenManager: {},
      passwordHash: {},
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

  const getAccessToken = () =>
    Jwt.token.generate({ id: 'user-123', username: 'darren' }, process.env.ACCESS_TOKEN_KEY);

  beforeEach(() => jest.clearAllMocks());

  describe('POST /threads', () => {
    it('should return 201 and added thread', async () => {
      mockThreadRepository.addThread.mockResolvedValue({
        id: 'thread-123',
        title: 'Test Thread',
        owner: 'user-123',
      });

      const server = await makeServer();
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'Test Thread', body: 'Body content' },
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      expect(response.statusCode).toBe(201);
      const payload = JSON.parse(response.payload);
      expect(payload.status).toBe('success');
      expect(payload.data.addedThread.id).toBe('thread-123');
    });

    it('should return 401 when no auth token', async () => {
      const server = await makeServer();
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'Test Thread', body: 'Body content' },
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /threads/:threadId', () => {
    it('should return 200 with thread detail', async () => {
      mockThreadRepository.getThreadById.mockResolvedValue({
        id: 'thread-123',
        title: 'Test Thread',
        body: 'Body',
        date: '2024-01-01',
        username: 'darren',
      });
      mockCommentRepository.getCommentsByThreadId.mockResolvedValue([
        { id: 'comment-1', username: 'user1', date: '2024-01-01', content: 'A comment', is_deleted: false },
      ]);
      mockReplyRepository.getRepliesByCommentId.mockResolvedValue([]);
      mockLikeRepository.getLikeCountByCommentId.mockResolvedValue(0);

      const server = await makeServer();
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload.status).toBe('success');
      expect(payload.data.thread.id).toBe('thread-123');
    });
  });
});
