const createServer = require('../../../../../Infrastructures/http/createServer');
const Jwt = require('@hapi/jwt');

describe('Likes API', () => {
  process.env.ACCESS_TOKEN_KEY = 'access_token_key_secret_for_testing_purposes_min32';
  process.env.REFRESH_TOKEN_KEY = 'refresh_token_key_secret_for_testing_purposes_min32';

  const mockThreadRepository = { verifyThreadExists: jest.fn(), addThread: jest.fn(), getThreadById: jest.fn() };
  const mockCommentRepository = { verifyCommentExists: jest.fn(), getCommentsByThreadId: jest.fn(), addComment: jest.fn(), deleteComment: jest.fn(), verifyCommentOwner: jest.fn() };
  const mockLikeRepository = {
    isCommentLiked: jest.fn(),
    likeComment: jest.fn(),
    unlikeComment: jest.fn(),
    getLikeCountByCommentId: jest.fn(),
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
      likeRepository: mockLikeRepository,
    });

  const getAccessToken = () =>
    Jwt.token.generate({ id: 'user-123', username: 'darren' }, process.env.ACCESS_TOKEN_KEY);

  beforeEach(() => jest.clearAllMocks());

  describe('PUT /threads/:threadId/comments/:commentId/likes', () => {
    it('should return 200 when liking a comment', async () => {
      mockThreadRepository.verifyThreadExists.mockResolvedValue(undefined);
      mockCommentRepository.verifyCommentExists.mockResolvedValue(undefined);
      mockLikeRepository.isCommentLiked.mockResolvedValue(false);
      mockLikeRepository.likeComment.mockResolvedValue(undefined);

      const server = await makeServer();
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload.status).toBe('success');
    });

    it('should return 200 when unliking a comment', async () => {
      mockThreadRepository.verifyThreadExists.mockResolvedValue(undefined);
      mockCommentRepository.verifyCommentExists.mockResolvedValue(undefined);
      mockLikeRepository.isCommentLiked.mockResolvedValue(true);
      mockLikeRepository.unlikeComment.mockResolvedValue(undefined);

      const server = await makeServer();
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      expect(response.statusCode).toBe(200);
    });

    it('should return 401 when no auth', async () => {
      const server = await makeServer();
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
      });
      expect(response.statusCode).toBe(401);
    });
  });
});
