const request = require('supertest');
const jwt = require('jsonwebtoken');
const createServer = require('../../../../../Infrastructures/http/createServer');

process.env.ACCESS_TOKEN_KEY = 'access_token_key_secret_for_testing_min32chars';

const getAccessToken = () => jwt.sign({ id: 'user-123', username: 'darren' }, process.env.ACCESS_TOKEN_KEY);

describe('Likes API', () => {
  const makeApp = (threadOverrides = {}, commentOverrides = {}, likeOverrides = {}) => {
    return createServer({
      userRepository: {},
      authenticationRepository: {},
      authenticationTokenManager: {},
      passwordHash: {},
      threadRepository: { verifyThreadExists: jest.fn(), addThread: jest.fn(), getThreadById: jest.fn(), ...threadOverrides },
      commentRepository: {
        verifyCommentExists: jest.fn(), getCommentsByThreadId: jest.fn().mockResolvedValue([]),
        addComment: jest.fn(), deleteComment: jest.fn(), verifyCommentOwner: jest.fn(),
        ...commentOverrides,
      },
      replyRepository: { getRepliesByCommentId: jest.fn().mockResolvedValue([]) },
      likeRepository: {
        isCommentLiked: jest.fn(), likeComment: jest.fn(),
        unlikeComment: jest.fn(), getLikeCountByCommentId: jest.fn().mockResolvedValue(0),
        ...likeOverrides,
      },
    });
  };

  describe('PUT /threads/:threadId/comments/:commentId/likes', () => {
    it('should return 200 when liking a comment', async () => {
      const app = makeApp(
        { verifyThreadExists: jest.fn().mockResolvedValue(undefined) },
        { verifyCommentExists: jest.fn().mockResolvedValue(undefined) },
        { isCommentLiked: jest.fn().mockResolvedValue(false), likeComment: jest.fn().mockResolvedValue(undefined) }
      );
      const res = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes')
        .set('Authorization', `Bearer ${getAccessToken()}`);
      expect(res.statusCode).toBe(200);
    });

    it('should return 200 when unliking a comment', async () => {
      const app = makeApp(
        { verifyThreadExists: jest.fn().mockResolvedValue(undefined) },
        { verifyCommentExists: jest.fn().mockResolvedValue(undefined) },
        { isCommentLiked: jest.fn().mockResolvedValue(true), unlikeComment: jest.fn().mockResolvedValue(undefined) }
      );
      const res = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes')
        .set('Authorization', `Bearer ${getAccessToken()}`);
      expect(res.statusCode).toBe(200);
    });

    it('should return 401 when no auth', async () => {
      const res = await request(makeApp()).put('/threads/thread-123/comments/comment-123/likes');
      expect(res.statusCode).toBe(401);
    });

    it('should return 500 when putLike throws error', async () => {
      const app = makeApp({ verifyThreadExists: jest.fn().mockRejectedValue(new Error('server error')) });
      const res = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes')
        .set('Authorization', `Bearer ${getAccessToken()}`);
      expect(res.statusCode).toBe(500);
    });
  });
});
