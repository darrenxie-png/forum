const createServer = require('../../../../../Infrastructures/http/createServer');
const Jwt = require('@hapi/jwt');

describe('Comments API', () => {
  process.env.ACCESS_TOKEN_KEY = 'access_token_key_secret_for_testing_purposes_min32';
  process.env.REFRESH_TOKEN_KEY = 'refresh_token_key_secret_for_testing_purposes_min32';

  const mockThreadRepository = {
    verifyThreadExists: jest.fn(),
    addThread: jest.fn(),
    getThreadById: jest.fn(),
  };
  const mockCommentRepository = {
    addComment: jest.fn(),
    deleteComment: jest.fn(),
    verifyCommentExists: jest.fn(),
    verifyCommentOwner: jest.fn(),
    getCommentsByThreadId: jest.fn(),
  };

  const makeServer = () =>
    createServer({
      userRepository: {},
      authenticationRepository: {},
      authenticationTokenManager: {},
      passwordHash: {},
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: { getRepliesByCommentId: jest.fn().mockResolvedValue([]) },
      likeRepository: { getLikeCountByCommentId: jest.fn().mockResolvedValue(0) },
    });

  const getAccessToken = () =>
    Jwt.token.generate({ id: 'user-123', username: 'darren' }, process.env.ACCESS_TOKEN_KEY);

  beforeEach(() => jest.clearAllMocks());

  describe('POST /threads/:threadId/comments', () => {
    it('should return 201 and added comment', async () => {
      mockThreadRepository.verifyThreadExists.mockResolvedValue(undefined);
      mockCommentRepository.addComment.mockResolvedValue({
        id: 'comment-123',
        content: 'A comment',
        owner: 'user-123',
      });

      const server = await makeServer();
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: { content: 'A comment' },
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      expect(response.statusCode).toBe(201);
      const payload = JSON.parse(response.payload);
      expect(payload.status).toBe('success');
      expect(payload.data.addedComment.id).toBe('comment-123');
    });

    it('should return 401 when no auth', async () => {
      const server = await makeServer();
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: { content: 'A comment' },
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe('DELETE /threads/:threadId/comments/:commentId', () => {
    it('should return 200 on delete', async () => {
      mockThreadRepository.verifyThreadExists.mockResolvedValue(undefined);
      mockCommentRepository.verifyCommentExists.mockResolvedValue(undefined);
      mockCommentRepository.verifyCommentOwner.mockResolvedValue(undefined);
      mockCommentRepository.deleteComment.mockResolvedValue(undefined);

      const server = await makeServer();
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload.status).toBe('success');
    });
  });
});
