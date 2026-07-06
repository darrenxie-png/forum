const createServer = require('../../../../../Infrastructures/http/createServer');
const Jwt = require('@hapi/jwt');

describe('Replies API', () => {
  process.env.ACCESS_TOKEN_KEY = 'access_token_key_secret_for_testing_purposes_min32';
  process.env.REFRESH_TOKEN_KEY = 'refresh_token_key_secret_for_testing_purposes_min32';

  const mockThreadRepository = { verifyThreadExists: jest.fn(), addThread: jest.fn(), getThreadById: jest.fn() };
  const mockCommentRepository = { verifyCommentExists: jest.fn(), getCommentsByThreadId: jest.fn(), addComment: jest.fn(), deleteComment: jest.fn(), verifyCommentOwner: jest.fn() };
  const mockReplyRepository = {
    addReply: jest.fn(),
    deleteReply: jest.fn(),
    verifyReplyExists: jest.fn(),
    verifyReplyOwner: jest.fn(),
    getRepliesByCommentId: jest.fn(),
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
      likeRepository: { getLikeCountByCommentId: jest.fn().mockResolvedValue(0) },
    });

  const getAccessToken = () =>
    Jwt.token.generate({ id: 'user-123', username: 'darren' }, process.env.ACCESS_TOKEN_KEY);

  beforeEach(() => jest.clearAllMocks());

  describe('POST /threads/:threadId/comments/:commentId/replies', () => {
    it('should return 201 and added reply', async () => {
      mockThreadRepository.verifyThreadExists.mockResolvedValue(undefined);
      mockCommentRepository.verifyCommentExists.mockResolvedValue(undefined);
      mockReplyRepository.addReply.mockResolvedValue({
        id: 'reply-123',
        content: 'A reply',
        owner: 'user-123',
      });

      const server = await makeServer();
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: { content: 'A reply' },
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      expect(response.statusCode).toBe(201);
      const payload = JSON.parse(response.payload);
      expect(payload.status).toBe('success');
      expect(payload.data.addedReply.id).toBe('reply-123');
    });
  });

  describe('DELETE /threads/:threadId/comments/:commentId/replies/:replyId', () => {
    it('should return 200 on delete', async () => {
      mockThreadRepository.verifyThreadExists.mockResolvedValue(undefined);
      mockCommentRepository.verifyCommentExists.mockResolvedValue(undefined);
      mockReplyRepository.verifyReplyExists.mockResolvedValue(undefined);
      mockReplyRepository.verifyReplyOwner.mockResolvedValue(undefined);
      mockReplyRepository.deleteReply.mockResolvedValue(undefined);

      const server = await makeServer();
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload.status).toBe('success');
    });
  });
});
